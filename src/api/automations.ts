// src/api/automations.ts
export type AutomationAction = {
  id: string;
  label: string;
  params: { name: string; type: "string" | "number" | "text" }[];
};

export const getAutomations = async (): Promise<AutomationAction[]> => {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 120));
  return [
    { id: "send_email", label: "Send Email", params: [{ name: "to", type: "string" }, { name: "subject", type: "string" }] },
    { id: "generate_doc", label: "Generate Document", params: [{ name: "template", type: "string" }, { name: "recipient", type: "string" }] },
    { id: "create_user", label: "Create User", params: [{ name: "username", type: "string" }, { name: "role", type: "string" }] },
  ];
};
