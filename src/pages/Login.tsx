// src/pages/Home.jsx
import { signInWithEmailAndPassword, User } from "firebase/auth";
import { auth } from "../services/firebase";
import { useState } from "react";
import LoginForm from "../components/form/LoginForm";
import { LoaderCircleIcon } from "lucide-react";


import { SnackBar } from "../components/snackbar/SnackBar";

export const Login = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [openSnackbarError, setOpenSnackbarError] = useState(false);

  const handleSubmit = (username: string, password: string) => {
    setLoading(true);
    signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUser(user);
        console.log(user);

        // Guarda el token en localStorage (o en cookies si prefieres)
        localStorage.setItem("userToken", userCredential.user.refreshToken);

        setLoading(false);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/wrong-password")
          setError("Credenciales invalidas");
        if (errorCode === "auth/user-not-found")
          setError("Este usuario no existe");
        if (errorCode === "auth/invalid-email")
          setError("Credenciales invalidas");
        setOpenSnackbarError(true);
        setLoading(false);
        console.log(errorCode, errorMessage);
      });
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbarError(false);
  };
  return (
    <section className="relative flex flex-col gap-10 justify-center items-center w-full min-h-screen bg-gradient-to-b from-slate-800 to-indigo-800 font-montserrat">
      {user === null && loading === false && (
        <>
          <h1 className="text-4xl text-white font-bold">ADMIN PANEL</h1>
          <LoginForm
            username={username}
            password={password}
            setPassword={setPassword}
            setUsername={setUsername}
            onSubmit={handleSubmit}
          />
        </>
      )}
      {loading && <LoaderCircleIcon className="animate-spin text-indigo-300" />}

      <SnackBar
        message={error}
        handleCloseSnackbar={handleCloseSnackbar}
        openSnackbar={openSnackbarError}
        severity="error"
      />
      <footer className="absolute bottom-0 righ-0 w-full h-20 bg-transparent flex flex-col justify-center items-end pr-10 text-white text-sm">
        <h3>FromDevz Admin Panel version 1.0 </h3>
        <h3>FromDevz all rights reserved</h3>
      </footer>
    </section>
  );
};
