import type {
  Achievement,
  Certification,
  EducationEntry,
  ExperienceEntry,
} from "@/types";

export const summary =
  "M.Tech scholar in Quantum Technology at IIT Jodhpur, specialising in Quantum Optimization and Quantum Machine Learning — hands-on with QAOA, quantum algorithms, QUBO/Ising formulations, and variational quantum algorithms. Combines this with a strong foundation in data science, AI/ML, and production-grade software engineering built over two years as a data scientist.";

export const education: EducationEntry[] = [
  { degree: "M.Tech, Quantum Technology", institute: "Indian Institute of Technology, Jodhpur", score: "9.25 CGPA", year: "2026" },
  { degree: "PGP, Data Science", institute: "Great Lakes Institute of Management, Gurgaon", year: "2022" },
  { degree: "B.Tech, Electronics & Communication Engineering", institute: "Model Engineering College, Kochi", score: "6.59 CGPA", year: "2020" },
];

export const experience: ExperienceEntry[] = [
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
    title: "Quantum Optimization",
    skills: [
      "QAOA & variants",
      "QUBO/Ising formulations",
      "Variational Quantum Eigensolver (VQE)",
      "Quantum Annealing",
      "Combinatorial Optimization",
      "Gradient-based & gradient-free parameter optimization",
      "Noise mitigation on NISQ devices",
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
