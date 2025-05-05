import {Link} from "react-router-dom";
import {paths} from "@/config/paths.ts";
import {URL} from "@/constants/Url.ts";
import {UserBadge} from "@/types/UserProfile.ts";

interface UserBadgeProps {
	user: UserBadge
}

export const UserSimpleBadge = ({user} : UserBadgeProps) => {
	return (<div key={"user"} className="user-card">
		<Link className="name-pic" to={paths.profile.getHref() + user.username}>
			<img className="badge-picture" src={URL.SERVER + user.picture} alt=""/>
			<div className="name">
				<div className="username">{user.username}</div>
				<div className="fullname">{`${user.firstName} ${user.lastName}`}</div>
			</div>
		</Link>
	</div>)
}