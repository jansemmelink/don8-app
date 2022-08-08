import { useRef, useState, useEffect } from 'react';
import { faCheck, faTimes, faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import Login from './Login';

import apiAddr from './api/api';
const REGISTER_URL = "/register"

const NAME_REGEX = /^.{1,60}$/;
const PHONE_REGEX = /^[0-9 ]{10,15}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9@_.-]{5,100}$/;

const Register = () => {
	const emailRef = useRef();
	const errRef = useRef();

	const [name, setName] = useState('');
	const [validName, setValidName] = useState(false);
	const [nameFocus, setNameFocus] = useState(false);

	const [email, setEmail] = useState('');
	const [validEmail, setValidEmail] = useState(false);
	const [emailFocus, setEmailFocus] = useState(false);

	const [phone, setPhone] = useState('');
	const [validPhone, setValidPhone] = useState(false);
	const [phoneFocus, setPhoneFocus] = useState(false);

	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		emailRef.current.focus();
	}, []);

	useEffect(() => {
		setValidName(NAME_REGEX.test(name));
	}, [name]);

	useEffect(() => {
		setValidEmail(EMAIL_REGEX.test(email));
	}, [email]);

	useEffect(() => {
		setValidPhone(PHONE_REGEX.test(phone));
	}, [phone]);

	useEffect(() => {
		setErrMsg('');
	}, [name, phone, email]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		// if button enabled with JS hack
		const v1 = NAME_REGEX.test(name);
		const v2 = EMAIL_REGEX.test(email);
		const v3 = PHONE_REGEX.test(phone);
		if (!v1 || !v2 || !v3) {
			setErrMsg('Invalid Entry');
			return;
		}

		setErrMsg('Creating your account ...');

		const reqBody = { name, email, phone, activate_link: "http://localhost:3000/activate" }
        fetch(apiAddr + REGISTER_URL,
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
            if (resp.status === 409 || resp.status === 202) {
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
				//success:
				setErrMsg('');
				setSuccess(true);
	            //localStorage.setItem("userObjStr", JSON.stringify(data));
			}
        })
        .catch(err => {
            console.log("got exception")
			setErrMsg('Registration failed: '+err);
        })
	};

	return (
		<>
			{success ? (
				<section>
					<h1>Registered</h1>
					<p>Email: {email}</p>
					<p>Check your email for instruction to activate your account.</p>
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
					<h1>Register</h1>
					<form onSubmit={handleSubmit}>
						<label htmlFor="name">
							Name:
							<FontAwesomeIcon
								icon={faCheck}
								className={validName ? 'valid' : 'hide'}
							/>
							<FontAwesomeIcon
								icon={faTimes}
								className={validName || !name ? 'hide' : 'invalid'}
							/>
						</label>
						<input
							type="text"
							id="name"
							onChange={(e) => setName(e.target.value)}
							value={name}
							required
							aria-invalid={validName ? 'false' : 'true'}
							aria-describedby="namenote"
							onFocus={() => setNameFocus(true)}
							onBlur={() => setNameFocus(false)}
						/>
						<p
							id="namenote"
							className={nameFocus && !validName ? 'instructions' : 'offscreen'}
						>
							<FontAwesomeIcon icon={faInfoCircle} />
							Your name as you want to be known, e.g. Joe Black
						</p>

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

						<label htmlFor="phone">
							Phone:
							<FontAwesomeIcon
								icon={faCheck}
								className={validPhone ? 'valid' : 'hide'}
							/>
							<FontAwesomeIcon
								icon={faTimes}
								className={validPhone || !phone ? 'hide' : 'invalid'}
							/>
						</label>
						<input
							type="text"
							id="phone"
							onChange={(e) => setPhone(e.target.value)}
							value={phone}
							required
							aria-invalid={validPhone ? 'false' : 'true'}
							aria-describedby="phonenote"
							onFocus={() => setPhoneFocus(true)}
							onBlur={() => setPhoneFocus(false)}
						/>
						<p
							id="phonenote"
							className={
								phoneFocus && !validPhone ? 'instructions' : 'offscreen'
							}
						>
							<FontAwesomeIcon icon={faInfoCircle} />
							South African phone number e.g. 012 345 6789
							<br/>
							Spaces are optional and will be ignored.
						</p>

						<button
							disabled={!validName || !validEmail || !validPhone ? true : false}
						>
							Register
						</button>
					</form>
					<p>
						Already registered?
						<br />
						<span className="line">
							<a href="/login">Sign In</a>
						</span>
					</p>
				</section>
			)}
		</>
	);
};

export default Register;