import React, {ChangeEvent, useEffect, useState} from 'react';
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {paths} from "../../config/paths.ts";
import {useBunkoDispatch, useBunkoSelector} from "../../hooks/redux-hooks.ts";
import {login} from "../../slices/UserSlice.ts";


const messages = defineMessages({
	usernamePlaceholder: {
		id: 'login.usernamePlaceholder',
		defaultMessage: 'Username',
		description: "Input placeholder",
	},
	pwdPlaceholder: {
		id: 'login.pwdPlaceholder',
		defaultMessage: 'Password',
		description: "Input placeholder",
	},
	registerLink: {
		id: 'login.registerLink',
		defaultMessage: 'New to bunko ?',
		description: "Register link",
	}
})

export const Login = () => {
	const {user, loading, error} = useBunkoSelector(state => state.currentUser);
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [buttonLoading, setButtonLoading] = useState(false);
	const [params] = useSearchParams();
	const navigate = useNavigate();
	const dispatch = useBunkoDispatch();
	const {formatMessage} = useIntl();

	useEffect(() => {
		const redirection = params.get("redirectTo");
		if (user && !loading) {
			if (redirection) {
				navigate(redirection);
			}
			navigate(paths.home.getHref());
		}
	}, [user, params, navigate]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setButtonLoading(true);
		dispatch(login({username, password}))
		setButtonLoading(false);
	};

	return (
		<>
			<h2 className="login-title">Login</h2>
			<div className="login-container">
				<div className="login-form">
					{error && error === "Bad credentials" && <p style={{color: 'red'}}>
						<FormattedMessage id="auth.badCredentials"
										  defaultMessage="Invalid Credentials"
										  description="Invalid credentials"/>
					</p>}
					<form onSubmit={handleSubmit}>
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
						<button className="submit-btn" type="submit">
							{buttonLoading ? 'Logging in...' : 'Login'}
						</button>
					</form>
					<Link className="register-link" to={paths.auth.register.getHref()}>{formatMessage(messages.registerLink)}</Link>
				</div>
			</div>
		</>
	);
};

export default Login;
