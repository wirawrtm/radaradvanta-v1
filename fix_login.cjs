const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldLogic = `  const foundEmployee = employees.find((emp) => {
    const rowUser = String(emp.user || "").trim().toLowerCase();
    const rowEmail = String(emp.email || "").trim().toLowerCase();
    const rowUserLocal = rowEmail.includes("@") ? rowEmail.split("@")[0] : rowEmail;
    if (rowUser !== "") {
      return rowUser === lowerUser || rowEmail === lowerUser;
    } else {
      return rowUserLocal === lowerUser || rowEmail === lowerUser;
    }
  });`;

const newLogic = `  const foundEmployee = employees.find((emp) => {
    const rowUser = String(emp.user || "").trim().toLowerCase();
    const rowEmail = String(emp.email || "").trim().toLowerCase();
    const rowName = String(emp.name || "").trim().toLowerCase();
    const rowUserLocal = rowEmail.includes("@") ? rowEmail.split("@")[0] : rowEmail;
    
    if (rowUser !== "") {
      return rowUser === lowerUser || rowEmail === lowerUser || rowName === lowerUser || rowName.replace(/\\s+/g, '') === lowerUser;
    } else {
      return rowUserLocal === lowerUser || rowEmail === lowerUser || rowName === lowerUser || rowName.replace(/\\s+/g, '') === lowerUser;
    }
  });`;

if (code.includes(oldLogic)) {
  code = code.replace(oldLogic, newLogic);
  fs.writeFileSync('server.ts', code);
  console.log("Replaced login logic!");
} else {
  console.log("Could not find old logic in server.ts");
}
