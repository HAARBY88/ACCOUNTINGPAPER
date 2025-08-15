import { getFilingHistory } from "./companiesHouse.js";

export async function handler(event) {
  const companyNumber = event.path.split("/").pop();
  if (!companyNumber) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing company number" }) };
  }
  const data = await getFilingHistory(companyNumber);
  return { statusCode: 200, body: JSON.stringify(data) };
}
