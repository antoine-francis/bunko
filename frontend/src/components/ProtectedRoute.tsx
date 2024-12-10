import {useSession} from "../hooks/session-hook.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {paths} from "../config/paths.ts";
import React, {useEffect} from "react";
import {useBunkoSelector} from "../hooks/redux-hooks.ts";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const {loaded} = useBunkoSelector(state => state.currentUser);
	const user = useSession();
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user && loaded) {
			navigate(paths.auth.login.getHref(location.pathname), { replace: true });
		}
	}, [user, location.pathname, navigate]);

	if (!user) {
		return null
	} else {
		return children;
	}
};