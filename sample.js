import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import fs from "fs";
import path from "path";
import "dotenv/config"

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const model = "meta/Llama-4-Maverick-17B-128E-Instruct-FP8";

export async function main() {
    const imagePath = path.join(process.cwd(), "contoso_layout_sketch.jpg")
    const imageBuffer = fs.readFileSync(imagePath)
    const base64Image = imageBuffer.toString("base64");

  const client = ModelClient(
    endpoint,
    new AzureKeyCredential(token),
  );

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { role:"system", content: "You are a frontend developer who likes writing code." },
        { role:"user", content: [
                {
                    type: "text",
                    text: "Write HTML and CSS code for a web page based on the image of the hand drawn sketch of a design displaying tents, backpacks, and hiking clothing categoires with their respective items and prices"
                },
                {
                    type: "image_url",
                    image_url: base64Image
                }
            ]}
      ],
      temperature: 1.0,
      top_p: 1.0,
      max_tokens: 1000,
      model: model
    }
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

  console.log(response.body.choices[0].message.content);
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});

