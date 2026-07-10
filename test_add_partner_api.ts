async function test() {
  console.log("Sending simulated addPartner request to local backend...");
  try {
    const resp = await fetch('http://localhost:3000/api', {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        action: "addPartner",
        pic: "Hanif Iqfa R",
        name: "Test Partner Kiosk " + Date.now(),
        category: "R1",
        user: "Hanif Iqfa R",
        group: "Field Corn",
        province: "Central Java"
      })
    });
    
    console.log("Response Status:", resp.status);
    console.log("Response Content-Type:", resp.headers.get("content-type"));
    const text = await resp.text();
    console.log("Response Body:", text);
  } catch (error: any) {
    console.error("Fetch error:", error.message || error);
  }
}

test();
