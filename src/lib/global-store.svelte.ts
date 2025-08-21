import type { Auth0User } from "./svelte-auth0";
import type { UserType } from "./Types";

function initializeGlobalStore() {
	interface Appstate {
		authUser: Auth0User;
		user: UserType | null;
		theme: string;
		isSidebarCollapsed : boolean
	}

	let store = $state<Appstate>({
		authUser: {},
		user: null,
		theme: 'Light',
		isSidebarCollapsed : false
	});

	if (typeof window !== 'undefined') {
		const cachedUser = localStorage.getItem('cached_user');
		if (cachedUser) {
			try {
				store.user = JSON.parse(cachedUser);
			} catch (e) {
				console.error('Failed to parse cached user:', e);
				localStorage.removeItem('cached_user');
			}
		}
	}

	if (typeof window !== 'undefined') {
		const cachedData = localStorage.getItem('cached_user');
		if (cachedData) {
			try {
				const parsed = JSON.parse(cachedData);
				const isExpired = Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000; 
				if (!isExpired) {
					store.user = parsed.user;
				} else {
					localStorage.removeItem('cached_user');
				}
			} catch (e) {
				console.error('Failed to parse cached user:', e);
				localStorage.removeItem('cached_user');
			}
		}
	}

	return {
		getUser(): UserType {
			if (!store.user) throw new Error('User not initialized in App state');
			return store.user;
		},
		setUser(user: UserType) {
			store.user = user;
			if (typeof window !== 'undefined') {
				const cacheData = {
					user,
					timestamp: Date.now()
				};
				localStorage.setItem('cached_user', JSON.stringify(cacheData));
			}
		},
		hasUser(): boolean {
			return store.user !== null;
		},
		clearUser() {
			store.user = null;
			if (typeof window !== 'undefined') {
				localStorage.removeItem('cached_user');
			}
		},
		getAuth(): Auth0User {
			return store.authUser;
		},
		async setAuth(authUser: Auth0User) {
			store.authUser = authUser;
		},
		getTheme(): string {
			return store.theme;
		},
		setTheme(theme: 'Light' | 'Dark') {
			store.theme = theme;
		},
		getSidebarStatus() : boolean {
			return store.isSidebarCollapsed
		},
		setSidebarStatus(status : boolean) {
			store.isSidebarCollapsed = status
		}

	};
}

export const appState = initializeGlobalStore();