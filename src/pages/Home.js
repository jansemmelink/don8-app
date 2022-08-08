import React from "react";
import Register from "./Register";
import Dashboard from "./Dashboard";

const Home = () => {
    console.log("HOME");
    //if not logged in, show registration (which also has link to login)
    const s = JSON.parse(localStorage.getItem("sessionObjStr"));
    if (!s) {
        console.log("not logged in");
        return (
            <Register/>
        );
    } else {
        console.log("logged in");
        return (
            <Dashboard/>
        );
    }
}

export default Home;

    //return:
    //list of promises pending - most important
    //list of groups you follow

    //Group:
    //Show header title/logo
    //  click for description
    //list top needs
    //search/filter for requests:
    //  - then make more promises
    //      title + optional photo
    //      your promise:
    //          qty
    //          date
    //          location
    //          [promise]
    //      description
    //  - invite someone to donate for a request
    //manage promises:
    //  incr/decr/cancel
    //drop-off:
    //  show QR code that coordinator can scan
    //  [Close]
    //  update your promises after dropped
    //nav:
    //  find other groups
    //  organiser
