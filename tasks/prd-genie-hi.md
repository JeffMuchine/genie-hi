# Product Requirements Document: Genie-Hi

## Introduction/Overview

Genie-Hi is an AI-powered job application assistant that helps users create tailored resumes and cover letters for multiple job applications. The platform leverages Google's Gemini API to generate personalized application materials, allowing users to efficiently apply to multiple positions with customized content for each opportunity.

**Problem Statement:** Job seekers struggle to customize their resumes and cover letters for each application, leading to generic submissions that may not highlight the most relevant experience for each position.

**Solution:** Genie-Hi streamlines the job application process by automatically generating tailored resumes and cover letters based on job descriptions, while giving users full control to review, edit, and approve all changes before downloading.

## Goals

1. Enable users to apply to multiple jobs with personalized, AI-generated resumes and cover letters
2. Provide transparent, reviewable changes to resume content through a diff-based validation system
3. Offer flexible cover letter customization through an intuitive editing studio
4. Deliver a seamless, encouraging user experience from job input to final download
5. Establish a foundation for future monetization through subscription tiers
6. Deploy a production-ready application on Google Cloud Run

## User Stories

### Primary User Flow
**As a job seeker**, I want to input multiple job postings and receive tailored resumes and cover letters for each, so that I can apply to multiple positions efficiently with personalized application materials.

**Acceptance Criteria:**
- I can add jobs via URL or text input
- The system extracts job title and company name automatically
- I can upload my base resume in various formats (PDF, .docx, .docs)
- I receive personalized resume and cover letter for each job
- I can review and modify all changes before downloading
- I can download a complete package (resume + cover letter) per job

### Resume Validation
**As a user**, I want to see exactly what changes were made to my resume for each job, so that I can approve or reject specific modifications while maintaining control over my personal brand.

**Acceptance Criteria:**
- I see a side-by-side comparison (original vs. tailored)
- Changes are organized into logical sections
- I can accept or reject changes per section with clear buttons
- Rejected changes revert to original content
- Accepted changes are saved to the tailored resume

### Cover Letter Customization
**As a user**, I want to customize the tone, length, and highlights of my cover letter, so that it matches my personal style and the specific job opportunity.

**Acceptance Criteria:**
- I can directly edit cover letter text
- I can adjust tone (Referral blurb, Chat Message, Formal Email)
- I can set length preference (Short, Medium, Long)
- I can specify custom highlights
- I can regenerate with new parameters or approve the final version
- All edits and control settings are saved

### Account Management
**As a returning user**, I want to manage my account, subscription, and payment methods, so that I can upgrade my plan and track my usage.

**Acceptance Criteria:**
- I can sign in using my Google account
- I can view my current subscription tier
- I can see my uploaded resume
- I can view payment history
- I can upgrade or cancel my subscription
- I can select payment method (Stripe or Venmo)

## Functional Requirements

### FR1: Authentication & Authorization
1.1. System must support Google OAuth 2.0 social login  
1.2. System must create and maintain user sessions securely  
1.3. System must associate all user data (resumes, jobs, generated content) with authenticated user accounts  
1.4. System must redirect unauthenticated users to login when accessing protected routes

### FR2: Job Input & Management (Step 1)
2.1. System must provide an input field with "+ Add" button for adding jobs  
2.2. System must accept both URL and plain text input for job descriptions  
2.3. System must extract and display job title and company name from input  
2.4. System must display added jobs as cards showing only job title and company name  
2.5. System must enable users to add multiple jobs before generating  
2.6. System must provide a "Generate" button that becomes active when at least one job is added

### FR3: Resume Upload & Management (Step 2, Action #1)
3.1. System must detect if user has an existing resume in the database  
3.2. System must trigger a popup modal for resume upload if no resume exists when "Generate" is clicked  
3.3. System must accept resume uploads in formats: .pdf, .docx, .txt, .json, .docs  
3.4. System must parse and store resume content for processing  
3.5. System must display uploaded resume link above job input bar after successful upload  
3.6. System must generate and display resume insights including:
   - User's experience level
   - Brief encouraging note (max 2 sentences)

### FR4: AI Generation Process (Step 2, Action #2)
4.1. System must show a semi-transparent overlay during generation  
4.2. Overlay must rotate through informational content:
   - Real-time progress: "Processing Job X of Y..."
   - Job-specific insights: "Your experience is a strong fit for [Job]..."
   - Pro tips: "Tip: Quantify your achievements..."
   - Product advocacy: "Do you know you can build your resume in the Resume Tab..."  
