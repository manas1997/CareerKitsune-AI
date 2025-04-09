import { getUserSkills } from "./data-service"

export type InterviewPrepPlan = {
  companyName: string
  role: string
  timeUntilInterview: string
  technicalTopics: string[]
  behavioralTopics: string[]
  companySpecificInfo: string
  mockQuestions: {
    technical: string[]
    behavioral: string[]
  }
  preparationSchedule: {
    day: string
    tasks: string[]
  }[]
  skillGapAnalysis: {
    requiredSkills: string[]
    userSkills: string[]
    gapsIdentified: string[]
    recommendations: string[]
  }
  overallAssessment: {
    readiness: "high" | "medium" | "low"
    focusAreas: string[]
    honestFeedback: string
  }
}

// Common interview topics by role
const commonTopicsByRole: Record<string, { technical: string[]; behavioral: string[] }> = {
  "software engineer": {
    technical: [
      "Data structures & algorithms",
      "System design",
      "Programming languages (specific to role)",
      "Problem-solving approach",
      "Code optimization",
      "Testing methodologies",
    ],
    behavioral: [
      "Teamwork & collaboration",
      "Conflict resolution",
      "Project management",
      "Adaptability",
      "Communication skills",
      "Leadership experience",
    ],
  },
  "product manager": {
    technical: [
      "Product metrics & analytics",
      "User research methods",
      "Product development lifecycle",
      "Prioritization frameworks",
      "Market analysis",
      "Technical understanding",
    ],
    behavioral: [
      "Stakeholder management",
      "Decision making process",
      "Cross-functional collaboration",
      "Customer focus",
      "Strategic thinking",
      "Problem solving",
    ],
  },
  "data scientist": {
    technical: [
      "Statistical analysis",
      "Machine learning algorithms",
      "Data cleaning & preprocessing",
      "SQL & database knowledge",
      "Python/R programming",
      "Experiment design",
    ],
    behavioral: [
      "Communication of complex concepts",
      "Business acumen",
      "Project prioritization",
      "Teamwork",
      "Adaptability",
      "Attention to detail",
    ],
  },
  default: {
    technical: [
      "Role-specific technical skills",
      "Industry knowledge",
      "Tools & software proficiency",
      "Problem-solving methodology",
      "Analytical thinking",
    ],
    behavioral: [
      "Communication skills",
      "Teamwork & collaboration",
      "Adaptability",
      "Time management",
      "Leadership potential",
      "Conflict resolution",
    ],
  },
}

// Company-specific interview patterns
const companyInterviewPatterns: Record<
  string,
  {
    format: string
    focus: string[]
    uniqueAspects: string[]
  }
> = {
  google: {
    format: "Multiple rounds with different interviewers, focusing on technical skills and Googleyness",
    focus: ["Algorithm efficiency", "System design", "Cultural fit", "Leadership"],
    uniqueAspects: ["STAR method responses", "Focus on data-driven decisions", "Emphasis on scale"],
  },
  amazon: {
    format: "Behavioral and technical interviews with heavy focus on Leadership Principles",
    focus: ["Amazon Leadership Principles", "Customer obsession", "Technical depth", "Ownership"],
    uniqueAspects: ["STAR method is essential", "Expect bar-raiser interviews", "Prepare ownership examples"],
  },
  microsoft: {
    format: "Problem-solving and coding interviews with focus on collaboration",
    focus: ["Coding skills", "Problem decomposition", "Architecture", "Growth mindset"],
    uniqueAspects: ["Collaborative approach to problems", "Focus on learning and growth", "Product thinking"],
  },
  apple: {
    format: "Technical depth and design sensibility with attention to detail",
    focus: ["Technical expertise", "Design thinking", "Attention to detail", "User focus"],
    uniqueAspects: ["Emphasis on quality and craft", "Deep domain knowledge", "User experience focus"],
  },
  facebook: {
    format: "Coding, design and behavioral interviews with focus on impact",
    focus: ["Coding efficiency", "System design", "Cultural fit", "Impact measurement"],
    uniqueAspects: ["Move fast culture", "Focus on scale", "Emphasis on metrics and impact"],
  },
  default: {
    format: "Combination of technical and behavioral interviews",
    focus: ["Technical skills", "Cultural fit", "Problem-solving", "Communication"],
    uniqueAspects: ["Research company values", "Prepare relevant examples", "Have thoughtful questions ready"],
  },
}

