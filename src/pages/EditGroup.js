import React, {useState, useRef, useEffect} from "react";
import {Navigate, useParams} from "react-router-dom";

import apiAddr from './api/api';
const GROUP_URL="/group"

const EditGroup = () => {
    const { id } = useParams();
    const groupLink = GROUP_URL + "/"+id;

    const errRef = useRef();
	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState(false);

    const titleRef = useRef();
    const [title, setTitle] = useState('');//todo - current value

    const descriptionRef = useRef();
	const [description, setDescription] = useState('');//todo - current value

    useEffect(() => {
        const init = JSON.parse(localStorage.getItem("groupObjStr"))
        if (init && (id===init.id)) {
            setTitle(init.title);
            setDescription(init.description);
        }
		titleRef.current.focus();
	}, []);

    const handleSubmit = () => {
        console.log("Submit update ...");
        const s = JSON.parse(localStorage.getItem("sessionObjStr"));
        const reqBody = {id: id, title: title, description: description};
        console.log("Submit update ..." + JSON.stringify(reqBody));
        fetch(apiAddr + GROUP_URL + "/"+id,
            {
                method: "put",
                headers: {
                    "Content-Type":"application/json",
                    "Don8-Auth-Sid":s.id,
                },
                body:JSON.stringify(reqBody),
            },
        )
        .then(resp => {
            console.log("resp");
            if ((resp.status === 202) || (resp.status === 409)) {
				return resp.json();
			} else {
				return {error:"Failed with "+resp.status + ":" + resp.statusText};
			}
        })
        .then(data => {
            console.log("updated: "+JSON.stringify(data))
            //data is updated group information
            //localStorage.setItem("groupObjStr", JSON.stringify(data)); //loaded in edit group for init values
            //window.dispatchEvent(new Event("groupChange"));
            setSuccess(true);
        })
        .catch(err => {
            console.log("update failed: "+err)
            setErrMsg(err)
        })
    }

    return (
        <>
        {success ? (
            <Navigate to={groupLink}/>
        ) : (
            <section>
                <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">{errMsg}</p>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="title">Group Title:</label>
                    <input
                        type="text"
                        id="title"
                        ref={titleRef}
                        autoComplete="on"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        required
                    />

                    <label htmlFor="description">Description:</label>
                    <textarea
                        type="textarea"
                        id="description"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                    />
                    <button type="submit">Update</button>
                </form>
                <a href={groupLink}>Back</a>
            </section>
        )}
        </>
    );
}

export default EditGroup;