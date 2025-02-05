import {Link} from "react-router-dom";
import {paths} from "../../config/paths.ts";
import {useBunkoSelector} from "../../hooks/redux-hooks.ts";
import {FormattedMessage} from "react-intl";
import {IconLogout, IconSettings} from "@tabler/icons-react";
import {URL} from "../../constants/Url.ts";

export const VerticalOptionsBar = () => {
	const {showVerticalOptionsBar} = useBunkoSelector((state) => state.uiState)
	const {user} = useBunkoSelector((state) => state.currentUser);

	if (user) {
		return (
			<div id="vertical-options-bar" style={showVerticalOptionsBar ? {display: "none"} : {display: "block"}}>
				<ul>
					<li>
						<img className="mini-profile-pic" src={`${URL.SERVER}${user.picture}`} alt={user.username}/>
						<Link to={{pathname: paths.profile.getHref() + user.username}}>
							{user.username}
						</Link>
					</li>
					<li>
						<IconSettings/>
						<Link to={{pathname: paths.profile.getHref() + user.username}}>
							Settings
						</Link>
					</li>
					<li>
						<IconLogout />
						<Link to={paths.auth.logout.getHref()}>
							<FormattedMessage
								id="menubar.dropdown.logout"
								description="dropdown button"
								defaultMessage="Logout"/>
						</Link>
					</li>
				</ul>
			</div>
		)
	}
}