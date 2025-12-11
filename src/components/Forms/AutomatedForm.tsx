// src/components/Forms/AutomatedForm.tsx
import React, { useEffect, useState } from "react";
import type { Node } from "reactflow";
import { getAutomations, AutomationAction } from "../../api/automations";

type Props = { node: Node; onChange: (patch: Partial<Node>) => void };

export default function AutomatedForm({ node, onChange }: Props) {
  const data = (node.data as any) || {};
  const [actions, setActions] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getAutomations().then((r) => {
      if (!mounted) return;
      setActions(r);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const selected = actions.find((a) => a.id === data.actionId) ?? null;

  useEffect(() => {
    // ensure params exist
    if (selected && (!data.params || Object.keys(data.params).length === 0)) {
      const initial: any = {};
      selected.params.forEach((p) => (initial[p.name] = ""));
      onChange({ data: { ...data, params: initial } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <div className="kv-label">Action</div>
        {loading ? (
          <div style={{ color: "#94a3b8" }}>Loading actions...</div>
        ) : (
          <select className="input-sm" value={data.actionId ?? ""} onChange={(e) => onChange({ data: { ...data, actionId: e.target.value, params: {} } })}>
            <option value="">— select action —</option>
            {actions.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {selected && (
        <div>
          <div className="kv-label">Parameters</div>
          {selected.params.map((p) => (
            <div key={p.name} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: "#cbd5e1", marginBottom: 6 }}>{p.name}</div>
              <input
                className="input-sm"
                value={(data.params && data.params[p.name]) ?? ""}
                onChange={(e) => onChange({ data: { ...data, params: { ...(data.params || {}), [p.name]: e.target.value } } })}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
