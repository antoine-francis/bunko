import {Link} from "react-router-dom";
import {paths} from "../../config/paths.ts";

export const MenuBar = () => {
	return (
		<div className="menu-bar">
			<div className="Home">
				<Link to={paths.home.getHref()}>Bunko</Link>
			</div>
			<div className="login-button">
				<Link to={paths.auth.login.getHref()}>Login</Link>
			</div>
			<div className="register-button">
				<Link to={paths.auth.register.getHref()}>Register</Link>
			</div>
		</div>
	)
}