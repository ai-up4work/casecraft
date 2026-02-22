# CaseCraft - Route Map

## Public Routes

### `/` - Homepage
**Description:** Landing page with hero, features, testimonials, CTA
**Actions:** 
- "Explore Templates" → `/templates`
- View features and social proof
- Responsive design for mobile/desktop

---

### `/templates` - Template Browser
**Description:** Browse and filter 10+ design templates
**Components:**
- Category filter (All, Minimalist, Geometric, Artistic, Nature, Abstract, Retro)
- Template cards with color preview
- "Choose Template" CTA for each

**Action:** Click "Choose Template" → `/configure/upload?template=TEMPLATE_ID`

---

### `/configure/upload` - Image Upload
**Description:** Drag & drop file uploader
**Query Params:**
- `template` - Selected template ID (required)
- Redirects to design customizer after upload

**File Types:** PNG, JPG, JPEG

**Action:** After upload → `/configure/design?id=CONFIG_ID&template=TEMPLATE_ID`

---

### `/configure/design` - Design Customizer
**Description:** Existing customizer component
**Features:**
- Crop image
- Adjust colors (Black, Blue, Rose, Obsidian, Copper)
- Select phone model
- Choose material (Silicone, Polycarbonate)
- Choose finish (Smooth, Textured)
- Preview on phone mockup
- Save design (optional)

**Action:** 
- "Continue to Order" → `/order?templateId=TEMPLATE&designId=DESIGN_ID` (if saved)
- Or direct → `/order?templateId=TEMPLATE`

---

### `/order` - Order Information
**Description:** Collect customer details for order
**Form Fields:**
- Full Name *
- Email *
- Phone Number *
- Street Address *
- City *
- Postal Code *
- State/Province
- Country *

**Actions:**
- "Order via WhatsApp" - Opens WhatsApp with pre-filled order details
- "Order via Email" - Sends order confirmation email
- "Back to Templates" - Returns to template selection

---

### `/dashboard` - My Designs
**Description:** User design library (email-based lookup)
**Features:**
- Email search field
- Grid of user's saved designs
- Design preview images
- "Order This Design" button for each
- Copy Design ID
- Delete design

**Entry:** Search with email → Shows all designs for that email

---

### `/configure/preview` - Design Preview
**Description:** Final preview before confirming (existing)
**Displays:** Phone case mockup with selected image
**Actions:** Proceed to checkout/order flow

---

## API Routes (Backend)

### `GET /api/designs?email=user@email.com`
**Response:** Array of user's saved designs
```json
[
  {
    "id": "design_123",
    "email": "user@email.com",
    "template_id": "minimalist-white",
    "design_name": "My Case Design",
    "image_url": "https://...",
    "created_at": "2024-01-15T10:30:00Z"
  }
]
```

---

### `POST /api/designs`
**Body:**
```json
{
  "email": "user@email.com",
  "templateId": "minimalist-white",
  "designName": "My Awesome Case",
  "imageUrl": "https://...",
  "croppedImageUrl": "https://...",
  "phoneModel": "iphone15",
  "caseColor": "black",
  "caseMaterial": "silicone",
  "caseFinish": "smooth",
  "width": 1080,
  "height": 1350
}
```
**Response:** Saved design object with ID

---

### `DELETE /api/designs/[id]`
**Response:** Success confirmation

---

### `POST /api/send-order-email`
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1 555-000-0000",
  "address": "123 Main St",
  "city": "New York",
  "postalCode": "10001",
  "country": "United States",
  "state": "NY",
  "designId": "design_123",
  "templateId": "minimalist-white"
}
```
**Response:** Email sent confirmation

---

## Navigation Flows

### Complete Order Flow
```
Homepage
  ↓ [Explore Templates]
/templates
  ↓ [Choose Template]
/configure/upload?template=ID
  ↓ [Image uploaded]
/configure/design?id=CONFIG&template=ID
  ↓ [Customize complete]
/order?templateId=ID&designId=ID
  ↓ [Choose contact]
  ├─ WhatsApp (external)
  └─ Email confirmation
```

### Quick Order (No Save)
```
/templates
  ↓ [Choose Template]
/configure/upload?template=ID
  ↓ [Upload & Skip to Customizer]
/configure/design
  ↓ [Don't save]
/order?templateId=ID
  ↓ [Contact direct]
```

### Dashboard Flow
```
/dashboard
  ↓ [Enter email]
  ├─ [No designs] → Prompt to create
  └─ [View designs]
    ├─ [Order This] → /order?designId=ID
    ├─ [Copy ID] → Copy to clipboard
    └─ [Delete] → Confirmation
```

---

## URL Parameters

| Route | Param | Type | Required | Purpose |
|-------|-------|------|----------|---------|
| `/configure/upload` | `template` | string | Yes | Template ID to use |
| `/configure/design` | `id` | string | Yes | Configuration ID |
| `/configure/design` | `template` | string | Yes | Template ID |
| `/order` | `templateId` | string | Yes | Selected template |
| `/order` | `designId` | string | No | Saved design to order |
| `/api/designs` | `email` | string | Yes | User email |

---

## Error Handling

### Common Issues

**404 Not Found:** Invalid configuration or design ID
**400 Bad Request:** Missing required fields in form/API
**500 Server Error:** Upload failed, email failed, database error

Each error shows user-friendly toast notification with:
- Error message
- Suggested action
- Link to try again

---

## Mobile Considerations

All routes are fully responsive:
- Stacked layout on mobile
- Touch-friendly buttons and inputs
- Optimized image sizes
- Simplified navigation

---

## SEO & Metadata

| Route | Title | Description |
|-------|-------|-------------|
| `/` | CaseCraft - Your Phone, Your Canvas | Create custom phone cases with artisan templates |
| `/templates` | Choose Your Template - CaseCraft | Browse 10+ professionally designed templates |
| `/dashboard` | My Designs - CaseCraft | View and manage your saved case designs |
| `/order` | Order Your Case - CaseCraft | Complete your order information |

---

## Rate Limiting & Security

- Design upload: Max 5MB images via UploadThing
- Email sends: Rate limited by email service
- Order emails: No rate limit (direct user action)
- Dashboard: Any email can search (designs are public by ID for ordering)

---

## Deployment Notes

All routes work in:
- Local development
- Vercel preview deployments
- Production (vercel.com)

API routes automatically deploy as serverless functions.

---

**Map Version:** 1.0  
**Last Updated:** Feb 2026  
**Brand:** CaseCraft - "Your phone, your canvas."
