# Svelte Auth0 Library

A modern, Svelte-native authentication library built on top of Auth0. This library provides a clean, reactive approach to authentication using Svelte 5 runes and follows Svelte idioms rather than React patterns.

## Features

- 🚀 **Svelte 5 Native**: Built with `$state` and `$effect` runes
- 🔒 **Auth0 Integration**: Full Auth0 authentication support
- 📱 **Client-Side**: No server-side rendering dependencies
- 🎯 **TypeScript**: Complete type safety
- 🔄 **Reactive**: Direct access to reactive authentication state
- 🛡️ **Route Protection**: Simple route guard components
- 🎨 **Zero Boilerplate**: No context providers or hooks needed
- ⚡ **Performance**: Direct state access, no context lookups

## Installation

Install the required dependencies:

```bash
npm install auth0-js
npm install -D @types/auth0-js
```

Then copy the library files to your `src/lib/auth/` directory.

## Quick Start

### 1. Configure Auth0

Create your Auth0 configuration:

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

### 2. Initialize in Your App

```svelte
<!-- src/routes/+layout.svelte -->
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

### 3. Use in Components

```svelte
<!-- src/routes/login/+page.svelte -->
<script lang="ts">
  import { auth } from '$lib/auth';
  import { goto } from '$app/navigation';
  
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
    </form>
    
    {#if auth.error}
      <p class="error">Error: {auth.error.message}</p>
    {/if}
  {/if}
</div>
```

### 4. Protect Routes

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

### Authentication State

The `auth` object provides direct access to reactive authentication state:

```typescript
import { auth } from '$lib/auth';

// Reactive state (automatically updates UI)
auth.user              // Current user object or null
auth.isAuthenticated   // Boolean indicating if user is authenticated
auth.isLoading        // Boolean indicating if auth operation is in progress
auth.error            // Current error object or null
```

### Authentication Methods

```typescript
// Login with email/password
await auth.login({ email: 'user@example.com', password: 'password' });

// Sign up new user
await auth.signup({ 
  email: 'user@example.com', 
  password: 'password',
  name: 'John Doe' // optional
});

// Logout current user
auth.logout();

// Check for existing session
await auth.checkSession();

// Get current access token
const token = auth.getAccessToken();
```

### Components

#### `AuthProvider`

Initializes the authentication service.

```svelte
<AuthProvider config={auth0Config}>
  {#snippet children()}
    <!-- Your app content -->
  {/snippet}
</AuthProvider>
```

**Props:**
- `config`: Auth0 configuration object

#### `AuthGuard`

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

## Usage Examples

### Reactive State in Components

```svelte
<script lang="ts">
  import { auth } from '$lib/auth';
  
  // Reactive statements automatically update when auth state changes
  $: isLoggedIn = auth.isAuthenticated;
  $: userName = auth.user?.name;
  
  // Effects run when auth state changes
  $effect(() => {
    if (auth.isAuthenticated) {
      console.log('User logged in:', auth.user);
    }
  });
</script>

{#if isLoggedIn}
  <p>Hello, {userName}!</p>
{:else}
  <p>Please log in</p>
{/if}
```

### API Calls with Authentication

```svelte
<script lang="ts">
  import { auth } from '$lib/auth';
  
  async function makeApiCall() {
    const token = auth.getAccessToken();
    
    if (!token) {
      console.error('No access token available');
      return;
    }
    
    try {
      const response = await fetch('/api/protected-data', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('API call failed');
      }
    } catch (error) {
      console.error('API error:', error);
    }
  }
</script>
```

### Custom Loading Component

```svelte
<!-- CustomLoader.svelte -->
<div class="spinner">
  <div class="bounce1"></div>
  <div class="bounce2"></div>
  <div class="bounce3"></div>
</div>

<!-- Usage -->
<script lang="ts">
  import { AuthGuard } from '$lib/auth';
  import CustomLoader from './CustomLoader.svelte';
</script>

<AuthGuard loadingComponent={CustomLoader}>
  {#snippet children()}
    <!-- Protected content -->
  {/snippet}
</AuthGuard>
```

### Error Handling

```svelte
<script lang="ts">
  import { auth } from '$lib/auth';
  
  // Watch for authentication errors
  $effect(() => {
    if (auth.error) {
      console.error('Authentication error:', auth.error);
      // Show toast notification, redirect, etc.
      showErrorToast(auth.error.message);
    }
  });
  
  async function handleLogin() {
    try {
      await auth.login({ email, password });
      // Success - auth.isAuthenticated will be true
      goto('/dashboard');
    } catch (error) {
      // Error is also available in auth.error
      console.error('Login failed:', error);
    }
  }
</script>
```

### Social Login

```svelte
<script lang="ts">
  import { auth } from '$lib/auth';
  
  function loginWithGoogle() {
    // Redirect to Auth0 with Google connection
    window.location.href = `https://${auth0Config.domain}/authorize?` +
      `response_type=code&` +
      `client_id=${auth0Config.clientID}&` +
      `redirect_uri=${encodeURIComponent(auth0Config.redirectUri)}&` +
      `scope=${encodeURIComponent(auth0Config.scope)}&` +
      `connection=google-oauth2`;
  }
</script>

<button onclick={loginWithGoogle}>
  Login with Google
</button>
```

## Configuration

### Environment Variables

Use environment variables for configuration:

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

### Auth0 Setup

1. Create an Auth0 application
2. Set allowed callback URLs to include your app's callback route
3. Configure allowed logout URLs
4. Set up your audience if using APIs
5. Configure connection settings (database, social, etc.)


## Best Practices

1. **Always use HTTPS in production**
2. **Store sensitive configuration in environment variables**
3. **Handle errors gracefully** with proper user feedback
4. **Implement proper loading states** for better UX
5. **Use TypeScript** for better development experience
6. **Test authentication flows** thoroughly
7. **Keep tokens secure** (this library uses localStorage for simplicity)

## Troubleshooting

### Common Issues

1. **Module resolution errors**: Ensure file paths are correct
2. **Auth0 configuration**: Check domain, client ID, and callback URLs
3. **Redirect loops**: Verify Auth0 settings match your app configuration
4. **Token expiration**: Implement token refresh logic if needed

### Debug Mode

Check the browser console for detailed error messages. The library logs authentication errors to help with debugging.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- Check the [Auth0 documentation](https://auth0.com/docs) for Auth0-specific issues
- Review browser console for error messages
- Ensure your Auth0 application is configured correctly

---

**Note**: This library is designed for client-side authentication only. For server-side authentication or universal applications, consider additional security measures and token handling strategies.