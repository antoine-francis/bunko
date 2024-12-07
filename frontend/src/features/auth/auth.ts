
export const attemptLogin = async (username: string, password : string) => {
	const response = await fetch('http://localhost:8000/auth/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({username, password}),
		credentials: 'include',
	});

	if (!response.ok) {
		// Special case of providing as little info as possible
		throw new Error("Bad credentials");
	}
	return response.json();
}