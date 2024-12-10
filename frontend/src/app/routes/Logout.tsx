import {useMutation, useQueryClient} from "@tanstack/react-query";
import {attemptLogout} from "../../features/auth/api/auth.ts";
import {Loading} from "../../components/Loading.tsx";
import {useEffect} from "react";
import {paths} from "../../config/paths.ts";
import {useNavigate} from "react-router-dom";
import {useBunkoDispatch} from "../../hooks/redux-hooks.ts";
import {logout} from "../../slices/UserSlice.ts";

export const Logout = () => {
	const navigate = useNavigate();
	const dispatch = useBunkoDispatch();

	const { mutate, isPending } = useMutation({
		mutationFn: () => attemptLogout(),
		onSuccess: () => {
			dispatch(logout());
			navigate(paths.auth.login.getHref());
			queryClient.removeQueries({
				queryKey: "reqUser"
			});

		},
		retry: 0,
	});

	const queryClient = useQueryClient();

	useEffect(() => {
		mutate();
	}, [mutate, navigate, queryClient]);

	return isPending ? <Loading /> : null;
};