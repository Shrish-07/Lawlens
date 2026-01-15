# LawLens: AI-Powered Legal Document Summarizer

## Overview
LawLens is a full-stack web application that enables users to upload legal PDFs, generate AI-driven summaries, and manage documents securely. Developed over five weeks as a personal project, it applies computer science techniques—such as natural language processing and API development—to address challenges in political science, like making complex statutes and case law more accessible for policy research and civic engagement. This intersection highlights how technology can democratize legal information, fostering informed public discourse.

By showcasing robust code, from backend database integration to frontend user interfaces, LawLens demonstrates problem-solving skills, technical proficiency, and a commitment to impactful applications. The project solves real-world inefficiencies in document analysis, with potential for expansion into semantic search or multi-user collaboration.

## Features
- **Secure Authentication**: User signup/login with JWT tokens and bcrypt hashing for data protection.
- **Document Management**: Upload, list, download, and delete PDFs, with ownership tied to user accounts.
- **AI Summarization**: Text extraction via PyPDF, followed by chunked summarization using Hugging Face's DistilBART model to handle lengthy documents efficiently.
- **Database Persistence**: SQLAlchemy and SQLModel for storing user and metadata in SQLite, ensuring scalability.
- **File Cleanup**: Utilities to purge expired or unused files, maintaining system integrity.
- **Deployment Support**: Configured for platforms like Render, with environment variables for customization.

## Technology Stack
### Backend
- Framework: FastAPI (for efficient API routing and validation)
- Database: SQLite with SQLAlchemy/SQLModel ORM
- NLP: Hugging Face Transformers (DistilBART summarizer), Sentence Transformers (embeddings setup)
- PDF Handling: PyPDF
- Security: PyJWT, Passlib
- Server: Uvicorn

### Frontend
- Framework: Next.js with TypeScript
- Styling: Tailwind CSS and PostCSS

### Additional Tools
- Data Validation: Pydantic
- Environment: Managed via `.env` (e.g., model configurations)
- Database Initialization: `create_db.py` script

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Shrish-07/Lawlens.git
   cd Lawlens

Set up the backend:
Create a virtual environment:
```
python -m venv venv (activate with source venv/bin/activate on Unix or venv\Scripts\activate on Windows).
```
Install dependencies: 
```
pip install -r requirements.txt.
```
Copy .env.example to .env and configure variables (e.g., LLM_SUMMARY_MODEL).
Initialize database: python create_db.py.

Set up the frontend:
Navigate to apps/web: cd apps/web.
Install dependencies: npm install.


Usage

Launch the backend: Bashuvicorn apps.api.main:app --reloadAPI accessible at http://localhost:8000.
Launch the frontend:Bashcd apps/web
npm run devInterface at http://localhost:3000.
Key Interactions:
Register/login via /auth endpoints.
Upload PDFs at /pdf/upload.
Summarize via /pdf/summarize/{pdf_id}.
Manage files with list/download/delete operations.


Project Structure
```
textLawlens/
├── apps/
│   ├── api/                # Backend: API endpoints, models, and logic
│   │   ├── main.py         # FastAPI app entry
│   │   ├── pdf.py          # PDF handling and summarization routes
│   │   ├── summarizer.py   # NLP text processing
│   │   ├── auth.py         # Authentication endpoints
│   │   ├── models.py       # Database schemas
│   │   ├── schemas.py      # Pydantic validation models
│   │   ├── database.py     # SQLAlchemy setup
│   │   ├── crud.py         # CRUD operations
│   │   ├── utils.py        # Helpers (e.g., ID generation)
│   │   ├── files.py        # File listing/retrieval
│   │   └── cleanup.py      # Storage management
│   └── web/                # Frontend: Next.js components and pages
├── notebooks/              # Project notes and proposal
├── supabase/               # Alternative database schema
├── storage/                # Persistent file storage
├── uploads/                # Upload directory
├── .env.example            # Environment template
├── create_db.py            # DB creation script
├── render.yaml             # Deployment config
├── requirements.txt        # Python dependencies
└── README.md
```
Limitations and Future Enhancements

Summarization chunks text for efficiency but may miss nuanced context in ultra-long documents.
Embeddings are prepared but unused; future integration could enable semantic search.
Basic frontend; potential additions include interactive previews or analytics dashboards.
Expand to support additional formats or integrate external legal databases for broader policy applications.

Motivation and Impact
Inspired by the need to bridge technology and governance, LawLens exemplifies how CS can empower political science pursuits. By automating legal analysis, it promotes equity in access to information critical for policy-making and advocacy. This project reflects dedicated effort in building a functional tool from concept to deployment, underscoring skills in full-stack development and AI application.
