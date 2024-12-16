import {useBunkoDispatch, useBunkoSelector} from "./redux-hooks.ts";
import {UserBadge} from "../types/UserProfile.ts";
import {useEffect} from "react";
import {fetchUser} from "../slices/UserSlice.ts";

export const useSession = (): UserBadge | undefined => {
	const { user, loading} = useBunkoSelector((state) => state.currentUser);
	const dispatch = useBunkoDispatch();

	useEffect(() => {
		if (!user && loading) {
			dispatch(fetchUser());
		}
		if (!user && !loading) {
			// If no session is found in the store
			return undefined;
		}
	}, [user, loading, dispatch]);

	return user;
};