import { CandidateProfile } from "../types";

export const SAMPLE_CANDIDATES: { id: string; title: string; subtitle: string; profile: CandidateProfile }[] = [
  {
    id: "fullstack_senior",
    title: "Aarav Sharma — Senior Full-Stack Engineer",
    subtitle: "React, Node.js, TypeScript, PostgreSQL, Distributed Systems (5+ Yrs)",
    profile: {
      name: "Aarav Sharma",
      email: "aarav.sharma@gemini.ai",
      phoneNumber: "+1 (555) 349-8821",
      location: "San Francisco, CA (Open to Remote)",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      linkedInUrl: "https://linkedin.com/in/aarav-sharma-dev",
      githubUrl: "https://github.com/aaravsharma-eng",
      portfolioUrl: "https://aaravsharma.tech",
      targetRole: "Senior Full Stack Engineer",
      skills: "JavaScript, TypeScript, React, Node.js, Express, PostgreSQL, Redis, Docker, System Design, REST APIs, Microservices",
      experienceYears: 5,
      expectedSalary: "$165,000 / year",
      noticePeriod: "2 Weeks",
      workAuthorization: "US Citizen / Authorized",
      preferredLanguages: ["English", "Hindi"],
      resumeText: `Senior Software Engineer with 5+ years of experience developing high-scale cloud platforms.
Built real-time collaboration engines serving 2M+ monthly active users with React, WebSockets, and Node.js.
Architected resilient microservices using TypeScript, Docker, and PostgreSQL with sub-50ms latency.
Led frontend migration from legacy monolithic views to modern server-side rendered React components.
Implemented distributed caching using Redis and designed JWT-based RBAC authentication systems with refresh token rotation.`,
      jobDescription: `We are looking for a Senior Full Stack Engineer to lead core product engineering.
Requirements:
- 4+ years of professional experience in TypeScript, React, and Node.js backend services.
- Deep algorithmic knowledge and ability to design scalable, secure RESTful APIs.
- Experience with relational databases (PostgreSQL), schema optimization, and caching (Redis).
- Strong verbal and written communication skills with ability to collaborate in multilingual environments.`,
      education: [
        {
          degree: "B.Tech in Computer Science & Engineering",
          institution: "National Institute of Technology (NIT)",
          year: "2019",
          gpa: "3.85 / 4.0",
        },
      ],
      workExperience: [
        {
          company: "Nexus Cloud Systems",
          role: "Senior Full Stack Software Engineer",
          duration: "2021 – Present",
          highlights: [
            "Architected distributed pub/sub event bus handling 15,000 req/sec with sub-30ms p99 latency.",
            "Spearheaded React state redesign reducing UI re-render bottlenecks by 52%.",
          ],
        },
        {
          company: "ScaleTech Solutions",
          role: "Full Stack Engineer",
          duration: "2019 – 2021",
          highlights: [
            "Developed REST and GraphQL services in TypeScript and PostgreSQL with connection pooling.",
            "Automated CI/CD pipeline deployments with Docker and automated Jest unit tests.",
          ],
        },
      ],
      certifications: [
        "AWS Certified Solutions Architect – Associate",
        "Meta Certified Front-End Developer",
      ],
    },
  },
  {
    id: "frontend_lead",
    title: "Priya Patel — Staff Frontend Architect",
    subtitle: "React 19, Next.js, Web Performance, State Management (4 Yrs)",
    profile: {
      name: "Priya Patel",
      email: "priya.patel@gemini.ai",
      phoneNumber: "+1 (555) 872-1049",
      location: "Seattle, WA",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
      linkedInUrl: "https://linkedin.com/in/priyapatel-ui",
      githubUrl: "https://github.com/priyapatel-arch",
      portfolioUrl: "https://priyapatel.design",
      targetRole: "Frontend Lead / Architect",
      skills: "React, Next.js, Tailwind CSS, TypeScript, Webpack/Vite, UI/UX, Jest, GraphQL, Performance Optimization",
      experienceYears: 4,
      expectedSalary: "$155,000 / year",
      noticePeriod: "Immediate",
      workAuthorization: "Permanent Resident (Green Card)",
      preferredLanguages: ["English", "Hindi", "Gujarati"],
      resumeText: `Lead Frontend Engineer passionate about crafting accessible, pixel-perfect user interfaces.
Specialized in React, Next.js, and modern CSS frameworks with Lighthouse 98+ performance scores.
Engineered reusable design systems used across 12 enterprise micro-frontends.
Optimized bundle size by 45% via tree-shaking, lazy-loading, and route-based code splitting.`,
      jobDescription: `Seeking an expert Frontend Lead to elevate our web application user experience.
Must possess deep understanding of React component lifecycle, virtual DOM reconciliation, design systems, and responsive layouts.`,
      education: [
        {
          degree: "B.S. in Software Engineering",
          institution: "University of Washington",
          year: "2020",
          gpa: "3.90 / 4.0",
        },
      ],
      workExperience: [
        {
          company: "Hyperion Interactive",
          role: "Lead Frontend Architect",
          duration: "2021 – Present",
          highlights: [
            "Designed company-wide unified design tokens library adopted by 35+ engineers.",
            "Cut Largest Contentful Paint (LCP) from 3.2s to 1.1s across core dashboard flows.",
          ],
        },
      ],
      certifications: ["Google Mobile Web Specialist", "Certified Accessibility Specialist (CPACC)"],
    },
  },
  {
    id: "backend_ai",
    title: "Rohan Verma — Backend & AI Systems Engineer",
    subtitle: "Python, FastAPI, Gemini API, PyTorch, SQL, Vector DBs (3 Yrs)",
    profile: {
      name: "Rohan Verma",
      email: "rohan.verma@gemini.ai",
      phoneNumber: "+91 98765 43210",
      location: "Bengaluru, India (Open to Relocation/Remote)",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      linkedInUrl: "https://linkedin.com/in/rohanverma-ai",
      githubUrl: "https://github.com/rohanverma-ml",
      portfolioUrl: "https://rohanverma.dev",
      targetRole: "AI Backend Engineer",
      skills: "Python, FastAPI, PostgreSQL, Gemini API, LLM Tooling, LangChain, Docker, Vector Search, Cloud Run",
      experienceYears: 3,
      expectedSalary: "$140,000 / year",
      noticePeriod: "1 Month",
      workAuthorization: "H-1B Eligible / India Resident",
      preferredLanguages: ["English", "Hindi"],
      resumeText: `Backend Engineer specializing in generative AI application backends and high-throughput APIs.
Built semantic search engines combining pgvector and Google Gemini embeddings for 500k+ enterprise documents.
Developed asynchronous background task pipelines in FastAPI and Celery.`,
      jobDescription: `Looking for an AI Backend Engineer to build production LLM systems, secure proxy gateways, and scalable APIs with Python and modern cloud infrastructure.`,
      education: [
        {
          degree: "B.Tech in Information Technology",
          institution: "IIT Roorkee",
          year: "2021",
          gpa: "8.9 / 10",
        },
      ],
      workExperience: [
        {
          company: "Cognitive Labs",
          role: "AI Backend Engineer",
          duration: "2022 – Present",
          highlights: [
            "Engineered semantic retrieval engine processing 1.2M queries per day.",
            "Implemented rate-limiting proxy for Gemini API endpoints with automated failover.",
          ],
        },
      ],
      certifications: ["Google Cloud Professional Machine Learning Engineer", "Docker Certified Associate"],
    },
  },
];
