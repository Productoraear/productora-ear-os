const fs = require("fs");
const path = require("path");

function findStripeRoutes(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== "node_modules" && f !== ".next") findStripeRoutes(full);
    } else if (f === "route.ts" || f === "route.js") {
      const c = fs.readFileSync(full, "utf8");
      if (c.includes("stripe") || c.includes("Stripe") || c.includes("checkout")) {
        console.log("STRIPE ROUTE:", full);
      }
    }
  }
}

findStripeRoutes("src/app/api");

