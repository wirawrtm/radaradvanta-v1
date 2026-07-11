const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /const DEFAULT_BACKEND_URL = .*?;\nconst APP_SCRIPT_URL = .*?;\n\nconst SCRIPT_URL = [\s\S]*?\n    \? "\/api"\n    : APP_SCRIPT_URL;/m,
  `const SCRIPT_URL = (import.meta as any).env.VITE_SCRIPT_URL || "/api";`
);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed SCRIPT_URL");
