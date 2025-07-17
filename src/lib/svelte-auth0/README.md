# Svelte Auth0 Library

A modern Svelte 5 authentication library built on top of Auth0, providing a seamless developer experience with runes-based state management and TypeScript support.

## Features

- 🚀 **Svelte 5 Runes**: Uses `$state` and `$effect` for reactive state management
- 🔒 **Auth0 Integration**: Built on Auth0's robust authentication platform
- 📱 **Client-Side Only**: No server-side rendering dependencies
- 🎯 **TypeScript Support**: Full type safety throughout
- 🔄 **Context-Based**: Uses Svelte context for dependency injection
- 🛡️ **Route Protection**: Built-in components for protecting routes
- 🎨 **Customizable**: Flexible configuration options

## Installation

First, install the required dependencies:

```bash
npm install auth0-js
npm install -D @types/auth0-js
```

Then copy the library files to your `src/lib/auth/` directory.

## Quick Start

### 1. Configure Auth0

Set up your Auth0 application configuration:

```typescript
// src/lib/config/auth0.ts
import type { Auth0Config } from '$lib/auth';

export const auth0Config: Auth0Config = {
  clientID: 'your-auth0-client-id',
  domain: 'your-domain.auth0.com',
  redirectUri: 'http://localhost:5173/callback',
  audience: 'your-api-audience',
  scope: 'openid profile email',
  responseType: 'code'
};
```

### 2. Set up the Provider

Wrap your app with the `AuthProvider`:

```svelte
<!-- src/app.html or src/routes/+layout.svelte -->
<script lang="ts">
  import { AuthProvider } from '$lib/auth';
  import { auth0Config } from '$lib/config/auth0';
</script>

<AuthProvider config={auth0Config}>
  {#snippet children()}
    <slot />
  {/snippet}
</AuthProvider>
```

### 3. Create a Login Component

```svelte
<!-- src/routes/login/+page.svelte -->
<script lang="ts">
  import { useAuth } from '$lib/auth';
  import { goto } from '$app/navigation';
  
  const auth = useAuth();
  
  let email = $state('');
  let password = $state('');
  
  async function handleLogin() {
    try {
      await auth.login({ email, password });
      goto('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  }
  
  async function handleSignup() {
    try {
      await auth.signup({ email, password });
      goto('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
    }
  }
</script>

<div class="login-container">
  {#if auth.isLoading}
    <div>Loading...</div>
  {:else if auth.isAuthenticated}
    <div>
      <h2>Welcome, {auth.user?.name}!</h2>
      <button onclick={auth.logout}>Logout</button>
    </div>
  {:else}
    <form onsubmit={handleLogin}>
      <h2>Login</h2>
      <input 
        bind:value={email} 
        type="email" 
        placeholder="Email" 
        required 
      />
      <input 
        bind:value={password} 
        type="password" 
        placeholder="Password" 
        required 
      />
      <button type="submit">Login</button>
      <button type="button" onclick={handleSignup}>Sign Up</button>
    </form>
    
    {#if auth.error}
      <p class="error">Error: {auth.error.message}</p>
    {/if}
  {/if}
</div>
```

### 4. Protect Routes

Use the `AuthGuard` component to protect routes:

```svelte
<!-- src/routes/dashboard/+page.svelte -->
<script lang="ts">
  import { AuthGuard } from '$lib/auth';
</script>

<AuthGuard>
  {#snippet children()}
    <div>
      <h1>Dashboard</h1>
      <p>This is a protected page</p>
    </div>
  {/snippet}
</AuthGuard>
```

## API Reference

### `useAuth()`

The main hook for accessing authentication state and methods.

```typescript
const auth = useAuth();

// State
auth.user          // Current user object or null
auth.isAuthenticated // Boolean indicating if user is authenticated
auth.isLoading     // Boolean indicating if auth operation is in progress
auth.error         // Current error object or null

// Methods
auth.login(credentials)     // Login with email/password
auth.signup(credentials)    // Sign up new user
auth.logout()              // Logout current user
auth.checkSession()        // Check for existing session
auth.getAccessToken()      // Get current access token
```

