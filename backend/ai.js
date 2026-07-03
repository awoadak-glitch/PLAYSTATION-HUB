import axios from "axios";

export async function analyzeGame(imageUrl, apiKey) {
  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "auto",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
حلل لعبة من الصورة وأرجع JSON فقط:

title, description, story, genre, age_rating, platform, developer, publisher
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
        Authorization: `Bearer ${apiKey}`
      }
    }
  );

  return JSON.parse(res.data.choices[0].message.content);
}
