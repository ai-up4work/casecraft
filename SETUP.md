# CaseCraft - Setup Guide

Welcome to CaseCraft! Your phone, your canvas.

## Project Overview

CaseCraft is a custom phone case design platform with:
- 10+ artisan templates to choose from
- Image customization and cropping
- Session-based design saving (via Supabase)
- Direct WhatsApp/Email ordering
- No authentication required - simple and fast

## Quick Start

### 1. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 2. Set Up Environment Variables
Copy `.env.example` to `.env.local` and fill in your API keys:

```bash
cp .env.example .env.local
```

### 3. Required Services

#### UploadThing (Image Uploads)
1. Go to [uploadthing.com](https://uploadthing.com)
2. Create an account and app
3. Get your `UPLOADTHING_SECRET` and add to `.env.local`

#### Supabase (Optional - Design Persistence)
1. Go to [supabase.com](https://supabase.com)
2. Create a project
3. Create tables for `designs` and `orders` (SQL provided below)
4. Get your URL and anon key and add to `.env.local`

**Supabase SQL Setup:**
```sql
-- Designs table
CREATE TABLE designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  template_id TEXT NOT NULL,
  design_name TEXT DEFAULT 'My Case Design',
  image_url TEXT NOT NULL,
  cropped_image_url TEXT,
  phone_model TEXT,
  case_color TEXT,
  case_material TEXT,
  case_finish TEXT,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX designs_email_idx ON designs(email);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  state TEXT,
  design_id UUID,
  template_id TEXT NOT NULL,
  order_details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### WhatsApp Business (Order Notifications)
1. Set up WhatsApp Business API
2. Get your phone number and add to `.env.local` as `NEXT_PUBLIC_WHATSAPP_NUMBER`
3. Update the WhatsApp link in `/src/app/order/page.tsx` with your number

### 4. Run Development Server
```bash
npm run dev
# or
pnpm dev
```

Visit http://localhost:3000

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── templates/page.tsx    # Template selection
│   ├── order/page.tsx        # Order information & WhatsApp/Email
│   ├── dashboard/page.tsx    # My Designs (user designs by email)
│   ├── configure/            # Design customizer (existing flow)
│   └── api/
│       ├── designs/          # Design CRUD endpoints
│       ├── send-order-email/ # Email order confirmation
│       └── webhooks/         # UploadThing webhooks
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Phone.tsx
│   ├── PhonePreview.tsx
│   └── ui/                   # shadcn/ui components
├── config/
│   ├── templates.ts          # 10+ template definitions
│   └── products.ts           # Product config
├── lib/
│   ├── supabase.ts           # Supabase client & services
│   ├── uploadthing.ts
│   └── utils.ts
└── styles/
    └── globals.css           # CaseCraft color palette
```

## Color Palette

CaseCraft uses an artisan-workshop aesthetic:
- **Deep Obsidian**: #0D0D0D (Primary dark)
- **Warm Sand**: #E8D5B0 (Secondary accent)
- **Burnt Copper**: #C4622D (Primary accent)

See `src/app/globals.css` for complete theme configuration.

## Key Features

### Templates (10+)
Browse templates in `/config/templates.ts`:
- Minimalist
- Geometric
- Artistic
- Nature
- Abstract
- Retro

### Design Flow
1. **Browse Templates** → `/templates`
2. **Upload Image** → `/configure/upload?template=TEMPLATE_ID`
3. **Customize** → `/configure/design` (crop, adjust colors, materials)
4. **Order** → `/order?designId=DESIGN_ID&templateId=TEMPLATE_ID`
5. **Choose Contact Method** → WhatsApp or Email

### Dashboard
Users can:
- Search their designs by email
- View saved designs
- Copy design IDs
- Delete designs
- Order existing designs

## API Endpoints

### Designs
- `GET /api/designs?email=user@email.com` - Get user designs
- `POST /api/designs` - Save a new design
- `DELETE /api/designs/[id]` - Delete a design

### Orders
- `POST /api/send-order-email` - Send order via email

## Customization

### Change App Name
Update in:
- `package.json` (name)
- `/src/components/Navbar.tsx` (logo)
- `/src/components/Footer.tsx` (branding)
- `/src/app/layout.tsx` (metadata)

### Modify Templates
Edit `/src/config/templates.ts`:
```typescript
{
  id: 'your-template-id',
  name: 'Your Template',
  description: 'Description...',
  category: 'minimalist',
  colors: ['#color1', '#color2', '#color3'],
}
```

### Add New Routes
New design flow pages go in `/src/app/configure/`

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables
4. Deploy!

### Self-Hosted
```bash
npm run build
npm start
```

## Support

For issues or questions:
1. Check existing GitHub issues
2. Review `.env.example` for required variables
3. Ensure Supabase/UploadThing accounts are set up

## License

MIT - Feel free to customize and use for your business!

---

**Made with ❤️ for artisan creators**
