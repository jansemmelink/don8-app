import React, {useState, useRef, useEffect} from 'react';
import Group from './Group';

import apiAddr from './api/api';
const REQUESTS_ADD_URL = '/requests';

const AddRequest = () => {
    const errRef = useRef();
	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState(false);

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
		titleRef.current.focus();
	}, []);

	useEffect(() => {
		setErrMsg('');
	}, [title, description, tags, units, qty]);

	const handleSubmit = async (e) => {
		e.preventDefault();
        const s = JSON.parse(localStorage.getItem("sessionObjStr"));
        const g = JSON.parse(localStorage.getItem("groupObjStr"));
        if (g) {
            console.log("group.id="+g.id);
        } else {
            console.log("no group");
        }
		const reqBody = {group_id: g.id, title: title, description: description, tags: tags, units: units, qty: Number(qty)}
        console.log("reqBody: "+JSON.stringify(reqBody));
        fetch(apiAddr + REQUESTS_ADD_URL,
            {
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Don8-Auth-Sid":s.id,
                },
                body:JSON.stringify(reqBody),
            },
        )
        .then(resp => {
            if ((resp.status === 202) || (resp.status === 409)) {
				return resp.json();
			} else {
				return {error:"Failed with "+resp.status + ":" + resp.statusText};
			}
        })
        .then((data) => {
			console.log("data="+data);
			if (data.error) {
				setErrMsg(data.error);
			} else {
				setErrMsg('Requested');
				setSuccess(true);
			}
        })
        .catch(err => {
            console.log("got exception")
			setErrMsg('Request failed: '+err);
        })
	};

    const g = JSON.parse(localStorage.getItem("groupObjStr"));
    return (
        <>
        {success ? (
            <Group/>
        ) : (
            <section>
                <p
                    ref={errRef}
                    className={errMsg ? 'errmsg' : 'offscreen'}
                    aria-live="assertive"
                >
                    {errMsg}
                </p>

                <h1>New Request for {g.title}</h1>
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
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        required
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
                        required
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

                    <button>Request</button>
                </form>
            </section>
        )
        };
        </>
    );
}
export default AddRequest;