// Generate mock interview questions
function generateMockQuestions(role: string, companyName: string): { technical: string[]; behavioral: string[] } {
  const normalizedRole = role.toLowerCase()
  const normalizedCompany = companyName.toLowerCase()

  // Find the closest role match
  let roleKey = "default"
  for (const key of Object.keys(commonTopicsByRole)) {
    if (normalizedRole.includes(key)) {
      roleKey = key
      break
    }
  }

  // Find the closest company match
  let companyKey = "default"
  for (const key of Object.keys(companyInterviewPatterns)) {
    if (normalizedCompany.includes(key)) {
      companyKey = key
      break
    }
  }

  const topics = commonTopicsByRole[roleKey]
  const companyPattern = companyInterviewPatterns[companyKey]

  // Generate technical questions
  const technicalQuestions = [
    `Can you explain your approach to ${topics.technical[0]}?`,
    `How would you solve a problem involving ${topics.technical[1]}?`,
    `What experience do you have with ${topics.technical[2]}?`,
    `How do you ensure quality in your ${roleKey === "software engineer" ? "code" : "work"}?`,
    `Tell me about a challenging technical problem you've solved.`,
  ]

  // Generate behavioral questions
  const behavioralQuestions = [
    `Tell me about a time when you demonstrated ${companyPattern.focus[0]}.`,
    `How do you approach ${topics.behavioral[0]}?`,
    `Describe a situation where you had to ${topics.behavioral[1]}.`,
    `What's your approach to ${companyPattern.focus[1]}?`,
    `Tell me about a time you failed and what you learned from it.`,
  ]

  return {
    technical: technicalQuestions,
    behavioral: behavioralQuestions,
  }
}

// Create preparation schedule based on time until interview
function createPrepSchedule(timeUntilInterview: string, role: string): { day: string; tasks: string[] }[] {
  const schedule: { day: string; tasks: string[] }[] = []

  // Parse time until interview
  const match = timeUntilInterview.match(/(\d+)\s*(day|week|month)s?/)
  if (!match) return []

  const amount = Number.parseInt(match[1])
  const unit = match[2]

  let totalDays = 0
  if (unit === "day") totalDays = amount
  else if (unit === "week") totalDays = amount * 7
  else if (unit === "month") totalDays = amount * 30

  if (totalDays <= 2) {
    // Rush preparation (1-2 days)
    schedule.push({
      day: "Day 1 (Today)",
      tasks: [
        "Research company and role (1 hour)",
        "Review your resume and prepare to discuss all points (30 mins)",
        "Practice answering 5 common behavioral questions (1 hour)",
        "Quick review of technical fundamentals (2 hours)",
        "Prepare 3-5 questions to ask interviewers (30 mins)",
        "Plan interview logistics - outfit, transportation, etc. (30 mins)",
      ],
    })

    if (totalDays > 1) {
      schedule.push({
        day: "Day 2 (Tomorrow)",
        tasks: [
          "Mock interview with focus on weakest areas (1 hour)",
          "Final technical concept review (1 hour)",
          "Relaxation and mental preparation (1 hour)",
          "Review company's latest news and developments (30 mins)",
          "Prepare interview materials - portfolio, code samples, etc. (30 mins)",
          "Early sleep for mental sharpness",
        ],
      })
    }
  } else if (totalDays <= 7) {
    // Week-long preparation
    schedule.push({
      day: "Days 1-2",
      tasks: [
        "Deep company research - culture, products, challenges (2 hours)",
        "Role requirements analysis and skill gap identification (1 hour)",
        "Create study plan for technical topics (1 hour)",
        "Begin technical review of most critical topics (2 hours/day)",
      ],
    })

    schedule.push({
      day: "Days 3-5",
      tasks: [
        "Daily technical practice problems (1-2 hours/day)",
        "Prepare and practice STAR stories for behavioral questions (1 hour/day)",
        "Mock interviews focusing on different aspects each day (1 hour/day)",
        "Research your interviewers if names are known (30 mins)",
      ],
    })

    schedule.push({
      day: "Days 6-7",
      tasks: [
        "Final mock interviews with feedback (2 hours)",
        "Review of weak areas identified in mocks (1-2 hours)",
        "Prepare thoughtful questions for interviewers (30 mins)",
        "Relaxation techniques and mental preparation (30 mins/day)",
        "Outfit and logistics preparation",
        "Early sleep night before interview",
      ],
    })
  } else {
    // Long-term preparation (2+ weeks)
    schedule.push({
      day: "Week 1",
      tasks: [
        "Comprehensive company and role research (3-4 hours)",
        "Detailed skill gap analysis (1-2 hours)",
        "Create structured study plan for technical topics (1 hour)",
        "Begin fundamental concept review (1-2 hours/day)",
        "Start preparing STAR stories for behavioral questions (2-3 hours)",
      ],
    })

    schedule.push({
      day: "Week 2",
      tasks: [
        "Daily technical practice with increasing difficulty (1-2 hours/day)",
        "Mock interviews with focus on technical skills (2-3 sessions)",
        "Refine behavioral question responses (2-3 hours)",
        "Research industry trends relevant to the role (1-2 hours)",
        "Begin preparing questions for interviewers (1 hour)",
      ],
    })

    if (totalDays > 14) {
      schedule.push({
        day: "Final Week",
        tasks: [
          "Comprehensive mock interviews (2-3 sessions)",
          "Focus on weak areas identified in mocks (2-3 hours)",
          "Final review of technical concepts (2-3 hours)",
          "Refine and practice delivery of STAR stories (1-2 hours)",
          "Research your interviewers if names are known (1 hour)",
          "Finalize questions for interviewers (30 mins)",
          "Prepare interview materials and logistics",
          "Relaxation and mental preparation (30 mins/day)",
        ],
      })
    }
  }

  return schedule
}

