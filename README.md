# Atlas Productivity Suite** is a modern, AI-powered web application designed to improve workplace productivity by bringing multiple intelligent tools into one integrated platform. Instead of using separate applications for different tasks, users can access AI-powered productivity features from a single dashboard.**

The Atlas Productivity Suite platform helps users summarize meeting notes, conduct AI-assisted research, and create intelligent task plans, making everyday workplace activities faster, more organized, and more efficient.

---

## Project Objectives

The objectives of this project are to:

* Build a responsive AI-powered web application.
* Demonstrate the integration of multiple AI features into a single platform.
* Improve workplace productivity through intelligent automation.
* Create an intuitive and user-friendly interface.
* Apply responsible AI principles by encouraging users to verify AI-generated content.

---

## Features

### 📋 Meeting Notes Summarizer

* Paste meeting notes into the application.
* Generate concise AI summaries.
* Extract key discussion points.
* Identify decisions made.
* Highlight action items.
* Detect deadlines where applicable.
* Copy summaries to the clipboard.
* Download summaries as PDF.

### 🔍 AI Research Assistant

* Enter any research topic or question.
* Receive AI-generated explanations.
* View key concepts and important facts.
* Explore practical examples.
* Get suggested follow-up questions.
* Access previous research history.
* Copy or download research results.

### ✅ AI Task Planner

* Create project goals.
* Generate AI-assisted action plans.
* Break large goals into manageable tasks.
* Assign priorities.
* Set deadlines.
* Track task completion.
* View progress using a progress bar.
* Receive productivity recommendations.

---

## Dashboard

The application includes a centralized dashboard that provides:

* Productivity overview
* Recent activity
* Upcoming deadlines
* Quick access to AI tools
* Task progress tracking
* Navigation to all platform features

---

## Responsive Design

The application is fully responsive and optimized for:

* Desktop
* Laptop
* Tablet
* Mobile devices

The layout automatically adapts to different screen sizes to provide a consistent user experience.

---

## User Authentication

Users can:

* Register an account
* Log in securely
* Reset forgotten passwords
* Manage their profile

Each user has access only to their own saved data.

---

## Responsible AI

The AI Productivity Assistant promotes responsible use of artificial intelligence.

**Responsible AI Notice**

> AI-generated responses are intended to assist users and may occasionally contain inaccuracies or incomplete information. Users should always review and verify important information before making business, academic, or personal decisions.

---

## Technology Stack

### Frontend

* React
* TypeScript
* Tailwind CSS
* React Router
* React Query
* shadcn/ui

### Backend

* Supabase
* Authentication
* Database Services

### AI Integration

* OpenAI API (or another compatible AI model)

---

## AI Tools

This project leverages modern AI technologies to power its intelligent features:

**OpenAI API** – Generates meeting summaries, research responses, and task plans.
**Large Language Models (LLMs)** – Understand user prompts and generate natural language responses.
**Prompt Engineering** – Uses carefully designed prompts to produce accurate and relevant AI outputs.
**Natural Language Processing (NLP)** – Analyzes and summarizes text, extracts key information, and understands user queries.
**Generative AI** – Creates summaries, explanations, action plans, and productivity recommendations based on user input.

## Application Structure

```
AI-Productivity-Assistant
│
├── src
│   ├── components
│   ├── pages
│   ├── layouts
│   ├── services
│   ├── hooks
│   ├── utils
│   └── assets
│
├── public
│
├── supabase
│
└── README.md
```

---

## Core Functionality

The application combines multiple AI-powered tools into a **single integrated platform**, allowing users to:

* Summarize meeting notes.
* Perform AI-assisted research.
* Plan and organize tasks.
* Monitor productivity.
* Manage work from one dashboard.

Each AI feature includes clearly separated **Input** and **Output** sections, allowing users to easily provide information and review AI-generated responses.

---

## Future Enhancements

Future versions of the application may include:

* Voice-to-text meeting transcription
* Calendar integration
* Email assistant
* Team collaboration features
* File uploads
* AI-powered document analysis
* Multi-language support
* Cloud synchronization
* Analytics dashboard
* Notification reminders

---

## Learning Outcomes

This project demonstrates practical knowledge of:

* Full-stack web development
* Responsive web design
* Artificial Intelligence integration
* User authentication
* Database management
* RESTful APIs
* Modern React development
* User interface and user experience design
* Responsible AI implementation

---

## Installation

1. Clone the repository.

```bash
git clone https://github.com/your-username/AI-Productivity-Assistant.git
```

2. Navigate to the project folder.

```bash
cd AI-Productivity-Assistant
```

3. Install dependencies.

```bash
npm install
```

4. Configure your environment variables.

Create a `.env` file and add your API keys and Supabase credentials.

```env
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Start the development server.

```bash
npm run dev
```

---

## Author

**Vanessa Dumase**

AI Productivity Assistant

---

## License

This project is intended for educational and portfolio purposes.
