import React, {useState, useEffect, useRef} from 'react';

import apiAddr from './api/api';
const GROUPS_URL="/groups"

const Dashboard = () => {
    //get current session details
    const s = JSON.parse(localStorage.getItem("sessionObjStr"));

    //clear group selection
    localStorage.removeItem("groupObjStr");

    const errRef = useRef();
	const [errMsg, setErrMsg] = useState('');

    const [matches, setMatches] = useState([])
    const [filter, setFilter] = useState('');
    useEffect(() => {
		setErrMsg('');
	}, [filter]);

    const doSearch = (event) => {
        event.preventDefault();
        //load list of groups that user is member of
        fetch(apiAddr + GROUPS_URL + `?filter=${filter}`,
            {
                method:"get",
                headers:{
                    "Don8-Auth-Sid":s.id,
                },
            },
        )
        .then(resp => {
            if ((resp.status === 200) || (resp.status === 404)) {
                return resp.json();
            } else {
                return {error:"Failed with "+resp.status + ":" + resp.statusText};
            }
        })
        .then((data) => {
            if (data.error) {
                setErrMsg(data.error);
            } else {
                setMatches(data)
                //window.dispatchEvent(new Event("groupChange"));
            }
        })
        .catch(err => {
            console.log("got exception")
            setErrMsg('Group creation failed: '+err);
        })
    }

    return (
        <section>
            <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">{errMsg}</p>
            <a href="/groups/new">+Group</a>
            <form onSubmit={doSearch}>
                <input
                    type="text"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>
            <ul>
                {matches.map((match) => {
                    let link="/group/"+match.group_id;
                    let title = "";
                    title += match.title;
                    if (match.start_time) {
                        title += " from "+match.start_time;
                    }
                    return <li key={match.group_id}><a href={link}>{title}</a></li>
                })}
            </ul>
        </section>
    );
}

export default Dashboard;