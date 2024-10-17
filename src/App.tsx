// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Publicaciones } from "./pages/publicaciones/Publicaciones";
import { Proyectos } from "./pages/proyectos/Proyectos";
import { Login } from "./pages/dashboard/Login";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { UserProvider } from "./context/UserContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Imagenes } from "./pages/imagenes/Imagenes";
import { Archivos } from "./pages/archivos/Archivos";
import { Consultores } from "./pages/consultores/Consultores";
import { NewPublicacion } from "./pages/publicaciones/NewPublicacion";
import { EditPublicacion } from "./pages/publicaciones/EditPublicacion";
import { NewProyecto } from "./pages/proyectos/NewProyecto";


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
            <Route path="publicaciones/edit/:id" element={<EditPublicacion />} />
            <Route path="proyectos" element={<Proyectos />} />
            <Route path="proyectos/upload" element={<NewProyecto />} />
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