4.3. System must integrate with Gemini API for AI-powered content generation  
4.4. System must enforce rate limits for free tier accounts  
4.5. System must automatically transition to Review & Edit view upon completion  
4.6. System must update progress bar to Step 2 after generation completes

### FR5: Resume Validator - Diff Tool (Feature A)
5.1. System must display full-screen split modal with original (left) and tailored (right) resumes  
5.2. System must organize tailored resume into logical sections  
5.3. System must provide "Accept" and "Reject" buttons for each section  
5.4. System must revert rejected sections to original content  
5.5. System must maintain accepted changes in tailored resume  
5.6. System must save user decisions (accept/reject) to database  
5.7. System must allow users to exit validator and return to Review & Edit view

### FR6: Cover Letter Studio (Feature B)
6.1. System must open editor with left panel (editable text) and right panel (controls)  
6.2. System must allow direct text editing in left panel  
6.3. System must provide tone controls: Referral blurb, Chat Message, Formal Email  
6.4. System must provide length controls: Short, Medium, Long  
6.5. System must provide user-defined highlights field  
6.6. System must display two action buttons: "Regenerate" and "LGTM"  
6.7. "Regenerate" must trigger new AI generation using adjusted controls  
6.8. "LGTM" must save all edits and controls, then return to Review & Edit view  
6.9. System must pass all control values to Gemini API prompts for regeneration

### FR7: Review & Edit Interface (Feature C)
7.1. System must display job cards in rows after generation  
7.2. Each job card must show "Review Resume" and "Review Cover Letter" buttons  
7.3. Clicking job card must highlight entire card section in color #ADDDD0  
7.4. System must track which job is currently selected  
7.5. System must provide "Finish Review & Proceed" button at bottom of page

### FR8: Download & Completion (Step 3)
8.1. System must transition to final download view when "Finish Review & Proceed" is clicked  
8.2. System must update progress bar to Step 3  
8.3. System must display all jobs with "Download Package" buttons  
8.4. System must bundle resume and cover letter for each job into a downloadable folder  
8.5. Folder must be named: "[Job Title] + [Company Name]"  
8.6. System must store folder files locally on server (with cloud migration path planned)

### FR9: Progress Tracker
9.1. System must display visual progress bar at top of Job Application view  
9.2. Progress bar must show 3 steps: "Add Job Links", "Review Resume/Cover Letter", "Ready to Download"  
9.3. Active step must be highlighted in color #6F38C5  
9.4. Inactive steps must be shown in color #EEEEE  
9.5. System must update active step based on user's current state in the flow

### FR10: Account & Subscription Management
10.1. System must provide dedicated "Account" view accessible from sidebar  
10.2. System must display latest uploaded resume for logged-in user  
10.3. System must allow resume upload if none exists  
10.4. System must display current subscription plan (e.g., "Free Tier")  
10.5. System must show available payment methods: Stripe and Venmo  
10.6. System must provide UI for plan upgrade and cancellation  
10.7. System must display payment history as a table/list of past transactions  
10.8. System must integrate with payment provider APIs for transaction processing

### FR11: Sidebar Navigation
11.1. System must provide left sidebar with navigation links  
11.2. Primary tabs must include:
   - Job Application (fully functional)
   - Account & Subscription (fully functional)  
11.3. Placeholder tabs must include:
   - Resume Chatbot (simple chat UI placeholder)
   - Insight Scoreboard (visual graph placeholder)
   - Referral (social share buttons placeholder)  
11.4. System must highlight active tab in sidebar

### FR12: Visual Identity & Design
12.1. System must use color palette: #6F38C5 (primary), #87A2FB, #ADDDD0, #EEEEE  
12.2. Layout must follow: Sidebar navigation (left) + Main content area (right)  
12.3. Design must convey: Clean, professional, encouraging, and modern vibe  
12.4. All UI components must be responsive and mobile-friendly

## Non-Goals (Out of Scope)

1. **Custom ML Model Training:** Using pre-built Gemini API, not training custom models
2. **Multi-language Support:** English only for MVP
3. **Resume Templates:** No visual resume template selection (content focus only)
4. **Job Search Integration:** No job board scraping or search functionality
5. **Email Integration:** No direct email sending to employers
6. **Mobile Native Apps:** Web application only; responsive design but no iOS/Android apps
7. **Team/Collaboration Features:** Single-user experience only
8. **ATS Scoring:** No Applicant Tracking System compatibility scoring
9. **Interview Preparation:** Focus on application materials only
10. **Cloud Storage (Initial Launch):** Starting with local file storage, cloud migration planned for future

