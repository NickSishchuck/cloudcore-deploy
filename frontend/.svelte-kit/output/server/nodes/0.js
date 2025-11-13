

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.3np4dCUf.js","_app/immutable/chunks/BOgt6p_H.js","_app/immutable/chunks/76xsp2ES.js"];
export const stylesheets = [];
export const fonts = [];
