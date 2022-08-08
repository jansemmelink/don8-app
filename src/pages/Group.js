import React, {useState, useEffect, useRef} from "react";
import {useParams} from "react-router-dom";

import apiAddr from './api/api';
const GROUP_URL="/group"

const Group = () => {
    const errRef = useRef();
	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState(false);

    const [group, setGroup] = useState({});
    let [parentLink, setParentLink] = useState('');
    let { id } = useParams();
    if (id === undefined) {
        const currentGroup = JSON.parse(localStorage.getItem("groupObjStr"))
        if (currentGroup) {
            id = currentGroup.id;
            console.log("got id from local storage: "+id);
        }
    }


    const editLink = GROUP_URL + "/edit/" + id;
    const loadGroup = () => {
        console.log("getting group "+id+" ...");
        fetch(apiAddr + GROUP_URL + "/" + id,
            {
                method: "get",
                headers: {
                    "Accept": "application/json",
                }
            })
            .then(resp => {return resp.json();})
            .then(data => {
                setGroup(data);
                let newParentLink = "";
                if (data.parent_group_id) {
                    newParentLink = "/group/"+data.parent_group_id
                }
                localStorage.setItem("groupObjStr", JSON.stringify(data)); //loaded in edit group for init values
				window.dispatchEvent(new Event("groupChange"));
                setSuccess(true);
                setParentLink(newParentLink);
                console.log("loaded group, parentLink="+newParentLink)
            })
            .catch(err => {
                setErrMsg("failed to fetch: "+err)
            })
    }

    useEffect(()=>{
        loadGroup();
    },[]);

    return (<section>
        <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">{errMsg}</p>
        {success ? (
            <>
                {group.parent && (parentLink !== "") ? (
                    <a href={parentLink}>{group.parent.title}</a>
                ) : (
                    <></>
                )}

                <h1><a href={editLink}>{group.title}</a></h1>
                <p><a href={editLink}>{group.description}</a></p>

                <h3>Requests</h3>
                <a href="/groups/new_request">+ Request Donation</a>

                <h3>Children</h3>
                {(group.children) ? (
                    <>
                    {group.children.map((child) => {
                        let link="/group/"+child.id;
                        return <li key={child.id}><a href={link}>{child.title}</a></li>
                    })}
                    </>
                ) : (
                    <></>
                )}

                {/* todo: list of requests + status of each + filter */}

                <a href="/groups/new">+ Child Group</a>
            </>
        ):(
            <>
            </>
        )}
    </section>);
}

export default Group;