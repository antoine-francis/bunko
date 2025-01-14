import {Subscription, UserProfile} from "../../../types/UserProfile.ts";
import {getCookie} from "../../../utils/get-cookie.ts";
import {URL} from "../../../constants/Url.ts";

export const subscribeToProfile = async (profile : UserProfile) : Promise<Subscription> => {
	const response = await fetch(URL.SERVER + URL.SUBSCRIBE + profile.username, {
		method: "POST",
		credentials: 'include',
		headers: {
			"Content-Type": "application/json",
			"X-CSRFToken": getCookie("csrftoken"),
		}
	});
	if (response.ok) {
		return await response.json();
	} else {
		throw new Error(response.status.toString());
	}
}

export const unsubscribeToProfile = async (profile : UserProfile) : Promise<string> => {
	const response = await fetch(URL.SERVER + URL.UNSUBSCRIBE + profile.username, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			"X-CSRFToken": getCookie("csrftoken"),
		}
	});
	if (!response.ok) {
		throw new Error(response.status.toString());
	}
	return response.json();
}