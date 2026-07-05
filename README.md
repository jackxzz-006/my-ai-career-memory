<div align="center">

# 🎯 AI Career & Education Advisor

**Personalized career and education guidance, powered by live AI.**

</div>

---

## 📖 Overview

Most career advice is generic — "learn more skills," "network more." This app fixes that.

Users enter their **actual** education level, skills, interests, career goals, and constraints. A live Gemini-powered agent processes that input and returns **specific, structured** recommendations: real career/education paths, why each one fits, exactly which skills are missing, and concrete next steps — not vague filler.

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Google Sign-In** | One-click authentication via Supabase Auth (OAuth) — no separate signup flow |
| 📝 **Guided input form** | Captures education level, skills & interests, career goals, and optional constraints |
| 🤖 **Live AI recommendations** | Form data is sent to a Supabase Edge Function, which calls the Gemini API and returns structured JSON |
| 📊 **Structured output** | Each recommendation includes: path name, fit reasoning, skill gaps, next steps, and a realistic timeline |
| 🕘 **Recommendation history** | Every result is saved to Postgres and linked to the user's account for later review |
| ⏳ **Loading & error states** | Clear feedback while the AI responds, and graceful handling if a call fails |

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (built via [Lovable](https://lovable.dev)) |
| UI Components | shadcn/ui |
| Styling | Tailwind CSS |
| Auth & Database | Supabase (Auth + Postgres) |
| Serverless Compute | Supabase Edge Functions |
| AI Model | Google Gemini API |
| OAuth Provider | Google Cloud OAuth 2.0 |
| Hosting | Lovable |

## 🔄 How It Works

```
User signs in (Google OAuth via Supabase Auth)
        │
        ▼
User fills out recommendation form
  (education level, skills, goals, constraints)
        │
        ▼
Frontend calls Supabase Edge Function
        │
        ▼
Edge Function builds prompt → calls Gemini API
        │
        ▼
Gemini returns structured JSON
  (paths, fit reasoning, skill gaps, next steps, timeline)
        │
        ▼
Result displayed to user + saved to Postgres (linked to user_id)
        │
        ▼
User can revisit all past recommendations on the History page
```

## 🔑 Environment Variables

Configured as **Supabase secrets** — never exposed to the frontend:

```env
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_OAUTH_CLIENT_ID=your_google_oauth_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_google_oauth_client_secret
```

## 🚀 Getting Started

```bash
# clone the repo
git clone https://github.com/jackxzz-006/my-ai-career-memory.git
cd my-ai-career-memory

# install dependencies
npm install

# configure environment variables
cp .env.example .env

# run locally
npm run dev
```

Deploy the Edge Function and set its secret:

```bash
supabase functions deploy get-recommendation
supabase secrets set GEMINI_API_KEY=your_key
```

## 🗺️ Roadmap

- [ ] Compare recommendations across multiple submissions side by side
- [ ] Filter history by date or path type
- [ ] Cross-reference recommendations against real job postings data
- [ ] Export a recommendation report to PDF
- [ ] Per-user rate limiting on AI calls to control API costs

## 👤 Author

**jackxzz-006**
🔗 [github.com/jackxzz-006](https://github.com/jackxzz-006)

## 📄 License

This project is for educational and portfolio purposes. Add an [MIT License](https://choosealicense.com/licenses/mit/) if you plan to open-source it fully.

---

<div align="center">
<sub>Built with 🤖 + ☕ as part of a full-stack + AI engineering portfolio.</sub>
</div>
