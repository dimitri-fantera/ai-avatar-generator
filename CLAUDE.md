# AI Avatar Generator

## Plan
See [plan.md](./plan.md) for current status, completed work, and next steps. Always read and update plan.md when making changes.

## Overview
Web app for generating AI image avatars using Google Gemini. First iteration toward talking AI videos.

## Tech Stack
- Next.js 14 (App Router)
- Vercel Blob (image storage)
- Google Generative AI (Gemini)
- Tailwind CSS

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run linter

## Deployment
Deployed to Vercel. Push to main triggers auto-deploy.

## Environment Variables
- GOOGLE_AI_API_KEY - Google AI Studio key
- BLOB_READ_WRITE_TOKEN - Vercel Blob token

## Project Structure
```
app/
├── layout.tsx          # Root layout
├── page.tsx            # Main UI (prompt input + gallery)
├── globals.css         # Tailwind imports
└── api/
    ├── generate/route.ts   # POST: Generate image from prompt
    └── history/route.ts    # GET: Fetch history (list blobs)
components/
├── PromptForm.tsx      # Input form for prompts
├── ImageCard.tsx       # Display generated image
└── Gallery.tsx         # History gallery
lib/
└── gemini.ts           # Google AI client wrapper
```
