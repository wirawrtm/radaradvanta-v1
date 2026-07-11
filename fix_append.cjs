const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const oldCode = `  try {
    const currentData = await getSheetValues(sheetName);
    if (!currentData) return false;
    currentData.push(sanitizedRow);
    return await updateSheetValues(sheetName, currentData);
  } catch (e) {
    console.error(\`Error appending to sheet \${sheetName}:\`, e);
    return false;
  }`;

const newCode = `  try {
    const currentData = await getSheetValues(sheetName);
    if (!currentData) throw new Error(\`Sheet \${sheetName} not found\`);
    currentData.push(sanitizedRow);
    const success = await updateSheetValues(sheetName, currentData);
    if (!success) throw new Error(\`Failed to update sheet \${sheetName}\`);
    return true;
  } catch (e: any) {
    console.error(\`Error appending to sheet \${sheetName}:\`, e);
    throw new Error(\`Gagal menambahkan data ke Google Sheets: \${e.message}\`);
  }`;

content = content.replace(oldCode, newCode);
fs.writeFileSync('server.ts', content, 'utf8');
