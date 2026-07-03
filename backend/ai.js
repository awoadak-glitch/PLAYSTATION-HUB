import axios from "axios";

export async function analyzeGame(imageUrl, apiKey) {
  try {
    const res = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "qwen/qwen2.5-vl-7b-instruct:free",
        messages: [
          {
            role: "user",
            content: `
حلل هذه الصورة وأعد JSON فقط بدون أي شرح:

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

رابط الصورة:
${imageUrl}
`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const text = res.data.choices[0].message.content;

    return JSON.parse(
      text.replace(/```json/g, "").replace(/```/g, "")
    );
  } catch (err) {
    console.log("AI ERROR:", err.response?.data || err.message);
    return null;
  }
}
