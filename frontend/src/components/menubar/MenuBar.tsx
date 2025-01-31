import {Link} from "react-router-dom";
import {paths} from "../../config/paths.ts";
import {useBunkoDispatch, useBunkoSelector} from "../../hooks/redux-hooks.ts";
import {defineMessages, useIntl} from "react-intl";
import {useCallback} from "react";
import {toggleVerticalBar} from "../../slices/UiStateSlice.ts";
import {IconMenu2} from "@tabler/icons-react";
import {Search} from "../search/Search.tsx";

const messages = defineMessages({
	browseTags: {
		id: "menubar.browseTags",
		description: "Menu bar button",
		defaultMessage: "Browse tags",
	},
})

export const MenuBar = () => {
	const {formatMessage} = useIntl();
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
							+
						</div>
					</Link>
					<Link to={{pathname: paths.tags.getHref()}}>
						<div id="browse-tags" className="menu-bar-btn">
							{formatMessage(messages.browseTags)}
						</div>
					</Link>
					<div id="vertical-bar-toggle" onClick={toggleOtherBar}>
						<IconMenu2/>
					</div>
				</div>
			</>
		)
	}
}