// Analyze skill gaps
async function analyzeSkillGaps(
  userId: string,
  requiredSkills: string[],
): Promise<{
  requiredSkills: string[]
  userSkills: string[]
  gapsIdentified: string[]
  recommendations: string[]
}> {
  try {
    // Get user skills
    const userSkillsData = await getUserSkills(userId)
    const userSkills = userSkillsData.map((skill) => skill.name.toLowerCase())

    // Normalize required skills
    const normalizedRequiredSkills = requiredSkills.map((skill) => skill.toLowerCase())

    // Identify gaps
    const gapsIdentified = normalizedRequiredSkills.filter((skill) => !userSkills.includes(skill))

    // Generate recommendations
    const recommendations = gapsIdentified.map(
      (skill) => `Focus on learning ${skill} - allocate extra time to this area`,
    )

    if (gapsIdentified.length > normalizedRequiredSkills.length / 2) {
      recommendations.push("Consider requesting a later interview date to better prepare")
    }

    if (gapsIdentified.length === 0) {
      recommendations.push("You have all the required skills - focus on deepening your knowledge")
    }

    return {
      requiredSkills: requiredSkills,
      userSkills: userSkillsData.map((skill) => skill.name),
      gapsIdentified,
      recommendations,
    }
  } catch (error) {
    console.error("Error analyzing skill gaps:", error)
    return {
      requiredSkills,
      userSkills: [],
      gapsIdentified: ["Unable to analyze skills due to an error"],
      recommendations: ["Complete your skill profile to get better recommendations"],
    }
  }
}

// Generate overall assessment
function generateOverallAssessment(
  skillGapAnalysis: {
    requiredSkills: string[]
    gapsIdentified: string[]
  },
  timeUntilInterview: string,
): {
  readiness: "high" | "medium" | "low"
  focusAreas: string[]
  honestFeedback: string
} {
  // Calculate readiness based on skill gaps and time
  const gapPercentage =
    skillGapAnalysis.requiredSkills.length > 0
      ? skillGapAnalysis.gapsIdentified.length / skillGapAnalysis.requiredSkills.length
      : 0

  // Parse time until interview
  const match = timeUntilInterview.match(/(\d+)\s*(day|week|month)s?/)
  let totalDays = 30 // Default to a month
  if (match) {
    const amount = Number.parseInt(match[1])
    const unit = match[2]

    if (unit === "day") totalDays = amount
    else if (unit === "week") totalDays = amount * 7
    else if (unit === "month") totalDays = amount * 30
  }

  // Determine readiness
  let readiness: "high" | "medium" | "low" = "medium"
  let honestFeedback = ""

  if (gapPercentage > 0.5 && totalDays < 7) {
    readiness = "low"
    honestFeedback =
      "Based on the significant skill gaps and limited preparation time, you may want to consider requesting a later interview date. If that's not possible, focus intensely on the most critical skills and be prepared to discuss your learning approach."
  } else if (gapPercentage > 0.3 || totalDays < 3) {
    readiness = "medium"
    honestFeedback =
      "You have some important skill gaps to address, but with focused preparation, you can make significant progress. Prioritize the most critical skills and prepare to discuss how you're actively developing in these areas."
  } else {
    readiness = "high"
    honestFeedback =
      "You're well-positioned for this interview. Focus on refining your existing skills and preparing compelling examples of your experience. Be ready to demonstrate depth in your strongest areas."
  }

  // Determine focus areas
  const focusAreas = skillGapAnalysis.gapsIdentified.slice(0, 3)
  if (focusAreas.length < 3) {
    if (totalDays < 7) {
      focusAreas.push("Interview technique and STAR method responses")
    }
    focusAreas.push("Company-specific knowledge")
    focusAreas.push("Preparing thoughtful questions for interviewers")
  }

  return {
    readiness,
    focusAreas,
    honestFeedback,
  }
}

