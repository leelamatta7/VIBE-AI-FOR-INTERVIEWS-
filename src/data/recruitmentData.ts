import { CompanyJobRole, ApplicantRecord } from "../types";

export const INITIAL_JOB_ROLES: CompanyJobRole[] = [
  {
    id: "role_google_cloud_sr",
    companyName: "Google Cloud",
    companyLogo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80",
    companyIndustry: "Cloud Computing & AI",
    title: "Senior Full-Stack Cloud Engineer",
    department: "Cloud Platform Infrastructure",
    location: "Sunnyvale, CA (Hybrid / Remote)",
    employmentType: "Full-time",
    experienceRequired: "4+ Years",
    skillsRequired: ["TypeScript", "React", "Node.js", "PostgreSQL", "Google Cloud", "Distributed Systems", "Docker"],
    minMatchThreshold: 75,
    salaryRange: "$165,000 - $205,000 / yr",
    jobDescription: `Google Cloud is looking for a Senior Full-Stack Cloud Engineer to design next-generation developer tooling and resilient microservices.
Key Responsibilities:
- Build high-throughput full-stack platforms using modern TypeScript, React, and Node.js backend services.
- Architect low-latency distributed APIs, Redis caching layers, and optimized PostgreSQL databases.
- Integrate cloud infrastructure with GCP Cloud Run, Pub/Sub, and zero-trust IAM policies.
- Collaborate with AI and system design teams to deliver scalable enterprise products.
Requirements:
- 4+ years building production-grade web systems and distributed services.
- Deep expertise in frontend architecture, database schema design, and asynchronous event streams.
- Passion for software craftsmanship, unit test rigor, and robust automated deployments.`,
    createdAt: "2026-08-25",
    applicantsCount: 0,
    status: "active",
  },
  {
    id: "role_stripe_core",
    companyName: "Stripe",
    companyLogo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=80",
    companyIndustry: "Financial Infrastructure",
    title: "Staff Backend Infrastructure Engineer",
    department: "Global Payments & Core Ledgers",
    location: "San Francisco, CA / Remote",
    employmentType: "Full-time",
    experienceRequired: "5+ Years",
    skillsRequired: ["Go / Python / Node.js", "PostgreSQL", "Kafka", "Distributed Systems", "Idempotency", "Redis"],
    minMatchThreshold: 80,
    salaryRange: "$180,000 - $225,000 / yr",
    jobDescription: `Join Stripe to build the economic infrastructure of the internet.
Key Responsibilities:
- Architect mission-critical payment ledger pipelines with 99.999% availability and strict idempotency guarantees.
- Design resilient event-driven message queues and transactional consensus systems.
- Optimize database write paths and partition high-scale PostgreSQL shards.
Requirements:
- 5+ years building high-reliability backend systems.
- Deep understanding of distributed transactions, concurrency control, and failure recovery.`,
    createdAt: "2026-08-26",
    applicantsCount: 0,
    status: "active",
  },
  {
    id: "role_openai_sys",
    companyName: "OpenAI",
    companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    companyIndustry: "Generative Artificial Intelligence",
    title: "Staff AI Systems & Agentic Runtime Engineer",
    department: "Applied AI Research",
    location: "San Francisco, CA / Remote",
    employmentType: "Full-time",
    experienceRequired: "5+ Years",
    skillsRequired: ["Python", "FastAPI", "Gemini / LLM Tooling", "PyTorch", "pgvector", "WebSockets", "Cloud Run"],
    minMatchThreshold: 80,
    salaryRange: "$200,000 - $250,000 / yr",
    jobDescription: `Work on cutting-edge autonomous agents and real-time multimodal model serving architectures.
Key Responsibilities:
- Build low-latency agent execution runtimes, streaming tool calling frameworks, and vector search systems.
- Optimize real-time multimodal inference pipelines with WebSockets and WebRTC streaming.
- Integrate automated benchmark evaluators and memory persistence layers.
Requirements:
- 5+ years developing backend architectures and LLM application infrastructure.
- Experience with low-latency streaming protocols and asynchronous pipelines.`,
    createdAt: "2026-08-27",
    applicantsCount: 0,
    status: "active",
  },
  {
    id: "role_microsoft_fe",
    companyName: "Microsoft",
    companyLogo: "https://images.unsplash.com/photo-1583321500900-82807e458f3c?w=100&auto=format&fit=crop&q=80",
    companyIndustry: "Enterprise Software & Cloud",
    title: "Principal Frontend Design System Architect",
    department: "Developer Division & Modern Web",
    location: "Redmond, WA / Remote",
    employmentType: "Full-time",
    experienceRequired: "6+ Years",
    skillsRequired: ["React 19", "TypeScript", "Tailwind CSS", "Web Performance", "State Management", "WCAG 2.1"],
    minMatchThreshold: 75,
    salaryRange: "$175,000 - $215,000 / yr",
    jobDescription: `Architect high-performance, accessible enterprise web applications serving millions of global developers.
Key Responsibilities:
- Lead the architectural vision for complex React single-page applications and component design systems.
- Benchmark and optimize Core Web Vitals, memory footprints, and bundle streaming.
- Drive accessibility (WCAG 2.1 AA) and responsive design standards across cross-functional teams.
Requirements:
- 6+ years specializing in modern React, TypeScript, and large-scale web architecture.`,
    createdAt: "2026-08-28",
    applicantsCount: 0,
    status: "active",
  },
  {
    id: "role_databricks_data",
    companyName: "Databricks",
    companyLogo: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=100&auto=format&fit=crop&q=80",
    companyIndustry: "Data & AI Lakehouse",
    title: "Senior Distributed Systems & Platform Engineer",
    department: "Lakehouse Compute Engine",
    location: "Mountain View, CA / Remote",
    employmentType: "Full-time",
    experienceRequired: "4+ Years",
    skillsRequired: ["C++ / Rust / Go", "Distributed Computing", "Kubernetes", "Linux Kernel", "gRPC"],
    minMatchThreshold: 80,
    salaryRange: "$170,000 - $210,000 / yr",
    jobDescription: `Build high-throughput distributed compute query execution kernels and cloud infrastructure.
Key Responsibilities:
- Optimize distributed memory management, network serialization, and disk I/O.
- Scale multi-tenant Kubernetes worker clusters and telemetry pipelines.
Requirements:
- 4+ years working on distributed systems or kernel-level optimization.`,
    createdAt: "2026-08-29",
    applicantsCount: 0,
    status: "active",
  },
  {
    id: "role_netflix_edge",
    companyName: "Netflix",
    companyLogo: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=100&auto=format&fit=crop&q=80",
    companyIndustry: "Streaming Media & Entertainment",
    title: "Senior Edge & Media Streaming Engineer",
    department: "Playback & Delivery Ecosystem",
    location: "Los Gatos, CA / Remote",
    employmentType: "Full-time",
    experienceRequired: "4+ Years",
    skillsRequired: ["WebRTC", "TypeScript", "Video Codecs", "Edge CDN", "Node.js", "Observability"],
    minMatchThreshold: 75,
    salaryRange: "$190,000 - $240,000 / yr",
    jobDescription: `Deliver seamless, bufferless video and real-time interactive media experiences to 250M+ global members.
Key Responsibilities:
- Build low-latency WebRTC and adaptive bitrate streaming pipelines.
- Implement telemetry collectors tracking edge network round-trip time and frame drops.
Requirements:
- 4+ years building media streaming or real-time networking systems.`,
    createdAt: "2026-08-30",
    applicantsCount: 0,
    status: "active",
  },
];

// Active pipeline initialized with live candidate sessions (no mocked/seeded fake data)
export const INITIAL_APPLICANTS: ApplicantRecord[] = [];