### `AuthProvider`

Provides authentication context to child components.

```svelte
<AuthProvider config={auth0Config}>
  {#snippet children()}
    <!-- Your app content -->
  {/snippet}
</AuthProvider>
```

**Props:**
- `config`: Auth0 configuration object

### `AuthGuard`

Protects routes by redirecting unauthenticated users.

```svelte
<AuthGuard 
  loginPath="/login" 
  returnTo={true}
  loadingComponent={CustomLoader}
>
  {#snippet children()}
    <!-- Protected content -->
  {/snippet}
</AuthGuard>
```

**Props:**
- `loginPath` (optional): Path to redirect to for login (default: '/login')
- `returnTo` (optional): Whether to include return URL (default: true)
- `loadingComponent` (optional): Custom loading component

### Types

```typescript
interface Auth0Config {
  domain: string;
  clientID: string;
  redirectUri: string;
  audience: string;
  scope: string;
  responseType: string;
}

interface Auth0User {
  email?: string;
  email_verified?: boolean;
  name?: string;
  nickname?: string;
  picture?: string;
  sub?: string;
  updated_at?: string;
  [key: string]: any;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials extends LoginCredentials {
  name?: string;
}
```

## Advanced Usage

### Custom Loading Component

```svelte
<script lang="ts">
  import { AuthGuard } from '$lib/auth';
  import Spinner from '$lib/components/Spinner.svelte';
</script>

<AuthGuard loadingComponent={Spinner}>
  {#snippet children()}
    <!-- Protected content -->
  {/snippet}
</AuthGuard>
```

### Access Token Usage

```svelte
<script lang="ts">
  import { useAuth } from '$lib/auth';
  
  const auth = useAuth();
  
  async function makeApiCall() {
    const token = auth.getAccessToken();
    if (token) {
      const response = await fetch('/api/data', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.json();
    }
  }
</script>
```

### Error Handling

```svelte
<script lang="ts">
  import { useAuth } from '$lib/auth';
  
  const auth = useAuth();
  
  $effect(() => {
    if (auth.error) {
      console.error('Authentication error:', auth.error);
      // Handle error (show toast, redirect, etc.)
    }
  });
</script>
```

## Configuration

### Auth0 Setup

1. Create an Auth0 application
2. Set allowed callback URLs to include your app's callback route
3. Configure allowed logout URLs
4. Set up your audience if using APIs
5. Configure connection settings (username/password, social, etc.)

### Environment Variables

Consider using environment variables for configuration:

```typescript
// src/lib/config/auth0.ts
export const auth0Config: Auth0Config = {
  clientID: import.meta.env.VITE_AUTH0_CLIENT_ID,
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  redirectUri: import.meta.env.VITE_AUTH0_REDIRECT_URI,
  audience: import.meta.env.VITE_AUTH0_AUDIENCE,
  scope: 'openid profile email',
  responseType: 'code'
};
```

## Best Practices

1. **Always use HTTPS in production**
2. **Store sensitive tokens securely** (the library uses localStorage for simplicity)
3. **Handle errors gracefully** with proper user feedback
4. **Implement proper loading states** for better UX
5. **Use TypeScript** for better development experience
6. **Test authentication flows** thoroughly

## Troubleshooting

### Common Issues

1. **Import errors**: Make sure file extensions are correct (.svelte for .svelte.ts files)
2. **Context not found**: Ensure AuthProvider wraps your app
3. **Redirect loops**: Check Auth0 configuration and callback URLs
4. **Token expiration**: Implement token refresh logic if needed

### Debug Mode

Enable debug logging in development:

```typescript
// Add to your Auth0 config
const auth0Config = {
  // ... other config
  debug: import.meta.env.DEV
};
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.