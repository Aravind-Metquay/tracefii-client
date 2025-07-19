import auth0 from 'auth0-js';
import type { Auth0Config, Auth0User, LoginCredentials, SignupCredentials } from './types';

class AuthService {
  private config = $state<Auth0Config | null>(null);
  private auth0Client: auth0.WebAuth | null = null;
  
  // Public reactive state
  user = $state<Auth0User | null>(null);
  isAuthenticated = $state(false);
  isLoading = $state(true);
  error = $state<Error | null>(null);

  // Initialize the auth service
  init(config: Auth0Config) {
    this.config = config;
    this.auth0Client = new auth0.WebAuth(config);
    this.initializeAuth();
  }

  private async initializeAuth() {
    if (!this.auth0Client) return;
    
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

  private async parseHash(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.auth0Client) {
        reject(new Error('Auth0 client not initialized'));
        return;
      }

      this.auth0Client.parseHash(async (err, authResult) => {
        try {
          if (err) {
            this.handleError(err);
            reject(err);
            return;
          }
          
          if (authResult && authResult.accessToken) {
            await this.handleAuthResult(authResult);
          }
          
          if (typeof window !== 'undefined') {
            window.history.replaceState({}, document.title, window.location.pathname);
          }
          
          this.isLoading = false;
          resolve();
        } catch (error) {
          this.handleError(error);
          this.isLoading = false;
          reject(error);
        }
      });
    });
  }

  private async handleAuthResult(authResult: any) {
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
    }
    // Note: Don't set isLoading = false here, let the calling method handle it
  }

  private getUserInfo(accessToken: string): Promise<Auth0User> {
    return new Promise((resolve, reject) => {
      if (!this.auth0Client) {
        reject(new Error('Auth0 client not initialized'));
        return;
      }

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
    if (!this.auth0Client) {
      throw new Error('Auth0 client not initialized');
    }

    this.isLoading = true;
    this.error = null;
    
    try {
      await new Promise<void>((resolve, reject) => {
        this.auth0Client!.login({
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
    if (!this.auth0Client) {
      throw new Error('Auth0 client not initialized');
    }

    this.isLoading = true;
    this.error = null;
    
    try {
      await new Promise<void>((resolve, reject) => {
        this.auth0Client!.signup({
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
    if (!this.auth0Client || !this.config) {
      return;
    }

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
    if (!this.auth0Client) {
      this.isLoading = false;
      return;
    }

    try {
      await new Promise<void>((resolve, reject) => {
        this.auth0Client!.checkSession({}, async (err, authResult) => {
          if (err) {
            if (err.error !== 'login_required') {
              reject(err);
            } else {
              // No active session, but not an error
              this.isAuthenticated = false;
              this.user = null;
              resolve();
            }
          } else if (authResult) {
            await this.handleAuthResult(authResult);
            resolve();
          } else {
            // No session found
            this.isAuthenticated = false;
            this.user = null;
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

// Create a singleton instance
export const auth = new AuthService();
