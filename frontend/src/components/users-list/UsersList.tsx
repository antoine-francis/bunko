import {FormattedDate} from "react-intl";
import {Subscription} from "../../types/UserProfile.ts";
import {useLocation, useParams} from "react-router-dom";
import {Loading} from "../Loading.tsx";
import {EmptyList} from "./EmptyList.tsx";
import PropTypes from "prop-types";
import {ErrorHandler} from "../ErrorHandler.tsx";
import {useQuery} from "@tanstack/react-query";

interface UsersListProps {
	loadUsers: (username: string) => Promise<Subscription[] | undefined>
	queryKey: string
}

export const UsersList = ({loadUsers, queryKey} : UsersListProps) => {
	const location = useLocation();
	const {username} = useParams();

	const {data: users, isLoading, error} = useQuery({
		queryKey: [queryKey, username],
		queryFn: () => loadUsers(username!),
		refetchOnWindowFocus: false,
		retry: 0,
	})


	if (isLoading) {
		return <Loading/>;
	} else if (error) {
		return <ErrorHandler statusCode={error.message} redirectTo={location.pathname}/>;
	} else if (users === undefined || users.length === 0) {
		return <EmptyList/>;
	} else {
		return (
			<div id="followers-containers">
				{users.map((u: Subscription, i: number) => {
					return (<div key={"user-" + i} className="follower-card">
						<span className="name">{u.username}</span>
						<span className="follow-date"><FormattedDate value={u.followDate}/></span>
					</div>)
				})}
			</div>
		);
	}
}

UsersList.propTypes = {
	loadUsers : PropTypes.func.isRequired
}