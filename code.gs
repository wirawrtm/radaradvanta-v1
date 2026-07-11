function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    let result = { status: "error", message: "Unknown action" };

    if (action === "addPartner") {
      result = handleAddPartner(data);
    } else if (action === "addLot") {
      result = handleAddLot(data);
    } else if (action === "updateEmployee") {
      result = handleUpdateEmployee(data);
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleAddPartner(body) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("channel");
  if (!sheet) return { status: "error", message: "Sheet 'channel' tidak ditemukan" };

  const data = sheet.getDataRange().getValues();
  if (data.length === 0) return { status: "error", message: "Sheet kosong" };
  const headers = data[0];

  const idx = {
    pic: headers.findIndex(h => /pic|user|nama|analyst|solution/i.test(String(h).trim())),
    channel: headers.findIndex(h => /channel|kiosk|nama toko|toko|name/i.test(String(h).trim())),
    cat: headers.findIndex(h => /kategori|category|klasifikasi|^cat$/i.test(String(h).trim())),
    upline: headers.findIndex(h => /upline|spv|supervisor/i.test(String(h).trim())),
    province: headers.findIndex(h => /provinsi|province/i.test(String(h).trim())),
    area: headers.findIndex(h => /^area$/i.test(String(h).trim())),
    group: headers.findIndex(h => /group|tim|divisi|division/i.test(String(h).trim()))
  };

  if (idx.channel === -1) return { status: "error", message: "Kolom nama partner tidak ditemukan" };

  if (body.name) {
    const cleanNewName = String(body.name).replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const existingIndex = data.findIndex((row, idxVal) => {
      if (idxVal === 0) return false;
      const cleanExisting = String(row[idx.channel] || "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      return cleanExisting === cleanNewName;
    });

    if (existingIndex !== -1) {
      return { status: "error", message: `Partner dengan nama "${body.name}" sudah ada di database.` };
    }
  }

  const userProvince = body.province || "";
  const userArea = body.area || body.province || "";
  const newRow = new Array(headers.length).fill("");

  if (idx.channel !== -1) newRow[idx.channel] = body.name || "";
  if (idx.cat !== -1) newRow[idx.cat] = body.category || "";
  if (idx.pic !== -1) newRow[idx.pic] = body.pic || "";
  if (idx.province !== -1) newRow[idx.province] = userProvince || "";
  if (idx.area !== -1) newRow[idx.area] = userArea || "";
  if (idx.group !== -1) newRow[idx.group] = body.group || "";

  sheet.appendRow(newRow);
  const newId = data.length + 1;

  return { status: "success", id: newId, message: `Partner "${body.name}" berhasil ditambahkan` };
}

function handleAddLot(body) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("dr");
  if (!sheet) return { status: "error", message: "Sheet 'dr' tidak ditemukan" };

  const data = sheet.getDataRange().getValues();
  if (data.length === 0) return { status: "error", message: "Sheet kosong" };
  const headers = data[0];

  const idx = {
    lot: headers.findIndex(h => /lot/i.test(String(h).trim())),
    dr: headers.findIndex(h => /dr date|shipping date|^date$/i.test(String(h).trim())),
    qty: headers.findIndex(h => /^qty$|^quantity$/i.test(String(h).trim())),
    desc: headers.findIndex(h => /material.*desc|description|^hybrid$/i.test(String(h).trim())),
    crops: headers.findIndex(h => /^crops$/i.test(String(h).trim()))
  };

  if (idx.lot === -1) return { status: "error", message: "Kolom nomor LOT tidak ditemukan" };

  const cleanLotNo = String(body.lot || "").trim().toUpperCase();
  if (!cleanLotNo) return { status: "error", message: "Nomor LOT tidak boleh kosong" };

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idx.lot] || "").trim().toUpperCase() === cleanLotNo) {
      return { status: "error", message: `LOT dengan nomor "${cleanLotNo}" sudah terdaftar di database.` };
    }
  }

  const newRow = new Array(headers.length).fill("");
  if (idx.lot !== -1) newRow[idx.lot] = cleanLotNo;
  if (idx.dr !== -1) newRow[idx.dr] = body.date || "";
  if (idx.qty !== -1) newRow[idx.qty] = body.qty || "0";
  if (idx.desc !== -1) newRow[idx.desc] = body.hybrid || "";
  if (idx.crops !== -1) newRow[idx.crops] = body.crops || "";

  sheet.appendRow(newRow);

  return { status: "success", message: `LOT "${cleanLotNo}" berhasil didaftarkan` };
}

function handleUpdateEmployee(body) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("employee");
  if (!sheet) return { status: "error", message: "Sheet 'employee' tidak ditemukan" };

  const data = sheet.getDataRange().getValues();
  if (data.length === 0) return { status: "error", message: "Sheet kosong" };
  const headers = data[0];

  const getIdx = (patterns) => headers.findIndex(h => patterns.test(String(h).trim()));
  const emailIdx = headers.findIndex(h => /email/i.test(String(h).trim()));
  const userIdx = headers.findIndex(h => /^user$|^username$|^user\s*name$/i.test(String(h).trim().toLowerCase()));

  const idx = {
    name: getIdx(/nama|name|pic/i),
    email: emailIdx !== -1 ? emailIdx : getIdx(/email|user/i),
    username: userIdx !== -1 ? userIdx : -1,
    pos: getIdx(/position|jabatan/i),
    prov: getIdx(/province|provinsi/i),
    area: getIdx(/area/i),
    upline: getIdx(/upline|spv|supervisor|atasan|manager/i),
    password: getIdx(/password|pass/i),
    level: getIdx(/level|grade/i),
    group: getIdx(/group|tim|divisi|division/i)
  };

  if (idx.name === -1) return { status: "error", message: "Name column not found" };

  // This handles Add logic (if body.originalName is empty).
  if (!body.originalName) {
    const newRow = new Array(headers.length).fill("");
    if (idx.name !== -1 && body.name !== undefined) newRow[idx.name] = body.name;
    
    if (idx.username !== -1 && body.user !== undefined) {
      newRow[idx.username] = body.user;
    } else if (idx.email !== -1 && body.email !== undefined) {
      newRow[idx.email] = body.email;
    }
    
    if (idx.pos !== -1 && body.position !== undefined) newRow[idx.pos] = body.position;
    if (idx.prov !== -1 && body.province !== undefined) newRow[idx.prov] = body.province;
    if (idx.area !== -1 && body.area !== undefined) newRow[idx.area] = body.area;
    if (idx.upline !== -1 && body.upline !== undefined) newRow[idx.upline] = body.upline;
    if (idx.password !== -1 && body.password !== undefined) newRow[idx.password] = body.password;
    if (idx.level !== -1 && body.level !== undefined) newRow[idx.level] = body.level;
    if (idx.group !== -1 && body.group !== undefined) newRow[idx.group] = body.group;

    sheet.appendRow(newRow);
    return { status: "success" };
  }
  
  return { status: "error", message: "Only Add functionality is mapped here." };
}

function doGet(e) {
  // Add CORS headers for OPTIONS requests
  return ContentService.createTextOutput("OK");
}
