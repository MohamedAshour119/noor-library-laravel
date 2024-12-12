import './App.css'
import { Route, Routes, useLocation} from "react-router-dom";
import Home from "./pages/Home.tsx";
import Header from "./components/Header.tsx";
import SignUp from "./pages/auth/SignUp.tsx";
import SignIn from "./pages/auth/SignIn.tsx";
import {useEffect, useState} from "react";
import AuthRoute from "./auth/AuthRoute.tsx";
import AuthRedirect from "./auth/AuthRedirect.tsx";

function AuthLayout() {
    return (
        <Routes>
            {/*<Route path={`/notifications`} element={<Notifications />} />*/}
        </Routes>
    );
}
function App() {

    const [showHeader, setShowHeader] = useState(true);
    const location = useLocation();
    useEffect(() => {
        console.log('run')
        if (location.pathname === '/sign-up' || location.pathname === '/sign-in')
            setShowHeader(false)
        else
            setShowHeader(true)
    }, [location.pathname]);


    return (
    <>
        {showHeader && <Header />}

        <Routes>
            <Route path={`/`} element={<Home/>}/>

            <Route element={<AuthRoute />}>
                <Route path="/*" element={<AuthLayout />} />
            </Route>

            <Route element={<AuthRedirect />}>
                <Route path={`/sign-up`} element={<SignUp/>}/>
                <Route path={`/sign-in`} element={<SignIn/>}/>
            </Route>
        </Routes>
    </>
  )
}

export default App
