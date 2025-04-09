# CareerKitsune-AI

CareerKitsune-AI is an intelligent voice assistant designed to help users apply to jobs with zero hassle. The application provides a seamless experience for job searching, application submission, and interview preparation.

## Features

### Voice Interaction
- Natural language processing for job search and application
- Voice commands for navigating the application
- Text-to-speech for assistant responses

### Job Search and Application
- Personalized job recommendations based on user skills
- Ethical and safe job application automation
- Application tracking and status updates

### Interview Preparation
- Customized interview preparation plans
- Company-specific interview insights
- Technical and behavioral question preparation
- Skill gap analysis and recommendations

### User Authentication
- Secure user authentication with Supabase
- Profile management
- Resume and LinkedIn integration

## Ethical Automation

CareerKitsune-AI follows strict ethical guidelines for job application automation:

1. Human-like behavior with randomized delays
2. Respect for robots.txt and API rate limits
3. Use of officially supported APIs where possible
4. No bulk scraping or automated logins that violate Terms of Service
5. Secure credential handling with OAuth
6. Explicit user confirmation before taking actions
7. Fallback modes for manual intervention when needed

## Technology Stack

- Next.js for the frontend and API routes
- Supabase for authentication and database
- Tailwind CSS for styling
- shadcn/ui for UI components
- Web Speech API for voice recognition and synthesis

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables
4. Run the development server with `npm run dev`

## Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

## License

MIT
