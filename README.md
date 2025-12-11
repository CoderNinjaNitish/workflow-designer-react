📌 HR Workflow Designer – React + React Flow

This project is a mini HR Workflow Designer built using React, TypeScript, React Flow, and a modular architecture.
It allows HR teams to visually design workflows such as onboarding, approvals, document verification, and automated steps.

This assignment demonstrates strong understanding of React architecture, scalable code structure, state management, mock APIs, custom nodes, and workflow simulation.

🎥 Demo Video

Watch the full workflow demo here:
👉 (Paste your YouTube unlisted link here)


🖼️ Screenshots
1️⃣ Workflow Canvas


<img width="1913" height="913" alt="Screenshot 2025-12-11 103146" src="https://github.com/user-attachments/assets/ac492dbb-8e8a-499a-807f-c9f60d9a7584" />


2️⃣ Node Drag & Drop




3️⃣ Node Form Panel
<img width="1918" height="899" alt="Screenshot 2025-12-11 103159" src="https://github.com/user-attachments/assets/7aac1fce-b051-49ee-a80c-7b5251c53532" />



4️⃣ Workflow Simulation Output
<img width="1918" height="854" alt="Screenshot 2025-12-11 103337" src="https://github.com/user-attachments/assets/af2e570f-d3f7-4fba-81b9-6d784019868b" />



🚀 Features
✔ Drag-and-Drop Workflow Builder

Create workflows visually

Node types:

Start Node

Task Node

Approval Node

Automated Step Node

End Node

✔ Node Configuration Panel

Each node is editable through a form panel:

Start → title + metadata

Task → title, description, assignee, due date

Approval → approver role, auto-approve limit

Automated → select action + dynamic params

End → message + summary toggle

✔ Mock API Integration

GET /automations → returns automation actions

POST /simulate → simulates workflow execution and returns steps

✔ Workflow Simulation Panel

Serializes current flow

Sends to mock API

Displays execution log

Basic validation included

🧩 Project Structure
src/
│── components/
│   ├── FlowCanvas.tsx
│   ├── Sidebar.tsx
│   └── Forms/
│       ├── StartForm.tsx
│       ├── TaskForm.tsx
│       ├── ApprovalForm.tsx
│       ├── AutomatedForm.tsx
│       └── EndForm.tsx
│── api/
│   └── automations.ts
│── App.tsx
│── main.tsx
│── index.css

⚙️ Tech Stack

React (Vite + TypeScript)

React Flow

Tailwind CSS

Mock API (local / MSW / json-server)

Modular component architecture

📐 Architecture & Design Decisions
1. Modular Node System

Each node type has its own form + logic → scalable.

2. Central Workflow State

React Flow handles:

nodes

edges

selection

updates

3. Clean Separation of Concerns

Canvas logic

Form logic

API logic
sab alag-alag folders me.

4. Extensible Node Forms

Forms follow same pattern → easy future additions.

5. Mock API Layer

All API calls isolated under /api.

🏃‍♂️ How to Run the Project
1️⃣ Install dependencies
npm install

2️⃣ Run the app
npm run dev

3️⃣ (If using mock server)
npm run server

🧪 Completed for the Assignment

✔ Fully functioning workflow builder
✔ Custom node types
✔ Editable forms
✔ React Flow integration
✔ Mock API integration
✔ Workflow simulator
✔ Clean folder architecture
✔ Professional README

🚀 Future Enhancements (Optional)

Undo/Redo functionality

Auto-layout of nodes

Minimap inside canvas

Visual error indicators on nodes

Node version history

Workflow import/export

👨‍💻 Author

Nitish Kumar
GitHub: https://github.com/CoderNinjaNitish
