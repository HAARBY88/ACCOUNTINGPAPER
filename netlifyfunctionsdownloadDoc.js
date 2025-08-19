import fetch from "node-fetch";

export async function handler(event) {
  const { documentId } = JSON.parse(event.body);

  if (!documentId) {
    return { statusCode: 400, body: "Missing documentId" };
  }

  try {
    const res = await fetch(
      `https://document-api.company-information.service.gov.uk/document/${documentId}/content`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.CH_API_KEY + ":").toString("base64")}`
        }
      }
    );

    if (!res.ok) throw new Error("Companies House document fetch failed");

    // Return PDF as Base64 (so browser can render/download)
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    return {
      statusCode: 200,
      body: JSON.stringify({
        documentId,
        file: base64
      })
    };

  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to download document" }) };
  }
}
