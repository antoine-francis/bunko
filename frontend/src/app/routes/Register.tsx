import React, {ChangeEvent, useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {paths} from "../../config/paths.ts";
import {useBunkoDispatch, useBunkoSelector} from "../../hooks/redux-hooks.ts";
import {register} from "../../slices/UserSlice.ts";
import {isValidEmail} from "../../utils/valid-email.ts";
import {defineMessages, useIntl} from "react-intl";

const messages = defineMessages({
	firstNamePlaceholder: {
		id: "register.firstNamePlaceholder",
		defaultMessage: "First Name",
		description: "Input placeholder",
	},
	lastNamePlaceholder: {
		id: "register.lastNamePlaceholder",
		defaultMessage: "Last Name",
		description: "Input placeholder",
	},
	emailPlaceholder: {
		id: "register.emailPlaceholder",
		defaultMessage: "Email",
		description: "Input placeholder",
	},
	usernamePlaceholder: {
		id: "register.usernamePlaceholder",
		defaultMessage: "Username",
		description: "Input placeholder",
	},
	pwdPlaceholder: {
		id: "register.pwdPlaceholder",
		defaultMessage: "Password",
		description: "Input placeholder",
	},
	pwdConfPlaceholder: {
		id: "register.pwdConfPlaceholder",
		defaultMessage: "Confirm password",
		description: "Input placeholder",
	},
	loginLink: {
		id: "register.loginLink",
		defaultMessage: "Already a member ?",
		description: "Login link",
	},
})

export const Register = () => {
	const {formatMessage} = useIntl();
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
			<div className="signup-container">
				<div className="about-us">
					Sed vel tellus mauris. Nunc posuere rhoncus viverra. Vivamus id justo non augue tristique tempus sit amet in libero. Aliquam non nunc laoreet, sodales massa vel, ultricies risus. Vestibulum ac auctor eros. Donec orci metus, consectetur in euismod sed, egestas vitae metus. Nullam posuere odio nec tempus ornare.
				</div>
				<div className="signup-form">
					{error && <p style={{color: 'red'}}>
						{error}
					</p>}
					<form onSubmit={handleSubmit}>
						<div id="name">
							<div>
								<input
									placeholder={formatMessage(messages.firstNamePlaceholder)}
									type="firstName"
									value={firstName}
									onChange={(e: ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
									required
								/>
							</div>
							<div>
								<input
									placeholder={formatMessage(messages.lastNamePlaceholder)}
									type="lastName"
									value={lastName}
									onChange={(e: ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
									required
								/>
							</div>
						</div>
						<div>
							<input
								placeholder={formatMessage(messages.emailPlaceholder)}
								type="email"
								value={email}
								onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div>
							<input
								placeholder={formatMessage(messages.usernamePlaceholder)}
								type="username"
								value={username}
								onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
								required
							/>
						</div>
						<div>
							<input
								placeholder={formatMessage(messages.pwdPlaceholder)}
								type="password"
								value={password}
								onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
								required
							/>
						</div>
						<div>
							<input
								placeholder={formatMessage(messages.pwdConfPlaceholder)}
								type="password"
								value={confPassword}
								onChange={(e: ChangeEvent<HTMLInputElement>) => setConfPassword(e.target.value)}
								required
							/>
						</div>
						<div className="terms-conditions">
							<input
								type="checkbox"
								name="terms-agreement"
								id="terms"
								onChange={(e: ChangeEvent<HTMLInputElement>) => setAgreedToTerms(e.target.checked)}/>
							<label htmlFor="terms">I agree to the <a href="">terms and conditions</a></label>
						</div>

						<button className="submit-btn" type="submit">
							{buttonLoading ? 'Validating...' : 'Signup'}
						</button>
					</form>
					<Link className="login-link"
						  to={paths.auth.login.getHref()}>{formatMessage(messages.loginLink)}</Link>
				</div>
			</div>
		</>
	);
};

