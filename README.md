# SlideNova 🎯

AI-powered PowerPoint presentation generator. Enter a topic, choose a tone, and get a professional `.pptx` in seconds.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, react-hot-toast |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| AI | Google Gemini 1.5 Flash |
| Images | Pexels API |
| PPT | pptxgenjs |
| Styling | Plain CSS |

---

## Prerequisites

- Node.js ≥ 18
- MongoDB running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI
- [Gemini API key](https://aistudio.google.com/app/apikey)
- [Pexels API key](https://www.pexels.com/api/)

---

## Setup

### 1. Clone & install

```bash
git clone <repo-url>
cd SlideNova
npm run install:all
```

### 2. Configure environment variables

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/slidenova
GEMINI_API_KEY=your_gemini_api_key_here
PEXELS_API_KEY=your_pexels_api_key_here
CLIENT_URL=http://localhost:3000
```

### 3. Run the app

```bash
# From the root directory — starts both server and client
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

---

## Folder Structure

```
SlideNova/
├── client/                  # React frontend
│   └── src/
│       ├── components/      # Navbar, GenerateForm, SlidePreview, etc.
│       ├── pages/           # Home, History, PresentationDetail
│       ├── services/        # API calls (api.js)
│       └── styles/          # global.css, components.css
│
├── server/                  # Express backend
│   ├── controllers/         # presentationController.js
│   ├── models/              # Presentation.js (Mongoose)
│   ├── routes/              # presentationRoutes.js
│   ├── services/            # aiService, imageService, pptService
│   └── index.js
│
└── package.json             # Root scripts (concurrently)
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/presentations/generate` | Generate a new presentation |
| GET | `/api/presentations` | Get all presentations |
| GET | `/api/presentations/:id` | Get single presentation |
| PUT | `/api/presentations/:id` | Update slide content |
| DELETE | `/api/presentations/:id` | Delete presentation |
| GET | `/api/presentations/:id/download` | Download `.pptx` file |

---

## Features

- ✦ AI-generated slide content (titles + bullet points)
- 🖼️ Auto-fetched relevant images per slide (Pexels)
- 📊 Live slide preview in the browser
- ✏️ Editable slides before export
- ⬇️ One-click `.pptx` download
- 📁 Presentation history with delete option
- 🔔 Toast notifications
- 📱 Responsive design
