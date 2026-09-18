// ==UserScript==
// @name         YouTube and Google region setter (fork)
// @namespace    https://openuserjs.org/meta/Stiff_Music/YouTube_and_Google_region_setter_(fork).meta.js
// @version      1.1.0
// @author       Stiff music (fork of emmaexe)
// @copyright    2022 emmaexe, 2026 Stiff music
// @description  Automatically sets YouTube/Google region to your preferred one, ignoring IP-based detection. Fork of emmaexe's script with URL-param fix, input validation and menu commands.
// @license      GPL-3.0-only
// @homepageURL  https://github.com/emmaexe/userscripts
// @supportURL   https://github.com/emmaexe/userscripts/issues
// @icon         https://raw.githubusercontent.com/emmaexe/userscripts/main/youtube-region-setter/assets/youtube-ico-32.png
// @run-at       document-start
// @include      *://youtube.*/*
// @include      *://*.youtube.*/*
// @include      *://www.google.*/*
// @include      *://*.google.*/*
// @exclude      *://www.google.com/a/*
// @exclude      *://accounts.google.com/*
// @noframes
// @grant        GM.registerMenuCommand
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// ==/UserScript==

const DEFAULT_REGION = 'GB';
const VALID_REGIONS = /^[A-Z]{2}$/; // ISO 3166-1 alpha-2

/* ---------- Меню ---------- */

GM.registerMenuCommand('Set preferred youtube/google region', async () => {
    const input = prompt('Enter region code (e.g. GB, US, DE):', DEFAULT_REGION);
    if (!input) return;

    const region = input.trim().toUpperCase();
    if (!VALID_REGIONS.test(region)) {
        alert('Invalid region. Use a 2-letter ISO code, e.g. GB, US, DE.');
        return;
    }

    await GM.setValue('region', region);
    location.reload();
});

GM.registerMenuCommand('Disable region override', async () => {
    await GM.deleteValue('region');
    location.reload();
});

GM.registerMenuCommand('Show current region', async () => {
    const r = await GM.getValue('region', DEFAULT_REGION);
    alert('Current region: ' + r);
});

/* ---------- Основная логика ---------- */

async function main() {
    const region = (await GM.getValue('region', DEFAULT_REGION)).toUpperCase();
    if (!VALID_REGIONS.test(region)) return;

    const url = new URL(location.href);

    // Уже установлен нужный регион — выходим
    if (url.searchParams.get('gl') === region) return;

    // Перезаписываем gl, сохраняя остальные параметры
    url.searchParams.set('gl', region);
    location.replace(url.toString());
}

main();
