import { useRef, useState, useEffect } from 'react';
import { faCheck, faTimes, faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Login from './Login';

import apiAddr from './api/api';
const RESET_URL = "/reset"

const EMAIL_REGEX = /^[a-zA-Z0-9@_.-]{5,100}$/;

const Reset = () => {
    //todo: call api to delete the session...
	localStorage.removeItem("sessionObjStr");
	window.dispatchEvent(new Event("sessionChange"));

	const emailRef = useRef();
	const errRef = useRef();

	const [email, setEmail] = useState('');
	const [validEmail, setValidEmail] = useState(false);
	const [emailFocus, setEmailFocus] = useState(false);

	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		emailRef.current.focus();
	}, []);

	useEffect(() => {
		setValidEmail(EMAIL_REGEX.test(email));
	}, [email]);

	useEffect(() => {
		setErrMsg('');
	}, [email]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		// if button enabled with JS hack
		const v1 = EMAIL_REGEX.test(email);
		if (!v1) {
			setErrMsg('Invalid Entry');
			return;
		}

		setErrMsg('Resetting your password ...');

		const reqBody = { email, reset_link: "http://localhost:3000/activate" }
        fetch(apiAddr + RESET_URL,
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
				setErrMsg('');
				setSuccess(true);
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
				setErrMsg('');
				setSuccess(true);
			}
        })
        .catch(err => {
            console.log("got exception: "+err)
			setErrMsg('Reset failed: '+err);
        })
	};

	return (
		<>
			{success ? (
				<section>
					<h1>Done</h1>
					<p>Email: {email}</p>
					<p>Check your email for instruction to set your new password.</p>
				</section>
			) : (
				<section >
					<p
						ref={errRef}
						className={errMsg ? 'errmsg' : 'offscreen'}
						aria-live="assertive"
					>
						{errMsg}
					</p>
					<h1>Password Reset</h1>
					<form onSubmit={handleSubmit}>
						<label htmlFor="email">
							Email:
							<FontAwesomeIcon
								icon={faCheck}
								className={validEmail ? 'valid' : 'hide'}
							/>
							<FontAwesomeIcon
								icon={faTimes}
								className={validEmail || !email ? 'hide' : 'invalid'}
							/>
						</label>
						<input
							type="text"
							id="email"
							ref={emailRef}
							autoComplete="on"
							onChange={(e) => setEmail(e.target.value)}
							value={email}
							required
							aria-invalid={validEmail ? 'false' : 'true'}
							aria-describedby="emailnote"
							onFocus={() => setEmailFocus(true)}
							onBlur={() => setEmailFocus(false)}
						/>
						<p
							id="emailnote"
							className={
								emailFocus && email && !validEmail ? 'instructions' : 'offscreen'
							}
						>
							<FontAwesomeIcon icon={faInfoCircle} />
							email address e.g. myname@gmail.com
						</p>

						<button
							disabled={!validEmail ? true : false}
						>
							Reset
						</button>
					</form>
					<p>
						<span className="line">
							<a href="/login">Sign In</a>
						</span>
					</p>
				</section>
			)}
		</>
	);
};

export default Reset;