// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Publicaciones } from "./pages/Publicaciones";
import { Proyectos } from "./pages/Proyectos";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { UserProvider } from "./context/UserContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Imagenes } from "./pages/Imagenes";
import { Archivos } from "./pages/Archivos";
import { Consultores } from "./pages/Consultores";
import { NewPublicacion } from "./pages/NewPublicacion";


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
            <Route path="publicaciones/upload" element={<NewPublicacion />} />
            <Route path="proyectos" element={<Proyectos />} />
            <Route path="proyectos/upload" element={<NewPublicacion />} />
            <Route path="imagenes" element={<Imagenes />} />
            <Route path="imagenes/upload" element={<NewPublicacion />} />
            <Route path="archivos" element={<Archivos />} />
            <Route path="archivos/upload" element={<NewPublicacion />} />
            <Route path="consultores" element={<Consultores />} />
            <Route path="consultores/upload" element={<NewPublicacion />} />
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
