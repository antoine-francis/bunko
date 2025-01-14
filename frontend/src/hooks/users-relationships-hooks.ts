import {useBunkoSelector} from "./redux-hooks.ts";
import {UserProfile} from "../types/UserProfile.ts";

export const useIsOwner = (username : string | undefined, reqUser : string | undefined = undefined) : boolean => {
	// If currentUser is not specified when calling useIsOwner, the hook looks at the value of currentUser in the store
	const currentUser = useBunkoSelector(state => {
		const user = reqUser ? reqUser : state.currentUser.user?.username;
		return user ? user : undefined;
	});
	return currentUser && username ? currentUser === username : false;
}

export const useIsFollowedByUser = (profile : UserProfile | undefined, reqUser : string | undefined = undefined) : boolean => {
	// If currentUser is not specified when calling useIsOwner, the hook looks at the value of currentUser in the store
	const currentUser = useBunkoSelector(state => {
		const user = reqUser ? reqUser : state.currentUser.user?.username;
		return user ? user : undefined;
	});
	return profile && !profile.loading && currentUser ? profile.followers.filter((sub) => {return sub.user.username === currentUser}).length > 0 : false;
}