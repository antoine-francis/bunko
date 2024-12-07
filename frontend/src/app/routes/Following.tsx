import {loadFollowing} from "../../features/followers/api/load-followers.ts";
import {UsersList} from "../../components/users-list/UsersList.tsx";
import {useEffect} from "react";
import {useParams} from "react-router-dom";

export const Following = () => {
	const {username} = useParams();

	useEffect(() => {
		if (username !== undefined){
			document.title = `Followed by ${username}`;
		}
	}, [username])

	return <UsersList loadUsers={loadFollowing} queryKey="following" />
}