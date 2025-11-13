import { c as create_ssr_component, a as subscribe, v as validate_component, e as escape, h as add_attribute } from "../../../chunks/ssr.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { t, T as ThemeToggle, L as LanguageToggle } from "../../../chunks/LanguageToggle.js";
const css = {
  code: "@import '$lib/styles/auth.css';",
  map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script>\\n    import { goto } from '$app/navigation';\\n    import { auth } from '$lib/stores/auth';\\n    import { notifications } from '$lib/stores/notifications';\\n    import { t } from '$lib/stores/i18n';\\n    import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';\\n    import LanguageToggle from '$lib/components/ui/LanguageToggle.svelte';\\n    \\n    let username = '';\\n    let password = '';\\n    let isLoading = false;\\n    \\n    async function handleLogin() {\\n        isLoading = true;\\n        try {\\n            const response = await fetch('http://localhost:5000/auth/login', {\\n                method: 'POST',\\n                headers: { 'Content-Type': 'application/json' },\\n                body: JSON.stringify({ username, password })\\n            });\\n            \\n            const data = await response.json();\\n            \\n            if (response.ok) {\\n                auth.login(data.token, data.user);\\n                notifications.success($t('welcomeBack', { username: data.user.username }));\\n                goto('/');\\n            } else {\\n                notifications.error(data.message || $t('signInFailed'));\\n            }\\n        } catch (error) {\\n            notifications.error($t('networkError'));\\n        } finally {\\n            isLoading = false;\\n        }\\n    }\\n<\/script>\\n\\n<div class=\\"login-container\\">\\n    <div class=\\"theme-switcher\\">\\n        <ThemeToggle />\\n    </div>\\n    \\n    <div class=\\"language-switcher\\">\\n        <LanguageToggle />\\n    </div>\\n    \\n    <h1>☁️ CloudCore</h1>\\n    \\n    <form on:submit|preventDefault={handleLogin} class=\\"login-form\\">\\n        <div class=\\"form-group\\">\\n            <label for=\\"username\\">{$t('username')}</label>\\n            <input \\n                type=\\"text\\" \\n                id=\\"username\\" \\n                bind:value={username}\\n                required\\n            />\\n        </div>\\n        \\n        <div class=\\"form-group\\">\\n            <label for=\\"password\\">{$t('password')}</label>\\n            <input \\n                type=\\"password\\" \\n                id=\\"password\\" \\n                bind:value={password}\\n                required\\n            />\\n        </div>\\n        \\n        <button type=\\"submit\\" class=\\"btn btn-primary\\" disabled={isLoading}>\\n            {isLoading ? $t('signingIn') : $t('signIn')}\\n        </button>\\n    </form>\\n    \\n    <div class=\\"login-link\\">\\n        <span>{$t('noAccount')}</span>\\n        <a href=\\"/register\\">{$t('createAccount')}</a>\\n    </div>\\n</div>\\n\\n<style>\\n    @import '$lib/styles/auth.css';\\n</style>\\n"],"names":[],"mappings":"AAkFI,QAAQ,sBAAsB"}`
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $t, $$unsubscribe_t;
  $$unsubscribe_t = subscribe(t, (value) => $t = value);
  let username = "";
  let password = "";
  $$result.css.add(css);
  $$unsubscribe_t();
  return `<div class="login-container"><div class="theme-switcher">${validate_component(ThemeToggle, "ThemeToggle").$$render($$result, {}, {}, {})}</div> <div class="language-switcher">${validate_component(LanguageToggle, "LanguageToggle").$$render($$result, {}, {}, {})}</div> <h1 data-svelte-h="svelte-28id4q">☁️ CloudCore</h1> <form class="login-form"><div class="form-group"><label for="username">${escape($t("username"))}</label> <input type="text" id="username" required${add_attribute("value", username, 0)}></div> <div class="form-group"><label for="password">${escape($t("password"))}</label> <input type="password" id="password" required${add_attribute("value", password, 0)}></div> <button type="submit" class="btn btn-primary" ${""}>${escape($t("signIn"))}</button></form> <div class="login-link"><span>${escape($t("noAccount"))}</span> <a href="/register">${escape($t("createAccount"))}</a></div> </div>`;
});
export {
  Page as default
};
