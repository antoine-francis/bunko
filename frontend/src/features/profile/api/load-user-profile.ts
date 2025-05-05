import {UserBadge, UserProfile} from "@/types/UserProfile.ts";
import {URL} from "@/constants/Url.ts";
import {getCookie} from "@/utils/get-cookie.ts";

export const loadUserProfile : (username : string) => Promise<UserProfile | undefined> = async (username: string) => {

	const response = await fetch(URL.SERVER + URL.PROFILE + username, {
		credentials: 'include',
	});

	if (response.ok) {
		const data = await response.json();
		const flattenedProfile = Object.assign({}, {
			picture: data.picture,
			bio: data.bio,
			signupDate: data.signupDate,
			followers: data.followers === undefined ? 0 : data.followers,
			following: data.following === undefined ? 0 : data.following,
			saves: data.saves === undefined ? 0 : data.saves,
			series: data.series === undefined ? 0 : data.series,
			favorites: data.favorites,
			collectives: data.collectives,
			texts: data.texts,
			username: data.user.username,
			firstName: data.user.firstName,
			lastName: data.user.lastName
		})
		return flattenedProfile;
	} else {
		throw new Error(response.status.toString());
	}
};

export const updateUserProfile : (formData : FormData) => Promise<UserBadge | undefined> = async (formData : FormData) => {

	const response = await fetch(URL.SERVER + URL.UPDATE_PROFILE, {
		method: 'PATCH',
		body: formData,
		credentials: 'include',
		headers: {
			"X-CSRFToken": getCookie("csrftoken"),

		}
	});

	if (response.ok) {
		const data : UserBadge = await response.json();
		return data;
	} else {
		throw new Error(response.status.toString());
	}
};

export const loadSuggestedUsers = async () : Promise<UserBadge[]> => {
	const response = await fetch(URL.SERVER + URL.SUGGESTED_USERS, {
		method: 'GET',
		credentials: 'include',
		headers: {
			"X-CSRFToken": getCookie("csrftoken"),

		}
	});

	if (response.ok) {
		const data : UserBadge[] = await response.json();
		return data;
	} else {
		throw new Error(response.status.toString());
	}
}