import React, {ChangeEvent, useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {paths} from "../../config/paths.ts";
import {useBunkoDispatch, useBunkoSelector} from "../../hooks/redux-hooks.ts";
import {register} from "../../slices/UserSlice.ts";
import {isValidEmail} from "../../utils/valid-email.ts";

export const Register = () => {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [buttonLoading, setButtonLoading] = useState(false);
	const [confPassword, setConfPassword] = useState<string>("");
	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
	const [success, setSuccess] = useState<boolean>(false);
	const navigate = useNavigate();
	const {user} = useBunkoSelector(state => state.currentUser);
	const [error, setError] = useState<string | undefined>(undefined);
	const dispatch = useBunkoDispatch();

	useEffect(() => {
		if (success) {
			navigate(paths.auth.login.getHref());
		}
	}, [user, success, navigate]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(undefined);
		setButtonLoading(true);
		if (password !== confPassword) {
			setError("Passwords don't match");
		} else if (!isValidEmail(email)) {
			setError("Invalid email address");
		} else if (!agreedToTerms) {
			setError("You must agree to the terms and conditions");
		} else {
			dispatch(register({firstName, lastName, email, username, password}))
			!error && setSuccess(true);
		}
		setButtonLoading(false);
	};

	return (
		<>
			<h2 className="signup-title">Signup to Bunko</h2>
			<div className="signup-form">
				{error && <p style={{color: 'red'}}>
					{error}
					{/*<FormattedMessage id="auth.invalidFields"*/}
					{/*				  defaultMessage="Invalid fields"*/}
					{/*				  description="alert for invalid fields"/>*/}
				</p>}
				<form onSubmit={handleSubmit}>
					<div>
						<label>First name:</label>
						<input
							type="firstName"
							value={firstName}
							onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
							required
						/>
					</div>
					<div>
						<label>Last name:</label>
						<input
							type="lastName"
							value={lastName}
							onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
							required
						/>
					</div>
					<div>
						<label>Email:</label>
						<input
							type="email"
							value={email}
							onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div>
						<label>Username:</label>
						<input
							type="username"
							value={username}
							onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
							required
						/>
					</div>
					<div>
						<label>Password:</label>
						<input
							type="password"
							value={password}
							onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
							required
						/>
					</div>
					<div>
						<label>Confirm Password:</label>
						<input
							type="password"
							value={confPassword}
							onChange={(e: ChangeEvent<HTMLInputElement>) => setConfPassword(e.target.value)}
							required
						/>
					</div>
					<div>
						<input
							type="checkbox"
							name="terms-agreement"
							id="terms"
							onChange={(e: ChangeEvent<HTMLInputElement>) => setAgreedToTerms(e.target.checked)}/>
						<label htmlFor="terms">I agree to the <a href="">terms and conditions</a></label>
					</div>

					<button type="submit">
						{buttonLoading ? 'Validating...' : 'Signup'}
					</button>
				</form>
				<Link to={paths.auth.login.getHref()}>Already a member?</Link>
			</div>
		</>
	);
};

