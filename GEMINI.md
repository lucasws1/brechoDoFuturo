# GEMINI.md - Brechó do Futuro

## Project Overview

This is a full-stack e-commerce application for a second-hand store called "Brechó do Futuro". It's built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript.

The project is divided into two main parts:

*   **Backend:** A Node.js/Express application that serves a RESTful API for managing products, users, orders, and authentication. It uses Prisma as an ORM for MongoDB.
*   **Frontend:** A React application built with Vite that provides the user interface for the e-commerce store. It uses React Router for navigation, and a variety of libraries for UI components and state management.

## Building and Running

### Backend

To run the backend server, you'll need to have Node.js and pnpm installed.

1.  **Install dependencies:**
    ```bash
    cd backend
    pnpm install
    ```

2.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory with the following variables:
    ```
    DATABASE_URL="mongodb://localhost:27017/brechoDoFuturo"
    JWT_SECRET="your-super-secret-jwt-key-here"
    PORT=3001
    ```

3.  **Run the development server:**
    ```bash
    pnpm dev
    ```

The server will be available at `http://localhost:3001`.

### Frontend

To run the frontend application, you'll need to have Node.js and pnpm installed.

1.  **Install dependencies:**
    ```bash
    cd frontend
    pnpm install
    ```

2.  **Run the development server:**
    ```bash
    pnpm dev
    ```

The application will be available at `http://localhost:5173`.

## Development Conventions

*   **Backend:**
    *   The backend follows a standard MVC-like architecture with controllers, services, and routes.
    *   Prisma is used for all database interactions. The schema is defined in `backend/prisma/schema.prisma`.
    *   Authentication is handled with JWTs.
    *   Routes are defined in the `backend/src/routes` directory.

*   **Frontend:**
    *   The frontend is built with React and Vite.
    *   Components are located in `frontend/src/components`.
    *   Pages are located in `frontend/src/pages`.
    *   React Router is used for routing.
    *   The application uses a context-based approach for state management (`AuthContext`, `CartContext`, `ProductsContext`).
