import {FormattedDate} from "react-intl";
import {Subscription} from "../../types/UserProfile.ts";
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import {Loading} from "../Loading.tsx";
import {EmptyList} from "./EmptyList.tsx";
import {ErrorHandler} from "../ErrorHandler.tsx";
import {useBunkoDispatch, useBunkoSelector} from "../../hooks/redux-hooks.ts";
import {paths} from "../../config/paths.ts";
import {fetchProfile} from "../../slices/ProfilesSlice.ts";
import {URL} from "../../constants/Url.ts";

interface UsersListProps {
	subscriptionsKey: string
}

export const UsersList = ({subscriptionsKey} : UsersListProps) => {
	const {username} = useParams();
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useBunkoDispatch();
	const profile = useBunkoSelector(state => username ? state.userProfiles[username] : undefined);

	if (username === undefined) {
		navigate(paths.notFound.getHref());
	} else {
		if (!profile) {
			dispatch(fetchProfile(username));
		}
		document.title = `${username}'s ${subscriptionsKey}`;
	}

	const subscriptions : Subscription[] = profile ? ((profile as any)[subscriptionsKey]) : undefined;

	if (profile === undefined) {
		navigate(paths.notFound.getHref());
	} else if (profile.loading) {
		return <Loading/>;
	} else if (profile.error) {
		return <ErrorHandler statusCode={profile.error} redirectTo={location.pathname}/>;
	} else if (subscriptions === undefined || (subscriptions).length === 0) {
		return <EmptyList/>;
	} else {
		return (
			<div id="followers-container">
				{subscriptions.map((sub: Subscription, i: number) => {
					return (<div key={"user-" + i} className="follower-card">
						<Link className="name-pic" to={paths.profile.getHref() + sub.user.username}>
							<img className="badge-picture" src={URL.SERVER + sub.user.picture} alt=""/>
							<div className="name">
								<div className="username">{sub.user.username}</div>
								<div className="fullname">{`${sub.user.firstName} ${sub.user.lastName}`}</div>
							</div>
						</Link>
						<span className="follow-date"><FormattedDate value={sub.followDate}/></span>
					</div>)
				})}
			</div>
		);
	}
}