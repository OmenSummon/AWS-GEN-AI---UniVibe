import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

export function getBedrockClient(): { client: BedrockRuntimeClient | null; isConfigured: boolean; error?: string } {
  const region = process.env.AWS_REGION || "us-east-1";
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    return {
      client: null,
      isConfigured: false,
      error: "AWS Credentials not configured (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY)",
    };
  }

  try {
    const client = new BedrockRuntimeClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    return { client, isConfigured: true };
  } catch (err: any) {
    return { client: null, isConfigured: false, error: err?.message || "Failed to initialize Bedrock client" };
  }
}

export async function invokeBedrockText(prompt: string, systemPrompt?: string): Promise<{ text: string; model: string }> {
  const { client, isConfigured, error } = getBedrockClient();
  if (!client || !isConfigured) {
    throw new Error(error || "Bedrock client not configured");
  }

  const modelId = process.env.AWS_BEDROCK_TEXT_MODEL_ID || "anthropic.claude-3-5-sonnet-20240620-v1:0";

  // Anthropic Claude Messages payload format
  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 2500,
    system: systemPrompt || "You are UniVibe, an AI Student Intelligence Engine. Provide honest, non-fabricated, high-value campus insights.",
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: prompt }],
      },
    ],
    temperature: 0.7,
  };

  const command = new InvokeModelCommand({
    modelId,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(payload),
  });

  const response = await client.send(command);
  const responseBody = new TextDecoder().decode(response.body);
  const parsed = JSON.parse(responseBody);
  const textOutput = parsed.content?.[0]?.text || "";

  return {
    text: textOutput,
    model: modelId,
  };
}

export async function invokeBedrockImage(prompt: string): Promise<{ base64Image: string; model: string }> {
  const { client, isConfigured, error } = getBedrockClient();
  if (!client || !isConfigured) {
    throw new Error(error || "Bedrock client not configured");
  }

  const modelId = process.env.AWS_BEDROCK_IMAGE_MODEL_ID || "bedrock-stability.stable-image-core-v1-1";

  const payload = {
    prompt,
    mode: "text-to-image",
    aspect_ratio: "4:5",
    output_format: "png",
  };

  const command = new InvokeModelCommand({
    modelId,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(payload),
  });

  const response = await client.send(command);
  const responseBody = new TextDecoder().decode(response.body);
  const parsed = JSON.parse(responseBody);
  const base64Image = parsed.images?.[0] || "";

  return {
    base64Image,
    model: modelId,
  };
}

