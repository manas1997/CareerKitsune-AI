/**
 * Safety service to ensure ethical and safe automation of job applications
 * This service implements best practices to avoid being flagged as a bot
 */

// Random delay between actions to simulate human behavior
export function humanLikeDelay(minMs = 1000, maxMs = 3000): Promise<void> {
  const delay = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs
  return new Promise((resolve) => setTimeout(resolve, delay))
}

// Check if a site allows automation via robots.txt
export async function checkRobotsPermission(domain: string, path: string): Promise<boolean> {
  try {
    const response = await fetch(`https://${domain}/robots.txt`)
    if (!response.ok) return true // If no robots.txt, assume allowed

    const text = await response.text()

    // Simple robots.txt parser
    const lines = text.split("\n")
    let userAgentApplies = false

    for (const line of lines) {
      const trimmed = line.trim().toLowerCase()

      if (trimmed.startsWith("user-agent:")) {
        // Check if rule applies to us or all agents
        const agent = trimmed.substring("user-agent:".length).trim()
        userAgentApplies = agent === "*" || agent === "careerkitsune-ai"
      } else if (userAgentApplies && trimmed.startsWith("disallow:")) {
        const disallowedPath = trimmed.substring("disallow:".length).trim()
        if (path.startsWith(disallowedPath)) {
          return false // Path is disallowed
        }
      }
    }

    return true // No disallow rule found for this path
  } catch (error) {
    console.error("Error checking robots.txt:", error)
    return false // Be conservative on error
  }
}

// Rate limiting for API calls
const rateLimits: Record<string, { lastCall: number; maxCallsPerMinute: number; calls: number[] }> = {}

export async function respectRateLimit(domain: string): Promise<boolean> {
  if (!rateLimits[domain]) {
    // Default rate limits
    rateLimits[domain] = {
      lastCall: 0,
      maxCallsPerMinute: 20, // Conservative default
      calls: [],
    }
  }

  const now = Date.now()
  const limit = rateLimits[domain]

  // Remove calls older than 1 minute
  limit.calls = limit.calls.filter((time) => now - time < 60000)

  if (limit.calls.length >= limit.maxCallsPerMinute) {
    return false // Rate limit exceeded
  }

  // Add current call
  limit.calls.push(now)
  limit.lastCall = now

  return true
}

// Secure credential handling
export function secureCredentialHandling(action: string, site: string): { allowed: boolean; message: string } {
  // Only allow OAuth or token-based auth
  if (action === "store_password") {
    return {
      allowed: false,
      message: `For security reasons, we don't store passwords for ${site}. We'll use secure OAuth authentication instead.`,
    }
  }

  if (action === "oauth_login") {
    return {
      allowed: true,
      message: `Securely authenticating with ${site} using OAuth...`,
    }
  }

  return {
    allowed: true,
    message: "Action allowed",
  }
}

// Check if an action is allowed by Terms of Service
export function checkTermsOfService(site: string, action: string): { allowed: boolean; message: string } {
  const knownViolations: Record<string, string[]> = {
    "linkedin.com": ["bulk_scraping", "automated_login_without_oauth", "mass_applications"],
    "indeed.com": ["bulk_scraping", "automated_login_without_oauth", "mass_applications"],
    "glassdoor.com": ["bulk_scraping", "automated_login_without_oauth"],
  }

  if (knownViolations[site] && knownViolations[site].includes(action)) {
    return {
      allowed: false,
      message: `The action "${action}" violates the Terms of Service for ${site}. We'll help you find an alternative approach.`,
    }
  }

  return {
    allowed: true,
    message: "Action allowed by Terms of Service",
  }
}

// Get user confirmation before taking action
export function requireUserConfirmation(action: string, details: string): string {
  return `I'm about to ${action} for ${details}. Please confirm by saying "Yes, proceed" or provide additional instructions.`
}

// Detect if automation is being blocked
export function detectBlockedAutomation(response: any): boolean {
  // Check for common signs of automation blocking
  const blockSignals = [
    response.status === 403,
    response.status === 429,
    response.body?.includes("captcha"),
    response.body?.includes("automated"),
    response.body?.includes("suspicious"),
    response.body?.includes("unusual activity"),
  ]

  return blockSignals.some((signal) => signal === true)
}

// Fallback to manual mode
export function fallbackToManual(site: string, action: string): string {
  return `I've detected that ${site} may be blocking automated ${action}. Would you like me to:
  1. Guide you through doing this manually
  2. Try again with a different approach
  3. Skip this step for now`
}
