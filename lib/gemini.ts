import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export async function generateImage(prompt: string): Promise<Buffer> {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-pro-image-preview",
    generationConfig: {
      responseModalities: ["Text", "Image"],
    } as never,
  });

  const avatarPrompt = `Generate a stylized avatar image: ${prompt}.
    Make it visually appealing, suitable for a profile picture,
    with good composition and vibrant colors.`;

  const response = await model.generateContent(avatarPrompt);
  const parts = response.response.candidates?.[0]?.content?.parts;

  if (!parts) {
    throw new Error("No response parts received from Gemini");
  }

  for (const part of parts) {
    if ("inlineData" in part && part.inlineData) {
      const imageData = part.inlineData.data;
      return Buffer.from(imageData, "base64");
    }
  }

  throw new Error("No image data in response");
}
