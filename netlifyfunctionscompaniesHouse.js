import fetch from "node-fetch";

const companiesHouseKey = process.env.COMPANIES_HOUSE_API_KEY;

export async function searchCompanies(query) {
  const url = `https://api.company-information.service.gov.uk/search/companies?q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      "Authorization": "Basic " + Buffer.from(companiesHouseKey + ":").toString("base64")
    }
  });
  return res.json();
}

export async function getFilingHistory(companyNumber) {
  const url = `https://api.company-information.service.gov.uk/company/${companyNumber}/filing-history`;
  const res = await fetch(url, {
    headers: {
      "Authorization": "Basic " + Buffer.from(companiesHouseKey + ":").toString("base64")
    }
  });
  return res.json();
}

export async function downloadDocument(documentId) {
  const url = `https://document-api.company-information.service.gov.uk/document/${documentId}/content`;
  const res = await fetch(url, {
    headers: {
      "Authorization": "Basic " + Buffer.from(companiesHouseKey + ":").toString("base64")
    }
  });
  return Buffer.from(await res.arrayBuffer());
}
