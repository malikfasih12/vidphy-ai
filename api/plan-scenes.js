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

    // About 8 scenes per minute, with each scene designed for 5 seconds.
    const totalScenes = Math.max(8, Math.round(minutes * 8));

    const story = prompt.trim();

    const sceneTemplates = [
      "Establish the location and introduce the main subject.",
      "Show the main subject beginning the central action.",
      "Introduce an important development or discovery.",
      "Build tension or move the story forward.",
      "Show the main conflict becoming more intense.",
      "Reveal an important detail or unexpected moment.",
      "Bring the story toward its climax.",
      "Deliver a memorable ending or final reveal."
    ];

    const scenes = [];

    for (let i = 0; i < totalScenes; i++) {
      const template = sceneTemplates[i % sceneTemplates.length];

      scenes.push({
        scene: i + 1,
        duration_seconds: 5,
        purpose: template,
        prompt: `${story}. ${template} Scene ${i + 1} of ${totalScenes}. ${style} visual style. Aspect ratio: ${ratio}. Cinematic composition, realistic lighting, smooth camera movement, detailed environment, consistent characters and visual continuity.`
      });
    }

    return res.status(200).json({
      success: true,
      message: "Smart scene plan created successfully.",
      project: {
        duration_minutes: minutes,
        style,
        ratio,
        total_scenes: totalScenes,
        scene_duration_seconds: 5
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