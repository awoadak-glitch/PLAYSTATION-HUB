import fs from "fs";
import path from "path";
import { analyzeGame } from "./ai.js";

const postersDir = "../posters";
const gamesDir = "../games";
const processedFile = "./processed.json";

if (!fs.existsSync(gamesDir)) {
  fs.mkdirSync(gamesDir);
}

let processed = fs.existsSync(processedFile)
  ? JSON.parse(fs.readFileSync(processedFile))
  : {};

const files = fs.readdirSync(postersDir);

for (const file of files) {
  const id = path.parse(file).name;

  const gameFile = `${gamesDir}/${id}.json`;

  // إذا تم معالجته سابقاً
  if (processed[id] || fs.existsSync(gameFile)) continue;

  console.log("Processing:", id);

  const imageUrl =
    `https://raw.githubusercontent.com/${process.env.GITHUB_REPO}/main/posters/${file}`;

  try {
    const data = await analyzeGame(
      imageUrl,
      process.env.OPENROUTER_API_KEY
    );

    const finalData = {
      id,
      image: imageUrl,
      ...data,
      createdAt: Date.now()
    };

    fs.writeFileSync(gameFile, JSON.stringify(finalData, null, 2));

    processed[id] = true;
    fs.writeFileSync(processedFile, JSON.stringify(processed, null, 2));

  } catch (err) {
    console.log("Error processing:", id, err.message);
  }
}
