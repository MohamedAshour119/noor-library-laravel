import { Navigate, Outlet, useLocation, useSearchParams } from "react-router-dom";

function AuthRoute({ requireSocial = false }: { requireSocial?: boolean }) {
    const token = localStorage.getItem("token");
    const isSocialAccount = localStorage.getItem("is_social_account") === "true";
    const location = useLocation();
    const [searchParams] = useSearchParams();

    // Allow access to `/set-password` if the `data` parameter exists
    const isSetPasswordRoute = location.pathname === "/set-password";
    const hasDataParam = !!searchParams.get("data");

    if (isSetPasswordRoute && hasDataParam) {
        return <Outlet />;
    }

    // Otherwise, apply the usual checks
    if (!token) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (requireSocial && !isSocialAccount) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <Outlet />;
}

export default AuthRoute;
