// src/components/Forms/EndForm.tsx
import React from "react";
import type { Node } from "reactflow";

type Props = { node: Node; onChange: (patch: Partial<Node>) => void };

export default function EndForm({ node, onChange }: Props) {
  const data = (node.data as any) || {};
  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <div className="kv-label">End Message</div>
        <input className="input-sm" value={data.endMessage ?? ""} onChange={(e) => onChange({ data: { ...data, endMessage: e.target.value } })} />
      </div>

      <div>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={!!data.summaryFlag}
            onChange={(e) => onChange({ data: { ...data, summaryFlag: e.target.checked } })}
          />
          <span style={{ marginLeft: 6 }}>Show summary on completion</span>
        </label>
      </div>
    </div>
  );
}
