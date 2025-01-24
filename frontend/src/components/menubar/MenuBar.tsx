import {Link} from "react-router-dom";
import {paths} from "../../config/paths.ts";
import {useBunkoSelector} from "../../hooks/redux-hooks.ts";
import {defineMessages, useIntl} from "react-intl";

const messages = defineMessages({
	browseTags: {
		id: "menubar.browseTags",
		description: "Menu bar button",
		defaultMessage: "Browse tags",
	}
})

export const MenuBar = () => {
	const {formatMessage} = useIntl();
	const {user} = useBunkoSelector((state) => state.currentUser);
	if (user) {
		return (
			<div className="menu-bar">
				<div className="home">
					<Link to={paths.home.getHref()}>
						poqopo.co
					</Link>
				</div>
				<div className="browse-tags">
					<Link to={{pathname: paths.tags.getHref()}}>{formatMessage(messages.browseTags)}</Link>
				</div>
				<div className="create-text">
					<Link to={{pathname: paths.newText.getHref()}}>+</Link>
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