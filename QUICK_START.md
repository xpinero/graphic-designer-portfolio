# Quick Start Guide

Get your portfolio website up and running in minutes!

## Current Status

✅ **Website is ready!** The development server is currently running at http://localhost:3000

## What You Have

A complete, modern portfolio website with:
- Portfolio gallery with 9 sample projects
- About page with bio and services
- Contact form with validation
- Fully responsive design
- Smooth animations
- Mobile menu

## Next Steps

### 1. Customize Your Content (30 minutes)

**Replace Portfolio Images:**
```bash
# Add your images to public/projects/
# Recommended: project-1.jpg, project-2.jpg, etc.
# Size: 1200x900px or similar 4:3 ratio
```

**Update Portfolio Data:**
Edit `lib/data.ts` - change project titles, descriptions, and categories

**Update About Page:**
Edit `app/about/page.tsx` - change bio, skills, and experience

**Update Contact Info:**
Edit `app/contact/page.tsx` - change email, phone, and location

**Update Name & Branding:**
- `components/Navigation.tsx` - change "Ariel Pinero"
- `components/Footer.tsx` - update social media links
- `app/layout.tsx` - update site title and description

### 2. Test Your Changes

```bash
# The dev server is already running!
# Just visit http://localhost:3000 to see your changes
# Changes will auto-reload as you edit files
```

### 3. Deploy to Production (10 minutes)

**Option A: Vercel (Recommended)**
```bash
# 1. Create a GitHub repository and push your code
git init
git add .
git commit -m "My portfolio website"
git remote add origin YOUR_GITHUB_URL
git push -u origin main

# 2. Visit vercel.com and import your GitHub repo
# 3. Click Deploy - Done! Your site is live!
```

**Option B: Netlify**
- Visit netlify.com
- Drag and drop your project folder
- Or connect your GitHub repository

See `DEPLOYMENT.md` for detailed deployment instructions.

## Development Commands

```bash
# Start development server (already running!)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Stop the dev server
# Press Ctrl+C in the terminal
```

## File Structure

```
Key files to customize:
├── lib/data.ts              # Portfolio projects
├── app/about/page.tsx       # About page content
├── app/contact/page.tsx     # Contact info
├── components/Navigation.tsx # Site name
├── components/Footer.tsx     # Social links
└── public/projects/          # Your images
```

## Getting Help

- Full documentation: `README.md`
- Deployment guide: `DEPLOYMENT.md`
- Project summary: `PROJECT_SUMMARY.md`

## Tips

1. **Images**: Use optimized images (JPG/PNG/WebP) around 1200x900px
2. **Colors**: Customize theme colors in `app/globals.css`
3. **Email**: Set up email service later using `DEPLOYMENT.md` guide
4. **SEO**: Update metadata in each page file for better search rankings

## Current Site Preview

Visit http://localhost:3000 to see:
- Home: Portfolio gallery with filtering
- /about: Your bio and services
- /contact: Contact form

---

**Ready to customize?** Start by replacing the portfolio images and updating your personal information!
