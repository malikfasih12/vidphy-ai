import { InferenceClient } from "@huggingface/inference";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Only POST requests are allowed."
    });
  }

  try {
    const { prompt, duration, style, ratio, voice } = req.body || {};

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a video topic or script."
      });
    }

    if (!process.env.HF_TOKEN) {
      return res.status(500).json({
        success: false,
        message: "Hugging Face token is not configured."
      });
    }

    const hf = new InferenceClient(process.env.HF_TOKEN);

    const finalPrompt = [
      prompt.trim(),
      style ? `Style: ${style}` : "",
      ratio ? `Aspect ratio: ${ratio}` : "",
      "Cinematic, high quality, smooth motion, detailed."
    ]
      .filter(Boolean)
      .join(". ");

    const video = await hf.textToVideo({
      model: "Wan-AI/Wan2.2-TI2V-5B",
      inputs: finalPrompt,
      provider: "fal-ai"
    });

    const arrayBuffer = await video.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", "video/mp4");
    res.setHeader(
      "Content-Disposition",
      'inline; filename="vidphy-ai-video.mp4"'
    );

    return res.status(200).send(buffer);

  } catch (error) {
    console.error("VidPhy AI video generation error:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Video generation failed."
    });
  }
}
