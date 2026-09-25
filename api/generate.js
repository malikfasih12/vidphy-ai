export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Only POST requests are allowed."
    });
  }

  const { prompt, duration } = req.body || {};

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({
      success: false,
      message: "Please enter a video topic or script."
    });
  }

  return res.status(200).json({
    success: true,
    status: "ready",
    message: "VidPhy AI received your video request.",
    videoRequest: {
      prompt: prompt.trim(),
      duration: duration || 1
    }
  });
}
