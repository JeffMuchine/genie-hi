# Genie-Hi Implementation Tasks

## Relevant Files

### Backend
- `backend/main.py` - Entry point for the FastAPI application.
- `backend/app/core/config.py` - Configuration settings (env vars, constants).
- `backend/app/db/session.py` - Database connection and session management.
- `backend/app/models/user.py` - User database model.
- `backend/app/models/job.py` - Job and Application database models.
- `backend/app/api/v1/endpoints/auth.py` - Authentication endpoints.
- `backend/app/api/v1/endpoints/resume.py` - Resume upload and management endpoints.
- `backend/app/services/gemini_service.py` - Service for interacting with Google Gemini API.
- `backend/tests/test_auth.py` - Unit tests for authentication.
- `backend/tests/test_gemini.py` - Unit tests for AI generation.

### Frontend
- `frontend/src/App.tsx` - Main application component and routing.
- `frontend/src/components/layout/Sidebar.tsx` - Sidebar navigation component.
- `frontend/src/components/job/JobInput.tsx` - Component for adding jobs.
- `frontend/src/components/resume/ResumeUpload.tsx` - Component for resume upload.
- `frontend/src/features/application/ResumeValidator.tsx` - Diff tool interface.
- `frontend/src/features/application/CoverLetterStudio.tsx` - Cover letter editor.
- `frontend/src/api/client.ts` - Axios client for API requests.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

### Phase 0: Project Setup (Local Development)

- [ ] 0.0 Create feature branch and project structure
  - [ ] 0.1 Create and checkout branch `feature/genie-hi-init`
  - [ ] 0.2 Create directory structure: `backend/`, `frontend/`, `docs/`
  - [ ] 0.3 Initialize git repository (if not already done) and create `.gitignore`
- [ ] 1.0 Set up local development environment
  - [ ] 1.1 Set up Python virtual environment and install `fastapi`, `uvicorn`, `sqlalchemy`, `psycopg2-binary`, `python-multipart`, `google-generativeai`
  - [ ] 1.2 Set up Node.js environment and initialize React app (Vite + TypeScript)
  - [ ] 1.3 Install frontend dependencies: `axios`, `react-router-dom`, `styled-components` (or Tailwind if preferred), `framer-motion`
  - [ ] 1.4 Set up local PostgreSQL database `genie_hi_db`

### Phase 1: Backend Development (Local) - Build & Test All Features

- [ ] 2.0 Set up backend foundation (Python/FastAPI + PostgreSQL)
  - [ ] 2.1 Create `backend/main.py` with basic health check endpoint
  - [ ] 2.2 Configure database connection in `backend/app/db/session.py`
  - [ ] 2.3 Create `backend/tests/conftest.py` for test fixtures
  - [ ] 2.4 Verify server runs locally (`uvicorn backend.main:app --reload`)
- [x] 3.0 Implement authentication system with Google OAuth + Tests
  - [x] 3.1 Create User model in `backend/app/models/user.py`
  - [x] 3.2 Implement Google OAuth flow in `backend/app/api/v1/endpoints/auth.py`
  - [x] 3.3 Implement JWT token generation and validation
  - [x] 3.4 Create `backend/tests/test_auth.py` and add tests for login/logout/session
  - [x] 3.5 Run tests: `pytest backend/tests/test_auth.py`
- [x] 4.0 Implement database models and migrations + Tests
  - [x] 4.1 Define models: `Resume`, `Job`, `Application`, `Subscription`
  - [x] 4.2 Set up Alembic for migrations
  - [x] 4.3 Generate and apply initial migration
  - [x] 4.4 Verify schema in local PostgreSQL
- [x] 5.0 Implement Resume API endpoints + Tests
  - [x] 5.1 Create endpoint `POST /api/resume/upload` (file handling)
  - [x] 5.2 Create endpoint `GET /api/resume` (fetch latest)
  - [x] 5.3 Implement resume parsing logic (text extraction)
  - [x] 5.4 Create `backend/tests/test_resume.py` and verify upload/fetch
- [x] 6.0 Implement Job Management API endpoints + Tests
  - [x] 6.1 Create endpoint `POST /api/jobs` (add job URL/text)
  - [x] 6.2 Implement basic scraping/parsing for Job Title/Company
  - [x] 6.3 Create endpoint `GET /api/jobs` (list jobs)
  - [x] 6.4 Create `backend/tests/test_jobs.py` and verify CRUD operations
