import { useRef, useState, useEffect } from 'react';
//import AuthContext from './context/AuthProvider';
import Home from './Home';

import apiAddr from './api/api';
const LOGIN_URL = '/login';

const Login = () => {
	//const { setAuth } = useContext(AuthContext);
	const userRef = useRef();
	const errRef = useRef();

	const [email, setEmail] = useState('');
	const [pwd, setPwd] = useState('');
	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		userRef.current.focus();
	}, []);

	useEffect(() => {
		setErrMsg('');
	}, [email, pwd]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrMsg("Logging in ...");
		const reqBody = {email: email, password: pwd}
        fetch(apiAddr + LOGIN_URL,
            {
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify(reqBody),
            },
        )
        .then(resp => {
            console.log("got resp")
			console.log("resp.st="+resp.status);
			console.log("resp.stt="+resp.statusText);
            if (resp.status === 202) {
				return resp.json();
			} else if (resp.status === 404) {
				return {error:"unknown account"}
			} else if (resp.status === 401) {
				return {error:"wrong password"}
			} else {
				return {error:"Failed with "+resp.status + ":" + resp.statusText};
			}
        })
        .then((data) => {
			console.log("data="+data);
			if (data.error) {
				setErrMsg(data.error);
			} else {
				//success:
				setErrMsg('Activated');
				setSuccess(true);
	            localStorage.setItem("sessionObjStr", JSON.stringify(data));
				window.dispatchEvent(new Event("sessionChange"));
			}
        })
        .catch(err => {
            console.log("got exception")
			setErrMsg('Activation failed: '+err);
        })
	};

	return (
		<>
			{success ? (
				<Home/>
			) : (
				<section>
					<p
						ref={errRef}
						className={errMsg ? 'errmsg' : 'offscreen'}
						aria-live="assertive"
					>
						{errMsg}
					</p>
					<h1>Sign In</h1>
					<form onSubmit={handleSubmit}>
						<label htmlFor="email">Email:</label>
						<input
							type="text"
							id="email"
							ref={userRef}
							autoComplete="on"
							onChange={(e) => setEmail(e.target.value)}
							value={email}
							required
						/>

						<label htmlFor="password">Password:</label>
						<input
							type="password"
							id="password"
							onChange={(e) => setPwd(e.target.value)}
							value={pwd}
							required
						/>
						<button>Sign In</button>
					</form>
					<p>
						<span className="line">
							<a href="/register">Register a new email address</a>
						</span>
						<span className="line">
							<a href="/reset">Reset your password</a>
						</span>
					</p>
				</section>
			)}
		</>
	);
};

export default Login;