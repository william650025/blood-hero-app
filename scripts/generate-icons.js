#!/usr/bin/env node
/**
 * Generate PWA icons from SVG
 * Run: node scripts/generate-icons.js
 * 
 * This creates simple blood drop icons.
 * For production, replace with designed icons.
 */

const fs = require('fs');
const path = require('path');

const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#dc2626"/>
  <g transform="translate(256, 260)">
    <!-- Blood drop -->
    <path d="M0,-140 C0,-140 -90,0 -90,70 C-90,120 -50,160 0,160 C50,160 90,120 90,70 C90,0 0,-140 0,-140Z" fill="white" opacity="0.95"/>
    <!-- Heart inside drop -->
    <path d="M0,40 C0,40 -35,10 -35,-10 C-35,-25 -20,-35 0,-20 C20,-35 35,-25 35,-10 C35,10 0,40 0,40Z" fill="#dc2626"/>
  </g>
</svg>`;

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

// Write SVG (can be converted to PNG using sharp or canvas later)
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgIcon);

console.log('✅ SVG icon generated at public/icons/icon.svg');
console.log('💡 To generate PNG icons, use an image tool to convert icon.svg to icon-192.png and icon-512.png');
