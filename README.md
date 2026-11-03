# FpMatch — AI-assisted career guidance

FpMatch is a web application focused on employment guidance and training discovery. It combines an Angular frontend with a small Express API and an OpenAI-powered conversational assistant.

> Portfolio note: this repository is a work in progress. This README describes the structure visible in the source code; deployment, production readiness and measured outcomes are not claimed.

## Technology
- Angular 19 and TypeScript
- Node.js and Express
- OpenAI Node SDK (Responses API)
- RxJS
- JSON datasets for courses, specialties and employment statistics
- express-rate-limit for request throttling

## Architecture
Angular application → AsistenteIaService → POST /api/chat → Express API → OpenAI Responses API

The API keeps the OpenAI key on the server and reads it from environment variables. The frontend communicates with the local API through the configured development proxy.

## Run locally
Requirements: Node.js and npm.

1. Install dependencies: npm install
2. Create a local .env file in the project root (do not commit it):
   OPENAI_API_KEY=your_key
   OPENAI_MODEL=gpt-4.1-mini
   API_PORT=3000
3. Start the API and Angular development server: npm start
4. Open the Angular development URL shown by the CLI (configured port: 4201).

Run parts independently with npm run api and npm run start:ng.

## API
- GET /api/health — reports whether the server has an OpenAI key configured.
- POST /api/chat — accepts a messages array containing user/assistant messages and returns a reply.

The chat endpoint validates message structure, limits conversation history and applies rate limiting. Do not expose the API key in Angular code or commit real credentials.

## Build and tests
- npm run build
- npm test

These commands are defined in package.json. Their current results should be verified in CI before treating the project as release-ready.

## Roadmap
- Add a product walkthrough and screenshots.
- Document career-guidance and course-matching workflows in detail.
- Add API and component tests for important user journeys.
- Add CI for build, linting and tests.
- Review privacy, accessibility, error handling and production deployment configuration.

## Security
Keep secrets in environment variables. The committed .env.example must contain placeholders only. Never commit .env, API keys, personal data or production datasets.
