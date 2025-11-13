<script>
    import { goto } from '$app/navigation';
    import { auth } from '$lib/stores/auth';
    import { notifications } from '$lib/stores/notifications';
    import { t } from '$lib/stores/i18n';
    import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
    import LanguageToggle from '$lib/components/ui/LanguageToggle.svelte';
    
    let username = '';
    let email = '';
    let password = '';
    let confirmPassword = '';
    let isLoading = false;
    
    async function handleRegister() {
        // Validation
        if (password !== confirmPassword) {
            notifications.error($t('passwordsNoMatch'));
            return;
        }
        
        if (password.length < 6) {
            notifications.error($t('passwordTooShort'));
            return;
        }
        
        isLoading = true;
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                notifications.success($t('accountCreated', { username }));
                notifications.info($t('checkYourEmail'));
                setTimeout(() => goto('/login'), 2000);
            } else {
                notifications.error(data.message || $t('registrationFailed'));
            }
        } catch (error) {
            console.error('Registration error:', error);
            notifications.error($t('networkError'));
        } finally {
            isLoading = false;
        }
    }
    
    // Separate toggle functions
    function togglePasswordVisibility(inputId) {
        const input = document.getElementById(inputId);
        if (input) {
            input.type = input.type === 'password' ? 'text' : 'password';
        }
    }
</script>

<div class="register-container">
    <div class="theme-switcher">
        <ThemeToggle />
    </div>
    
    <div class="language-switcher">
        <LanguageToggle />
    </div>
    
    <h1>☁️ CloudCore</h1>
    
    <form on:submit|preventDefault={handleRegister} class="register-form">
        <!-- Username -->
        <div class="form-group">
            <label for="username">{$t('username')}</label>
            <input 
                type="text" 
                id="username" 
                bind:value={username}
                required
                minlength="3"
                maxlength="50"
                pattern="[a-zA-Z0-9_]+"
                title="Only letters, numbers, and underscores allowed"
            />
            <div class="input-hint">{$t('usernameHint')}</div>
        </div>
        
        <!-- Email -->
        <div class="form-group">
            <label for="email">{$t('emailAddress')}</label>
            <input 
                type="email" 
                id="email" 
                bind:value={email}
                required
                maxlength="100"
            />
        </div>
        
        <!-- Password -->
        <div class="form-group">
            <label for="password">{$t('password')}</label>
            <div class="password-wrapper">
                <input 
                    type="password"
                    id="password" 
                    bind:value={password}
                    required
                    minlength="6"
                />
                <button 
                    type="button" 
                    class="toggle-password"
                    on:click={() => togglePasswordVisibility('password')}
                    aria-label="Toggle password visibility"
                >
                    <span class="material-symbols-outlined">visibility_off</span>
                </button>
            </div>
            <div class="input-hint">{$t('passwordHint')}</div>
        </div>
        
        <!-- Confirm Password -->
        <div class="form-group">
            <label for="confirmPassword">{$t('confirmPassword')}</label>
            <div class="password-wrapper">
                <input 
                    type="password"
                    id="confirmPassword" 
                    bind:value={confirmPassword}
                    required
                />
                <button 
                    type="button" 
                    class="toggle-password"
                    on:click={() => togglePasswordVisibility('confirmPassword')}
                    aria-label="Toggle password visibility"
                >
                    <span class="material-symbols-outlined">visibility_off</span>
                </button>
            </div>
        </div>
        
        <button type="submit" class="btn btn-primary" disabled={isLoading}>
            {isLoading ? $t('creatingAccount') : $t('createAccount')}
        </button>
    </form>
    
    <div class="login-link">
        <span>{$t('alreadyAccount')}</span>
        <a href="/login">{$t('signIn')}</a>
    </div>
</div>

<style>
    .register-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: var(--bg-primary);
        padding: 20px;
        position: relative;
    }

    .theme-switcher {
        position: absolute;
        top: 20px;
        right: 80px;
    }

    .language-switcher {
        position: absolute;
        top: 20px;
        right: 20px;
    }

    h1 {
        font-size: 48px;
        margin-bottom: 40px;
        color: var(--text-primary);
    }

    .register-form {
        width: 100%;
        max-width: 400px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    label {
        font-size: 14px;
        font-weight: 500;
        color: var(--text-primary);
    }

    input {
        padding: 12px 16px;
        border: 2px solid var(--border-color);
        border-radius: 8px;
        font-size: 15px;
        font-family: inherit;
        background: var(--bg-secondary);
        color: var(--text-primary);
        outline: none;
        transition: all 0.3s ease;
    }

    input:focus {
        border-color: var(--color-blue);
        background: var(--bg-primary);
        box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.1);
    }

    .password-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    .password-wrapper input {
        width: 100%;
        padding-right: 48px;
    }

    .toggle-password {
        position: absolute;
        right: 12px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        color: var(--text-secondary);
        transition: color 0.2s;
    }

    .toggle-password:hover {
        color: var(--color-blue);
    }

    .input-hint {
        font-size: 12px;
        color: var(--text-secondary);
        margin-top: 4px;
    }

    .btn {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .btn-primary {
        background: linear-gradient(135deg, var(--color-blue) 0%, #1967d2 100%);
        color: white;
        box-shadow: 0 2px 8px rgba(66, 133, 244, 0.3);
    }

    .btn-primary:hover:not(:disabled) {
        background: linear-gradient(135deg, #1a73e8 0%, #1557b0 100%);
        box-shadow: 0 4px 12px rgba(66, 133, 244, 0.4);
        transform: translateY(-2px);
    }

    .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .login-link {
        text-align: center;
        margin-top: 20px;
        font-size: 14px;
        color: var(--text-secondary);
    }

    .login-link a {
        color: var(--color-blue);
        text-decoration: none;
        font-weight: 500;
    }

    .login-link a:hover {
        text-decoration: underline;
    }
</style>
