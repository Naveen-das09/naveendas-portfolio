export interface ResearchEntry {
  slug: string;
  tag: string;
  title: string;
  status: string;
  summary: string;
  abstract: string;
  institute: string;
  projectSlug?: string;
  repository?: string;
  sections: { id: string; title: string; paragraphs: string[] }[];
  resources?: { label: string; href: string }[];
}

export const researchEntries: ResearchEntry[] = [
  {
    slug: "neural-decoder-generalization",
    tag: "M.Tech Thesis",
    title:
      "What Makes Neural Decoders Generalize? A Characterization of Transfer Across Code Distance and Code Family in Quantum Error Correction",
    status: "In progress — pre-results stage",
    summary:
      "Why do neural decoders for quantum error correction fail to generalize across code distance and code family — and can training be restructured to fix it?",
    abstract:
      "Neural network decoders for quantum error correction are typically trained and evaluated on a single code distance and code family, leaving open the question of whether — and why — they generalize when that structure changes. This work studies transfer of neural QEC decoders across code distance and code family, and proposes coset-graded supervision as a candidate mechanism for improving generalization, backed by a falsifiable experimental plan (E0–E4).",
    institute: "Indian Institute of Technology, Jodhpur — M.Tech Quantum Technology",
    sections: [
      { id: "question", title: "The research question", paragraphs: ["A neural decoder can perform well on the code it was trained on without transferring to a different code distance or family. This thesis asks what is learned across these changes and how the training objective influences that transfer."] },
      { id: "approach", title: "Proposed approach", paragraphs: ["Coset-graded supervision is the candidate mechanism: structure the training signal around equivalence classes of errors rather than only raw syndrome-to-correction pairs. The existing research plan describes a falsifiable E0–E4 experimental programme to study generalization across code distance and code family."] },
      { id: "progress", title: "Progress and current scope", paragraphs: ["The research question, candidate supervision strategy, and experimental direction are documented. An interactive QEC explainer and a plain-language article communicate the motivation. This thesis remains at the pre-results stage; no neural-decoder transfer improvement or cross-family result is claimed here.", "Alongside this direction, QEC Lab provides a working environment for surface-code simulation, classical MWPM decoding, evidence inspection, and reproducible exports. Its simulation and software validation are separate from the proposed neural-decoder experiments."] },
      { id: "next", title: "Next research steps", paragraphs: ["Implement and evaluate the proposed training strategy, compare it with appropriate neural-decoder baselines, and report transfer performance with explicit noise assumptions and uncertainty. Cross-distance and cross-family conclusions require those experiments to be completed."] },
    ],
    resources: [
      { label: "Read the research introduction", href: "/articles/what-makes-a-decoder-generalize" },
      { label: "Explore the QEC visualization", href: "/lab/quantum-error-correction" },
      { label: "QEC Lab methods and validation", href: "/research/qec-lab" },
    ],
  },
  {
    slug: "qec-lab",
    tag: "Open-source research software",
    title: "QEC Lab: from research question to reproducible evidence",
    status: "Working alpha · v0.2 in development",
    summary: "A local workspace for surface-code simulation, decoder comparison, failure inspection, and reproducible research reports.",
    abstract: "I built QEC Lab to bring the full quantum error correction investigation into one workspace: define a question, review an experiment plan, run a real simulation, inspect the evidence, and export a reproducible record. It combines Stim and PyMatching with a browser interface, persistent research projects, and an optional evidence-grounded AI assistant.",
    institute: "Independent open-source project · MIT license",
    projectSlug: "qec-lab",
    repository: "https://github.com/Naveen-das09/qec-lab",
    sections: [
      { id: "motivation", title: "Why I built it", paragraphs: ["Research evidence often lives across notebooks, simulator logs, decoder settings, and handwritten notes. QEC Lab connects the question, experiment configuration, measured result, and reproduction artifacts so each curve can be traced back to the assumptions that produced it."] },
      { id: "methods", title: "Simulation and decoding methods", paragraphs: ["The scientific engine generates Stim rotated surface-code Z-memory circuits at distances 3, 5, 7, and 9. Circuit-level Pauli noise uses a channel parameter p for depolarization after Clifford gates, data depolarization before syndrome rounds, and reset flips. Measurement flips use a separately configurable multiplier × p.", "PyMatching performs minimum-weight perfect-matching decoding using a decomposed graphlike detector error model. Matched decoding uses the simulation noise parameters; the mismatch experiment keeps the stressed sampling circuit but makes the decoder assume measurement noise p. Matched weights do not imply optimal decoding of every circuit correlation."] },
      { id: "workflow", title: "What is implemented", paragraphs: ["The workspace supports baseline sweeps, measurement-noise stress tests, decoder-mismatch investigations, run comparisons, and inspection of failed shots by detector coordinate, syndrome time slice, and actual versus predicted logical observable parity.", "Project organization includes named research projects, notes, separate drafts and conversations, duplicate-and-edit plans, a shared cancellable job queue, and SQLite persistence. Markdown and illustrated HTML reports collect measured plots and researcher notes; HTML reports can be printed to PDF.", "An optional Gemini assistant can read selected measurements, validate an experiment, and stage a plan. The researcher starts execution explicitly. The simulation engine, manual workflow, and exports work without an AI key."] },
      { id: "evidence", title: "Recorded evidence and validation", paragraphs: ["The repository documents a measurement-noise stress investigation with 150,000 sampled memory experiments across 15 configurations. This is an example of the working research workflow, not a threshold estimate or a neural-decoder benchmark.", "A separate live assistant validation used a distance-3 circuit at p = 0.005, five syndrome rounds, 1,000 shots, matched decoding, and measurement multiplier 1. It recorded 23 logical failures: an error probability of 0.023 per memory experiment, with a 95% Wilson interval of approximately [0.01537, 0.03428]. The assistant’s reported counts and interval agreed with the saved evidence.", "The documented automated checks cover noiseless behavior, seeded consistency, captured-failure replay, decoder mismatch, Wilson intervals, invalid plans, cancellation, time budgets, export replay, persistence, restart recovery, and mocked assistant tool calls. The live provider check verifies one planning-and-analysis workflow; it is not a broad evaluation of scientific reliability."] },
      { id: "reproduction", title: "Reproducibility by design", paragraphs: ["Each reproduction bundle preserves the experiment specification, CSV measurements, exact circuits, decoder models, batch seeds, dependency versions, and a standalone replay script. Replay re-runs the recorded batches and checks failure counts against saved results. Assistant conversations are exported separately from the deterministic scientific report.", "Exact Stim samples can depend on library version, sampling-call shape, and CPU SIMD architecture. A seed alone is not a guarantee of bit-for-bit portability. Exported bundles are snapshots and may contain explicitly marked partial results."] },
      { id: "limits", title: "How to interpret the results", paragraphs: ["Logical error probability is the number of logical observable prediction failures divided by sampled memory experiments; it is not normalized per syndrome round. The plotted p is a noise-channel parameter, not an aggregate hardware error rate. Error bars are pointwise nominal 95% Wilson intervals, and zero observed failures still has a nonzero upper limit.", "No automatic threshold fitting or statistically significant decoder advantage is claimed. Related runs can share seeds and therefore correlated samples. Failure inspection shows detector events and observable mismatch, not the exact injected error history or a reconstructed correction path. Decoder timing excludes circuit sampling and graph construction."] },
      { id: "roadmap", title: "Current scope and next steps", paragraphs: ["QEC Lab is a working alpha for one trusted local workspace. The v0.2 development milestones add project management and illustrated reporting; release hardening and broader agent evaluation remain. Planned work includes statistically justified adaptive sampling, richer failure-path visualization, additional validated code families, and isolated team workspaces.", "This project currently uses classical MWPM decoding. It supports the broader research interest in decoder behavior, but it does not establish the neural-decoder transfer results proposed in my M.Tech thesis."] },
    ],
    resources: [
      { label: "Source code and setup guide", href: "https://github.com/Naveen-das09/qec-lab" },
      { label: "Project walkthrough", href: "https://github.com/Naveen-das09/qec-lab/blob/main/docs/PORTFOLIO.md" },
      { label: "Live validation record", href: "https://github.com/Naveen-das09/qec-lab/blob/main/docs/LIVE_VALIDATION.md" },
      { label: "Contributing guide", href: "https://github.com/Naveen-das09/qec-lab/blob/main/CONTRIBUTING.md" },
    ],
  },
];

export function getResearchBySlug(slug: string) {
  return researchEntries.find((r) => r.slug === slug);
}

export const keyCourses = [
  "Quantum Computation",
  "Quantum Algorithms",
  "Quantum Optimization",
  "Quantum Machine Learning",
  "Quantum Cryptography",
  "Classical & Quantum Algorithms",
  "Quantum Error Correction",
  "Device Independent Quantum Technology",
];

export const researchInterests = [
  "Quantum error correction & neural decoders",
  "Quantum optimization (QAOA, VQE, quantum annealing)",
  "Quantum machine learning",
  "Representation learning & explainable AI",
  "Mathematics, cognitive science & philosophy of mind",
];
