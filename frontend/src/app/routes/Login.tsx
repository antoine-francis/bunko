import React, {ChangeEvent, useState} from 'react';
import {useMutation} from "@tanstack/react-query";
import {attemptLogin} from "../../features/auth/api/auth.ts";
import {FormattedMessage} from "react-intl";
import {Link, useNavigate} from "react-router-dom";
import {paths} from "../../config/paths.ts";

export const Login = () => {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const navigate = useNavigate();

	const {mutate, isError, isPending} = useMutation({
		mutationFn: () => attemptLogin(username, password),
		onSuccess: () => {
			navigate(paths.home.getHref());
		}
	})

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		mutate();
	};

	return (
		<>
			<div className="login-form">
				<h2>Login</h2>
				{isError && <p style={{ color: 'red' }}>
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
							onChange={(e : ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
							required
						/>
					</div>
					<div>
						<label>Password:</label>
						<input
							type="password"
							value={password}
							onChange={(e : ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
							required
						/>
					</div>
					<button type="submit" disabled={isPending}>
						{isPending ? 'Logging in...' : 'Login'}
					</button>
				</form>
			</div>
			<Link to={paths.auth.register.getHref()}>New to Bunko?</Link>
		</>
	);
};

export default Login;
