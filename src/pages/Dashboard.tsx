// type Props = {}
import { Outlet } from "react-router-dom";
import NavBar from "../components/nav-bar/NavBar";

export const Dashboard = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};
