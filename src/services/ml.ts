import { apiRequest } from "./api";

export const getHealth = () =>
  apiRequest("/ml/health", {}, { message: "ML Service is healthy" });

export const predict = (data: { case_type: string; lawyer_exp: number; judge_exp: number; judge_count: number }) =>
  apiRequest("/ml/predict", { method: "POST", body: JSON.stringify(data) }, {
    data: { win_probability: Math.floor(Math.random() * 40) + 55, case_type: data.case_type, details: "Based on historical analysis of similar cases with comparable judicial and legal experience parameters." },
  });

export const askVakil = (query: string) =>
  apiRequest("/ml/ask-vakil", { method: "POST", body: JSON.stringify({ user_query: query }) }, {
    data: { answer: `**Legal Analysis:**\n\nRegarding your query: "${query}"\n\n**Article 21** of the Indian Constitution guarantees the right to life and personal liberty. No person shall be deprived of their life or personal liberty except according to procedure established by law.\n\n**Key Points:**\n1. This is a fundamental right\n2. It applies to all persons, citizens and non-citizens\n3. The Supreme Court has expanded its scope over the years\n\n*Disclaimer: This is AI-generated legal information, not legal advice.*` },
  });

export const chatAgent = (query: string) =>
  apiRequest("/ml/chat-agent", { method: "POST", body: JSON.stringify({ query }) }, {
    data: { answer: `Based on my analysis:\n\n${query}\n\nThis involves considerations under multiple statutes. I recommend consulting relevant case law for precedent.` },
  });

export const searchLegal = (query: string) =>
  apiRequest(`/ml/search?query=${encodeURIComponent(query)}`, {}, {
    data: [
      { title: "Indian Penal Code - Section 420", description: "Cheating and dishonestly inducing delivery of property. Relevant case laws and interpretations.", url: "#" },
      { title: "Code of Civil Procedure - Order VII", description: "Plaint - particulars and requirements for filing civil suits in Indian courts.", url: "#" },
      { title: "Evidence Act - Section 65B", description: "Admissibility of electronic records as evidence in legal proceedings.", url: "#" },
      { title: "Arbitration Act - Section 11", description: "Appointment of arbitrators and the role of courts in the arbitration process.", url: "#" },
    ],
  });
