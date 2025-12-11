// src/components/Canvas/FlowCanvas.tsx

//import NodeFormPanel from "./Forms/NodeFormPanel";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from "reactflow";
import type { Node, Edge, Connection } from "reactflow";
import "reactflow/dist/style.css";

/* --- initial demo node --- */
const initialNodes: Node[] = [
  {
    id: "1",
    type: "start",
    position: { x: 100, y: 100 },
    data: { label: "Start Node", startTitle: "Start" },
    style: { padding: 12, borderRadius: 8, background: "white" },
  },
];
const initialEdges: Edge[] = [];

let nextId = 2;
const getNodeId = () => `${nextId++}`;
const getEdgeId = () => `e${nextId++}`;

/* --- helper: basic validation --- */
function validateGraph(nodes: Node[], edges: Edge[]) {
  const errors: string[] = [];
  const starts = nodes.filter((n) => (n.type === "start" || (n.data && (n.data as any).label === "Start Node")));
  const ends = nodes.filter((n) => n.type === "end");
  if (starts.length === 0) errors.push("No Start node found.");
  if (starts.length > 1) errors.push("Multiple Start nodes found (only one allowed).");
  if (ends.length === 0) errors.push("No End node found.");
  // simple reachability check: every node except start must have at least one incoming edge
  const incoming = new Map<string, number>();
  nodes.forEach((n) => incoming.set(n.id, 0));
  edges.forEach((e) => incoming.set(e.target, (incoming.get(e.target) ?? 0) + 1));
  const orphan = nodes.filter((n) => n.type !== "start" && (incoming.get(n.id) ?? 0) === 0);
  if (orphan.length > 0) errors.push(`Orphan nodes found: ${orphan.map((n) => n.id).join(", ")}`);
  return errors;
}

