import fs from "fs";
import { analyzeGame } from "./ai.js";
import { db } from "./firebase.js";

const processedFile = "../data/processed.json";
const posters = "../posters";

const processed = fs.existsSync(processedFile)
  ? JSON.parse(fs.readFileSync(processedFile))
  : {};

const files = fs.readdirSync(posters);

for (const file of files) {
  const id = file.split(".")[0];

  if (processed[id]) continue;

  const imageUrl =
    `https://raw.githubusercontent.com/${process.env.GITHUB_REPO}/main/posters/${file}`;

  console.log("Processing:", id);

  const data = await analyzeGame(imageUrl, process.env.OPENROUTER_API_KEY);

  await db.collection("games").doc(id).set({
    id,
    image: imageUrl,
    ...data,
    createdAt: Date.now()
  });

  processed[id] = true;
  fs.writeFileSync(processedFile, JSON.stringify(processed, null, 2));
}
