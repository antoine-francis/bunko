import {Link} from "react-router-dom";
import {paths} from "../../config/paths.ts";
import {useBunkoDispatch, useBunkoSelector} from "../../hooks/redux-hooks.ts";
import {useCallback} from "react";
import {toggleVerticalBar} from "../../slices/UiStateSlice.ts";
import {IconMenu2, IconPlus} from "@tabler/icons-react";
import {Search} from "../search/Search.tsx";
import {URL} from "../../constants/Url.ts";

export const MenuBar = () => {
	const {user} = useBunkoSelector((state) => state.currentUser);
	const dispatch = useBunkoDispatch();

	const toggleOtherBar = useCallback(() => {
		dispatch(toggleVerticalBar());
	}, [dispatch]);

	if (user) {
		return (
			<>
				<div className="menu-bar">
					<Link to={paths.home.getHref()}>
						<div className="home">
							poqopo.co
						</div>
					</Link>
					<Search />
					<Link to={{pathname: paths.newText.getHref()}}>
						<div id="create-text" className="menu-bar-btn">
							<IconPlus/>
						</div>
					</Link>
					<Link id="profile-pic" to={{pathname: paths.profile.getHref() + user.username}}>
						<img className="mini-profile-pic" src={`${URL.SERVER}${user.picture}`} alt={user.username}/>
					</Link>
					<div id="vertical-bar-toggle" onClick={toggleOtherBar}>
						<IconMenu2/>
					</div>
				</div>
			</>
		)
	}
}