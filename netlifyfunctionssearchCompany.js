import { searchCompanies } from "./companiesHouse.js";

export async function handler(event) {
  const query = event.queryStringParameters.q;
  if (!query) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing query" }) };
  }
  const data = await searchCompanies(query);
  return { statusCode: 200, body: JSON.stringify(data) };
}
