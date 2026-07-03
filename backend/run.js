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
        model: "meta-llama/llama-3.1-8b-instruct",
        messages: [
          {
            role: "user",
            content: `
أنت خبير ألعاب.

اسم اللعبة هو: ${id}

أرجع JSON فقط:

{
  "title": "",
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

    const text = res.data.choices[0].message.content;

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.log("JSON ERROR:", text);
      continue;
    }

    const imageUrl =
      `https://raw.githubusercontent.com/${process.env.GITHUB_REPO}/main/posters/${file}`;

    const finalData = {
      id,
      image: imageUrl,
      ...data,
      createdAt: Date.now()
    };

    fs.writeFileSync(
      `${gamesDir}/${id}.json`,
      JSON.stringify(finalData, null, 2)
    );

    processed[id] = true;
    fs.writeFileSync(processedFile, JSON.stringify(processed, null, 2));

  } catch (err) {
    console.log("Error processing:", id, err.response?.data || err.message);
  }
}
