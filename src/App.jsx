import AppContent from "./AppContent";
import { UserProvider } from "./hooks/ContextVariables";
function App() {

    return (
        <UserProvider >
            <AppContent />
        </UserProvider>
    )
}

export default App