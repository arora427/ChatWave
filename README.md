# 💬 ChatWave

ChatWave is a modern, real-time chat and video calling application designed for seamless communication. Connect with friends, share media, and customize your experience with dynamic themes.

**Live Demo:** [https://chatwave-0xyv.onrender.com/](https://chatwave-0xyv.onrender.com/)



## ✨ Features

* **Real-Time Chat & Video:** Instantly message and video call friends.
* **User Authentication:** Secure login and registration using JSON Web Tokens (JWT).
* **Friend System:** Get friend recommendations and manage your friend list.
* **Emoji & File Sharing:** Express yourself with emojis and share files effortlessly.
* **Real-Time Status:** See when your messages have been delivered and seen.
* **Video Calling:** High-quality, real-time video calls with peers.
* **Customizable Themes:** Personalize your chat interface with different themes.
* **Random Avatars:** Get a unique, randomly generated avatar upon signing up.

## 🛠️ Tech Stack

This project is built using the MERN stack and other modern technologies:

* **Frontend:** React, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Real-Time API:** GetStream.io
* **Data Fetching:** TanStack Query (React Query)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.
* npm
    ```sh
    npm install npm@latest -g
    ```

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/arora427/ChatWave.git](https://github.com/arora427/ChatWave.git)
    ```
2.  **Install server dependencies**
    ```sh
    cd server
    npm install
    ```
3.  **Install client dependencies**
    ```sh
    cd ../client
    npm install
    ```
4.  **Create a `.env` file in the `server` directory**
    You will need to add your own environment variables for things like your MongoDB connection string, JWT secret, and GetStream.io API keys.
    ```env
    MONGO_URI=YOUR_MONGO_URI
    JWT_SECRET=YOUR_JWT_SECRET
    GETSTREAM_API_KEY=YOUR_GETSTREAM_KEY
    GETSTREAM_API_SECRET=YOUR_GETSTREAM_SECRET
    ```

### Running the Application

1.  **Start the backend server** (from the `server` directory)
    ```sh
    npm start
    ```
2.  **Start the frontend development server** (from the `client` directory)
    ```sh
    npm run dev
    ```

The application should now be running on `http://localhost:5173` (or another port if specified).

---
