import type {
  Achievement,
  Certification,
  EducationEntry,
  ExperienceEntry,
} from "@/types";

export const summary =
  "I'm an M.Tech scholar in Quantum Technology at IIT Jodhpur, working at the intersection of quantum computing, quantum machine learning, and classical AI/ML — currently researching quantum error correction and hybrid quantum-classical systems. My curiosity extends past the lab: mathematics, cognitive science, and philosophy of mind all shape how I think about learning, error, and generalization, in silicon and otherwise. Before this, I spent two years as a data scientist building production ML systems, which is the practical backbone under all of it.";

export const education: EducationEntry[] = [
  { degree: "M.Tech, Quantum Technology", institute: "Indian Institute of Technology, Jodhpur", score: "9.25 CGPA", year: "2026" },
  { degree: "PGP, Data Science", institute: "Great Lakes Institute of Management, Gurgaon", year: "2022" },
  { degree: "B.Tech, Electronics & Communication Engineering", institute: "Model Engineering College, Kochi", year: "2020" },
];

export const experience: ExperienceEntry[] = [
  {
    role: "Quantum Research Intern",
    org: "Infosys",
    location: "Bangalore, India",
    period: "May 2026 – Jul 2026",
    bullets: [
      "Researched quantum-friendly feature and dataset characterization for quantum machine learning, informing when a problem is worth encoding onto quantum hardware.",
      "Built a decision engine that routes optimization problems and datasets across classical, quantum, and hybrid quantum-classical compute — work now undergoing patent (IP) filing.",
      "Designed and prototyped Quantum Agents: agentic-AI-orchestrated quantum solvers for optimization, building the full stack from problem encoding through solver orchestration.",
      "Contributed to enterprise-grade product design for quantum application software, defining agentic AI workflows for customer-facing quantum solutions.",
    ],
  },
  {
    role: "Data Scientist",
    org: "Gadgeon Smart Systems Pvt Ltd",
    location: "Kerala, India",
    period: "2022 – 2023",
    bullets: [
      "Built and deployed production-grade ML pipelines for predictive maintenance and industrial analytics, enabling real-time fault detection and proactive asset management in IoT-enabled manufacturing environments.",
      "Developed end-to-end predictive analytics systems using supervised and time-series models (LSTM, Random Forest, XGBoost) on sensor data streams, reducing unplanned downtime and improving operational efficiency.",
      "Designed scalable data preprocessing and feature engineering pipelines for high-frequency industrial sensor data, ensuring model robustness under noisy, real-time conditions.",
      "Collaborated with cross-functional engineering teams on end-to-end delivery of data-driven automation solutions.",
      "Mentored junior team members in ML best practices, fostering a high-performing engineering environment.",
    ],
  },
];

export const skillGroups: { title: string; skills: string[] }[] = [
  {
    title: "Quantum Tech",
    skills: [
      "Quantum Optimization (QAOA, VQE, Annealing)",
      "Quantum Machine Learning",
      "Quantum Communication (QKD / BB84)",
      "Quantum Algorithms",
      "QUBO/Ising Formulations",
      "Qiskit",
      "PennyLane",
      "NISQ Noise Mitigation",
    ],
  },
  {
    title: "AI/ML & Deep Learning",
    skills: [
      "PyTorch",
      "TensorFlow",
      "Scikit-Learn",
      "Computer Vision (CNNs)",
      "NLP (LLMs, RAG)",
      "LangChain",
      "Agentic AI",
      "Vector Databases (Chroma/Pinecone)",
      "Model Deployment & Optimization",
    ],
  },
  {
    title: "Programming & Data",
    skills: ["Python", "C++", "SQL", "Tableau", "NumPy", "SciPy"],
  },
  {
    title: "MLOps & Cloud",
    skills: ["Git", "Docker", "CI/CD Pipelines", "FastAPI", "Streamlit", "MLflow", "AWS", "GCP"],
  },
];

export const certifications: Certification[] = [
  { title: "IBM Quantum Badges" },
  { title: "Computational Neuroscience", issuer: "University of Washington (Coursera)" },
];

export const achievements: Achievement[] = [
  { title: "Smart India Hackathon (SIH) 2025", detail: "Finalist" },
  { title: "GATE 2025", detail: "Qualified — Data Science & AI" },
  { title: "BizQuiz, IIT Jodhpur Techfest", detail: "Winner — 2nd Place" },
];
