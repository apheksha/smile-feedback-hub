# Smiles Feedback 😊

A beautiful, accessible feedback collection web app built with React, Vite,

## ✨ Features

- **Modern Design**: Soft pastel color palette (lavender, mint, blush, sky blue) with smooth animations
- **Full-Stack**: React frontend connected to Supabase backend for real-time data persistence
- **Accessible**: WCAG-compliant with keyboard navigation, ARIA labels, and focus states
- **Responsive**: Mobile-first design that looks great on all devices
- **Interactive**: Star rating system, form validation, success animations, and micro-interactions

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- A Supabase account - [Sign up free](https://supabase.com)

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   
   The database table is already created through Lovable's Supabase integration. The `feedbacks` table includes:
   - `id` (UUID, primary key)
   - `name` (text, optional)
   - `email` (text, optional)
   - `rating` (integer, 1-5, required)
   - `message` (text, required, min 10 characters)
   - `tags` (text, optional)
   - `consent` (boolean, required)
   - `created_at` (timestamp with timezone)

   Row Level Security (RLS) is enabled with policies for public insert and select.

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:8080](http://localhost:8080) in your browser.

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/                    # Shadcn UI components
│   ├── FeedbackForm.tsx       # Main feedback form with validation
│   ├── FeedbackCard.tsx       # Display card for feedback
│   └── StarRating.tsx         # Interactive star rating component
├── lib/
│   ├── formatDate.ts          # Date formatting utilities
│   └── utils.ts               # Utility functions
├── integrations/
│   └── supabase/
│       ├── client.ts          # Supabase client configuration
│       └── types.ts           # TypeScript types from Supabase
├── pages/
│   ├── Index.tsx              # Main page
│   └── NotFound.tsx           # 404 page
├── index.css                  # Design system and Tailwind CSS
└── App.tsx                    # Root component
```

## 🎨 Design System

The app uses a cohesive design system defined in `src/index.css`:

- **Primary**: Soft lavender (#B4A5D5 approx)
- **Secondary**: Mint green (#98C9B3 approx)
- **Accent**: Blush pink (#E8B4C8 approx)
- **Info**: Sky blue (#99C9E0 approx)

Custom animations include fade-in, scale, float, and the signature success morph animation.

## 🔒 Security & Best Practices

- **No hardcoded secrets**: Environment variables are used for Supabase credentials
- **Client-side validation**: All form inputs are validated before submission
- **Rate limiting hint**: Submit button is disabled during submission to prevent spam
- **RLS policies**: Supabase Row Level Security ensures data access control
- **Accessibility**: Full keyboard navigation, ARIA labels, and semantic HTML

### Adding RLS Policies (Already Configured)

The following RLS policies are already in place:

```sql
-- Allow anyone to submit feedback (public form)
CREATE POLICY "Anyone can submit feedback" 
ON public.feedbacks FOR INSERT WITH CHECK (true);

-- Allow anyone to view feedback (public display)
CREATE POLICY "Anyone can view feedback" 
ON public.feedbacks FOR SELECT USING (true);
```

## 📝 Usage

1. **Submit Feedback**: Fill out the form with your rating and message. Name, email, and tags are optional.
2. **View Latest**: The most recent feedback appears on the right side of the page.
3. **Refresh**: Click the refresh button to manually fetch the latest feedback.

## 🚢 Deployment

### Option 1: Lovable (Recommended)

Click the **Publish** button in the Lovable interface (top right on desktop, bottom right on mobile).

### Option 2: Manual Deployment

**Vercel:**
```bash
npm run build
vercel --prod
```

**Netlify:**
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 🛠️ Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Project info

**URL**: https://lovable.dev/projects/e3bbde10-741c-4d15-8647-dbb269c827ff

