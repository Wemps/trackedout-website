import { createRoot } from "react-dom/client";
import App from "./app/App";
import { initAnalytics } from "./app/analytics";
import "./styles/index.css";

initAnalytics();
createRoot(document.getElementById("root")!).render(<App />);
