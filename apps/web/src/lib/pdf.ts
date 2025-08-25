export async function uploadPdf(file: File): Promise<void> {
  console.log("Uploading:", file.name);
  // TODO: connect to backend API
}

export async function listPdfs(): Promise<string[]> {
  // TODO: replace with backend fetch
  return ["contract1.pdf", "case_notes.pdf"];
}
