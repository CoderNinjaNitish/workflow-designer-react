import Sidebar from "./components/Sidebar";
import FlowCanvas from "./components/FlowCanvas";

export default function App() {
  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <Sidebar />
      <FlowCanvas />
    </div>
  );
}
