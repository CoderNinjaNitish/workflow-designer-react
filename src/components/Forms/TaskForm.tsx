// src/components/Forms/TaskForm.tsx
import React, { useEffect, useState } from "react";
import type { Node } from "reactflow";

type Props = { node: Node; onChange: (patch: Partial<Node>) => void };

export default function TaskForm({ node, onChange }: Props) {
  const data = (node.data as any) || {};
  const [title, setTitle] = useState(data.title ?? "");
  const [description, setDescription] = useState(data.description ?? "");
  const [assignee, setAssignee] = useState(data.assignee ?? "");
  const [dueDate, setDueDate] = useState(data.dueDate ?? "");

  useEffect(() => {
    onChange({ data: { ...data, title, description, assignee, dueDate } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, assignee, dueDate]);

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <div className="kv-label">Title *</div>
        <input className="input-sm" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <div className="kv-label">Description</div>
        <textarea className="input-sm" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div className="kv-label">Assignee</div>
          <input className="input-sm" value={assignee} onChange={(e) => setAssignee(e.target.value)} />
        </div>
        <div style={{ width: 140 }}>
          <div className="kv-label">Due date</div>
          <input className="input-sm" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
      </div>
    </div>
  );
}
