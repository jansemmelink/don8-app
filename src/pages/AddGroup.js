import React, {useState, useRef, useEffect} from 'react';
import Group from './Group';

import apiAddr from './api/api';
const GROUPS_ADD_URL = '/groups';

const AddGroup = () => {
    const parentGroup = JSON.parse(localStorage.getItem("groupObjStr"));

    const titleRef = useRef();
    const errRef = useRef();
    const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		titleRef.current.focus();
	}, []);

	useEffect(() => {
		setErrMsg('');
	}, [title, description]);

	const handleSubmit = async (e) => {
		e.preventDefault();
        const s = JSON.parse(localStorage.getItem("sessionObjStr"));
		const reqBody = {title: title, description: description, user_role:"Group Owner"}
        if (parentGroup?.id) {
            reqBody.parent_group_id = parentGroup.id;
        }
        fetch(apiAddr + GROUPS_ADD_URL,
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
				setErrMsg('Created');
				setSuccess(true);
	            localStorage.setItem("groupObjStr", JSON.stringify(data));
				window.dispatchEvent(new Event("groupChange"));
			}
        })
        .catch(err => {
            console.log("got exception")
			setErrMsg('Group creation failed: '+err);
        })
	};

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

                <>
                {parentGroup ? (<h1>{parentGroup.title}</h1>):(<><h1>New Group</h1></>)}
                </>
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
                    <button>Create</button>
                </form>
            </section>
        )
        };
        </>
    );
}
export default AddGroup;