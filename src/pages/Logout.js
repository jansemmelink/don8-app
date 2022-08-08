import React from "react";
import { Navigate } from 'react-router-dom';

const Logout = () => {
    //todo: call api to delete the session...
    localStorage.removeItem("sessionObjStr");
    window.dispatchEvent(new Event("sessionChange"));

    return (
        <>
            <h1>Goodbye.</h1>
            <Navigate to="/home" replace="false"/>
        </>
    )
}

export default Logout;