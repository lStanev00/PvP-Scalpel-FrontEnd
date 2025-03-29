import { createRoot } from "react-dom/client";
import './Styles/main.css';
import App from "./App";
import { UserContext } from "./hooks/ContextVariables";

createRoot(document.querySelector(`#root`)).render(<App />);