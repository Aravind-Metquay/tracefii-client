import auth0 from 'auth0-js';
import type { 
  Auth0Config, 
  Auth0User, 
  LoginCredentials, 
  SignupCredentials,
  Auth0DecodedHash 
} from './types';

export class AuthStore {
  user = $state<Auth0User | null>(null);
  isAuthenticated = $state(false);
  isLoading = $state(true);
  error = $state<Error | null>(null);
  
  private auth0Client: auth0.WebAuth;
  private config: Auth0Config;

  constructor(config: Auth0Config) {
    this.config = config;
    this.auth0Client = new auth0.WebAuth(config);
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      if (typeof window !== 'undefined' && window.location.hash) {
        await this.parseHash();
      } else {
        await this.checkSession();
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  private parseHash(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.auth0Client.parseHash((err, authResult) => {
        if (err) {
          this.handleError(err);
          reject(err);
          return;
        }
        
        if (authResult && authResult.accessToken) {
          this.handleAuthResult(authResult);
        }
        
        window.history.replaceState({}, document.title, window.location.pathname);
        resolve();
      });
    });
  }

  private async handleAuthResult(authResult: Auth0DecodedHash) {
    try {
      if (authResult.accessToken) {
        const expiresAt = JSON.stringify(
          (authResult.expiresIn || 0) * 1000 + new Date().getTime()
        );
        
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken || '');
        localStorage.setItem('expires_at', expiresAt);

        const user = await this.getUserInfo(authResult.accessToken);
        this.user = user;
        this.isAuthenticated = true;
      }
    } catch (error) {
      this.handleError(error);
    } finally {
      this.isLoading = false;
    }
  }

  private getUserInfo(accessToken: string): Promise<Auth0User> {
    return new Promise((resolve, reject) => {
      this.auth0Client.client.userInfo(accessToken, (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  }

  async login(credentials: LoginCredentials): Promise<void> {
    this.isLoading = true;
    this.error = null;
    
    try {
      await new Promise<void>((resolve, reject) => {
        this.auth0Client.login({
          realm: 'Username-Password-Authentication',
          email: credentials.email,
          password: credentials.password
        }, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      this.handleError(error);
      this.isLoading = false;
    }
  }

  async signup(credentials: SignupCredentials): Promise<void> {
    this.isLoading = true;
    this.error = null;
    
    try {
      await new Promise<void>((resolve, reject) => {
        this.auth0Client.signup({
          connection: 'Username-Password-Authentication',
          email: credentials.email,
          password: credentials.password,
          username: credentials.name
        }, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      
      await this.login(credentials);
    } catch (error) {
      this.handleError(error);
      this.isLoading = false;
    }
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');

    this.auth0Client.logout({
      returnTo: window.location.origin,
      clientID: this.config.clientID
    });

    this.user = null;
    this.isAuthenticated = false;
    this.error = null;
    this.isLoading = false;
  }

  async checkSession(): Promise<void> {
    try {
      await new Promise<void>((resolve, reject) => {
        this.auth0Client.checkSession({}, (err, authResult) => {
          if (err) {
            if (err.error !== 'login_required') {
              reject(err);
            } else {
              resolve();
            }
          } else if (authResult) {
            this.handleAuthResult(authResult);
            resolve();
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      this.handleError(error);
    } finally {
      this.isLoading = false;
    }
  }

  getAccessToken(): string | null {
    const accessToken = localStorage.getItem('access_token');
    const expiresAt = localStorage.getItem('expires_at');
    
    if (expiresAt && accessToken) {
      const isValid = new Date().getTime() < JSON.parse(expiresAt);
      return isValid ? accessToken : null;
    }
    
    return null;
  }

  private handleError(error: any) {
    this.error = error instanceof Error ? error : new Error(
      error?.errorDescription || error?.error || 'Authentication failed'
    );
    this.isAuthenticated = false;
    this.isLoading = false;
  }
}