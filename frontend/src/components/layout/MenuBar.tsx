import {Link} from "react-router-dom";
import {paths} from "@/config/paths.ts";
import {useBunkoDispatch, useBunkoSelector} from "@/hooks/redux-hooks.ts";
import {useCallback} from "react";
import {toggleVerticalBar} from "@/slices/UiStateSlice.ts";
import {IconBell, IconMenu2, IconPlus} from "@tabler/icons-react";
import {Search} from "../search/Search.tsx";
import {URL} from "@/constants/Url.ts";


export const MenuBar = () => {
	const {user} = useBunkoSelector((state) => state.currentUser);
	const {showVerticalOptionsBar} = useBunkoSelector(state => state.uiState);
	const dispatch = useBunkoDispatch();

	const toggleOtherBar = useCallback(() => {
		const mainContentDiv = document.getElementById("main-content");
		if (mainContentDiv !== null) {
			if (showVerticalOptionsBar) {
				mainContentDiv.style.marginLeft = "0";
				localStorage.setItem('showVerticalOptionsBar', JSON.stringify(false));
			} else {
				mainContentDiv.style.marginLeft = "var(--sidebar-width)";
				localStorage.setItem('showVerticalOptionsBar', JSON.stringify(true));
			}
		}
		dispatch(toggleVerticalBar());
	}, [dispatch, showVerticalOptionsBar]);

	if (user) {
		return (
			<>
				<div className="menu-bar">
					<div id="vertical-bar-toggle" onClick={toggleOtherBar}>
						<IconMenu2/>
					</div>
					<Link to={paths.home.getHref()}>
						<div id="home">
							poqopo.co
						</div>
					</Link>
					<Search/>
					<Link id="new-text-btn" to={{pathname: paths.newText.getHref()}}>
						<div id="create-text" className="menu-bar-btn">
							<IconPlus/>
						</div>
					</Link>
					<Link to={{pathname: paths.newText.getHref()}}>
						<div id="create-text" className="menu-bar-btn">
							<IconBell/>
						</div>
					</Link>
					<Link id="profile-pic" to={{pathname: paths.profile.getHref() + user.username}}>
						<img className="mini-profile-pic" src={`${URL.SERVER}${user.picture}`} alt={user.username}/>
					</Link>
				</div>
			</>
		)
	}
}