import {useSession} from "../hooks/session-hook.ts";
import {Navigate, useLocation} from "react-router-dom";
import {paths} from "../config/paths.ts";
import React from "react";
import {useBunkoSelector} from "../hooks/redux-hooks.ts";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const {loading} = useBunkoSelector(state => state.currentUser);
	const user = useSession();
	const location = useLocation();

	if (!user && !loading) {
		if (location.pathname === paths.auth.logout.getHref()) {
			// Redirect to logout after login means we get logged back out
			return <Navigate to={paths.auth.login.getHref()} replace={true} />
		} else {
			return <Navigate to={paths.auth.login.getHref(location.pathname)} replace={true} />
		}
	} else {
		return children;
	}
};