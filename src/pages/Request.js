import React, {useState, useEffect, useRef} from "react";
import {useParams} from "react-router-dom";

import apiAddr from './api/api';
const REQUEST_URL="/request"

const Request = () => {
    const errRef = useRef();
	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState(false);

    const [request, setRequest] = useState({});
    const [group, setGroup] = useState({});

    let { id } = useParams();
    if (id === undefined) {
        const currentRequest = JSON.parse(localStorage.getItem("requestObjStr"))
        if (currentRequest) {
            id = currentRequest.id;
            console.log("got id from local storage: "+id);
        }
    }

    const editLink = REQUEST_URL + "/edit/" + id;
    const loadRequest = () => {
        const s = JSON.parse(localStorage.getItem("sessionObjStr"));
        console.log("getting request(id:"+id+") ...");
        fetch(apiAddr + REQUEST_URL + "/" + id,
            {
                method: "get",
                headers: {
                    "Accept": "application/json",
                    "Don8-Auth-Sid":s.id,
                }
            },
        )
        .then(resp => {return resp.json();})
        .then(data => {
            setRequest(data);
            localStorage.setItem("requestObjStr", JSON.stringify(data)); //loaded in edit group for init values
            window.dispatchEvent(new Event("requestChange"));
            setSuccess(true);
        })
        .catch(err => {
            setErrMsg("failed to fetch: "+err);
        })

        const g = JSON.parse(localStorage.getItem("groupObjStr"));
        setGroup(g);
    }

    useEffect(()=>{
        loadRequest();
    },[]);

    const groupLink = "/group/"+group.id;
    return (<section>
        <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">{errMsg}</p>
        {success ? (
            <>
                <a href={groupLink}>{group.title}</a>
                <h1>Request: {request.title}</h1>
                <p>{request.description}</p>
                <table>
                    <tbody>
                        <tr><td>Tags</td><td>{request.tags}</td></tr>
                        <tr><td>Quantity</td><td>{request.qty}</td></tr>
                        <tr><td>Units</td><td>{request.units}</td></tr>
                    </tbody>
                </table>
                <button>Edit</button>
                <a href={editLink}>Edit</a>
            </>
        ):(
            <>
            </>
        )}
    </section>);
}

export default Request;