## Design Considerations

### UI/UX Requirements
- **Progress Visibility:** Always show progress bar at top to orient users
- **Encouraging Tone:** Use positive, supportive language in insights and tips
- **Visual Feedback:** Highlight selected items, show loading states, provide success confirmations
- **Error Handling:** Graceful error messages with suggested actions
- **Accessibility:** Keyboard navigation, ARIA labels, sufficient color contrast

### Component Architecture
- Reusable React components for job cards, modals, buttons, forms
- Consistent styling using CSS modules or styled-components
- State management using React Context or Redux for complex state

### Key User Flows
1. **First-time User:** Login → Upload Resume → Add Jobs → Generate → Review → Download
2. **Returning User:** Login → Add Jobs → Generate (resume on file) → Review → Download
3. **Account Management:** Login → Navigate to Account → Update subscription/payment

## Technical Considerations

### Technology Stack
- **Frontend:** React (TypeScript recommended for type safety)
- **Backend:** Python (FastAPI or Flask for REST API)
- **Database:** PostgreSQL for structured data (users, jobs, subscriptions)
- **AI Integration:** Google Gemini API
- **Authentication:** Google OAuth 2.0
- **Payment Processing:** Stripe and Venmo integrations
- **File Storage:** Local file system (initial), Google Cloud Storage (planned migration)
- **Deployment:** Google Cloud Run (containerized with Docker)
- **Version Control:** Git

### Backend Architecture
- RESTful API design with clear endpoint naming
- Separate services for: Auth, Job Processing, Resume Handling, Cover Letter Generation
- Database models for: Users, Resumes, Jobs, Applications, Subscriptions, Payments
- Background job processing for AI generation (consider Cloud Tasks or Pub/Sub)
- Rate limiting middleware for free tier accounts

### Data Contracts (Backend → Frontend)

#### User Object
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "profile_picture": "string (URL)",
  "subscription_tier": "free | basic | premium",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

#### Resume Object
```json
{
  "id": "string",
  "user_id": "string",
  "file_path": "string",
  "uploaded_at": "timestamp",
  "insights": {
    "experience_level": "entry | mid | senior | executive",
    "encouraging_note": "string"
  }
}
```

#### Job Object
```json
{
  "id": "string",
  "user_id": "string",
  "job_title": "string",
  "company_name": "string",
  "job_description": "string (full text)",
  "source_url": "string (optional)",
  "added_at": "timestamp"
}
```

