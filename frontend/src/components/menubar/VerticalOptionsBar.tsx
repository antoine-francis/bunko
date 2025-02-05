import {Link} from "react-router-dom";
import {paths} from "../../config/paths.ts";
import {useBunkoSelector} from "../../hooks/redux-hooks.ts";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {IconHash, IconLogout, IconSettings} from "@tabler/icons-react";

const messages = defineMessages({
	browseTags: {
		id: "menubar.browseTags",
		description: "Menu bar button",
		defaultMessage: "Browse tags",
	},
})

export const VerticalOptionsBar = () => {
	const {formatMessage} = useIntl();
	const {showVerticalOptionsBar} = useBunkoSelector((state) => state.uiState)
	const {user} = useBunkoSelector((state) => state.currentUser);

	if (user) {
		return (
			<div id="vertical-options-bar" style={showVerticalOptionsBar ? {display: "none"} : {display: "block"}}>
				<ul>
					<li>
						<IconHash/>
						<Link to={{pathname: paths.tags.getHref()}}>
							<div id="browse-tags" className="menu-bar-btn">
								{formatMessage(messages.browseTags)}
							</div>
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