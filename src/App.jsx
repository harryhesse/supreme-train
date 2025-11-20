import { Route, Routes } from "react-router";
import ListPage from "./pages/list";
import EditPage from "./pages/edit";

export default function App() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Document Example</h1>

      <Routes>
        <Route path="/" element={<ListPage />}></Route>
        <Route path="/edit/:id" element={<EditPage />}></Route>
      </Routes>
    </div>
  );
}
