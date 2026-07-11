const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'const APP_SCRIPT_URL = (import.meta as any).env.VITE_SCRIPT_URL || ORIGINAL_SCRIPT_URL;',
  'const DEFAULT_BACKEND_URL = "https://ais-pre-qxrsujzymebwmjt4c5ujg3-961275344911.asia-southeast1.run.app/api";\nconst APP_SCRIPT_URL = (import.meta as any).env.VITE_SCRIPT_URL || DEFAULT_BACKEND_URL;'
);

fs.writeFileSync('src/App.tsx', code);
console.log("App.tsx URL fixed");
