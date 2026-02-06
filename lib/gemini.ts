import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export async function generateImage(prompt: string, referenceImage?: string): Promise<Buffer> {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-pro-image-preview",
    generationConfig: {
      responseModalities: ["Text", "Image"],
    } as never,
  });

  const avatarPrompt = `Generate a RAW PHOTOGRAPH, real camera photo, NOT an illustration or cartoon or digital art. This must look like an actual photo taken with a phone camera. Real human, real skin texture, real environment. Photo specifications: ${prompt}`;

  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
    { text: avatarPrompt },
  ];

  if (referenceImage) {
    parts.push({
      text: "Use the following image as a visual reference for style, composition, or subject:",
    });
    const match = referenceImage.match(/^data:(image\/\w+);base64,(.+)$/);
    if (match) {
      parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
    }
  }

  const response = await model.generateContent(parts);
  const responseParts = response.response.candidates?.[0]?.content?.parts;

  if (!responseParts) {
    throw new Error("No response parts received from Gemini");
  }

  for (const part of responseParts) {
    if ("inlineData" in part && part.inlineData) {
      const imageData = part.inlineData.data;
      return Buffer.from(imageData, "base64");
    }
  }

  throw new Error("No image data in response");
}
