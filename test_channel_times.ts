import fs from "fs";

async function analyze() {
  const dbPath = "./local_sheets_db.json";
  if (!fs.existsSync(dbPath)) {
    console.log("Local database file not found.");
    return;
  }
  
  const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  console.log("Keys in local db:", Object.keys(db));
  
  const channel = db.channel || [];
  const working = db.working || [];
  
  console.log(`Total channel rows: ${channel.length}`);
  console.log(`Total working rows: ${working.length}`);
  
  if (channel.length > 0) {
    console.log("Channel headers:", channel[0]);
    console.log("Channel row 1:", channel[1]);
  }
  
  if (working.length > 0) {
    console.log("Working headers:", working[0]);
    console.log("Working row 1:", working[1]);
  }
}

analyze();
