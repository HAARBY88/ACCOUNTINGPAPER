import fetch from "node-fetch";

export async function handler(event) {
  const { companyNumber } = JSON.parse(event.body);

  if (!companyNumber) {
    return { statusCode: 400, body: "Missing company number" };
  }

  try {
    const res = await fetch(
      `https://api.company-information.service.gov.uk/company/${companyNumber}/filing-history`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.CH_API_KEY + ":").toString("base64")}`
        }
      }
    );

    if (!res.ok) throw new Error("Companies House API error");

    const data = await res.json();

    // Simplify list
    const filings = data.items.map(item => ({
      id: item.transaction_id,
      date: item.date,
      description: item.description,
      type: item.type,
      document_id: item.links?.document_metadata?.split("/").pop()
    })).filter(f => f.document_id);

    return {
      statusCode: 200,
      body: JSON.stringify({ filings })
    };

  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to fetch filings" }) };
  }
}
