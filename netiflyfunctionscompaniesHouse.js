import fetch from "node-fetch";

export async function handler(event) {
  const company = event.queryStringParameters.company;
  if (!company) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing company number" }) };
  }

  try {
    const res = await fetch(`https://api.company-information.service.gov.uk/company/${company}/filing-history`, {
      headers: {
        Authorization: "Basic " + Buffer.from(process.env.COMPANIES_HOUSE_API_KEY + ":").toString("base64")
      }
    });
    const data = await res.json();
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