#### Application Object
```json
{
  "id": "string",
  "user_id": "string",
  "job_id": "string",
  "resume_id": "string",
  "tailored_resume": {
    "sections": [
      {
        "section_id": "string",
        "title": "string",
        "original_content": "string",
        "tailored_content": "string",
        "status": "accepted | rejected | pending"
      }
    ]
  },
  "cover_letter": {
    "content": "string",
    "tone": "referral | chat | formal",
    "length": "short | medium | long",
    "highlights": ["string"],
    "version": "number"
  },
  "status": "draft | ready | downloaded",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

#### Subscription Object
```json
{
  "id": "string",
  "user_id": "string",
  "plan": "free | basic | premium",
  "status": "active | cancelled | expired",
  "payment_method": "stripe | venmo",
  "next_billing_date": "timestamp",
  "created_at": "timestamp"
}
```

#### Payment Transaction Object
```json
{
  "id": "string",
  "user_id": "string",
  "amount": "number",
  "currency": "USD",
  "payment_method": "stripe | venmo",
  "status": "succeeded | pending | failed",
  "description": "string",
  "created_at": "timestamp"
}
```

### API Endpoints (Key Routes)

**Authentication:**
- `POST /auth/google` - Initiate Google OAuth flow
- `POST /auth/callback` - Handle OAuth callback
- `POST /auth/logout` - End user session

**Resume:**
- `GET /api/resume` - Get user's current resume
- `POST /api/resume/upload` - Upload new resume
- `GET /api/resume/insights` - Get resume insights

**Jobs:**
- `POST /api/jobs` - Add new job (accepts URL or text)
- `GET /api/jobs` - List user's jobs
- `DELETE /api/jobs/{job_id}` - Remove job

**Applications:**
- `POST /api/applications/generate` - Generate tailored materials for all jobs
- `GET /api/applications` - List all applications
- `GET /api/applications/{app_id}` - Get specific application details
- `PATCH /api/applications/{app_id}/resume-section` - Update section approval status
- `PATCH /api/applications/{app_id}/cover-letter` - Update cover letter
- `POST /api/applications/{app_id}/regenerate-cover-letter` - Regenerate with new controls
- `GET /api/applications/{app_id}/download` - Download application package

**Account:**
- `GET /api/account` - Get account details
- `PATCH /api/account` - Update account settings
- `GET /api/account/subscription` - Get subscription details
- `POST /api/account/subscription/upgrade` - Upgrade plan
- `POST /api/account/subscription/cancel` - Cancel subscription
- `GET /api/account/payments` - Get payment history

### Gemini API Integration
- Use rate limiting to prevent API abuse on free tier
- Implement retry logic with exponential backoff
- Cache parsed resume data to minimize API calls
- Structure prompts to include:
  - Original resume content
  - Job description
  - User controls (tone, length, highlights for cover letters)
  - Section-specific instructions for tailored resumes

### Security Considerations
- Secure OAuth token storage and refresh
- HTTPS only in production
- Input validation and sanitization for all user inputs
- SQL injection prevention (use parameterized queries)
- File upload validation (size limits, type checking, virus scanning)
- Rate limiting on all API endpoints
- CORS configuration for frontend domain only

### Deployment Architecture (Google Cloud Run)
- Containerize backend (Python) and frontend (React build) separately
- Set up Cloud SQL (PostgreSQL) instance
- Configure Secret Manager for API keys (Gemini, OAuth, payment providers)
- Set up Cloud Storage bucket for future file migration
- Configure Cloud Load Balancer for routing
- Implement Cloud Armor for DDoS protection
- Set up Cloud Monitoring and Logging

### Performance Targets
- API response time: < 200ms for standard requests
- AI generation time: < 30 seconds total for batch processing
- Page load time: < 2 seconds
- Support concurrent users: 100+ (scalable with Cloud Run auto-scaling)

## Success Metrics

### User Engagement
- Number of jobs processed per user per session (Target: 3-5)
- Time spent in Review & Edit phase (Target: 5-10 minutes)
- Resume validator acceptance rate (Target: >70% sections accepted)
- Cover letter regeneration rate (Target: <2 regenerations per job)
- Return user rate (Target: 30% within 30 days)

### Conversion
- Free to paid conversion rate (Target: 5% within 90 days)
- Subscription retention rate (Target: 80% monthly)
- Average revenue per user (ARPU)

### Quality
- User satisfaction score (Target: 4.5/5 via in-app survey)
- Download completion rate (Target: >85% of users who reach Step 3)
- Cover letter edit depth (target: <30% text changed indicates good AI quality)

### Technical Performance
- API uptime (Target: 99.9%)
- Error rate (Target: <1% of requests)
- P95 latency (Target: <500ms for API calls)
- Gemini API success rate (Target: >98%)

### All Metrics Equally Important
Track and optimize across all four categories (Engagement, Conversion, Quality, Technical) to ensure balanced product growth.

## Open Questions

1. **Free Tier Limits:** What specific rate limits should apply to free accounts? (e.g., 5 jobs per day, 10 jobs per month?)

2. **Resume Parsing:** Should we build custom resume parsing logic or integrate with a third-party parsing service for better accuracy?

3. **Data Retention:** How long should we retain generated resumes and cover letters? Should users have unlimited storage or tier-based limits?

4. **Placeholder Features:** What is the timeline for converting placeholder tabs (Resume Chatbot, Insight Scoreboard, Referral) into full features?

5. **Analytics:** What additional user behavior tracking is needed beyond success metrics? (e.g., heatmaps, session recordings)

6. **Email Notifications:** Should we send email confirmations/reminders (e.g., "Your applications are ready!", subscription renewal reminders)?

7. **Export Formats:** Beyond folder download, should we support other export options? (e.g., email to self, direct save to Google Drive/Dropbox)

8. **Mobile Experience:** Given responsive design, are there specific mobile optimizations needed for the Review & Edit flow?

9. **A/B Testing:** Which features should we A/B test first? (e.g., cover letter tone options, insight messaging, progress bar design)

10. **Internationalization:** While English-only for MVP, should we architect for future i18n support from the start?

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-25  
**Owner:** Product Team  
**Status:** Ready for Review
