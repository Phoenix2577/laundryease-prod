# LaundryEase - Christ University Hostel Laundry System

A production-ready digital laundry management system for Christ University hostels, serving ~1,000 students across multiple blocks.

## Features

### For Students
- **Login** with Student ID + password
- **Submit laundry** with interactive clothing counters
- **Real-time tracking** - Submitted → Picked Up → Washing → Ready → Delivered
- **View history** of all past submissions
- **Give feedback** with star ratings after delivery
- **Mobile notifications** via WhatsApp/Push

### For Admin (Laundry Head)
- **Dashboard** with live stats and analytics
- **Manage all requests** - update status in one click
- **Filter & search** by block, room, date, status
- **Bulk operations** on multiple requests
- **Export reports** to Excel
- **Weekly volume charts** and block-wise analytics

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 + React + TypeScript + Tailwind CSS |
| Backend | Supabase (PostgreSQL + Auth + Realtime) |
| Hosting | Vercel (free tier) |
| Notifications | WhatsApp Business API + Firebase Cloud Messaging |

## Quick Start

### 1. Clone & Install
```bash
git clone <repo-url>
cd laundryease
npm install
```

### 2. Set up Supabase
1. Go to [supabase.com](https://supabase.com) and create a free project
2. Copy your Project URL and Anon Key from Project Settings > API
3. Open the SQL Editor and run the entire `supabase-schema.sql` file
4. Copy `.env.example` to `.env.local` and fill in your credentials

### 3. Run Locally
```bash
npm run dev
# Open http://localhost:3000
```

### 4. Deploy to Vercel
```bash
npm i -g vercel
vercel --prod
```

## Database Schema Overview

```
students          - Student profiles (ID, name, hostel, room, quota)
admins            - Admin accounts (laundry head, staff)
laundry_requests  - All laundry submissions with status tracking
status_history    - Audit log of every status change
feedback          - Student ratings and suggestions
notifications     - In-app and WhatsApp notification log
hostel_blocks     - Reference table for all hostel blocks
```

## Christ University Hostel Blocks

| Block | Code | Capacity |
|-------|------|----------|
| Jonas Hall | JH | 240 |
| Christ Hall A | CHA | 200 |
| Christ Hall B | CHB | 200 |
| Christ Hall C | CHC | 160 |
| St. Kuriakose Elias Hall | SKEH | 180 |
| CST Vidyabhavan | CSTV | 120 |
| Devadan Hall | DH | 140 |
| PG Mens Hostel | PGM | 100 |

## Student Quota System

- Annual laundry fee: **Rs. 7,000** (already collected by university)
- System tracks remaining quota per student
- Per-item costs deducted from quota:
  - Shirts/T-Shirts: Rs. 15
  - Pants/Jeans: Rs. 20
  - Towels: Rs. 18
  - Bed Sheets: Rs. 25
  - Jackets: Rs. 30
  - etc.

## Notification Flow

```
Student submits → WhatsApp confirmation
Admin picks up → WhatsApp + Push notification
Washing starts → Status update
Ready for delivery → WhatsApp + OTP
Delivered → Feedback request
```

## Security

- Row Level Security (RLS) enabled on all tables
- Students can only access their own data
- Admins can access all data within their assigned blocks
- Passwords hashed with bcrypt
- All API calls authenticated via JWT

## Customization for Christ University

To adapt this for Christ University specifically:

1. **Update hostel_blocks** table with exact room counts
2. **Integrate university SSO** (if available) in `lib/supabase.ts`
3. **Upload student roster** via CSV import in Supabase
4. **Configure WhatsApp Business** account for notifications
5. **Set up custom domain** (e.g., laundry.christuniversity.in)

## Support

For technical issues or feature requests, contact the development team or raise an issue in the repository.

---

**Built for Christ University | LaundryEase v1.0**