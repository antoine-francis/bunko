import {Link, NavigateFunction, useNavigate, useParams} from "react-router-dom";
import {paths} from "../../config/paths.ts";
import {fetchProfile, subscribe, unsubscribe} from "../../slices/ProfilesSlice.ts";
import {useBunkoDispatch, useBunkoSelector} from "../../hooks/redux-hooks.ts";
import {ErrorHandler} from "../../components/ErrorHandler.tsx";
import {defineMessages, FormattedDate, useIntl} from "react-intl";
import {useIsFollowedByUser, useIsOwner} from "../../hooks/users-relationships-hooks.ts";
import {UserBadge, UserProfile} from "../../types/UserProfile.ts";
import {useCallback, useEffect} from "react";
import {TextDescription} from "../../types/Text.ts";
import {BunkoDispatch} from "../../store.ts";
import {TextsList} from "../../components/texts-list/TextsList.tsx";
import {LoadingContainer} from "../../components/LoadingContainer.tsx";

const messages = defineMessages({
	textPlural: {
		id: "profile.textPlural",
		defaultMessage: "{nb} texts",
		description: "Profile page",
	},
	textSing: {
		id: "profile.textSing",
		defaultMessage: "{nb} text",
		description: "Profile page",
	},
	draftPlural: {
		id: "profile.draftPlural",
		defaultMessage: "{nb} drafts",
		description: "Profile page",
	},
	draftSing: {
		id: "profile.draftSing",
		defaultMessage: "{nb} draft",
		description: "Profile page",
	},
	followerSing: {
		id: "profile.followerSing",
		defaultMessage: "{nb} follower",
		description: "Profile page",
	},
	followerPlural: {
		id: "profile.followerPlural",
		defaultMessage: "{nb} followers",
		description: "Profile page",
	},
	followingSing: {
		id: "profile.followingSing",
		defaultMessage: "{nb} following",
		description: "Profile page",
	},
	followingPlural: {
		id: "profile.followingPlural",
		defaultMessage: "{nb} following",
		description: "Profile page",
	},
	bookmarkSing: {
		id: "profile.bookmarkSing",
		defaultMessage: "{nb} bookmark",
		description: "Profile page",
	},
	bookmarkPlural: {
		id: "profile.bookmarkPlural",
		defaultMessage: "{nb} bookmarks",
		description: "Profile page",
	},
})

export const Profile = () => {
	const {username} = useParams();
	const {formatMessage} = useIntl();
	const navigate : NavigateFunction = useNavigate();
	const dispatch : BunkoDispatch = useBunkoDispatch();
	const profile : UserProfile | undefined = useBunkoSelector(state => username ? state.userProfiles[username] : undefined);
	const currentUser : string | undefined = useBunkoSelector(state => {
		const user : UserBadge | undefined = state.currentUser.user;
		return user ? user.username : undefined;
	});
	const isOwner = useIsOwner(username, currentUser);
	const isFollowedByUser = useIsFollowedByUser(profile, currentUser);


	useEffect(() => {
		if (username === undefined) {
			navigate(paths.notFound.getHref());
		} else {
			dispatch(fetchProfile(username));
			document.title = `${username}'s profile`;
		}
	}, [dispatch ,navigate, username])

	const handleSubscribe = useCallback(() => {
		if (profile !== undefined) {
			if (isFollowedByUser) {
				dispatch(unsubscribe(profile));
			} else {
				dispatch(subscribe(profile));
			}
		}
	}, [profile, dispatch, isFollowedByUser]);

	const getSortedTexts = useCallback(() => {
		// const published : ReactNode[] = [];
		// const drafts : ReactNode[] = [];
		const published : TextDescription[] = []
		const drafts : TextDescription[] = []
		if (profile !== undefined) {
			for (let i : number = 0; i < profile.texts.length; i++) {
				const text : TextDescription = profile.texts[i];
				if (text.isDraft && isOwner) {
					drafts.push(text);
				} else {
					published.push(text);
				}
			}
			return (
				<>
					<div id="texts">
						{isOwner && (
							<div id="drafts">
							<span className="text-count">{drafts.length > 1 ? formatMessage(messages.draftPlural, {nb: drafts.length}) :
								formatMessage(messages.draftSing, {nb: drafts.length})}</span>
								<div className="text-list-container">
									<TextsList texts={drafts} showDescription={false}/>
								</div>
							</div>
						)}
						<span className="text-count">{published.length > 1 ? formatMessage(messages.textPlural, {nb: published.length}) :
							formatMessage(messages.textSing, {nb: published.length})}</span>
						<div className="text-list-container">
							<TextsList texts={published} />
						</div>
					</div>
				</>
			)
		}
	}, [isOwner, profile, formatMessage])

	if (!profile) {
		return null;
	} else {
		if (profile.loading !== undefined && profile.loading) {
			return <LoadingContainer />;
		} else if (profile.error) {
			return <ErrorHandler statusCode={profile.error}/>;
		} else {
			return (
				<div id="user-profile">
					<>
						<div className="user-info">
							<img className="profile-pic" src={profile.picture} alt=""/>
							<div className="full-name">{profile.firstName} {profile.lastName}</div>
							<div className="username">@{profile.username}</div>
							<div className="join-date">Member since <FormattedDate value={profile.signupDate}/></div>
							{!isOwner && <div className="follow-button">
								<button onClick={handleSubscribe}>{isFollowedByUser ? "Unfollow" : "Follow"}</button>
							</div>}
							<div className="bio">{profile.bio}</div>
							<div className="follows">
								<Link to={{pathname: `${paths.followers.getHref()}${profile.username}`}}>
									<div className="followers">
										{profile.followers.length > 1 ?
											formatMessage(messages.followerPlural, {nb: profile.followers.length}) :
											formatMessage(messages.followerSing, {nb: profile.followers.length})}
									</div>
								</Link>
								<Link to={{pathname: `${paths.following.getHref()}${profile.username}`}}>
									<div className="following">
										{profile.following.length > 1 ?
											formatMessage(messages.followingPlural, {nb: profile.following.length}) :
											formatMessage(messages.followingSing, {nb: profile.following.length})}
									</div>
								</Link>
								<Link to={{pathname: `${paths.bookmarks.getHref()}${profile.username}`}}>
									<div className="bookmarks">
										{profile.bookmarks.length > 1 ?
											formatMessage(messages.bookmarkPlural, {nb: profile.bookmarks.length}) :
											formatMessage(messages.bookmarkSing, {nb: profile.bookmarks.length})}
									</div>
								</Link>
							</div>
						</div>
						{profile.collectives !== undefined && profile.collectives.length > 0 && (
							<div className="collectives">
								{profile.collectives.map((coll, index) => {
										const {collective} = coll;
										if (collective !== undefined) {
											return (
												<div key={"coll-" + index} className={"collective"}>
													<Link to={{pathname: `${paths.collective.getHref()}${collective.id}`}}>
														{collective.name} - {collective.members.length}
													</Link>
												</div>
											);
										} else {
											return null;
										}
									}
								)}
							</div>
						)}
						<div className="texts">
							{getSortedTexts()}
						</div>
					</>
				</div>
			);
		}
	}
}