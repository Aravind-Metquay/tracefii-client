import auth0 from 'auth0-js';
import type { Auth0Config, Auth0User, LoginCredentials, SignupCredentials } from './types';

// #region --- Module-level State ---

/**
 * A single, exportable state object that holds all reactive authentication state.
 * This pattern is required by Svelte 5 to prevent reassignment of exported state variables.
 * Components will import this object to react to changes in auth state.
 */
export const auth = $state({
	user: null as Auth0User | null,
	isAuthenticated: false,
	isLoading: true,
	error: null as Error | null
});

// Internal state for the service that doesn't need to be reactive.
let auth0Client: auth0.WebAuth | null = null;
let config: Auth0Config | null = null;

// #endregion

// #region --- Helper Functions (Internal) ---

/**
 * Sets the global error state and resets authentication status.
 * @param err The error object.
 */
function handleError(err: any): void {
	auth.error =
		err instanceof Error
			? err
			: new Error(err?.errorDescription || err?.error || 'Authentication failed');
	auth.isAuthenticated = false;
	auth.isLoading = false;
}

/**
 * Fetches user profile information from Auth0's /userinfo endpoint.
 * @param accessToken The user's access token.
 * @returns A promise that resolves with the user's profile.
 */
function getUserInfo(accessToken: string): Promise<Auth0User> {
	return new Promise((resolve, reject) => {
		if (!auth0Client) {
			return reject(new Error('Auth0 client not initialized'));
		}
		auth0Client.client.userInfo(accessToken, (err, userInfo) => {
			if (err) {
				return reject(err);
			}
			resolve(userInfo as Auth0User);
		});
	});
}

/**
 * Handles the authentication result from Auth0, sets tokens, and updates state.
 * @param authResult The result object from an Auth0 authentication flow.
 */

async function handleAuthResult(authResult: auth0.Auth0DecodedHash): Promise<void> {
	try {
		if (authResult.accessToken && authResult.idToken) {
			const expiresAt = JSON.stringify((authResult.expiresIn || 0) * 1000 + new Date().getTime());
			localStorage.setItem('access_token', authResult.accessToken);
			localStorage.setItem('id_token', authResult.idToken);
			localStorage.setItem('expires_at', expiresAt);

			const userInfo = await getUserInfo(authResult.accessToken);
			auth.user = userInfo;
			auth.isAuthenticated = true;
			auth.error = null;

			// Cache user info for optimistic loading
			localStorage.setItem('user_info', JSON.stringify(userInfo));
		}
	} catch (err) {
		handleError(err);
	}
}

/**
 * Parses the authentication hash from the URL after a redirect from Auth0.
 */
function parseHash(): Promise<void> {
	return new Promise((resolve, reject) => {
		if (!auth0Client) {
			return reject(new Error('Auth0 client not initialized'));
		}
		auth0Client.parseHash(async (err, authResult) => {
			try {
				if (err) {
					handleError(err);
					return reject(err);
				}
				if (authResult) {
					await handleAuthResult(authResult);
				}
				if (typeof window !== 'undefined') {
					// Clean the hash from the URL
					window.history.replaceState({}, document.title, window.location.pathname);
				}
				auth.isLoading = false;
				resolve();
			} catch (e) {
				handleError(e);
				reject(e);
			}
		});
	});
}

// #endregion

// #region --- Public API Functions ---

/**
 * Initializes the Auth0 client and checks for an existing session.
 * This should be called once when your application loads.
 * @param authConfig The Auth0 configuration object.
 */
export async function initAuth(authConfig: Auth0Config): Promise<void> {
	config = authConfig;
	auth0Client = new auth0.WebAuth(config);

	const accessToken = getAccessToken();
	const storedUser = localStorage.getItem('user_info');

	if (accessToken && storedUser) {
		try {
			auth.user = JSON.parse(storedUser);
			auth.isAuthenticated = true;
			auth.isLoading = false;
		} catch (e) {
			auth.isLoading = true;
		}
	} else {
		auth.isLoading = true;
	}

	auth.error = null;

	try {
		if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
			await parseHash();
		} else {
			await checkSession();
		}
	} catch (err) {
		handleError(err);
	}
}

