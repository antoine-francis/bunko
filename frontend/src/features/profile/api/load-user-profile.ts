import {UserProfile} from "../../../types/UserProfile.ts";
import {URL} from "../../../constants/Url.ts";

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
			bookmarks: data.bookmarks === undefined ? 0 : data.bookmarks,
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