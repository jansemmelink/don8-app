import React, {useState, useRef, useEffect} from "react";
import {Navigate, useParams} from "react-router-dom";

import apiAddr from './api/api';
const REQUEST_URL="/request"

const EditRequest = () => {
    const { id } = useParams();
    const requestLink = "/request/"+id;

    const errRef = useRef();
	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState(false);
    const [groupLink, setGroupLink] = useState({});

    //fields
    const titleRef = useRef();
    const [title, setTitle] = useState('');

    const descriptionRef = useRef();
    const [description, setDescription] = useState('');
    
    const tagsRef = useRef();
    const [tags, setTags] = useState('');

    const unitsRef = useRef();
    const [units, setUnits] = useState('');

    const qtyRef = useRef();
    const [qty, setQty] = useState('');

    useEffect(() => {
        const init = JSON.parse(localStorage.getItem("requestObjStr"))
        if (init && (id===init.id)) {
            setTitle(init.title);
            setDescription(init.description);
            setTags(init.tags);
            setQty(init.qty);
            setUnits(init.units);
            setGroupLink(init.group_id);
        }
		titleRef.current.focus();
	}, []);

    const handleSubmit = () => {
        console.log("Submit update ...");
        const s = JSON.parse(localStorage.getItem("sessionObjStr"));
        const reqBody = {id: id, title: title, description: description, tags: tags, units: units, qty: Number(qty)};
        console.log("Submit update ..." + JSON.stringify(reqBody));
        fetch(apiAddr + REQUEST_URL + "/"+id,
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
                <h1>Request Editor</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="title">Title:</label>
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
                        ref={descriptionRef}
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                    />

                    <label htmlFor="tags">Tags:</label>
                    <input
                        type="text"
                        id="tags"
                        ref={tagsRef}
                        autoComplete="on"
                        onChange={(e) => setTags(e.target.value)}
                        value={tags}
                        required
                    />

                    <label htmlFor="units">Units:</label>
                    <input
                        type="text"
                        id="units"
                        ref={unitsRef}
                        autoComplete="on"
                        onChange={(e) => setUnits(e.target.value)}
                        value={units}
                    />

                    <label htmlFor="qty">Quantity:</label>
                    <input
                        type="text"
                        id="qty"
                        ref={qtyRef}
                        autoComplete="on"
                        onChange={(e) => setQty(e.target.value)}
                        value={qty}
                        required
                    />

                    <button type="submit">Update</button>
                </form>
                <a href={requestLink}>Back</a>
            </section>
        )}
        </>
    );
}

export default EditRequest;