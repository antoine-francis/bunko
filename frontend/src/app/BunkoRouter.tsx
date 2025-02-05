import {RouterProvider, createBrowserRouter, Outlet} from "react-router-dom";

import { paths } from "../config/paths";
import {MenuBar} from "../components/menubar/MenuBar.tsx";
import React from "react";
import {ProtectedRoute} from "../components/ProtectedRoute.tsx";
import {VerticalOptionsBar} from "../components/menubar/VerticalOptionsBar.tsx";

const AppLayout: React.FC = () => {
	return (<>
		<ProtectedRoute>
			<MenuBar />
			<div id="main-container">
				<Outlet />
				<VerticalOptionsBar/>
			</div>
		</ProtectedRoute>
	</>);
}

const NoMenuBarAppLayout: React.FC = () => {
	return (<>
		<ProtectedRoute>
			<Outlet />
		</ProtectedRoute>
	</>);
}

const bunkoRouter = createBrowserRouter([
	{
		element: <Outlet/>,
		children: [
			{
				path: paths.auth.login.path,
				lazy: async () => {
					const { Login } = await import('./routes/Login');
					return { Component: Login };
				},
			},
			{
				path: paths.auth.register.path,
				lazy: async () => {
					const { Register } = await import('./routes/Register');
					return { Component: Register };
				},
			},
		]
	},
	{
		element: <AppLayout/>,
		children: [
			{
				path: paths.home.path,
				lazy: async () => {
					const { Dashboard } = await import('./routes/Dashboard');
					return { Component: Dashboard };
				},
			},
			{
				path: paths.auth.logout.path,
				lazy: async () => {
					const { Logout } = await import('./routes/Logout');
					return { Component: Logout };
				},
			},
			{
				path: paths.singleText.path,
				lazy: async () => {
					const { SingleText } = await import('./routes/text/SingleText');
					return { Component: SingleText };
				},
			},
			{
				path: paths.profile.path,
				lazy: async () => {
					const { Profile } = await import('./routes/Profile');
					return { Component: Profile };
				},
			},
			{
				path: paths.editProfile.path,
				lazy: async () => {
					const { ProfileEdit } = await import('./routes/ProfileEdit');
					return { Component: ProfileEdit };
				},
			},
			{
				path: paths.followers.path,
				lazy: async () => {
					const { Followers } = await import('./routes/Followers');
					return { Component: Followers };
				},
			},
			{
				path: paths.following.path,
				lazy: async () => {
					const { Following } = await import('./routes/Following');
					return { Component: Following };
				},
			},
			{
				path: paths.bookmarks.path,
				lazy: async () => {
					const { UserBookmarks } = await import('./routes/UserBookmarks.tsx');
					return { Component: UserBookmarks };
				},
			},
			{
				path: paths.series.path,
				lazy: async () => {
					const { SeriesDescription } = await import('./routes/SeriesDescription.tsx');
					return { Component: SeriesDescription };
				},
			},
			{
				path: paths.tag.path,
				lazy: async () => {
					const { Tag } = await import('./routes/Tag.tsx');
					return { Component: Tag };
				},
			},
			{
				path: paths.tags.path,
				lazy: async () => {
					const { BrowseTags } = await import('./routes/BrowseTags.tsx');
					return { Component: BrowseTags };
				},
			},
			{
				path: paths.collective.path,
				lazy: async () => {
					const { CollectiveDetails } = await import('./routes/CollectiveDetails.tsx');
					return { Component: CollectiveDetails };
				},
			},
			{
				path: paths.notFound.path,
				lazy: async () => {
					const { Error } = await import('./routes/Error');
					return { Component: Error };
				},
			},
			{
				path: '*',
				lazy: async () => {
					const { Error } = await import('./routes/Error');
					return { Component: Error };
				},
			},
		]
	},
	{
		element: <NoMenuBarAppLayout/>,
		children: [
			{
				path: paths.newText.path,
				lazy: async () => {
					const { TextEditor } = await import('./routes/text/TextEditor.tsx');
					return { Component: TextEditor };
				},
			},
			{
				path: paths.editText.path,
				lazy: async () => {
					const { TextEditor } = await import('./routes/text/TextEditor.tsx');
					return { Component: TextEditor };
				},
			},
		]
	}
])

export const BunkoRouter = () => {
	return <RouterProvider router={bunkoRouter} />;
};