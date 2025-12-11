// src/components/Forms/ApprovalForm.tsx
import React from "react";
import type { Node } from "reactflow";

type Props = { node: Node; onChange: (patch: Partial<Node>) => void };

export default function ApprovalForm({ node, onChange }: Props) {
  const data = (node.data as any) || {};
  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <div className="kv-label">Title</div>
        <input className="input-sm" value={data.title ?? ""} onChange={(e) => onChange({ data: { ...data, title: e.target.value } })} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <div className="kv-label">Approver Role</div>
        <select className="input-sm" value={data.approverRole ?? "Manager"} onChange={(e) => onChange({ data: { ...data, approverRole: e.target.value } })}>
          <option>Manager</option>
          <option>HRBP</option>
          <option>Director</option>
          <option>Custom</option>
        </select>
      </div>

      <div style={{ marginBottom: 8 }}>
        <div className="kv-label">Auto-approve threshold (0 = disabled)</div>
        <input className="input-sm" type="number" value={data.autoApproveThreshold ?? 0} onChange={(e) => onChange({ data: { ...data, autoApproveThreshold: Number(e.target.value) } })} />
      </div>
    </div>
  );
}
