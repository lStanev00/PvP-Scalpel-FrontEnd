import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UserContext } from "./ContextVariables";

export const UserRoute = () => {
    const {user} = useContext(UserContext);
    const isAuthenticated = Boolean(user?._id);
    const location = (useLocation()).pathname;

    return isAuthenticated ? <Outlet /> : <Navigate to={`/login?target=${location}`} />;
};


export const GuestRoute = () => {
    const { user } = useContext(UserContext);
    const isAuthenticated = Boolean(user?._id);
  
    return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
  };