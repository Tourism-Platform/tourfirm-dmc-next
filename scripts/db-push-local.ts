import "./load-env.js";

import { getPayload } from "payload";

process.env.PAYLOAD_DB_PUSH = "true";

const { default: config } = await import("@payload-config");

console.log("Pushing schema to local DB...");
await getPayload({ config });
console.log("Schema push OK");

process.exit(0);
