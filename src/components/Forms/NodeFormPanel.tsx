// src/components/Forms/NodeFormPanel.tsx
import React from "react";
import type { Node } from "reactflow";
import StartForm from "./StartForm";
import TaskForm from "./TaskForm";
import ApprovalForm from "./ApprovalForm";
import AutomatedForm from "./AutomatedForm";
import EndForm from "./EndForm";

type Props = {
  node: Node | null;
  onChange: (patch: Partial<Node>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
};

export default function NodeFormPanel({ node, onChange, onDuplicate, onDelete }: Props) {
  if (!node) {
    return (
      <div style={{ padding: 12 }}>
        <h4 style={{ marginTop: 0 }}>Node Properties</h4>
        <div style={{ opacity: 0.8, fontSize: 13 }}>Select a node to edit its properties.</div>
      </div>
    );
  }

  const common = { node, onChange };

  return (
    <div style={{ padding: 12, width: "100%" }}>
      <h4 style={{ marginTop: 0 }}>Node Properties</h4>

      {/* Common label */}
      <div style={{ marginBottom: 10 }}>
        <div className="kv-label">Label</div>
        <input
          className="input-sm"
          value={(node.data as any).label ?? ""}
          onChange={(e) => onChange({ data: { ...(node.data as any), label: e.target.value } })}
        />
      </div>

      {/* Type-specific */}
      {node.type === "start" && <StartForm {...common} />}
      {node.type === "task" && <TaskForm {...common} />}
      {(node.type === "approval" || node.type === "approve") && <ApprovalForm {...common} />}
      {node.type === "automated" && <AutomatedForm {...common} />}
      {node.type === "end" && <EndForm {...common} />}

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button className="btn-ghost" onClick={onDuplicate}>Duplicate</button>
        <button style={{ background: "#7f1d1d", color: "#fff", borderRadius: 6, padding: "8px 10px" }} onClick={onDelete}>
          Delete
        </button>
      </div>

      <div style={{ marginTop: 18, opacity: 0.7, fontSize: 12 }}>
        Tip: changes are applied instantly. Use Save to export workflow JSON.
      </div>
    </div>
  );
}
