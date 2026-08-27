import AppContent from "./components/AppContent";
import ThemeProvider from "./theme";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
