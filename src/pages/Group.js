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
                {(group.requests) ? (
                    <table border="1">
                        <tr><th>Item</th><th>Request</th><th>Received</th><th>Promised</th><th>Left</th></tr>
                    {group.requests.map((request) => {
                        console.log("request: "+JSON.stringify(request))
                        let link="/request/"+request.id;
                        let reqQty = request.qty
                        if ((request.units !== undefined) && (request.units != null)) { //todo: show and deduct received and promised, in columns
                            reqQty += " " + request.units
                        }
                        return (<tr>
                                <td><a href={link}>{request.title}</a></td>
                                <td>{reqQty}</td>
                                <td>N/A</td>
                                <td>N/A</td>
                                <td>N/A</td>
                            </tr>)
                    })}
                    </table>
                ) : (
                    <></>
                )}
                <a href="/requests/new">+ Request Donation</a>

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