const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `const DEFAULT_BACKEND_URL = "https://ais-pre-qxrsujzymebwmjt4c5ujg3-961275344911.asia-southeast1.run.app/api";
const APP_SCRIPT_URL = (import.meta as any).env.VITE_SCRIPT_URL || DEFAULT_BACKEND_URL;

const SCRIPT_URL = 
  (window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname.includes("run.app") ||
  window.location.hostname.includes("cloud.google.com"))
    ? "/api"
    : APP_SCRIPT_URL;

console.log("Resolved SCRIPT_URL:", SCRIPT_URL, "hostname:", window.location.hostname);`;

code = code.replace(target, `const SCRIPT_URL = (import.meta as any).env.VITE_SCRIPT_URL || "/api";`);
fs.writeFileSync('src/App.tsx', code);
console.log("Fixed again");
