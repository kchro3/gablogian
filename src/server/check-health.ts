export async function checkHealth() {
  try {
    const response = await fetch("http://localhost:8787/api/health", {
      mode: "cors", // Enable CORS
      credentials: "include", // Include credentials if needed
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow requests from any origin
        "Access-Control-Allow-Methods": "GET", // Allow GET method
        "Access-Control-Allow-Headers": "Content-Type", // Allow Content-Type header
      },
    });
    const isHealthy = response.ok;

    return {
      status: isHealthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      timestamp: new Date().toISOString(),
    };
  }
}
