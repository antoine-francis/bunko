import {Link} from "react-router-dom";
import {paths} from "@/config/paths.ts";
import {useBunkoDispatch, useBunkoSelector} from "@/hooks/redux-hooks.ts";
import {useCallback} from "react";
import {toggleVerticalBar} from "@/slices/UiStateSlice.ts";
import {IconMenu2, IconPlus} from "@tabler/icons-react";
import {Search} from "../search/Search.tsx";
import {URL} from "@/constants/Url.ts";


export const Footer = () => {
	const {user} = useBunkoSelector((state) => state.currentUser);
	const dispatch = useBunkoDispatch();

	const toggleOtherBar = useCallback(() => {
		dispatch(toggleVerticalBar());
	}, [dispatch]);

	if (user) {
		return (
			<footer>
				Privacy - Terms - Cookies © {new Date().getFullYear()} Antoine Francis
			</footer>
		)
	}
}