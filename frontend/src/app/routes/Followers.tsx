import {loadFollowers} from "../../features/followers/api/load-followers.ts";
import {UsersList} from "../../components/users-list/UsersList.tsx";

export const Followers = () => {
	return <UsersList loadUsers={loadFollowers}/>
}