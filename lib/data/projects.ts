import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "qflux",
    title: "Q-FLUX — Quantum-Optimized Fleet Logistics Digital Twin",
    summary:
      "A live digital-twin fleet logistics platform that formulates truck-to-order assignment as a QUBO, solves it with a quantum annealer, and re-optimizes in real time when disruptions occur.",
    description: [
      "Formulated truck-to-order assignment across a multi-depot delivery fleet as a QUBO and solved it with a quantum annealer (D-Wave Neal / Leap), with classical methods handling road routing, sequencing, feasibility repair, and fuel planning.",
      "Built a live digital-twin simulation — multiple depots, mixed truck fleets, hundreds of orders, and a full road network with tolls, congestion, and fuel stations — served through a FastAPI backend.",
      "Designed real-time disruption handling: on a breakdown, road closure, or urgent order, the affected zone is isolated and re-optimized independently rather than re-solving the entire fleet.",
      "Implemented deadhead elimination, assigning return-leg collections to trucks already heading home, and an interactive map for isolating and inspecting individual truck routes.",
    ],
    category: "quantum",
    year: "2026",
    techStack: ["Python", "QUBO", "D-Wave Ocean SDK", "FastAPI", "NetworkX", "JavaScript"],
    links: {},
    featured: true,
  },
  {
    slug: "hybrid-quantum-classical-nn",
    title: "Hybrid Quantum-Classical Neural Network for Image Classification",
    summary:
      "Variational quantum circuits embedded inside classical ResNet / Vision Transformer backbones for image classification.",
    description: [
      "Designed a hybrid architecture embedding variational quantum circuits within classical deep learning backbones (ResNet / Vision Transformers) for classification tasks.",
      "Optimised quantum feature maps and ansatz design to maximise expressive power within the qubit constraints of NISQ processors.",
    ],
    category: "quantum",
    status: "Ongoing",
    techStack: ["PennyLane", "PyTorch", "Qiskit", "ResNet", "Vision Transformers"],
    links: { github: "https://github.com/Naveen-das09/Hybrid-Quantum-Classical-NN" },
    featured: true,
  },
  {
    slug: "bb84-qkd-simulation",
    title: "BB84 Quantum Key Distribution Simulation with Decoy States",
    summary:
      "Qiskit simulation of the BB84 protocol with a decoy-state extension, secure key rate and QBER analysis under realistic channel noise.",
    description: [
      "Simulated BB84 QKD with decoy-state extension using Qiskit; computed secure key rates and QBER under realistic channel noise.",
      "Built an interactive visualization dashboard for real-time protocol analysis and parameter tuning.",
    ],
    category: "quantum",
    techStack: ["Python", "Qiskit", "Quantum Communication", "QBER Analysis", "Streamlit"],
    links: { github: "https://github.com/Naveen-das09/BB84-Simulation-Demo" },
    featured: true,
  },
  {
    slug: "qscreen",
    title: "QScreen",
    summary:
      "A data-driven algorithm that scores how 'quantum-friendly' a dataset is, before committing to an expensive quantum ML training run.",
    description: [
      "Built a data-driven scoring algorithm that analyzes a dataset and outputs a quantum suitability score, indicating how well-suited it is to a quantum ML approach.",
      "Used the score as a screening step ahead of training, so quantum ML is only applied to datasets likely to benefit from it, rather than committing compute upfront.",
    ],
    category: "quantum",
    techStack: ["PennyLane", "Qiskit", "Streamlit", "Python"],
    links: {},
    featured: true,
  },
  {
    slug: "rag-application",
    title: "Retrieval-Augmented Generation (RAG) Application",
    summary:
      "Production-ready RAG system over PDF documents with vector-database retrieval, served through a Dockerized FastAPI backend.",
    description: [
      "Architected and deployed a production-ready RAG system with vector-database retrieval, reducing hallucination rates through structured prompt engineering.",
      "Containerised with Docker and served via FastAPI.",
    ],
    category: "ml-ai",
    techStack: ["GPT", "Llama3", "LangChain", "Chroma", "Pinecone", "FastAPI", "Docker"],
    links: { github: "https://github.com/Naveen-das09/RAG_pdf" },
  },
  {
    slug: "canine-eeg-bci",
    title: "Brain-Computer Interface — Canine Olfaction EEG Signal Classification",
    summary:
      "End-to-end EEG pipeline decoding neural signatures of scent in dogs, from raw signal to neural-network classification.",
    description: [
      "Built an end-to-end pipeline for EEG signal acquisition, preprocessing, signal analysis, feature extraction, and neural-network-based classification.",
      "Applied time-frequency analysis and data storytelling techniques for medical-grade signal interpretation.",
    ],
    category: "ml-ai",
    techStack: ["Python", "MNE", "Biosignal Processing", "Neural Networks", "Time Series"],
    links: { github: "https://github.com/Naveen-das09/Canine-EEG-analysis" },
    featured: true,
  },
  {
    slug: "ai-job-hunter",
    title: "AI Job Hunter",
    summary:
      "A full-stack job search assistant that scrapes postings, parses resumes, and uses an LLM to match candidates to roles.",
    description: [
      "Built an automated pipeline that scrapes job postings, parses resumes, and scores candidate-role fit using Claude.",
      "Scheduled recurring scrape-and-match runs, persisting results for review through a Streamlit frontend backed by a FastAPI service.",
      "Containerised both the API and frontend with Docker for reproducible local deployment.",
    ],
    category: "ml-ai",
    techStack: ["FastAPI", "Streamlit", "Claude", "Python", "SQLite", "Docker"],
    links: {},
    featured: true,
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}
