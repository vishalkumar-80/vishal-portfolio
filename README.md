# Vishal Kumar — Portfolio

A responsive personal portfolio built with React and Vite. It introduces Vishal, highlights selected projects, skills, education and experience, and includes a contact form backed by a serverless email API.

**Live site:** [vishal-portfolio-silk-rho.vercel.app](https://vishal-portfolio-silk-rho.vercel.app)

## Features

- Responsive single-page layout with dark and light themes.
- Sections for profile, skills, projects, experience, education and contact.
- Project details displayed in interactive previews and a modal.
- Contact form handled by a Vercel serverless function at `/api/contact`.
- Resume download link expects a PDF at `public/resume/Vishal_Kumar_Resume.pdf`.

## Tech stack

- React 18 and Vite 6
- Lucide React icons
- Vercel Functions for the contact API
- Nodemailer with Gmail SMTP for contact email delivery

## Run locally

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Vite prints the local development URL in the terminal. The Vite config also mounts the contact API locally, so `/api/contact` is available during development.

To create and preview a production build:

```bash
npm run build
npm run preview
```

## Contact email configuration

The contact form sends messages through `api/contact.js`. Create a local `.env.local` file in the project root with the following server-side variables:

```env
GMAIL_USER=your-gmail-address@gmail.com
GMAIL_APP_PASSWORD=your-16-character-google-app-password
CONTACT_TO=destination@example.com
```

Use a Google **App Password** for `GMAIL_APP_PASSWORD`, not your regular Gmail password. Keep `.env.local` private; environment files are ignored by Git. `.env.example` shows the expected variable names.

For Vercel, add the same variables under **Project Settings → Environment Variables**, then redeploy. The contact form returns an error until valid email credentials are configured.


## Project layout

```text
api/contact.js          Contact form serverless function
public/                 Static assets
src/App.jsx             Portfolio page and sections
src/components/         Project previews and modal
src/data/config.js      Profile and social links
src/data/projects.js    Project content
src/styles.css          Page styling
vite.config.js          Vite setup and local contact API middleware
```

## Customize

- Update personal details and links in `src/data/config.js`.
- Edit project cards in `src/data/projects.js`.
- Replace `public/images/vishal-kumar.png` with the profile image.
- Add the resume PDF at `public/resume/Vishal_Kumar_Resume.pdf`.
