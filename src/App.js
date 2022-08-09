//import logo from './logo.svg';
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import { useState } from 'react';
import './App.css';
import Register from "./pages/Register";
import Activate from "./pages/Activate";
import Login from "./pages/Login";
import Reset from "./pages/Reset";
import Logout from "./pages/Logout";
import Home from './pages/Home';
import Group from './pages/Group';
import AddGroup from "./pages/AddGroup";
import EditGroup from "./pages/EditGroup";
import AddRequest from "./pages/AddRequest";

const Nav = () => {
  const [s,setSession] = useState(JSON.parse(localStorage.getItem("sessionObjStr")));
  window.addEventListener('sessionChange', () => {
    console.log("session changed!");
    setSession(JSON.parse(localStorage.getItem("sessionObjStr")));
    console.log("session: "+JSON.stringify(s));
  });

  return (
    <>
      <nav>
        <ul className="topnav">
          <li>
            <Link to="/">Don8</Link>
          </li>
          {(!s?.user) && <>
            <li className="right">
              <Link to="/login">Login</Link>
            </li>
            <li className="right">
              <Link to="/register">Register</Link>
            </li>
          </>
          }
          {(s && s.user) && (<>
            <li className="right">
              <Link to="/logout">Logout</Link>
            </li>
          </>)}
        </ul>
      </nav>
      <Outlet />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Nav />}>
          <Route index element={<Home />} />
					<Route path="register" element={<Register />} />
					<Route path="reset" element={<Reset />} />
					<Route path="activate/:tpw" element={<Activate />} />
					<Route path="login" element={<Login />} />
					<Route path="logout" element={<Logout />} />

					<Route path="group/:id" element={<Group />} />
					<Route path="group/edit/:id" element={<EditGroup />} />
					<Route path="groups/new" element={<AddGroup />} />

					<Route path="requests/new" element={<AddRequest />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
