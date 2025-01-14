import {UsersList} from "../../components/users-list/UsersList.tsx";
import {useEffect} from "react";
import {useParams} from "react-router-dom";

export const Following = () => {
	const {username} = useParams();

	useEffect(() => {
		if (username !== undefined){
			document.title = `Followed by ${username}`;
		}
	}, [username]);

	return <UsersList subscriptionsKey="following"/>;
}