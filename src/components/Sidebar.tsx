import React from "react";

const items = [
  { type: "start", label: "Start Node" },
  { type: "task", label: "Task Node" },
  { type: "approval", label: "Approval Node" },
  { type: "automated", label: "Automated Step" },
  { type: "end", label: "End Node" },
];

export default function Sidebar() {
  const onDragStart = (e: React.DragEvent, nodeType: string) => {
    e.dataTransfer.setData("application/reactflow", nodeType);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside
      style={{
        width: 220,
        padding: 12,
        background: "#0f1724",
        color: "#fff",
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      <h3 style={{ margin: "6px 0 12px", fontSize: 16 }}>Add nodes</h3>

      {items.map((it) => (
        <div
          key={it.type}
          draggable
          onDragStart={(e) => onDragStart(e, it.type)}
          style={{
            padding: "10px 12px",
            marginBottom: 8,
            borderRadius: 8,
            background: "#111827",
            cursor: "grab",
            userSelect: "none",
          }}
        >
          {it.label}
        </div>
      ))}

      <div style={{ marginTop: 18, fontSize: 12, opacity: 0.8 }}>
        Drag an item onto the canvas
      </div>
    </aside>
  );
}
