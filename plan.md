# Project Plan: AI Avatar Generator

## Goal
Build a web app that generates realistic UGC-style AI avatars, as a first step toward talking AI videos.

## Current Status
**Phase 1: Avatar Generation** - In Progress

## Work Completed

### Core Infrastructure
- [x] Next.js 14 app with App Router
- [x] Vercel Blob integration for image storage
- [x] Google Gemini integration for image generation
- [x] Basic UI with prompt input and gallery

### Prompt Customization UI
- [x] Gender selection (Male, Female, Non-binary)
- [x] Age range selection (18-25, 26-35, 36-45, 46-60, 60+)
- [x] Ethnicity selection (African, East Asian, South Asian, Caucasian, Hispanic/Latino, Middle Eastern, Mixed)
- [x] Expression selection (Casual/Talking, Smiling, Thoughtful, Surprised, Confident, Serious)
- [x] Background selection (Kitchen, Living Room, Bedroom, Home Office, Car, Coffee Shop, Park, Street, Gym)
- [x] Additional details text input
- [x] Collapsible JSON prompt preview

### Prompt Engineering
- [x] Structured JSON prompt template (nano_banana_pro format)
- [x] Realistic UGC aesthetic (not overly polished)
- [x] Phone camera artifacts (jpeg compression, lens distortion, noise)
- [x] Imperfect framing and lighting
- [x] Comprehensive negative prompt to avoid professional look

### Simple Prompt Page
- [x] New `/prompt` route with free-form text input
- [x] Shared history with main avatar generator (same blob storage)
- [x] Reuses existing Gallery component

## Next Steps

### Phase 1 Improvements
- [ ] Test generated images for UGC realism
- [ ] Fine-tune prompt parameters based on results
- [ ] Add more background options
- [ ] Add hair style/color options
- [ ] Add clothing style options

### Phase 2: Video/Animation
- [ ] Research talking avatar APIs (D-ID, HeyGen, Synthesia, etc.)
- [ ] Add lip-sync/animation capability
- [ ] Audio input for avatar speech
- [ ] Video export functionality

### Phase 3: Polish
- [ ] User accounts and saved avatars
- [ ] Avatar presets/templates
- [ ] Batch generation
- [ ] API rate limiting and error handling improvements

## Technical Debt
- [ ] Add TypeScript strict mode
- [ ] Add unit tests
- [ ] Add E2E tests
- [ ] Improve error messages in UI

## Notes
- Gemini model: `gemini-3-pro-image-preview`
- Images stored in Vercel Blob under `avatars/` prefix
- Auto-deploy on push to main
