# CaseCraft - Quick Start (5 Minutes)

## 1. Install & Run
```bash
npm install
npm run dev
```

Visit http://localhost:3000

## 2. Test the Flow
- Click "Explore Templates" on homepage
- Choose any template
- Upload an image
- Customize (crop, colors, materials)
- Fill order form with test data
- Click "Order via WhatsApp" (will open WhatsApp if installed)

## 3. Configure for Production

### UploadThing (Required - for image uploads)
1. Go to [uploadthing.com](https://uploadthing.com)
2. Create app → get `UPLOADTHING_SECRET`
3. Add to `.env.local`:
   ```
   UPLOADTHING_SECRET=your_secret_here
   ```

### WhatsApp (Required - for orders)
1. Get WhatsApp Business phone number
2. Update in `/src/app/order/page.tsx` (line ~120):
   ```typescript
   const whatsappUrl = `https://wa.me/YOUR_NUMBER?text=${message}`
   ```
3. Or add to `.env.local` as `NEXT_PUBLIC_WHATSAPP_NUMBER`

### Supabase (Optional - for design persistence)
1. Go to [supabase.com](https://supabase.com) → new project
2. Run SQL from `SETUP.md` to create tables
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```
4. Update `/src/lib/supabase.ts` to use real client instead of mock

## 4. Customize Brand
Edit 3 files:
- `src/app/globals.css` - Change colors
- `src/components/Navbar.tsx` - Logo
- `src/components/Footer.tsx` - Branding text

## 5. Deploy to Vercel
```bash
git push  # Push to GitHub
# Go to vercel.com → import repo → add env vars → deploy!
```

## Key URLs
- Homepage: `/`
- Templates: `/templates`
- Dashboard: `/dashboard`
- Order: `/order`
- Customizer: `/configure/design`

## Architecture Overview
```
User Flow:
  Homepage → Templates → Upload Image → Customize → Order Info → WhatsApp/Email

Technical:
  Frontend (React) → API Routes → Supabase (optional) → Direct to WhatsApp/Email
```

## Troubleshooting

**Images not uploading?**
- Check UploadThing is configured
- Check `UPLOADTHING_SECRET` in `.env.local`

**Designs not saving?**
- Without Supabase, designs are session-only
- Set up Supabase for persistence

**WhatsApp not working?**
- Ensure phone number is in international format
- Test on a device with WhatsApp installed

**Color theme looks wrong?**
- Check `src/app/globals.css` CSS variables loaded
- Clear browser cache (Cmd+Shift+Delete)

## What's Different From Original

| Feature | Before | After |
|---------|--------|-------|
| Auth | Kinde | None (email lookup) |
| Payments | Stripe checkout | None (direct order) |
| Templates | 1 design | 10+ templates |
| Order Flow | Full checkout | Form → WhatsApp/Email |
| Branding | CaseCobra | CaseCraft |
| Colors | Green theme | Obsidian/Sand/Copper |

## Next: Production Checklist

- [ ] UploadThing configured
- [ ] WhatsApp number set
- [ ] Supabase tables created (if using)
- [ ] Branding customized
- [ ] Environment variables in Vercel
- [ ] Tested full order flow
- [ ] Email confirmation working (if using)
- [ ] Deployed to production

---

**That's it! CaseCraft is ready to accept orders.**
