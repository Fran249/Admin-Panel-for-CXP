// src/App.tsx

// import React, { useEffect } from 'react';
import React, { useEffect, useState } from "react";
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
import { EditProyecto } from "./pages/proyectos/EditProyecto";
import { NewImagen } from "./pages/imagenes/NewImagen";
import { NewArchivo } from "./pages/archivos/NewArchivo";
import { NewConsultor } from "./pages/consultores/NewConsultor";
import { EditConsultores } from "./pages/consultores/EditConsultores";
import { Servicios } from "./pages/servicios/Servicios";
import { NewServicio } from "./pages/servicios/NewServicio";
import { EditServicio } from "./pages/servicios/EditServicio";
import { open } from "@tauri-apps/plugin-shell";
import { UpdaterNotification } from "./components/updater-notification/UpdaterNotification";
import { check } from "@tauri-apps/plugin-updater";
import { invoke } from "@tauri-apps/api/core";
import { ViewPicker } from "./pages/view-picker/ViewPicker";
import { ImageConverter } from "./pages/image-converter/ImageConverter";


const App: React.FC = () => {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [version, setVersion] = useState("");

  const handleConfirmUpdate = async () => {
    const update = await check();
    if (update?.available) {
      await update.downloadAndInstall();
      await invoke("graceful_restart");
    }
  };
  const handleOpenLink = (url: string) => {
    open(url);
  };
  const checkUpdates = async () => {
    const update = await check();
    if (update === null) {
      // await message('Failed to check for updates.\nPlease try again later.', {
      //   title: 'Error',
      //   kind: 'error',
      //   okLabel: 'OK'
      // });
      return;
    } else if (update?.available) {
      setVersion(update.version);
      setHasUpdate(true);
    }
  };

  useEffect(() => {

    checkUpdates();
  }, []);
  return (
    <Router>
      <UserProvider>
        {hasUpdate && (
          <UpdaterNotification
            version={version}
            onClick={handleConfirmUpdate}
            openLink={handleOpenLink}
          />
        )}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/view-picker"
            element={
              <ProtectedRoute>
                <ViewPicker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/image-converter"
            element={
              <ProtectedRoute>
                <ImageConverter />
              </ProtectedRoute>
            }
          />
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
            <Route
              path="publicaciones/edit/:id"
              element={<EditPublicacion />}
            />
            <Route path="proyectos" element={<Proyectos />} />
            <Route path="proyectos/upload" element={<NewProyecto />} />
            <Route path="proyectos/edit/:id" element={<EditProyecto />} />
            <Route path="imagenes" element={<Imagenes />} />
            <Route path="imagenes/upload" element={<NewImagen />} />
            <Route path="archivos" element={<Archivos />} />
            <Route path="archivos/upload" element={<NewArchivo />} />
            <Route path="consultores" element={<Consultores />} />
            <Route path="consultores/upload" element={<NewConsultor />} />
            <Route path="consultores/edit/:id" element={<EditConsultores />} />
            <Route path="servicios" element={<Servicios />} />
            <Route path="servicios/upload" element={<NewServicio />} />
            <Route path="servicios/edit/:id" element={<EditServicio />} />
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
};

export default App;
