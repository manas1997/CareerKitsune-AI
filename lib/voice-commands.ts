import { getJobs, createApplication, getUserSkills, getJobsBySkills } from "./data-service"
import { createInterviewPrepPlan } from "./interview-prep-service"
import { humanLikeDelay, requireUserConfirmation } from "./safety-service"
import type { Job } from "@/types/job"
import type { InterviewPrepPlan } from "./interview-prep-service"

type CommandResponse = string

let cachedJobs: Job[] = []
let currentJobIndex = 0
let interviewPrepMode = false
let interviewPrepData: {
  companyName?: string
  role?: string
  timeUntilInterview?: string
  jobDescription?: string
  stage:
    | "initial"
    | "collecting_company"
    | "collecting_role"
    | "collecting_time"
    | "collecting_description"
    | "complete"
  plan?: InterviewPrepPlan
} = {
  stage: "initial",
}

export async function processVoiceCommand(command: string, userId?: string): Promise<CommandResponse> {
  // Convert command to lowercase for easier matching
  const lowerCommand = command.toLowerCase()

  // Check if we're in interview prep mode
  if (interviewPrepMode) {
    return await handleInterviewPrepCommand(lowerCommand, userId)
  }

  // Check for interview mentions
  if (
    containsAny(lowerCommand, ["interview in", "have an interview", "got an interview"]) &&
    containsTimeframe(lowerCommand)
  ) {
    interviewPrepMode = true
    interviewPrepData = {
      timeUntilInterview: extractTimeframe(lowerCommand),
      stage: "collecting_company",
    }

    return `I see you have an interview coming up ${interviewPrepData.timeUntilInterview}! I can help you prepare. First, what company is the interview with?`
  }

  // Check for greetings
  if (containsAny(lowerCommand, ["hello", "hi", "hey", "greetings"])) {
    return "Hello! I'm CareerKitsune-AI, your job application assistant. How can I help you today?"
  }

  // Check for job search commands
  if (containsAny(lowerCommand, ["find job", "search job", "look for job", "job search"])) {
    try {
      if (userId) {
        // Get user skills
        const skills = await getUserSkills(userId)

        if (skills.length > 0) {
          // Get jobs matching user skills
          const skillIds = skills.map((skill) => skill.id)

          // Add a human-like delay
          await humanLikeDelay(800, 1500)

          cachedJobs = await getJobsBySkills(skillIds, 5)

          if (cachedJobs.length > 0) {
            currentJobIndex = 0
            const job = cachedJobs[currentJobIndex]
            return `I found ${cachedJobs.length} jobs matching your skills. Here's the first one: ${job.title} at ${job.companies?.name || "a company"}. Would you like to hear more about this job?`
          } else {
            return "I couldn't find any jobs matching your skills. Try updating your skills in your profile or searching for different keywords."
          }
        } else {
          // Get recent jobs if no skills
          await humanLikeDelay(800, 1500)

          cachedJobs = await getJobs(5)

          if (cachedJobs.length > 0) {
            currentJobIndex = 0
            const job = cachedJobs[currentJobIndex]
            return `Here are some recent job postings. The first one is: ${job.title} at ${job.companies?.name || "a company"}. Would you like to hear more about this job?`
          } else {
            return "I couldn't find any jobs at the moment. Please try again later."
          }
        }
      } else {
        return "To search for jobs, please log in first."
      }
    } catch (error) {
      console.error("Error searching jobs:", error)
      return "I encountered an error while searching for jobs. Please try again later."
    }
  }

  // Check for next job command
  if (containsAny(lowerCommand, ["next job", "another job", "show me more"])) {
    if (cachedJobs.length === 0) {
      return "I don't have any jobs loaded. Try saying 'find jobs' first."
    }

    currentJobIndex = (currentJobIndex + 1) % cachedJobs.length
    const job = cachedJobs[currentJobIndex]
    return `Here's another job: ${job.title} at ${job.companies?.name || "a company"}. ${job.description.substring(0, 100)}... Would you like to hear more about this job?`
  }

  // Check for job details command
  if (containsAny(lowerCommand, ["tell me more", "job details", "more information"])) {
    if (cachedJobs.length === 0) {
      return "I don't have any jobs loaded. Try saying 'find jobs' first."
    }

    const job = cachedJobs[currentJobIndex]
    return `Here are the details for ${job.title} at ${job.companies?.name || "a company"}: 
      Location: ${job.location || (job.is_remote ? "Remote" : "Not specified")}. 
      Job Type: ${job.job_type}. 
      Experience Level: ${job.experience_level}. 
      Description: ${job.description.substring(0, 200)}... 
      Would you like to apply for this job?`
  }

  // Check for application commands
  if (containsAny(lowerCommand, ["apply", "submit application", "apply on my behalf"])) {
    if (!userId) {
      return "To apply for jobs, please log in first."
    }

    if (cachedJobs.length === 0) {
      return "I don't have any jobs loaded. Try saying 'find jobs' first."
    }

    if (lowerCommand.includes("apply on my behalf")) {
      const job = cachedJobs[currentJobIndex]

      // Get explicit confirmation before applying
      const confirmationMessage = requireUserConfirmation(
        "submit an application",
        `the ${job.title} position at ${job.companies?.name || "the company"}`,
      )

      // Store the job to apply for after confirmation
      return confirmationMessage
    } else if (lowerCommand.includes("yes, proceed")) {
      // User has confirmed the application
      const job = cachedJobs[currentJobIndex]

      try {
        // Add a human-like delay
        await humanLikeDelay(1500, 3000)

        // Create application in database
        await createApplication({
          job_id: job.id,
          user_id: userId,
          title: job.title,
          status: "Applied",
          is_read: false,
        })

        return `Great! I've submitted your application for the ${job.title} position at ${job.companies?.name || "the company"}. You can track the status of your application in the 'My Applications' section of your dashboard.`
      } catch (error) {
        console.error("Error applying for job:", error)
        return "I encountered an error while submitting your application. Please try again later."
      }
    }

    return "I can help you apply for jobs. To apply for the current job, say 'Apply on my behalf'."
  }

  // Check for resume commands
  if (containsAny(lowerCommand, ["resume", "upload resume", "update resume"])) {
    if (lowerCommand.includes("upload")) {
      return "To upload your resume, please click the 'Upload Resume' button in your profile section. Alternatively, you can say 'connect my LinkedIn' to import your profile data."
    }
    return "I can help you with your resume. Would you like to update it, review it, or use it for job applications?"
  }

  // Check for LinkedIn commands
  if (containsAny(lowerCommand, ["linkedin", "connect linkedin", "import linkedin"])) {
    return "To connect your LinkedIn profile, please click the 'Connect LinkedIn' button in your profile section. This will allow me to import your work history, skills, and education."
  }

  // Check for application status commands
  if (containsAny(lowerCommand, ["status", "application status", "check status"])) {
    return "I can check the status of your applications. You can view all your applications in the 'My Applications' tab. Would you like me to give you details about a specific one?"
  }

  // Check for help commands
  if (containsAny(lowerCommand, ["help", "what can you do", "capabilities"])) {
    return "I'm CareerKitsune-AI, your job application assistant. I can help you find jobs, apply to positions, manage your resume, track application status, or help you prepare for interviews. Just tell me what you need!"
  }

  // Default response for unrecognized commands
  return "I'm not sure I understand. You can ask me to find jobs, apply to positions, update your resume, check application status, or help you with your job search in other ways."
}

