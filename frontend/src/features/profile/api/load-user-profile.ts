import {UserProfile} from "../../../types/UserProfile.ts";

export const loadUserProfile : (username : string) => Promise<UserProfile | undefined> = async (username: string) => {
	try {
		const response = await fetch("http://localhost:8000/profile/" + username, {
			headers: {
				Cookie: "sessionid=owtt56ms9uvyq60gdghetb3z0cwoayjf;csrftoken=eLjJjD5rx4xTfwjla1NjUS1RIUmV8T28"
			},
			credentials: 'same-origin',
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
				favorites: data.favorites,
				collectives: data.collectives,
				texts: data.texts,
				username: data.user.username,
				firstName: data.user.firstName,
				lastName: data.user.lastName
			})
			return flattenedProfile;
		}
	} catch (exception) {
		console.log(exception);
	}
};