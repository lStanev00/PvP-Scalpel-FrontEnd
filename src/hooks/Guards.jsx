import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loading from "../components/loading.jsx";
import { getSafeInternalTarget } from "../helpers/authRedirect.js";
import { UserContext } from "./ContextVariables";

export const UserRoute = () => {
    const { authStatus } = useContext(UserContext);
    const location = useLocation();

    if (authStatus === "checking") return <Loading />;
    if (authStatus === "authenticated") return <Outlet />;

    const target = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?target=${encodeURIComponent(target)}`} replace />;
};

export const AdminRoute = () => {
    const { authStatus, user } = useContext(UserContext);
    const location = useLocation();

    if (authStatus === "checking") return <Loading />;

    if (authStatus !== "authenticated") {
        const target = `${location.pathname}${location.search}`;
        return <Navigate to={`/login?target=${encodeURIComponent(target)}`} replace />;
    }

    if (String(user?.role || "").trim().toLowerCase() !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export const GuestRoute = () => {
    const { authStatus } = useContext(UserContext);
    const location = useLocation();

    if (authStatus === "checking") return <Loading />;
    if (authStatus === "guest") return <Outlet />;

    const searchParams = new URLSearchParams(location.search);
    const target = getSafeInternalTarget(searchParams.get("target"));

    return <Navigate to={target || "/"} replace />;
};
