import {useEffect} from "react";
import {useBunkoDispatch, useBunkoSelector} from "@/hooks/redux-hooks.ts";
import {logout} from "@/slices/UserSlice.ts";
import Login from "./Login.tsx";
import {LoadingContainer} from "@/components/LoadingContainer.tsx";

export const Logout = () => {
	const dispatch = useBunkoDispatch();
	const {loading} = useBunkoSelector(state => state.currentUser);

	useEffect(() => {
		dispatch(logout());
	});

	return loading ? <LoadingContainer /> : <Login/>;
};