import {FormattedDate} from "react-intl";
import {Subscription} from "../../types/UserProfile.ts";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Loading} from "../Loading.tsx";
import {EmptyList} from "./EmptyList.tsx";
import PropTypes from "prop-types";
import {paths} from "../../config/paths.ts";

interface UsersListProps {
	loadUsers?: (username: string) => Promise<Subscription[] | undefined>
}

export const UsersList = ({loadUsers} : UsersListProps) => {
	const [users, setUsers] = useState<Subscription[]>([]);

	const [loaded, isLoaded] = useState(false);
	const {username} = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		async function getUsers() {
			if (username !== null && username !== undefined) {
				if (loadUsers) {
					try {
						const users = await loadUsers(username);
						users !== undefined && setUsers(users);
					} catch (exception) {
						console.error(exception);
						navigate(paths.notFound.getHref());
					}
				}
				isLoaded(true);
			}
		}

		if (!loaded) {
			getUsers().catch(e => {
				console.error(e);
			});
		}
	}, [users, loadUsers, navigate, username, loaded]);
	if (!loaded) {
		return <Loading/>;
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