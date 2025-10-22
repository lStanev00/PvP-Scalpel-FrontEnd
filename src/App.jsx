import AppContent from "./AppContent";
import { UserProvider } from "./hooks/ContextVariables";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

function App() {
    return (
        <HelmetProvider>
            <Router>
                <UserProvider>
                    <AppContent />
                </UserProvider>
            </Router>
        </HelmetProvider>
    );
}

export default App;
