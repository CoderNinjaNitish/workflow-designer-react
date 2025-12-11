// src/components/Forms/StartForm.tsx
import React from "react";
import type { Node } from "reactflow";

type Props = { node: Node; onChange: (patch: Partial<Node>) => void };

export default function StartForm({ node, onChange }: Props) {
  const data = (node.data as any) || {};
  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <div className="kv-label">Start Title</div>
        <input className="input-sm" value={data.startTitle ?? ""} onChange={(e) => onChange({ data: { ...data, startTitle: e.target.value } })} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <div className="kv-label">Metadata (key=value, comma separated)</div>
        <input
          className="input-sm"
          value={(data.metadata ?? []).map((kv: any) => `${kv.k}=${kv.v}`).join(",")}
          onChange={(e) => {
            const raw = e.target.value.trim();
            const arr = raw ? raw.split(",").map((x) => { const [k = "", v = ""] = x.split("="); return { k: k.trim(), v: v.trim() }; }) : [];
            onChange({ data: { ...data, metadata: arr } });
          }}
        />
      </div>
    </div>
  );
}
