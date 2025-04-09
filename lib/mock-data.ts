import type { Job } from "@/types/job"
import type { Application } from "@/types/application"

export const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA (Remote)",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    description:
      "We are looking for a Senior Frontend Developer to join our team. You will be responsible for building user interfaces for our web applications using React, Next.js, and TypeScript. The ideal candidate has 5+ years of experience with modern frontend frameworks and a passion for creating exceptional user experiences.",
    requirements: [
      "5+ years of experience with React",
      "Experience with Next.js and TypeScript",
      "Strong understanding of web performance optimization",
      "Experience with state management libraries like Redux or Zustand",
    ],
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux"],
    posted: "2 days ago",
    matchScore: 95,
  },
  {
    id: "2",
    title: "Full Stack Developer",
    company: "Innovate Solutions",
    location: "New York, NY (Hybrid)",
    type: "Full-time",
    salary: "$100,000 - $130,000",
    description:
      "Innovate Solutions is seeking a Full Stack Developer to help build and maintain our SaaS platform. You will work on both frontend and backend development using React, Node.js, and PostgreSQL. The ideal candidate is a problem solver who can work independently and as part of a team.",
    requirements: [
      "3+ years of experience with React",
      "3+ years of experience with Node.js",
      "Experience with SQL databases",
      "Understanding of RESTful APIs and microservices",
    ],
    skills: ["React", "Node.js", "PostgreSQL", "Express", "REST API"],
    posted: "1 week ago",
    matchScore: 88,
  },
  {
    id: "3",
    title: "UX/UI Designer",
    company: "Creative Digital",
    location: "Austin, TX (On-site)",
    type: "Full-time",
    salary: "$90,000 - $110,000",
    description:
      "Creative Digital is looking for a talented UX/UI Designer to join our growing team. You will be responsible for creating user-centered designs for web and mobile applications. The ideal candidate has a strong portfolio demonstrating their design process and problem-solving skills.",
    requirements: [
      "3+ years of experience in UX/UI design",
      "Proficiency with design tools like Figma or Sketch",
      "Experience with user research and usability testing",
      "Understanding of accessibility standards",
    ],
    skills: ["Figma", "UI Design", "UX Research", "Prototyping", "Wireframing"],
    posted: "3 days ago",
    matchScore: 75,
  },
]

export const mockApplications: Application[] = [
  {
    id: "1",
    jobId: "1",
    jobTitle: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    status: "Interview",
    appliedDate: "May 15, 2023",
    lastUpdated: "May 20, 2023",
    resumeVersion: "tech_resume_v2.pdf",
    coverLetter: true,
    notes: "Phone interview scheduled for May 25 at 2:00 PM",
    timeline: [
      {
        id: "1-1",
        date: "May 15, 2023",
        type: "Applied",
        description: "Application submitted via CareerKitsune-AI",
      },
      {
        id: "1-2",
        date: "May 20, 2023",
        type: "Interview",
        description: "Phone interview scheduled",
      },
    ],
  },
  {
    id: "2",
    jobId: "2",
    jobTitle: "Full Stack Developer",
    company: "Innovate Solutions",
    status: "Applied",
    appliedDate: "May 10, 2023",
    lastUpdated: "May 10, 2023",
    resumeVersion: "fullstack_resume.pdf",
    coverLetter: true,
    timeline: [
      {
        id: "2-1",
        date: "May 10, 2023",
        type: "Applied",
        description: "Application submitted via CareerKitsune-AI",
      },
    ],
  },
]
