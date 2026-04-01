# MovieCatalog - Frontend

A responsive web application for browsing a comprehensive movie catalog. 

> **Note:** This repository contains the **Frontend** application. It works in conjunction with its dedicated **Backend For Frontend (BFF)**. 

## Project Links

- **Live Site:** [View live site](https://pedroavilar.github.io/moviecatalog-frontend/)
- **Backend (BFF) Repository:** [moviecatalog-bff](https://github.com/pedroavilar/moviecatalog-bff)

## About the project

MovieCatalog allows users to browse popular, top-rated, and categorized movies. The platform allows users to favorite titles and explore complete details, including cast and production information. 

With the recent architectural upgrade, the frontend now communicates with our custom **Backend For Frontend (BFF)** instead of consuming the external APIs directly. The BFF handles data aggregation, external API proxying (TMDB API), caching, and security, allowing this frontend client to be faster, more secure, and strictly focused on UI/UX.

The project is being developed with a strict focus on responsiveness and accessibility, addressing various error scenarios and loading states to ensure the best user experience.

This website uses TMDB data but is not endorsed, certified, or otherwise approved by TMDB.  
<img src="src/assets/logotipo-tmdb.svg" alt="Logotipo TMDB." width="100px">

## Deployment

This frontend application is statically built and hosted on **GitHub Pages**, providing fast and secure delivery via HTTPS. It seamlessly communicates with the production BFF API (hosted on Render), ensuring proper CORS configuration and secure credential management.

## Technologies

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [React Router Dom](https://reactrouter.com/)
- [Axios](https://axios-http.com/)

## Installation and setup

To run this application locally fully functional, it's recommended to have the BFF running as well.

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Ensure you have the proper environment variables mapping your API requests to your local BFF instance (e.g., `http://localhost:3000`).

3. **Run the project:**
   ```bash
   npm run dev
   ```

> For backend backend setup instructions, please visit the [BFF Repository](https://github.com/pedroavilar/moviecatalog-bff).

## Project Status

This project is currently **under active development**. 