- [x] 7.0 Integrate Gemini API for content generation + Tests
  - [x] 7.1 Configure Google Gemini API key in `config.py`
  - [x] 7.2 Create `backend/app/services/gemini_service.py`
  - [x] 7.3 Implement prompt templates for Resume Insights and Tailoring
  - [x] 7.4 Create `backend/tests/test_gemini.py` (mock API calls)
- [x] 8.0 Implement Application Generation API (resume & cover letter) + Tests
  - [x] 8.1 Create endpoint `POST /api/applications/generate`
  - [x] 8.2 Implement logic to generate tailored resume content
  - [x] 8.3 Implement logic to generate cover letter content
  - [x] 8.4 Create `backend/tests/test_generation.py` and verify output structure
- [ ] 9.0 Implement Resume Validator API (diff/accept/reject) + Tests
  - [ ] 9.1 Create endpoint `GET /api/applications/{id}/diff`
  - [ ] 9.2 Create endpoint `PATCH /api/applications/{id}/section` (accept/reject)
  - [ ] 9.3 Implement logic to apply accepted changes to final resume
  - [ ] 9.4 Verify diff logic with tests
- [ ] 10.0 Implement Cover Letter Studio API + Tests
  - [ ] 10.1 Create endpoint `PATCH /api/applications/{id}/cover-letter` (save edits)
  - [ ] 10.2 Create endpoint `POST /api/applications/{id}/regenerate` (new params)
  - [ ] 10.3 Verify edit persistence with tests
- [ ] 11.0 Implement Download/Export API + Tests
  - [ ] 11.1 Create endpoint `GET /api/applications/{id}/download`
  - [ ] 11.2 Implement file generation (PDF/DOCX) and zipping
  - [ ] 11.3 Verify file download with tests
- [ ] 12.0 Implement Account & Subscription API + Tests
  - [ ] 12.1 Create endpoints for subscription status and plan management
  - [ ] 12.2 Create placeholder endpoints for Payment (Stripe/Venmo)
  - [ ] 12.3 Verify account endpoints with tests
- [ ] 13.0 Backend verification - Run all tests and verify all features work
  - [ ] 13.1 Run full test suite: `pytest backend/tests/`
  - [ ] 13.2 Fix any failing tests
  - [ ] 13.3 Verify API documentation (Swagger UI) is complete

### Phase 2: Frontend Development (Local) - Build UI/UX

- [ ] 14.0 Set up React frontend application structure
  - [ ] 14.1 Configure global styles (CSS Modules/Styled Components)
  - [ ] 14.2 Set up API client interceptors (Axios)
  - [ ] 14.3 Create shared UI components (Button, Card, Modal, Input)
