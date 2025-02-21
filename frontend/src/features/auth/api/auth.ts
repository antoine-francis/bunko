import {getCookie} from "../../../utils/get-cookie.ts";
import {UserBadge} from "../../../types/UserProfile.ts";

export const attemptLogin = async (username: string, password : string) => {
	const response = await fetch('http://localhost:8000/auth/login', {
		method: 'POST',
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Basic " + btoa(username + ":" + password)
		},
		credentials: 'include',
	});

	if (!response.ok) {
		// Special case of providing as little info as possible
		throw new Error("Bad credentials");
	}
	return await response.json();
}

export const attemptLogout = async () => {
	const response = await fetch('http://localhost:8000/auth/logout', {
		method: 'DELETE',
		credentials: 'include',
		headers: {
			"Content-Type": "application/json",
			"X-CSRFToken": getCookie("csrftoken"),
		},
	});
	return response.json();
}

export const checkSession = async (): Promise<UserBadge | undefined> => {
	const response = await fetch('http://localhost:8000/user_data', {
		credentials: "include",
	});
	if (!response.ok) {
		if (response.status === 404) {
			return undefined;
		}
		throw new Error('Failed to fetch user data');
	}
	return response.json();
};

export const attemptSignup = async (
	username: string,
	email : string,
	firstName : string,
	lastName : string,
	password : string) => {
	const response = await fetch('http://localhost:8000/auth/signup', {
		method: 'POST',
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Basic " + btoa(username + ":" + email + ":" + firstName + ":" + lastName + ":" + password)
		},
		credentials: 'include',
	});

	if (!response.ok) {
		// Special case of providing as little info as possible
		throw new Error(response.status.toString());
	}
	return await response.json();
}