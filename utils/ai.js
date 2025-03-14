import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function checkPostRelated(obj) {
  const prompt = `Does the following post title state that it is looking for a web designer, web developer, programmer, app developer graphic designer, data science, engineering or any tasks related to these fields? If yes, reply "true"; if not, reply "false": This is the title "${obj.title}" and this is the description "${obj.description}"`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();

  obj.relevant = text.trim() === "true";
}

export async function checkPostsRelated(posts) {
  const promises = posts.map((post) => checkPostRelated(post));
  await Promise.all(promises);
  return posts;
}
