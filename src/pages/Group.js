import React, {useState, useEffect, useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";

import apiAddr from './api/api';
const GROUP_URL="/group"

const Group = () => {
    const navigate = useNavigate();

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
        console.log("getting group(id:"+id+") ...");
        fetch(apiAddr + GROUP_URL + "/" + id,
            {
                method: "get",
                headers: {
                    "Accept": "application/json",
                }
            },
        )
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
        });
    }

    useEffect(()=>{
        loadGroup();
    },[]);//this causes a warning for missing dependency, but taking the [] out causes infinite load loop...?

    const showHidePageMenu = () => {
        console.log("myFunction called");
        let x = document.getElementById("myLinks");
        if (x.style.display === "block") {
            x.style.display = "none";
        } else {
            x.style.display = "block";
        }
    };

    const navigateToEditGroup = () => {
        navigate(editLink);
    };
    const navigateToNewGroup = () => {
        navigate("/groups/new");
    };
    const navigateToNewRequest = () => {
        navigate("/requests/new");
    };

    return (
        <>
            <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">{errMsg}</p>
            {success ? (
                <div className="mobile-container">
                    <div className="page_nav">
                        {group.parent && (parentLink !== "") ? (
                            <a href={parentLink} className="active">{group.parent.title}</a>
                        ) : (
                            <></>
                        )}
                        <a href="javascript:void(0);" className="icon" onClick={showHidePageMenu}>
                            <i className="fa fa-bars"></i>
                        </a>
                        <div id="myLinks">
                            <a href="/group/edit/id">Edit Group</a>
                            <a href="/requests/new">New Request</a>
                            <a href="/groups/new">New Sub-Group</a>
                        </div>
                    </div>

                    <h1>{group.title}</h1>
                    <p>{group.description}</p>

                    <h3>Requests</h3>
                    {(group.requests) ? (
                        <table border="1">
                            <thead>
                                <tr><th>Item</th><th>Request</th><th>Received</th><th>Promised</th><th>Left</th></tr>
                            </thead>
                            <tbody>
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
                            </tbody>
                        </table>
                    ) : (
                        <></>
                    )}

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
                </div>):
                (
                    <></>
                )
        }
        </>
    );
}

export default Group;