export default function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [fileInputKey, setFileInputKey] = useState(Date.now()); // to reset file input
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    // validate whenever nodes/edges change
    const errs = validateGraph(nodes, edges);
    setValidationErrors(errs);
    // ensure selected node still exists
    if (selectedNodeId && !nodes.find((n) => n.id === selectedNodeId)) setSelectedNodeId(null);
  }, [nodes, edges, selectedNodeId]);

  useEffect(() => {
    console.log("FlowCanvas ready");
  }, []);

  /* --- connect handler --- */
  const onConnect = useCallback(
    (params: Connection | any) => {
      // create an edge with a deterministic id and allow label editing via double click
      const newEdge: Edge = {
        id: getEdgeId(),
        source: params.source,
        target: params.target,
        animated: true,
        label: params.label ?? "",
      };
      setEdges((eds) => addEdge(newEdge as any, eds));
    },
    [setEdges]
  );

  /* --- drag & drop new node --- */
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData("application/reactflow");
      if (!nodeType) return;

      // Prevent more than one start node
      if (nodeType === "start" && nodes.some((n) => n.type === "start")) {
        alert("A Start node already exists. Only one Start node is allowed.");
        return;
      }

      const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;

      // set default data per node type according to spec
      let defaultData: any = { label: "Node" };
      if (nodeType === "start") {
        defaultData = { label: "Start Node", startTitle: "Start", metadata: [] };
      } else if (nodeType === "task") {
        defaultData = { label: "Task Node", title: "Task", description: "", assignee: "", dueDate: "", customFields: [] };
      } else if (nodeType === "approval" || nodeType === "approve") {
        defaultData = { label: "Approval Node", title: "Approval", approverRole: "Manager", autoApproveThreshold: 0 };
      } else if (nodeType === "automated") {
        defaultData = { label: "Automated Step", title: "Automated", actionId: "", params: {} };
      } else if (nodeType === "end") {
        defaultData = { label: "End Node", endMessage: "Done", summaryFlag: true };
      }

      const newNode: Node = {
        id: getNodeId(),
        type: nodeType,
        position: { x: x - 75, y: y - 20 },
        data: defaultData,
        style: { padding: 12, borderRadius: 8, background: "#ffffff" },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes, nodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  /* --- edge double-click: edit label --- */
  const onEdgeDoubleClick = useCallback(
    (evt: React.MouseEvent, edge: Edge) => {
      evt.preventDefault();
      const newLabel = prompt("Enter edge label:", (edge.label as string) ?? "");
      if (newLabel === null) return; // cancel
      setEdges((eds) => eds.map((e) => (e.id === edge.id ? { ...e, label: newLabel } : e)));
    },
    [setEdges]
  );

  /* --- selection tracking: pick node id that has selected=true --- */
  useEffect(() => {
    const sel = nodes.find((n) => (n as any).selected);
    setSelectedNodeId(sel ? sel.id : null);
  }, [nodes]);

  /* --- Delete key removes selected items --- */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Delete") {
        setNodes((nds) => nds.filter((n) => !(n as any).selected));
        setEdges((eds) => eds.filter((edge) => !(edge as any).selected));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setNodes, setEdges]);

  /* --- Save (download) — include version & meta for spec compliance --- */
  const onSave = useCallback(() => {
    const payload = {
      version: "1.0",
      meta: { name: "workflow", author: "unknown", createdAt: new Date().toISOString() },
      nodes,
      edges,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workflow.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  /* --- Load / Import JSON file --- */
  const onFile = useCallback(
    (file: File | null) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result));
          const parsedNodes = parsed.nodes ?? parsed;
          const parsedEdges = parsed.edges ?? [];
          if (parsedNodes && parsedEdges) {
            // ensure ids numeric counter is ahead
            let maxId = 0;
            parsedNodes.forEach((n: any) => {
              const numeric = parseInt(String(n.id).replace(/\D/g, ""), 10);
              if (!Number.isNaN(numeric) && numeric > maxId) maxId = numeric;
            });
            nextId = Math.max(nextId, maxId + 1);
            setNodes(parsedNodes);
            setEdges(parsedEdges);
          } else {
            alert("Invalid file: expected { nodes, edges }");
          }
        } catch (err) {
          alert("Failed to parse JSON file");
        } finally {
          setFileInputKey(Date.now()); // reset input
        }
      };
      reader.readAsText(file);
    },
    [setNodes, setEdges]
  );

  /* --- Node properties editor helpers --- */
  const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedNodeId) ?? null, [nodes, selectedNodeId]);

  const updateSelectedNode = useCallback(
    (patch: Partial<Node>) => {
      if (!selectedNodeId) return;
      setNodes((nds) => nds.map((n) => (n.id === selectedNodeId ? { ...n, ...patch } : n)));
    },
    [selectedNodeId, setNodes]
  );

  /* --- UI --- */
  return (
    <ReactFlowProvider>
      <div style={{ display: "flex", height: "100vh", width: "100vw", fontFamily: "Inter, Arial, sans-serif" }}>
        {/* Left and center */}
        <div style={{ display: "flex", flex: 1 }}>
          <div style={{ flex: 1, position: "relative" }} onDrop={onDrop} onDragOver={onDragOver}>
            {/* top-right controls: Save + Load + validation badge */}
            <div style={{ position: "absolute", right: 16, top: 12, zIndex: 999, display: "flex", gap: 8, alignItems: "center" }}>
              {/* Validation indicator */}
              <div
                title={validationErrors.join("\n") || "No validation errors"}
                style={{
                  background: validationErrors.length ? "#7f1d1d" : "#064e3b",
                  color: "#fff",
                  padding: "6px 10px",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              >
                {validationErrors.length ? `${validationErrors.length} validation issue(s)` : "Valid"}
              </div>

              <label htmlFor="fileInput" style={{ cursor: "pointer", background: "#111827", color: "#fff", padding: "8px 12px", borderRadius: 8 }}>
                Load
              </label>
              <input id="fileInput" key={fileInputKey} type="file" accept="application/json" style={{ display: "none" }} onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
              <button onClick={onSave} style={{ background: "#111827", color: "#fff", padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer" }}>
                Save
              </button>
            </div>

            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onEdgeDoubleClick={onEdgeDoubleClick}
              fitView
              style={{ width: "100%", height: "100%" }}
            >
              <Background gap={16} />
            </ReactFlow>
          </div>
        </div>

        {/* Right properties panel */}
        <div style={{ width: 320, borderLeft: "1px solid rgba(255,255,255,0.03)", padding: 12, boxSizing: "border-box", background: "#0b1220", color: "#fff" }}>
          <h4 style={{ marginTop: 0 }}>Node Properties</h4>
          {selectedNode ? (
            <>
              <div style={{ marginBottom: 8, fontSize: 13, opacity: 0.9 }}>ID: {selectedNode.id}</div>

              <label style={{ fontSize: 13, display: "block", marginBottom: 6 }}>Label</label>
              <input
                value={(selectedNode.data as any).label ?? ""}
                onChange={(e) => updateSelectedNode({ data: { ...(selectedNode.data as any), label: e.target.value } })}
                style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 10 }}
              />

              {/* show type-specific quick fields */}
              {selectedNode.type === "task" && (
                <>
                  <label style={{ fontSize: 13, display: "block", marginBottom: 6 }}>Assignee</label>
                  <input
                    value={(selectedNode.data as any).assignee ?? ""}
                    onChange={(e) => updateSelectedNode({ data: { ...(selectedNode.data as any), assignee: e.target.value } })}
                    style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 10 }}
                  />
                </>
              )}

              {selectedNode.type === "approval" && (
                <>
                  <label style={{ fontSize: 13, display: "block", marginBottom: 6 }}>Approver Role</label>
                  <input
                    value={(selectedNode.data as any).approverRole ?? ""}
                    onChange={(e) => updateSelectedNode({ data: { ...(selectedNode.data as any), approverRole: e.target.value } })}
                    style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid rgba(255,255,255,0.06)", marginBottom: 10 }}
                  />
                </>
              )}

              <label style={{ fontSize: 13, display: "block", marginBottom: 6 }}>Background color</label>
              <input
                type="color"
                value={(selectedNode.style as any)?.background ?? "#ffffff"}
                onChange={(e) => updateSelectedNode({ style: { ...(selectedNode.style as any), background: e.target.value } })}
                style={{ width: "100%", height: 42, border: "none", marginBottom: 12 }}
              />

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => {
                    // duplicate node quickly
                    if (!selectedNode) return;
                    const clone = { ...selectedNode, id: getNodeId(), position: { x: (selectedNode.position as any).x + 40, y: (selectedNode.position as any).y + 40 } };
                    setNodes((nds) => nds.concat(clone));
                  }}
                  style={{ padding: "8px 10px", borderRadius: 6, background: "#111827", color: "#fff", border: "none", cursor: "pointer" }}
                >
                  Duplicate
                </button>

                <button
                  onClick={() => {
                    if (!selectedNode) return;
                    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
                    setSelectedNodeId(null);
                  }}
                  style={{ padding: "8px 10px", borderRadius: 6, background: "#7f1d1d", color: "#fff", border: "none", cursor: "pointer" }}
                >
                  Delete
                </button>
              </div>
            </>
          ) : (
            <div style={{ opacity: 0.8, fontSize: 13 }}>Select a node to edit its properties.</div>
          )}

          <div style={{ marginTop: 18, opacity: 0.7, fontSize: 12 }}>
            Tip: Drag from left sidebar → drop on canvas. Click a node to edit. Save / Load with buttons. Double-click an edge to change its label.
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
}
