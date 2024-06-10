import Groq from "groq-sdk";

const key = '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';
const groq = new Groq({ apiKey: process.env.key });

export async function main() {
  const chatCompletion = await getGroqChatCompletion();
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message?.content || "");
}

export async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: "Explain the importance of fast language models",
      },
    ],
    model: "llama3-8b-8192",
  });
}
