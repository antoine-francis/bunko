import {useBunkoDispatch, useBunkoSelector} from "./redux-hooks.ts";
import {UserBadge} from "../types/UserProfile.ts";
import {checkSession} from "../features/auth/api/auth.ts";
import {setUser, loadUser} from "../slices/UserSlice.ts";
import {useEffect, useState} from "react";

export const useSession = (): UserBadge | undefined => {
	const [user, setUserState] = useState<UserBadge | undefined>(undefined);
	const { user: reduxUser } = useBunkoSelector((state) => state.currentUser);
	const dispatch = useBunkoDispatch();

	useEffect(() => {
		dispatch(loadUser());
		if (reduxUser) {
			setUserState(reduxUser);
		} else {
			const fetchSession = async () => {
				const session = await checkSession();
				if (session) {
					setUserState(session);
					dispatch(setUser(session));
				} else {
					setUserState(undefined);
				}
			};

			fetchSession().then(() => {});
		}
	}, [reduxUser, dispatch]);

	return user;
};