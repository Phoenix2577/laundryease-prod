# Deployment Guide - Christ University LaundryEase

## Step 1: Prepare Your Accounts (15 minutes)

### A. Supabase (Database + Auth)
1. Go to https://supabase.com
2. Click "New Project"
3. Name: `christ-laundry`
4. Database Password: (save this securely)
5. Region: `Mumbai (Asia South)` or `Singapore`
6. Click "Create new project"
7. Wait 2-3 minutes for project to initialize

### B. Vercel (Hosting)
1. Go to https://vercel.com
2. Sign up with GitHub (recommended)
3. Connect your GitHub repository (or create one)

### C. GitHub (Code Repository)
1. Go to https://github.com/new
2. Repository name: `laundryease-christ`
3. Make it Private
4. Initialize with README

## Step 2: Push Code to GitHub (5 minutes)

```bash
# In your project folder
git init
git add .
git commit -m "Initial commit - LaundryEase for Christ University"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/laundryease-christ.git
git push -u origin main
```

## Step 3: Set Up Supabase Database (10 minutes)

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open the `supabase-schema.sql` file from this project
4. Copy ALL the SQL code
5. Paste into the SQL Editor
6. Click **Run**
7. Verify: Go to **Table Editor** - you should see tables created

### Get Your API Keys
1. Go to **Project Settings** (gear icon) > **API**
2. Copy:
   - `URL` → this is your `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → this is your `SUPABASE_SERVICE_ROLE_KEY` (KEEP SECRET!)

## Step 4: Deploy to Vercel (10 minutes)

### Option A: Via Vercel Dashboard (Easiest)
1. In Vercel Dashboard, click **Add New Project**
2. Import your GitHub repository
3. Configure:
   - Framework Preset: `Next.js`
   - Build Command: `next build`
   - Output Directory: `dist`
4. Add Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key
   SUPABASE_SERVICE_ROLE_KEY = your-service-role-key
   ```
5. Click **Deploy**
6. Wait 2-3 minutes for build to complete

### Option B: Via CLI
```bash
npm i -g vercel
vercel
# Follow prompts to link to your project
vercel --prod
```

## Step 5: Configure Custom Domain (Optional, 10 minutes)

If Christ University provides a subdomain:

1. In Vercel Dashboard, go to your project
2. Click **Settings** > **Domains**
3. Add your domain: `laundry.christuniversity.in`
4. Follow DNS configuration instructions
5. Wait for SSL certificate (automatic, ~2 minutes)

## Step 6: Upload Student Data (15 minutes)

### Prepare CSV File
Create a file `students.csv` with columns:
```csv
student_id,full_name,email,phone,hostel_block,room_number
CHRIST2024001,Rahul Sharma,rahul.s@christuniversity.in,9876543210,Jonas Hall,204-B
CHRIST2024002,Priya Menon,priya.m@christuniversity.in,9876543211,Christ Hall A,112-A
```

### Import to Supabase
1. In Supabase Dashboard, go to **Table Editor**
2. Click **students** table
3. Click **Insert** > **Import data from CSV**
4. Upload your CSV file
5. Map columns and import

## Step 7: Set Up Admin Account (5 minutes)

1. In Supabase **Table Editor**, go to **admins** table
2. Click **Insert row**
3. Fill in:
   - email: `laundry.head@christuniversity.in`
   - full_name: `Laundry Head Name`
   - role: `laundry_head`
   - hostel_blocks: `{Jonas Hall, Christ Hall A, Christ Hall B, ...}`
4. Set password (or use Supabase Auth)

## Step 8: Test Everything (10 minutes)

### Student Flow Test
1. Open your deployed URL
2. Login with a student ID from your CSV
3. Submit a test laundry request
4. Check that it appears in the database

### Admin Flow Test
1. Login with admin credentials
2. View the dashboard
3. Update status of the test request
4. Verify status history is logged

### Check Notifications
1. If WhatsApp is configured, check messages
2. Otherwise, check in-app notifications

## Step 9: Go Live Checklist

- [ ] All 1,000 students imported
- [ ] Admin accounts created
- [ ] WhatsApp Business API approved (if using)
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Tested on mobile devices
- [ ] Student orientation/training planned
- [ ] Backup strategy configured (Supabase auto-backups)

## Troubleshooting

### Build Fails on Vercel
- Check that `next.config.js` has `output: 'export'`
- Verify all dependencies in `package.json`
- Check build logs in Vercel dashboard

### Database Connection Issues
- Verify environment variables are correct
- Check Supabase project is in correct region
- Ensure RLS policies allow access

### Images Not Loading
- Since we use `unoptimized: true`, images should work
- If using external images, add domains to `next.config.js`

## Maintenance

### Weekly
- Check dashboard analytics
- Review feedback and ratings
- Monitor quota usage

### Monthly
- Export reports for accounting
- Review and optimize costs
- Update student roster if needed

### Backup
Supabase automatically backs up daily. To restore:
1. Go to Supabase Dashboard > Database > Backups
2. Select backup point
3. Click Restore

---

**Your LaundryEase system should now be live and ready for 1,000 students!**

For issues, contact: [your-email@christuniversity.in]