const { GoogleGenerativeAI } = require("@google/generative-ai");
import dotenv from "dotenv";
dotenv.config();

class AiController {
  private readonly GoogleGenerativeAI = GoogleGenerativeAI;

  constructor() {
    this.GoogleGenerativeAI = new GoogleGenerativeAI();
  }

  async generateText(prompt: string): Promise<string> {
    try {
        const genAI = new this.GoogleGenerativeAI(process.env.GEMINI);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const response = await model.generateContent(prompt);
      return response.response.text();
    } catch (error) {
      console.error("Error generating text:", error);
      throw error; // Re-throw the error to be handled by the calling function
    }
  }
}

export default AiController;
