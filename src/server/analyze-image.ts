export async function analyzeImage(imageData: string) {
  try {
    const response = await fetch("http://localhost:8787/api/analyze", {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ image: imageData }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as {
      status: string;
      critique: string;
      timestamp: string;
    };

    // Return the raw critique text from the response
    return data.critique;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to analyze image";
    throw error;
  }
}
