import { apiRequest } from "./api";

export const processDocument = (file: File) => {
  const formData = new FormData();
  formData.append("document", file);
  return apiRequest("/document/process", { method: "POST", body: formData }, {
    data: {
      risk_level: "Medium",
      summary: "This document contains a standard commercial lease agreement with several notable clauses regarding liability limitations and termination conditions. Key risks identified include ambiguous force majeure provisions and non-standard indemnification requirements.",
      key_clauses: ["Termination Clause (Section 4.2)", "Liability Cap (Section 7.1)", "Force Majeure (Section 9.3)"],
      page_count: 12,
    },
  });
};

export const getHistory = () =>
  apiRequest("/document/history", {}, {
    data: [
      { filename: "lease_agreement.pdf", status: "Processed", date: "2024-03-15", risk_level: "High" },
      { filename: "employment_contract.pdf", status: "Processed", date: "2024-03-14", risk_level: "Low" },
      { filename: "nda_template.pdf", status: "Processed", date: "2024-03-13", risk_level: "Medium" },
      { filename: "partnership_deed.pdf", status: "Processing", date: "2024-03-12", risk_level: "—" },
    ],
  });
