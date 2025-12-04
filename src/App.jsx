import AppContent from "./AppContent";
import { UserProvider } from "./hooks/ContextVariables";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
    return (
        <Router>
            <UserProvider>
                <AppContent />
            </UserProvider>
        </Router>
    );
}

export default App;
