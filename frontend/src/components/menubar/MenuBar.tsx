import {Link} from "react-router-dom";
import {paths} from "../../config/paths.ts";
import {useBunkoSelector} from "../../hooks/redux-hooks.ts";

export const MenuBar = () => {
	const {user} = useBunkoSelector((state) => state.currentUser);
	if (user) {
		return (
			<div className="menu-bar">
				<div className="home">
					<Link to={paths.home.getHref()}>Bunko</Link>
				</div>
				<div className="profile-button">
					<Link to={{pathname: paths.profile.getHref() + user.username}}>{user.username}</Link>
				</div>
				<div className="logout-button">
					<Link to={paths.auth.logout.getHref()}>Logout</Link>
				</div>
			</div>
		)
	}
}