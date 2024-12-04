import {loadFollowing} from "../../features/followers/api/load-followers.ts";
import {UsersList} from "../../components/users-list/UsersList.tsx";

export const Following = () => {
	return <UsersList loadUsers={loadFollowing}/>
}