import {Link, useNavigate} from "react-router-dom";
import {paths} from "@/config/paths.ts";
import {useBunkoDispatch, useBunkoSelector} from "@/hooks/redux-hooks.ts";
import {defineMessages, useIntl} from "react-intl";
import {
	IconHash,
	IconLayoutGrid,
	IconLogout,
	IconMoon,
	IconSettings,
	IconSun,
	IconUsersGroup
} from "@tabler/icons-react";
import {toggleDarkMode, toggleVerticalBar} from "@/slices/UiStateSlice.ts";
import {useCallback, useEffect} from "react";
import {Footer} from "@/components/layout/Footer.tsx";
import {Dropdown} from "@/components/util/Dropdown.tsx";
import {UserBadge} from "@/types/UserProfile.ts";

const messages = defineMessages({
	browseTags: {
		id: "menubar.browseTags",
		description: "Menu bar button",
		defaultMessage: "Browse tags",
	},
	browseSeries: {
		id: "menubar.browseSeries",
		description: "Menu bar button",
		defaultMessage: "Browse series",
	},
	browseWriters: {
		id: "menubar.browseWriters",
		description: "Menu bar button",
		defaultMessage: "Discover writers",
	},
	settings: {
		id: "menubar.settings",
		description: "Menu bar button",
		defaultMessage: "Settings",
	},
	logout: {
		id: "menubar.logout",
		description: "Menu bar button",
		defaultMessage: "Logout",
	}

})

export const VerticalOptionsBar = () => {
	const {formatMessage} = useIntl();
	const dispatch = useBunkoDispatch();
	const {showVerticalOptionsBar, isDarkMode} = useBunkoSelector(state => state.uiState)
	const {user} = useBunkoSelector(state => state.currentUser);
	const navigate = useNavigate();

	useEffect(() => {
		window.addEventListener("click", (event : MouseEvent) => {
			const isMobileScreen = window.innerWidth <= 700;
			if (isMobileScreen && event.target && event.target instanceof Element && event.target.classList.contains("nav-btn")) {
				dispatch(toggleVerticalBar(false));
			}
		})
	}, []);

	const getDropdownContent = useCallback((user : UserBadge) => {
		const items = [];
		items.push(
			<>
				<IconSettings/>
				<div className="nav-btn" onClick={() => navigate(paths.profile.getHref() + user.username)}>
					{formatMessage(messages.settings)}
				</div>
			</>
		);
		items.push(
			<>
				<IconLogout/>
				<div className="nav-btn" onClick={() => navigate(paths.auth.logout.getHref())}>
					{formatMessage(messages.logout)}
				</div>
			</>
		);
		return items;
	}, [formatMessage, navigate])

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
					 onClick={() => dispatch(toggleVerticalBar(false))}/>
				<div id="vertical-options-bar" style={showVerticalOptionsBar ? {left: "0px"} : {left: "-250px"}}>
					<div id="vertical-bar-content">
						<ul>
							<li>
								<IconUsersGroup/>
								<Link to={{pathname: paths.tags.getHref()}}>
									<div id="browse-tags" className="nav-btn">
										{formatMessage(messages.browseWriters)}
									</div>
								</Link>
							</li>
							<li>
								<IconHash/>
								<Link to={{pathname: paths.tags.getHref()}}>
									<div id="browse-tags" className="nav-btn">
										{formatMessage(messages.browseTags)}
									</div>
								</Link>
							</li>
							<li>
								<IconLayoutGrid/>
								<Link to={{pathname: paths.tags.getHref()}}>
									<div id="browse-tags" className="nav-btn">
										{formatMessage(messages.browseSeries)}
									</div>
								</Link>
							</li>
							<hr/>
						</ul>
						<div className="more-options">
							<button id="toggle-dark-mode" onClick={handleDarkModeToggle}>{isDarkMode ? <IconSun/> :
								<IconMoon/>}</button>


							<Dropdown items={getDropdownContent(user)} />
						</div>
					</div>
					<Footer/>
				</div>

			</>
		)
	}
}