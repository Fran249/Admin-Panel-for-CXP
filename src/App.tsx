// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Publicaciones } from "./pages/Publicaciones";
import { Proyectos } from "./pages/Proyectos";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { UserProvider } from "./context/UserContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route path="publicaciones" element={<Publicaciones />} />
            <Route path="proyectos" element={<Proyectos />} />
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
