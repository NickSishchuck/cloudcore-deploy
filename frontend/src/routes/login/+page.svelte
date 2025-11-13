<script>
    import { goto } from '$app/navigation';
    import { auth } from '$lib/stores/auth';
    import { notifications } from '$lib/stores/notifications';
    import { t } from '$lib/stores/i18n';
    import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
    import LanguageToggle from '$lib/components/ui/LanguageToggle.svelte';
    
    let username = '';
    let password = '';
    let isLoading = false;
    
    async function handleLogin() {
        isLoading = true;
        try {
          const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                auth.login(data.token, data.user);
                notifications.success($t('welcomeBack', { username: data.user.username }));
                goto('/');
            } else {
                notifications.error(data.message || $t('signInFailed'));
            }
        } catch (error) {
            notifications.error($t('networkError'));
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="login-container">
    <div class="theme-switcher">
        <ThemeToggle />
    </div>
    
    <div class="language-switcher">
        <LanguageToggle />
    </div>
    
    <h1>☁️ CloudCore</h1>
    
    <form on:submit|preventDefault={handleLogin} class="login-form">
        <div class="form-group">
            <label for="username">{$t('username')}</label>
            <input 
                type="text" 
                id="username" 
                bind:value={username}
                required
            />
        </div>
        
        <div class="form-group">
            <label for="password">{$t('password')}</label>
            <input 
                type="password" 
                id="password" 
                bind:value={password}
                required
            />
        </div>
        
        <button type="submit" class="btn btn-primary" disabled={isLoading}>
            {isLoading ? $t('signingIn') : $t('signIn')}
        </button>
    </form>
    
    <div class="login-link">
        <span>{$t('noAccount')}</span>
        <a href="/register">{$t('createAccount')}</a>
    </div>
</div>

<style>
    @import '$lib/styles/auth.css';
</style>
