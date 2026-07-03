import fs from "fs";
import path from "path";
import axios from "axios";

const postersDir = "../posters";
const gamesDir = "../games";
const processedFile = "./processed.json";

if (!fs.existsSync(gamesDir)) fs.mkdirSync(gamesDir);

let processed = fs.existsSync(processedFile)
  ? JSON.parse(fs.readFileSync(processedFile))
  : {};

const files = fs.readdirSync(postersDir);

for (const file of files) {
  const id = path.parse(file).name;

  if (processed[id]) continue;

  console.log("Processing:", id);

  try {
    const res = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.3-8b-instruct:free",
        messages: [
          {
            role: "user",
            content: `
أعد JSON فقط بدون أي شرح أو markdown:

{
  "title": "${id}",
  "description": "",
  "story": "",
  "genres": [],
  "age_rating": "",
  "platforms": [],
  "developer": "",
  "publisher": ""
}
`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    let text = res.data.choices[0].message.content;

    console.log("AI RAW:", text);

    // 🔥 تنظيف أي markdown أو رموز
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const data = JSON.parse(text);

    const imageUrl =
      `https://raw.githubusercontent.com/${process.env.GITHUB_REPO}/main/posters/${file}`;

    const finalData = {
      id,
      image: imageUrl,
      ...data,
      createdAt: Date.now()
    };

    const outPath = `${gamesDir}/${id}.json`;

    fs.writeFileSync(outPath, JSON.stringify(finalData, null, 2));

    console.log("Saved:", outPath);

    processed[id] = true;
    fs.writeFileSync(processedFile, JSON.stringify(processed, null, 2));

  } catch (err) {
    console.log("ERROR:", id, err.response?.data || err.message);
  }
}