/**
 * Silently checks for an active session with Auth0.
 */
export async function checkSession(): Promise<void> {
	if (!auth0Client) {
		auth.isLoading = false;
		return;
	}
	try {
		await new Promise<void>((resolve, reject) => {
			auth0Client!.checkSession({}, async (err, authResult) => {
				if (err) {
					if (err.error !== 'login_required') {
						return reject(err); // A real error occurred
					}
					// No active session is normal, not an error
					auth.isAuthenticated = false;
					auth.user = null;
					return resolve();
				}
				if (authResult) {
					await handleAuthResult(authResult);
				}
				resolve();
			});
		});
	} catch (err) {
		handleError(err);
	} finally {
		auth.isLoading = false;
	}
}

/**
 * Logs in a user with email and password. This will redirect to Auth0.
 * @param credentials The user's email and password.
 */
export async function login(credentials: LoginCredentials): Promise<void> {
	if (!auth0Client) throw new Error('Auth0 client not initialized');
	auth.isLoading = true;
	auth.error = null;

	await new Promise<void>((resolve, reject) => {
		auth0Client!.login(
			{
				realm: 'Username-Password-Authentication',
				email: credentials.email,
				password: credentials.password
			},
			(err) => {
				if (err) {
					handleError(err);
					return reject(err);
				}
				resolve();
			}
		);
	});
}

/**
 * Signs up a new user and then automatically logs them in.
 * @param credentials The new user's name, email, and password.
 */
export async function signup(credentials: SignupCredentials): Promise<void> {
	if (!auth0Client) throw new Error('Auth0 client not initialized');
	auth.isLoading = true;
	auth.error = null;

	try {
		await new Promise<void>((resolve, reject) => {
			auth0Client!.signup(
				{
					connection: 'Username-Password-Authentication',
					email: credentials.email,
					password: credentials.password,
					username: credentials.name
				},
				(err) => {
					if (err) return reject(err);
					resolve();
				}
			);
		});
		// After successful signup, log the user in
		await login(credentials);
	} catch (err) {
		handleError(err);
	}
}

/**
 * Logs the user out by clearing local tokens and redirecting to Auth0 logout endpoint.
 */
export function logout(): void {
	if (!auth0Client || !config) return;

	localStorage.removeItem('access_token');
	localStorage.removeItem('id_token');
	localStorage.removeItem('expires_at');

	auth.user = null;
	auth.isAuthenticated = false;
	auth.error = null;

	auth0Client.logout({
		returnTo: window.location.origin,
		clientID: config.clientID
	});
}

/**
 * Sends a password reset email to the user.
 * @param email The user's email address.
 * @returns A promise that resolves with the success message from Auth0.
 */
export async function sendResetPasswordEmail(email: string): Promise<string> {
	if (!auth0Client) throw new Error('Auth0 client not initialized');
	auth.isLoading = true;
	auth.error = null;

	try {
		return await new Promise<string>((resolve, reject) => {
			auth0Client!.changePassword(
				{
					connection: 'Username-Password-Authentication',
					email: email
				},
				(err, resp) => {
					if (err) {
						return reject(new Error(err.errorDescription || err.error || 'Password reset failed'));
					}
					resolve(resp);
				}
			);
		});
	} catch (err) {
		handleError(err);
		throw err; // Re-throw so the UI can catch it
	} finally {
		auth.isLoading = false;
	}
}

/**
 * Retrieves the current valid access token from localStorage.
 * @returns The access token string, or null if it's missing or expired.
 */
export function getAccessToken(): string | null {
	const accessToken = localStorage.getItem('access_token');
	const expiresAt = localStorage.getItem('expires_at');

	if (expiresAt && accessToken) {
		const isValid = new Date().getTime() < JSON.parse(expiresAt);
		return isValid ? accessToken : null;
	}
	return null;
}

// #endregion
