// type Props = {}
import { Outlet } from "react-router-dom";
import NavBar from "../../components/nav-bar/NavBar";

export const Dashboard = () => {
  const url = window.location.pathname;
  console.log(url);
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};
