import {Link} from "react-router-dom";
import {paths} from "../../config/paths.ts";
import {useBunkoDispatch, useBunkoSelector} from "../../hooks/redux-hooks.ts";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {IconHash, IconLogout, IconMoon, IconSettings, IconSun} from "@tabler/icons-react";
import {toggleDarkMode, toggleVerticalBar} from "../../slices/UiStateSlice.ts";
import {useCallback} from "react";

const messages = defineMessages({
	browseTags: {
		id: "menubar.browseTags",
		description: "Menu bar button",
		defaultMessage: "Browse tags",
	},
})

export const VerticalOptionsBar = () => {
	const {formatMessage} = useIntl();
	const dispatch = useBunkoDispatch();
	const {showVerticalOptionsBar, isDarkMode} = useBunkoSelector(state => state.uiState)
	const {user} = useBunkoSelector(state => state.currentUser);

	const handleDarkModeToggle = useCallback(() => {
		const newMode : string = isDarkMode ? "light" : "dark";
		dispatch(toggleDarkMode());
		localStorage.setItem('theme', newMode);
		document.documentElement.setAttribute('data-theme', newMode);
	}, [dispatch, isDarkMode]);

	if (user) {
		return (
			<>
				<div className="close-bar-veil" style={!showVerticalOptionsBar ? {display: "none"} : {display: "block"}}
					 onClick={() => dispatch(toggleVerticalBar())}/>
				<div id="vertical-options-bar" style={showVerticalOptionsBar ? {width: "250px"} : {width: "0"}}>
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
							<IconLogout/>
							<Link to={paths.auth.logout.getHref()}>
								<FormattedMessage
									id="menubar.dropdown.logout"
									description="dropdown button"
									defaultMessage="Logout"/>
							</Link>
						</li>
					</ul>
					<button id="toggle-dark-mode" onClick={handleDarkModeToggle}>{isDarkMode ? <IconSun/> : <IconMoon/>}</button>
				</div>
			</>
		)
	}
}