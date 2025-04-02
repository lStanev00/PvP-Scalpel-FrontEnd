import AppContent from "./AppContent";
import { UserProvider } from "./hooks/ContextVariables";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

function App() {

    return (
        <Router>
            <UserProvider >
                <AppContent />
            </UserProvider>
        </Router>
    )
}

export default App