import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home.tsx";
import Header from "./components/Header.tsx";
import SignUp from "./pages/auth/SignUp.tsx";

function App() {

  return (
    <BrowserRouter>
        {(location.pathname !== '/sign-up' && location.pathname !== '/sign-in') &&
            <Header />
        }

        <Routes>
            <Route path={`/`} element={<Home/>}/>
            <Route path={`/sign-up`} element={<SignUp/>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default App
