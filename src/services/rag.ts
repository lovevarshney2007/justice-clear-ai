import { apiRequest } from "./api";

export const getChatStatus = () =>
  apiRequest("/rag/chat-status", {}, { status: "active", model: "Legal-RAG-v2", documents_loaded: 42 });

export const chatRAG = (message: string) =>
  apiRequest("/rag/chat", { method: "POST", body: JSON.stringify({ message }) }, {
    data: { answer: `Based on the uploaded documents, here is my analysis:\n\n"${message}"\n\nThe relevant sections indicate that the contractual obligations are binding under Section 2(h) of the Indian Contract Act, 1872. The agreement constitutes a valid contract as it satisfies all essential elements.\n\n**References:**\n- Document: contract_review.pdf, Page 4\n- Document: legal_framework.pdf, Page 12` },
  });

export const summarizeWeb = (url: string) =>
  apiRequest("/rag/summarize-web", { method: "POST", body: JSON.stringify({ url }) }, {
    data: {
      summary: `**Summary of: ${url}**\n\nThis article discusses key legal developments in contract law and their implications for modern business transactions. The main points include:\n\n1. **Digital Contracts** — Courts increasingly recognize electronic signatures\n2. **Smart Contracts** — Blockchain-based agreements gaining legal standing\n3. **Cross-border Issues** — Jurisdictional challenges in international commerce\n\nThe article concludes that businesses must adapt their legal frameworks to accommodate digital transformation.`,
      word_count: 2450,
      reading_time: "8 min",
    },
  });

export const uploadRAG = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiRequest("/rag/upload", { method: "POST", body: formData }, {
    data: { message: "File uploaded and indexed successfully", chunks_created: 24 },
  });
};

export const getBlogs = () =>
  apiRequest("/rag/blogs", {}, {
    data: [
      { title: "Contract_Law_Fundamentals", created: "2024-03-10" },
      { title: "IP_Rights_Overview", created: "2024-03-08" },
      { title: "Criminal_Law_Updates_2024", created: "2024-03-05" },
      { title: "Tax_Law_Amendments", created: "2024-03-01" },
    ],
  });

export const getBlog = (title: string) =>
  apiRequest(`/rag/blogs/${title}`, {}, {
    data: { title, content: `# ${title.replace(/_/g, " ")}\n\nThis is a comprehensive overview of the topic covering key legal principles, recent amendments, and practical implications for legal practitioners.\n\n## Introduction\n\nThe evolving landscape of law requires continuous adaptation...\n\n## Key Points\n\n1. Recent judicial interpretations\n2. Legislative amendments\n3. Practical implications\n\n## Conclusion\n\nStaying updated with legal developments is crucial for effective practice.` },
  });

export const deleteBlog = (title: string) =>
  apiRequest("/rag/blogs/delete", { method: "DELETE", body: JSON.stringify({ data: { title } }) }, {
    success: true, message: "Blog deleted successfully",
  });
