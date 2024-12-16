import React, {ChangeEvent, useEffect, useState} from 'react';
import {FormattedMessage} from "react-intl";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {paths} from "../../config/paths.ts";
import {useBunkoDispatch, useBunkoSelector} from "../../hooks/redux-hooks.ts";
import {login} from "../../slices/UserSlice.ts";

export const Login = () => {
	const {user, error} = useBunkoSelector(state => state.currentUser);
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [buttonLoading, setButtonLoading] = useState(false);
	const [params] = useSearchParams();
	const navigate = useNavigate();
	const dispatch = useBunkoDispatch();

	useEffect(() => {
		const redirection = params.get("redirectTo");
		if (user) {
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
			<div className="login-form">
				{error && error === "Bad credentials" && <p style={{color: 'red'}}>
					<FormattedMessage id="auth.badCredentials"
									  defaultMessage="Invalid Credentials"
									  description="Invalid credentials"/>
				</p>}
				<form onSubmit={handleSubmit}>
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
					<button type="submit">
						{buttonLoading ? 'Logging in...' : 'Login'}
					</button>
				</form>
				<Link to={paths.auth.register.getHref()}>New to Bunko?</Link>
			</div>
		</>
	);
};

export default Login;
