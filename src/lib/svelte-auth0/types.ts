import type { Auth0DecodedHash, WebAuth } from 'auth0-js';

export interface Auth0Config {
	domain: string;
	clientID: string;
	redirectUri: string;
	audience: string;
	scope: string;
	responseType: string;
}

export interface Auth0User {
	email?: string;
	email_verified?: boolean;
	name?: string;
	nickname?: string;
	picture?: string;
	sub?: string;
	updated_at?: string;
	[key: string]: any;
}

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface SignupCredentials extends LoginCredentials {
	name?: string;
}

export interface AuthState {
	user: Auth0User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: Error | null;
}

export interface AuthContextValue extends AuthState {
	login: (credentials: LoginCredentials) => Promise<void>;
	signup: (credentials: SignupCredentials) => Promise<void>;
	logout: () => void;
	checkSession: () => Promise<void>;
	getAccessToken: () => string | null;
}

export type { Auth0DecodedHash, WebAuth };
