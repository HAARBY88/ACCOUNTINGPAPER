import fs from "fs";
import path from "path";
import { downloadDocument } from "./companiesHouse.js";
import { processUploadedFiles } from "./processUpload.js";

export async function handler(event) {
  try {
    const { filings, filters } = JSON.parse(event.body);

    // Filter filings
    const filtered = filings.filter(filing => {
      const withinDateRange =
        !filters.startDate ||
        (new Date(filing.date) >= new Date(filters.startDate) &&
         new Date(filing.date) <= new Date(filters.endDate));

      const typeMatches =
        !filters.types || filters.types.length === 0 ||
        filters.types.includes(filing.type);

      return withinDateRange && typeMatches;
    });

    // Download documents
    const tempDir = "/tmp";
    const downloadedPaths = [];
    for (const filing of filtered) {
      const fileBuffer = await downloadDocument(filing.documentId);
      const filePath = path.join(tempDir, `${filing.documentId}.pdf`);
      fs.writeFileSync(filePath, fileBuffer);
      downloadedPaths.push(filePath);
    }

    // Run AI analysis
    const aiResult = await processUploadedFiles(downloadedPaths);

    return {
      statusCode: 200,
      body: JSON.stringify({ result: aiResult })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
