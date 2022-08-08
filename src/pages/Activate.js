import { useRef, useState, useEffect } from 'react';
import { faCheck, faTimes, faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Navigate, useParams } from 'react-router-dom';

import apiAddr from './api/api';
const ACTIVATE_URL = "/activate"

const PWD_REGEX = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,60}$/;

const Activate = () => {
	const { tpw } = useParams();
    console.log("Tpw: " + tpw);

	const randomPwd = 'Au7eiwohLeif';
	const errRef = useRef();

	const [pwd, setPwd] = useState(randomPwd);
	const [validPwd, setValidPwd] = useState(false);
	const [pwdFocus, setPwdFocus] = useState(false);

	const [matchPwd, setMatchPwd] = useState(randomPwd);
	const [validMatch, setValidMatch] = useState(false);
	const [matchFocus, setMatchFocus] = useState(false);

	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState(false);

	// useEffect(() => {
	// 	userRef.current.focus();
	// }, []);

	useEffect(() => {
		setValidPwd(PWD_REGEX.test(pwd));
		setValidMatch(pwd === matchPwd);
	}, [pwd, matchPwd]);

	useEffect(() => {
		setErrMsg('');
	}, [pwd, matchPwd]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		// if button enabled with JS hack
		const v1 = PWD_REGEX.test(pwd);
		const v2 = PWD_REGEX.test(matchPwd);
		if (!v1 || !v2) {
			setErrMsg('Invalid Entry');
			return;
		}

		setErrMsg("Activating your account ...");
		const reqBody = {tpw: tpw, pwd: pwd}
        fetch(apiAddr + ACTIVATE_URL,
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
				return {error:"not activated unknown account"}
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
				<Navigate to="/home" replace="false"/>
			) : (
				<section >
					<p
						ref={errRef}
						className={errMsg ? 'errmsg' : 'offscreen'}
						aria-live="assertive"
					>
						{errMsg}
					</p>
					<h1>Activate Your Account</h1>
					<p>Enter and repeat a new password of your choice. Use 8 characters or more with a mix of letters and digits.</p>
					<p>If this is your own phone or computer, just click [Activate].</p>
					<form onSubmit={handleSubmit}>
						<label htmlFor="password">
							Password:
							<FontAwesomeIcon
								icon={faCheck}
								className={validPwd ? 'valid' : 'hide'}
							/>
							<FontAwesomeIcon
								icon={faTimes}
								className={validPwd || !pwd ? 'hide' : 'invalid'}
							/>
						</label>
						<input
							type="password"
							id="password"
							onChange={(e) => setPwd(e.target.value)}
							value={pwd}
							required
							aria-invalid={validPwd ? 'false' : 'true'}
							aria-describedby="pwdnote"
							onFocus={() => setPwdFocus(true)}
							onBlur={() => setPwdFocus(false)}
						/>
						<p
							id="pwdnote"
							className={pwdFocus && !validPwd ? 'instructions' : 'offscreen'}
						>
							<FontAwesomeIcon icon={faInfoCircle} />
							8 or more letters and digits.
						</p>

						<label htmlFor="confirm_pwd">
							Confirm Password:
							<FontAwesomeIcon
								icon={faCheck}
								className={validMatch && matchPwd ? 'valid' : 'hide'}
							/>
							<FontAwesomeIcon
								icon={faTimes}
								className={validMatch || !matchPwd ? 'hide' : 'invalid'}
							/>
						</label>
						<input
							type="password"
							id="confirm_pwd"
							onChange={(e) => setMatchPwd(e.target.value)}
							value={matchPwd}
							required
							aria-invalid={validMatch ? 'false' : 'true'}
							aria-describedby="confirmnote"
							onFocus={() => setMatchFocus(true)}
							onBlur={() => setMatchFocus(false)}
						/>
						<p
							id="confirmnote"
							className={
								matchFocus && !validMatch ? 'instructions' : 'offscreen'
							}
						>
							<FontAwesomeIcon icon={faInfoCircle} />
							Must match the first password input field.
						</p>

						<button
							disabled={!validPwd || !validMatch ? true : false}
						>
							Activate
						</button>
					</form>
				</section>
			)}
		</>
	);
};

export default Activate;