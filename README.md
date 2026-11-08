# TogetherWe | Community Events Platform

TogetherWe is a community-driven social development platform that connects people through meaningful volunteer activities and community events. Users can discover events, create initiatives, join volunteer activities, and contribute to positive social change.

## 🌐 Live Project

- **Live Website:** [Add your Vercel URL]
- **Client Repository:** https://github.com/mahim157/togetherwe-client
- **Server Repository:** https://github.com/mahim157/togetherwe-server

## ✨ Key Features

- **User Authentication:** Secure registration and login with email/password and social authentication.
- **Community Events:** Browse upcoming community events with search and category filtering.
- **Create Events:** Authenticated users can create community events with descriptions, images, locations, and dates.
- **Join Events:** Users can join volunteer activities and track volunteer participation.
- **Manage Events:** Event creators can update and delete their own events.
- **Joined Events:** View and manage events you have joined.
- **Saved Events:** Bookmark interesting events and access them later.
- **Event Discussion:** Users can discuss events through comments.
- **Comment Management:** Users can edit and delete their own comments.
- **User Profiles:** View and update profile information.
- **Responsive Design:** Optimized for mobile, tablet, and desktop devices.
- **Dark and Light Mode:** Switch between different interface themes.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Next.js | React framework |
| React | User interface |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Better Auth | Authentication |
| MongoDB | Database |
| Lucide React | Icons |
| Fetch API | Backend communication |

## 📁 Project Structure

```text
client/
├── app/
│   ├── components/
│   ├── events/
│   │   └── [id]/
│   ├── create-event/
│   ├── joined-events/
│   ├── saved-events/
│   ├── manage-events/
│   ├── profile/
│   ├── login/
│   ├── register/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
├── public/
├── package.json
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

- Node.js
- npm
- Git

### 1. Clone the Repository

```bash
git clone YOUR_CLIENT_REPOSITORY_URL
```

### 2. Navigate to the Project

```bash
cd client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the client root directory.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Add any other environment variables required by your local authentication configuration.

### 5. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 🔐 Authentication

TogetherWe uses Better Auth for user authentication.

Supported authentication features include:

- Email and password authentication
- Google OAuth
- GitHub OAuth
- Session management
- Protected pages and authenticated API requests

## 🌍 Backend Integration

The frontend communicates with the Express.js backend.

**Local Backend URL:**

```text
http://localhost:5000
```

See the [Server Repository](https://github.com/mahim157/togetherwe-server) for backend configuration and API details.

## 🚀 Production Build

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## 📌 Project Purpose

TogetherWe aims to make community participation easier by helping people discover volunteer opportunities, organize social initiatives, and work together to create meaningful change.

## 👨‍💻 Developer

**Moynol Islam Mahim**

- GitHub: https://github.com/mahim157
- LinkedIn: https://www.linkedin.com/in/md-moynol-islam-mahim

---

*TogetherWe — Connecting People, Creating Positive Change.*