// Helper function to check if a string contains any of the phrases
function containsAny(text: string, phrases: string[]): boolean {
  return phrases.some((phrase) => text.includes(phrase))
}

// Helper function to check if text contains a timeframe
function containsTimeframe(text: string): boolean {
  return /\b\d+\s*(day|week|month)s?\b/i.test(text)
}

// Helper function to extract timeframe
function extractTimeframe(text: string): string {
  const match = text.match(/\b(\d+)\s*(day|week|month)s?\b/i)
  if (match) {
    return `in ${match[1]} ${match[2]}${Number.parseInt(match[1]) > 1 ? "s" : ""}`
  }
  return "soon"
}

// Handle interview prep mode commands
async function handleInterviewPrepCommand(command: string, userId?: string): Promise<CommandResponse> {
  if (!userId) {
    interviewPrepMode = false
    return "To use interview preparation features, please log in first."
  }

  switch (interviewPrepData.stage) {
    case "collecting_company":
      interviewPrepData.companyName = command
      interviewPrepData.stage = "collecting_role"
      return `Great! You're interviewing at ${command}. What role are you interviewing for?`

    case "collecting_role":
      interviewPrepData.role = command
      interviewPrepData.stage = "collecting_description"
      return `Got it! Do you have the job description you can share? If so, please paste it. If not, just say "no description".`

    case "collecting_description":
      if (command.toLowerCase() === "no description" || command.toLowerCase() === "no") {
        interviewPrepData.jobDescription = ""
      } else {
        interviewPrepData.jobDescription = command
      }

      interviewPrepData.stage = "complete"

      // Generate the interview prep plan
      try {
        // Add a human-like delay for processing
        await humanLikeDelay(2000, 4000)

        const plan = await createInterviewPrepPlan(
          userId,
          interviewPrepData.companyName || "Unknown",
          interviewPrepData.role || "Unknown",
          interviewPrepData.timeUntilInterview || "soon",
          interviewPrepData.jobDescription,
        )

        interviewPrepData.plan = plan

        // Create a summary response
        const response = `
I've created your interview preparation plan for the ${plan.role} position at ${plan.companyName}. Here's my honest assessment:

Readiness Level: ${plan.overallAssessment.readiness === "high" ? "High ✅" : plan.overallAssessment.readiness === "medium" ? "Medium ⚠️" : "Low ❌"}

Key Focus Areas:
${plan.overallAssessment.focusAreas.map((area) => `• ${area}`).join("\n")}

Technical Topics to Study:
${plan.technicalTopics
  .slice(0, 3)
  .map((topic) => `• ${topic}`)
  .join("\n")}

Behavioral Topics to Prepare:
${plan.behavioralTopics
  .slice(0, 3)
  .map((topic) => `• ${topic}`)
  .join("\n")}

Company-Specific Insights:
${plan.companySpecificInfo}

Preparation Schedule:
${plan.preparationSchedule[0].day}: ${plan.preparationSchedule[0].tasks.slice(0, 2).join(", ")}...

Honest Feedback:
${plan.overallAssessment.honestFeedback}

Would you like me to provide more details on any specific part of this plan?`

        return response
      } catch (error) {
        console.error("Error creating interview prep plan:", error)
        interviewPrepMode = false
        return "I encountered an error while creating your interview preparation plan. Please try again later."
      }

    case "complete":
      // Handle follow-up questions about the plan
      if (containsAny(command.toLowerCase(), ["technical", "topics", "study"])) {
        return `Here are all the technical topics you should focus on for your ${interviewPrepData.role} interview at ${interviewPrepData.companyName}:
${interviewPrepData.plan?.technicalTopics.map((topic, i) => `${i + 1}. ${topic}`).join("\n")}

I recommend focusing especially on ${interviewPrepData.plan?.technicalTopics.slice(0, 2).join(" and ")}.`
      }

      if (containsAny(command.toLowerCase(), ["behavioral", "questions", "star"])) {
        return `Here are key behavioral topics to prepare for your interview:
${interviewPrepData.plan?.behavioralTopics.map((topic, i) => `${i + 1}. ${topic}`).join("\n")}

And here are some sample behavioral questions:
${interviewPrepData.plan?.mockQuestions.behavioral.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Remember to use the STAR method (Situation, Task, Action, Result) when answering these questions.`
      }

      if (containsAny(command.toLowerCase(), ["schedule", "plan", "preparation"])) {
        return `Here's your detailed preparation schedule:
${interviewPrepData.plan?.preparationSchedule
  .map((day) => `${day.day}:\n${day.tasks.map((task) => `• ${task}`).join("\n")}`)
  .join("\n\n")}`
      }

      if (containsAny(command.toLowerCase(), ["mock", "practice", "interview questions"])) {
        return `Here are some mock interview questions to practice:

Technical Questions:
${interviewPrepData.plan?.mockQuestions.technical.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Behavioral Questions:
${interviewPrepData.plan?.mockQuestions.behavioral.map((q, i) => `${i + 1}. ${q}`).join("\n")}

I recommend practicing these out loud and recording yourself to review your answers.`
      }

      if (containsAny(command.toLowerCase(), ["skill", "gap", "weakness"])) {
        return `Based on my analysis, here are the skill gaps you should address:

Required Skills:
${interviewPrepData.plan?.skillGapAnalysis.requiredSkills.map((skill, i) => `${i + 1}. ${skill}`).join("\n")}

Gaps Identified:
${
  interviewPrepData.plan?.skillGapAnalysis.gapsIdentified.length
    ? interviewPrepData.plan?.skillGapAnalysis.gapsIdentified.map((gap, i) => `${i + 1}. ${gap}`).join("\n")
    : "No significant gaps identified!"
}

Recommendations:
${interviewPrepData.plan?.skillGapAnalysis.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join("\n")}`
      }

      if (containsAny(command.toLowerCase(), ["exit", "done", "finish", "thank"])) {
        interviewPrepMode = false
        return "I've exited interview preparation mode. You can access your plan anytime by asking about interview preparation. Good luck with your interview!"
      }

      return `I'm here to help with your interview preparation for ${interviewPrepData.role} at ${interviewPrepData.companyName}. You can ask about:
1. Technical topics to study
2. Behavioral questions to prepare
3. Your preparation schedule
4. Mock interview questions
5. Skill gaps and recommendations

Or say "exit" to leave interview preparation mode.`
  }

  // Fallback
  interviewPrepMode = false
  return "I've reset the interview preparation process. You can start again by mentioning your upcoming interview."
}
