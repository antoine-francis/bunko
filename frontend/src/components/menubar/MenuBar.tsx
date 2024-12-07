import {Link} from "react-router-dom";
import {paths} from "../../config/paths.ts";
import {useUser} from "../../contexts/UserContext.tsx";

export const MenuBar = () => {
	const {user} = useUser();
	if (!user) {
		return "";
	} else {
		return (
			<div className="menu-bar">
				<div className="Home">
					<Link to={paths.home.getHref()}>Bunko</Link>
				</div>
				<div className="login-button">
					<Link to={{pathname: paths.profile.getHref() + user.username}}>{user.username}</Link>
				</div>
				<div className="register-button">
					<Link to={paths.auth.register.getHref()}>Register</Link>
				</div>
			</div>
		)
	}
}