// Main function to create interview preparation plan
export async function createInterviewPrepPlan(
  userId: string,
  companyName: string,
  role: string,
  timeUntilInterview: string,
  jobDescription?: string,
): Promise<InterviewPrepPlan> {
  // Normalize inputs
  const normalizedRole = role.toLowerCase()
  const normalizedCompany = companyName.toLowerCase()

  // Extract required skills from job description
  const requiredSkills: string[] = []
  if (jobDescription) {
    // Simple extraction of skills from job description
    const skillKeywords = [
      "proficient in",
      "experience with",
      "knowledge of",
      "familiar with",
      "skills in",
      "expertise in",
      "background in",
      "understanding of",
    ]

    const sentences = jobDescription.split(/[.!?]/)
    for (const sentence of sentences) {
      for (const keyword of skillKeywords) {
        if (sentence.toLowerCase().includes(keyword)) {
          // Extract the skill after the keyword
          const index = sentence.toLowerCase().indexOf(keyword) + keyword.length
          const skillPart = sentence.substring(index).trim()
          // Take the first few words as the skill
          const skill = skillPart.split(/\s+/).slice(0, 3).join(" ").replace(/[,;]$/, "")
          if (skill && skill.length > 2) {
            requiredSkills.push(skill)
          }
        }
      }
    }
  }

  // If no skills extracted, use default skills for the role
  if (requiredSkills.length === 0) {
    // Find the closest role match
    let roleKey = "default"
    for (const key of Object.keys(commonTopicsByRole)) {
      if (normalizedRole.includes(key)) {
        roleKey = key
        break
      }
    }

    // Use technical topics as required skills
    requiredSkills.push(...commonTopicsByRole[roleKey].technical)
  }

  // Find role-specific topics
  let roleKey = "default"
  for (const key of Object.keys(commonTopicsByRole)) {
    if (normalizedRole.includes(key)) {
      roleKey = key
      break
    }
  }

  // Find company-specific patterns
  let companyKey = "default"
  for (const key of Object.keys(companyInterviewPatterns)) {
    if (normalizedCompany.includes(key)) {
      companyKey = key
      break
    }
  }

  // Generate mock questions
  const mockQuestions = generateMockQuestions(role, companyName)

  // Create preparation schedule
  const preparationSchedule = createPrepSchedule(timeUntilInterview, role)

  // Analyze skill gaps
  const skillGapAnalysis = await analyzeSkillGaps(userId, requiredSkills)

  // Generate overall assessment
  const overallAssessment = generateOverallAssessment(skillGapAnalysis, timeUntilInterview)

  // Create the complete preparation plan
  const prepPlan: InterviewPrepPlan = {
    companyName,
    role,
    timeUntilInterview,
    technicalTopics: commonTopicsByRole[roleKey].technical,
    behavioralTopics: commonTopicsByRole[roleKey].behavioral,
    companySpecificInfo: `${companyName} typically uses ${companyInterviewPatterns[companyKey].format}. They focus on ${companyInterviewPatterns[companyKey].focus.join(", ")}. ${companyInterviewPatterns[companyKey].uniqueAspects.join(" ")}`,
    mockQuestions,
    preparationSchedule,
    skillGapAnalysis,
    overallAssessment,
  }

  return prepPlan
}
