import { KeyRound } from "lucide-react";
import { useState } from "react";

type Props = {
  username: string;
  password: string;
  onSubmit: (username: string, password: string) => void;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
};

export default function LoginForm({
  onSubmit,
  username,
  password,
  setUsername,
  setPassword,
}: Props) {
  const [keyIcon, setKeyIcon] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(username, password);
      }}
      className="relative flex flex-col justify-center items-center rounded-xl gap-10 border-indigo-800 border-2 shadow-lg shadow-indigo-100 w-80 h-80 "
    >
      <div className="w-full flex flex-col justify-center items-center gap-1">
        <h1 className="text-neutral-300 text-semibold">Username</h1>
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          className="p-1 focus:p-2 duration-300 rounded-lg outline-[.5px] outline-indigo-400"
        />
      </div>
      <div className="w-full flex flex-col justify-center items-center gap-1">
        <h1 className="text-neutral-300 text-semibold">Password</h1>
        <input className="p-1 focus:p-2 duration-300 rounded-lg outline-[.5px] outline-indigo-400" type="password" onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button
        onMouseOver={() => setKeyIcon(true)}
        onMouseLeave={() => setKeyIcon(false)}
        type="submit"
        className="py-2 px-5 flex justify-center items-center bg-white rounded-xl duration-300 border-2 border-transparent hover:tracking-[.2em]  hover:border-indigo-500"
      >
        Ingresar
      </button>
      {keyIcon && (
        <KeyRound className="text-indigo-100 absolute bottom-[3rem] right-10" />
      )}
    </form>
  );
}
