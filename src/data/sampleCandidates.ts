import { CandidateProfile } from "../types";

/**
 * Candidate Profile Initializer
 * Real-time dynamic candidate profile configured for the user.
 * Mocked/seeded data has been removed.
 */
export const DEFAULT_CANDIDATE_PROFILE: CandidateProfile = {
  name: "Leela Matta",
  email: "leelamatta7@gmail.com",
  phoneNumber: "+1 (555) 728-1904",
  location: "San Francisco, CA / Remote",
  avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
  linkedInUrl: "https://linkedin.com/in/leela-matta",
  githubUrl: "https://github.com/leelamatta",
  portfolioUrl: "https://leelamatta.dev",
  targetRole: "Senior Full Stack Software Engineer",
  skills: "TypeScript, React, Node.js, Express, PostgreSQL, Redis, System Design, REST APIs, Microservices",
  experienceYears: 5,
  expectedSalary: "$165,000 / year",
  noticePeriod: "2 Weeks",
  workAuthorization: "Authorized to Work",
  preferredLanguages: ["English", "Hindi"],
  resumeText: `Senior Full Stack Software Engineer with 5+ years of production experience architecting scalable distributed web platforms.
Specializes in high-performance frontend interfaces with React and TypeScript, resilient Node.js backend microservices, and optimized PostgreSQL/Redis storage layers.
Demonstrated success leading end-to-end technical initiatives, optimizing API latencies, and implementing real-time WebRTC and streaming media integrations.`,
  jobDescription: `Target Role: Senior Full Stack Engineer
Requirements:
- 4+ years professional software engineering experience with modern TypeScript, React, and Node.js.
- Strong knowledge of API design, distributed system architecture, caching, and data modeling.
- Experience with real-time video/audio streaming or high-throughput microservices is a strong plus.
- Excellent communication and collaborative problem-solving skills.`,
  education: [
    {
      degree: "B.Tech in Computer Science & Engineering",
      institution: "State University of Technology",
      year: "2020",
      gpa: "3.9 / 4.0",
    },
  ],
  workExperience: [
    {
      company: "Apex Global Cloud",
      role: "Senior Full Stack Engineer",
      duration: "2022 – Present",
      highlights: [
        "Architected scalable microservices handling 20,000 requests/sec with sub-40ms latency.",
        "Built real-time collaboration dashboards using WebSockets and React.",
      ],
    },
  ],
};

export const createBlankCandidateProfile = (name = "Leela Matta", email = "leelamatta7@gmail.com"): CandidateProfile => ({
  name,
  email,
  phoneNumber: "",
  location: "",
  targetRole: "Senior Full Stack Software Engineer",
  skills: "TypeScript, React, Node.js, PostgreSQL",
  experienceYears: 4,
  resumeText: "",
  jobDescription: "",
  preferredLanguages: ["English"],
});

export const SAMPLE_CANDIDATES = [
  {
    id: "candidate_leela",
    title: "Leela Matta — Senior Full-Stack Engineer",
    subtitle: "TypeScript, React, Node.js, PostgreSQL, Cloud Systems (5 Yrs)",
    profile: DEFAULT_CANDIDATE_PROFILE,
  },
];