- [ ] 15.0 Implement visual identity and design system
  - [ ] 15.1 Define color palette (#6F38C5, #87A2FB, etc.)
  - [ ] 15.2 Create layout wrapper (Sidebar + Main Content)
- [ ] 16.0 Implement authentication UI (Google OAuth login)
  - [ ] 16.1 Create Login page with "Sign in with Google" button
  - [ ] 16.2 Implement auth state management (Context/Redux)
- [ ] 17.0 Implement sidebar navigation and routing
  - [ ] 17.1 Configure `react-router-dom` routes
  - [ ] 17.2 Build Sidebar component with active state highlighting
- [ ] 18.0 Implement Progress Tracker component
  - [ ] 18.1 Create visual progress bar (3 steps)
  - [ ] 18.2 Implement step transition logic
- [ ] 19.0 Implement Job Application Flow - Step 1 (Job Input UI)
  - [ ] 19.1 Build Job Input Bar and "+ Add" button
  - [ ] 19.2 Build Job List view (Cards with Title/Company)
  - [ ] 19.3 Implement "Generate" button state logic
- [ ] 20.0 Implement Resume Upload UI and Insights Display
  - [ ] 20.1 Build Resume Upload Modal (Drag & Drop)
  - [ ] 20.2 Build Insights Summary component (Experience + Note)
- [ ] 21.0 Implement AI Generation Loading Overlay
  - [ ] 21.1 Create overlay with rotating messages
  - [ ] 21.2 Implement mock timer/progress for visual feedback
- [ ] 22.0 Implement Resume Validator UI (Diff Tool)
  - [ ] 22.1 Build Split View Modal (Original vs Tailored)
  - [ ] 22.2 Implement Section Accept/Reject buttons
  - [ ] 22.3 Implement visual diff highlighting
- [ ] 23.0 Implement Cover Letter Studio UI
  - [ ] 23.1 Build Editor Layout (Text Area + Controls Sidebar)
  - [ ] 23.2 Implement Tone/Length/Highlights controls
  - [ ] 23.3 Implement "Regenerate" and "LGTM" actions
- [ ] 24.0 Implement Review & Edit Interface
  - [ ] 24.1 Build Job Card list with "Review" buttons
  - [ ] 24.2 Implement selection highlighting logic
- [ ] 25.0 Implement Download & Completion Flow UI
  - [ ] 25.1 Build Final View with "Download Package" buttons
  - [ ] 25.2 Implement download action handler
- [ ] 26.0 Implement Account & Subscription Management UI
  - [ ] 26.1 Build Account Dashboard (Resume, Plan, Payments)
  - [ ] 26.2 Implement Upgrade/Cancel UI mocks
- [ ] 27.0 Implement placeholder features UI (Chat, Scoreboard, Referral)
  - [ ] 27.1 Create simple placeholder views for secondary tabs
- [ ] 28.0 **USER REVIEW CHECKPOINT** - Review frontend flow/views
  - [ ] 28.1 Walkthrough of UI without backend connection (mock data)
  - [ ] 28.2 Incorporate user feedback on design/flow

### Phase 3: Integration & Local Testing

- [ ] 29.0 Connect frontend to backend APIs
  - [ ] 29.1 Update API client to point to local backend
  - [ ] 29.2 Replace mock data with real API calls
- [ ] 30.0 Implement end-to-end authentication flow
  - [ ] 30.1 Verify Google Login -> Backend Session -> Frontend State
- [ ] 31.0 Implement complete Job Application workflow integration
  - [ ] 31.1 Test Job Add -> Upload Resume -> Generate -> Review -> Download
- [ ] 32.0 Test all user flows locally
  - [ ] 32.1 Manual testing of happy path
  - [ ] 32.2 Manual testing of edge cases (no resume, API errors)
- [ ] 33.0 Fix integration bugs and polish UX
  - [ ] 33.1 Address any CORS issues or data format mismatches
  - [ ] 33.2 Refine loading states and error messages
- [ ] 34.0 **USER TESTING CHECKPOINT** - Test in local web browser
  - [ ] 34.1 User performs full end-to-end test on local machine
  - [ ] 34.2 Fix any issues reported by user

### Phase 4: Deployment to Google Cloud (After User Approval)

- [ ] 35.0 **AWAITING USER GO** - Wait for deployment approval
- [ ] 36.0 Set up Google Cloud project and resources
  - [ ] 36.1 Create GCP Project
  - [ ] 36.2 Enable APIs: Cloud Run, Cloud Build, SQL Admin, Secret Manager
- [ ] 37.0 Configure Cloud SQL (PostgreSQL) instance
  - [ ] 37.1 Create PostgreSQL instance
  - [ ] 37.2 Create production database and user
- [ ] 38.0 Set up Secret Manager for API keys
  - [ ] 38.1 Store DB credentials, Gemini Key, OAuth Client Secret
- [ ] 39.0 Create Docker containers for backend and frontend
  - [ ] 39.1 Create `backend/Dockerfile`
  - [ ] 39.2 Create `frontend/Dockerfile` (nginx serving build)
  - [ ] 39.3 Test builds locally
- [ ] 40.0 Deploy to Google Cloud Run
  - [ ] 40.1 Deploy Backend Service (connect to Cloud SQL & Secrets)
  - [ ] 40.2 Deploy Frontend Service
- [ ] 41.0 Configure domain and SSL certificates
  - [ ] 41.1 Map custom domain (if available) or use Cloud Run URLs
- [ ] 42.0 Set up Cloud Monitoring and Logging
  - [ ] 42.1 Verify logs are appearing in Cloud Logging

### Phase 5: Production Testing & Final Fixes

- [ ] 43.0 Test application on public internet
  - [ ] 43.1 Verify access from public URL
  - [ ] 43.2 Verify OAuth works in production (update redirect URIs)
- [ ] 44.0 Bug fixes and performance optimization
  - [ ] 44.1 Address any production-specific issues
- [ ] 45.0 Security audit and final production readiness checks
  - [ ] 45.1 Verify debug mode is off
  - [ ] 45.2 Verify database backups are enabled
- [ ] 46.0 Production launch ✅

