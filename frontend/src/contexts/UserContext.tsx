import { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import {UserBadge} from "../types/UserProfile.ts";


interface UserContextType {
	user: UserBadge | null;
	loading: boolean;
	error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const loadUserData = async (): Promise<UserBadge> => {
	const response = await fetch('http://localhost:8000/user_data', {
		credentials: "include",
	});
	if (!response.ok) {
		throw new Error('Failed to fetch user data');
	}
	return response.json();
};

interface UserProviderProps {
	children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
	const { data : userdata, isLoading, error } = useQuery<UserBadge, Error>({
			queryKey: ['reqUser'],
			queryFn: () => loadUserData(),
			retry: false,
			refetchOnWindowFocus: false
	});

	const userContextValue: UserContextType = {
		user: userdata ?? null,
		loading: isLoading,
		error: error instanceof Error ? error.message : null,
	};

	return (
		<UserContext.Provider value={userContextValue}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = (): UserContextType => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error('useUser must be used within a UserProvider');
	}
	return context;
};
