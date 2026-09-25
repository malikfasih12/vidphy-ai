export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Only POST requests are allowed."
    });
  }

  try {
    const {
      prompt,
      duration = 1,
      style = "Cinematic",
      ratio = "9:16 — Shorts"
    } = req.body || {};

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a video topic or script."
      });
    }

    const minutes = Math.max(1, Number(duration) || 1);

    // We use short scenes so that longer videos
    // can later be assembled into one final MP4.
    const targetScenes = Math.max(6, Math.round(minutes * 8));

    const cleanPrompt = prompt.trim();

    const scenes = [];

    for (let i = 0; i < targetScenes; i++) {
      scenes.push({
        scene: i + 1,
        duration_seconds: 5,
        prompt: `${cleanPrompt}. Scene ${i + 1} of ${targetScenes}. ${style} visual style. Aspect ratio: ${ratio}. Cinematic composition, realistic lighting, smooth camera movement, detailed environment, consistent visual style.`
      });
    }

    return res.status(200).json({
      success: true,
      message: "Scene plan created successfully.",
      project: {
        duration_minutes: minutes,
        style,
        ratio,
        total_scenes: scenes.length
      },
      scenes
    });

  } catch (error) {
    console.error("VidPhy AI scene planner error:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Scene planning failed."
    });
  }
}