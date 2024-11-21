# ProfilesMe

## Overview

ProfilesMe is a profile builder platform similar to `guns.lol` that allows users to create a single, comprehensive profile link to showcase all their online presence.

## Features

- 🔗 One Link for All Destinations
- ✨ Customizable Beautiful Design
- 🚀 Easy Profile Sharing
- Video and Image Adjustable Background

## Tech Stack

### FrontEnd
- React
- Tailwind CSS
- ShadcnUI
- Aceternity UI
- Lucide React
- TypeScript

### BackEnd
- TypeScript
- NodeJS
- Express
- MySQL
- MongoDB
- Google OAuth

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/sadanandmiskin/profilesme.git
```


### Running Backend-

- Environment Setup
```bash
cd backend
yarn install
```

- Create a `.env` file in `/backend` with:
```bash
DB_HOST=  #Mysql
DB_USER=
DB_PASSWORD=
DB_NAME=
PORT=
GOOGLE_CLIENT_ID=  #get it from google cloud console
GOOGLE_CLIENT_SECRET=
JWT_SECRET=
SESSION_SECRET=
FRONTEND_URL=
MONGO=   #mongo uri
```

- Run the dev server
```bash
npm run dev1
```



### Running the frontend-
2. Install dependencies
```bash
cd frontend
yarn install
```


- Change the backend url in frontend/src/backendUrl.ts
- Add the fronend Url in .env file in `/backend`

3. Run the development server
```bash
npm run dev
```


