# Deployment Guide

This guide will help you deploy your portfolio website to production.

## Quick Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications and is completely free for personal projects.

### Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial portfolio website"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"
   - Your site will be live in ~2 minutes!

3. **Custom Domain (Optional)**
   - In Vercel dashboard, go to Settings > Domains
   - Add your custom domain
   - Follow DNS configuration instructions

## Alternative: Deploy to Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Deploy**
   - Visit [netlify.com](https://netlify.com)
   - Drag and drop your project folder
   - Or connect your GitHub repository

## Environment Variables

Add these in your deployment platform before deploying:

- `STRIPE_SECRET_KEY` - Required for checkout and order API routes
- `STRIPE_WEBHOOK_SECRET` - Required for Stripe webhook verification
- `NEXT_PUBLIC_SITE_URL` - Public base URL (for example `https://your-site.vercel.app`)
- `ADMIN_PASSWORD` - Required for protected shop settings updates
- `RESEND_API_KEY` - Optional, for Resend email service
- `SENDGRID_API_KEY` - Optional, for SendGrid email service
- `HEALTH_CHECK_SECRET` - Shared secret for the private `/api/health` endpoint (generate a long random string)

## Post-deploy health check

The `/api/health` route is **private**: without `HEALTH_CHECK_SECRET` set in Vercel it responds with **404** and no deployment details. After you set `HEALTH_CHECK_SECRET`, call it with a Bearer token (values are never returned in the JSON, only configured/missing names).

Example:

```bash
curl -sS -H "Authorization: Bearer YOUR_HEALTH_CHECK_SECRET" \
  "https://your-project.vercel.app/api/health"
```

- HTTP **200** with `"ok": true` means all required environment variables are set.
- HTTP **503** with `"missingRequired"` lists required variable names that are unset or blank in that deployment.
- HTTP **401** means the secret header was missing or wrong.

## Pre-Deployment Checklist

- [ ] Replace placeholder images with actual portfolio work
- [ ] Update personal information (name, email, phone, location)
- [ ] Update social media links
- [ ] Customize bio and about content
- [ ] Test contact form
- [ ] Verify all links work
- [ ] Test on mobile devices
- [ ] Check SEO metadata

## Post-Deployment

1. **Test the live site**
   - Check all pages load correctly
   - Test contact form submission
   - Verify responsive design on mobile
   - Test portfolio filtering

2. **SEO Setup**
   - Submit sitemap to Google Search Console
   - Add Google Analytics (optional)
   - Verify meta tags are correct

3. **Performance**
   - Run Lighthouse audit
   - Optimize images if needed
   - Check page load times

## Updating the Site

After initial deployment, any changes you push to your main branch will automatically redeploy on Vercel/Netlify.

```bash
# Make changes to your code
git add .
git commit -m "Update portfolio content"
git push
# Site will auto-deploy!
```

## Support

For deployment issues:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Netlify: [docs.netlify.com](https://docs.netlify.com)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)
