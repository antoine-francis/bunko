export const paths = {
	home: {
		path: '/',
		getHref: () => '/',
	},

	auth: {
		register: {
			path: '/auth/register',
			getHref: (redirectTo?: string | null | undefined) =>
				`/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
		},
		login: {
			path: '/auth/login',
			getHref: (redirectTo?: string | null | undefined) =>
				`/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
		},
		logout: {
			path: '/auth/logout',
			getHref: (redirectTo?: string | null | undefined) =>
				`/auth/logout${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
		},
	},
	profile: {
		path: '/user/:username',
		getHref: (redirectTo?: string | null | undefined) =>
			`/user/${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
	},
	editProfile: {
		path: '/edit/user',
		getHref: (redirectTo?: string | null | undefined) =>
			`/edit/user${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
	},
	newText: {
		path: '/new',
		getHref: (redirectTo?: string | null | undefined) =>
			`/new${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
	},
	editText: {
		path: '/edit/:hash',
		getHref: (redirectTo?: string | null | undefined) =>
			`/edit/${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
	},
	followers: {
		path: '/followers/:username',
		getHref: (redirectTo?: string | null | undefined) =>
			`/followers/${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
	},
	following: {
		path: '/following/:username',
		getHref: (redirectTo?: string | null | undefined) =>
			`/following/${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
	},
	savedTexts: {
		path: '/savedTexts/:username',
		getHref: (redirectTo?: string | null | undefined) =>
			`/savedTexts/${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
	},
	singleText: {
		path: '/read/:hash',
		getHref: (redirectTo?: string | null | undefined) =>
			`/read/${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
	},
	series: {
		path: '/series/:id',
		getHref: (redirectTo?: string | null | undefined) =>
			`/series/${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
	},
	tag: {
		path: '/tag/:tag',
		getHref: (redirectTo?: string | null | undefined) =>
			`/tag/${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
	},
	tags: {
		path: '/tags',
		getHref: (redirectTo?: string | null | undefined) =>
			`/tags${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
	},
	collective: {
		path: '/collective/:id',
		getHref: (redirectTo?: string | null | undefined) =>
			`/collective/${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
	},
	collectiveMembers: {
		path: '/collective/members/:id',
		getHref: (redirectTo?: string | null | undefined) =>
			`/collective/members/${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
	},
	notFound: {
		path: '/not-found',
		getHref: (redirectTo?: string | null | undefined) =>
			`/not-found${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
	},

	app: {
		root: {
			path: '/app',
			getHref: () => '/app',
		},
		dashboard: {
			path: '',
			getHref: () => '/app',
		},
		discussions: {
			path: 'discussions',
			getHref: () => '/app/discussions',
		},
		discussion: {
			path: 'discussions/:discussionId',
			getHref: (id: string) => `/app/discussions/${id}`,
		},
		users: {
			path: 'users',
			getHref: () => '/app/users',
		},
		profile: {
			path: 'profile',
			getHref: () => '/app/profile',
		},
	},
} as const;