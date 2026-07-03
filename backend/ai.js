import axios from "axios";

export async function analyzeGame(imageUrl, apiKey) {
  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
حلل الصورة وأعد JSON فقط بدون أي شرح:

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
            },
            {
              type: "image_url",
              image_url: { url: imageUrl }
            }
          ]
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

  return JSON.parse(res.data.choices[0].message.content);
}
