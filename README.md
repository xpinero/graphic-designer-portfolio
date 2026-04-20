# Ariel Pinero - Graphics Designer Portfolio

A modern, elegant portfolio website built with Next.js 14, featuring smooth animations, responsive design, and an intuitive user experience.

## Features

- **Portfolio Gallery**: Filterable grid showcasing design work with categories
- **Project Modal**: Lightbox view for detailed project information
- **Contact Form**: Fully functional contact form with validation
- **About Page**: Professional bio, skills, services, and experience
- **Responsive Design**: Beautiful on all devices from mobile to desktop
- **Smooth Animations**: Framer Motion animations for engaging user experience
- **Modern Stack**: Next.js 14, TypeScript, Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Customization Guide

### 1. Update Personal Information

**Navigation & Footer** (`components/Navigation.tsx`, `components/Footer.tsx`):
- Change "Ariel Pinero" to your name
- Update social media links in Footer component

**Metadata** (`app/layout.tsx`):
- Update site title and description
- Add your keywords for SEO

### 2. Replace Portfolio Projects

**Portfolio Data** (`lib/data.ts`):
- Replace sample projects with your actual work
- Update project titles, descriptions, categories, and years
- Add your own project images to `public/projects/`

**Supported image formats**: JPG, PNG, WebP, SVG

### 3. Update About Page

**About Content** (`app/about/page.tsx`):
- Replace bio text with your story
- Update skills list with your expertise
- Modify services to match what you offer
- Update experience timeline with your work history

### 4. Customize Contact Information

**Contact Page** (`app/contact/page.tsx`):
- Update email address
- Add your phone number
- Change location
- Modify "What to Expect" section

### 5. Connect Email Service (Optional)

The contact form currently logs submissions to the console. To receive actual emails:

**Option A: Use Resend**
```bash
npm install resend
```

Update `app/api/contact/route.ts`:
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// In POST handler:
await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'your-email@example.com',
  subject: `New Contact Form: ${name}`,
  html: `<p><strong>From:</strong> ${name} (${email})</p>
         <p><strong>Project Type:</strong> ${projectType}</p>
         <p><strong>Message:</strong> ${message}</p>`
});
```

**Option B: Use SendGrid, Mailgun, or other email service**

### 6. Customize Theme Colors

**Global Styles** (`app/globals.css`):
- Modify CSS variables for colors:
  - `--accent`: Primary accent color
  - `--primary`: Primary text color
  - `--background`: Background color
  - etc.

### 7. Add Your Images

Replace placeholder images in `public/projects/` with your actual work:
- Recommended size: 1200x900px or similar 4:3 ratio
- Optimize images before uploading (use tools like TinyPNG)
- Supported formats: JPG, PNG, WebP

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel will automatically detect Next.js and deploy

### Deploy to Netlify

1. Push your code to GitHub
2. Visit [netlify.com](https://netlify.com)
3. Import your repository
4. Build command: `npm run build`
5. Publish directory: `.next`

### Environment Variables

If using email services, add these to your deployment platform:
- `RESEND_API_KEY` (if using Resend)
- Other API keys as needed

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with navigation
│   ├── page.tsx            # Home/portfolio gallery
│   ├── about/page.tsx      # About page
│   ├── contact/page.tsx    # Contact page
│   └── api/contact/route.ts # Contact form API
├── components/
│   ├── Navigation.tsx      # Header navigation
│   ├── Footer.tsx          # Footer component
│   ├── PortfolioGrid.tsx   # Portfolio gallery
│   ├── ProjectCard.tsx     # Project card component
│   ├── ProjectModal.tsx    # Project lightbox modal
│   ├── ContactForm.tsx     # Contact form
│   └── AnimatedSection.tsx # Animation wrapper
├── lib/
│   └── data.ts            # Portfolio data
└── public/
    └── projects/          # Portfolio images
```

## Technologies Used

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form
- **Icons**: Lucide React

## Support

For issues or questions, please open an issue on GitHub or contact the developer.

## License

This project is open source and available under the MIT License.
