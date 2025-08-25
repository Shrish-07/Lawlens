import { v4 as uuidv4 } from "uuid";

interface PDF {
  id: string;
  name: string;
  createdAt: Date;
  expiresAt: Date;
}

let pdfStore: PDF[] = [];

export function addPDF(name: string) {
  const id = uuidv4();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const pdf: PDF = { id, name, createdAt: now, expiresAt };
  pdfStore.push(pdf);

  return pdf;
}

export function getPDFs() {
  const now = new Date();
  pdfStore = pdfStore.filter((pdf) => pdf.expiresAt > now);
  return pdfStore;
}

export function deletePDFById(id: string) {
  pdfStore = pdfStore.filter((pdf) => pdf.id !== id);
}
