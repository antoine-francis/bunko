import {UsersList} from "../../components/users-list/UsersList.tsx";
import {useParams} from "react-router-dom";
import {useEffect} from "react";

export const Followers = () => {
	const {username} = useParams();

	useEffect(() => {
		if (username !== undefined){
			document.title = `${username}'s followers`;
		}
	}, [username]);

	return <UsersList subscriptionsKey="followers" />;
}