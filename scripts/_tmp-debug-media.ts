process.env.PAYLOAD_DB_PUSH = "false";
import fs from "node:fs";
import path from "node:path";
import { getPayload } from "payload";
import config from "@payload-config";

const paths = [
  "assets/images/city/samarkand.jpg",
  "assets/images/tours/silk-road.jpg",
  "assets/images/experiences/nature-1.jpg",
  "assets/images/city/bukhara.jpg",
  "assets/images/experiences/culture-1.jpg",
  "assets/images/city/khiva.jpg",
  "assets/images/experiences/culture-2.jpg",
  "assets/images/destinations/uzbekistan.jpg"
];

async function main() {
  const payload = await getPayload({ config });
  for (const sourcePath of paths) {
    const filePath = path.join(process.cwd(), "public", sourcePath);
    const exists = fs.existsSync(filePath);
    const found = await payload.find({
      collection: "media",
      where: { sourcePath: { equals: sourcePath } },
      limit: 1,
      depth: 0,
      overrideAccess: true
    });
    const byName = await payload.find({
      collection: "media",
      where: { filename: { equals: path.basename(sourcePath) } },
      limit: 3,
      depth: 0,
      overrideAccess: true
    });
    console.log(JSON.stringify({
      sourcePath,
      fileExists: exists,
      bySource: found.docs[0]?.id ?? null,
      byFilename: byName.docs.map((d: any) => ({ id: d.id, sourcePath: d.sourcePath, filename: d.filename }))
    }));
  }
  if (typeof payload.db?.destroy === "function") await payload.db.destroy();
}
main().catch((e) => { console.error(e); process.exit(1); });
