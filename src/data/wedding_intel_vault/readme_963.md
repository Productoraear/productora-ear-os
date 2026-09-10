Storage();

  const handleUpload = async (file: File) => {
    const path = `users/${userId}/gallery/${Date.now()}_${file.name}`;
    const url = await upload(path, file);
    console.log('Uploaded to:', url);
    console.log('Progress:', progress);
  };
}
```

### Wedding-Specific Utilities

```typescript
import {
  searchProviders,
  getBudgetSummary,
  getRSVPStats,
  bulkImportGuests
} from '@/lib/firebase';

// Search providers
const providers = await searchProviders({
  category: ProviderCategory.PHOTOGRAPHY,
  city: 'New York',
  minRating: 4.5,
  verified: true,
});

// Get budget summary
const budget = await getBudgetSummary(userId);
console.log('Total budget:', budget.total);
console.log('Paid:', budget.paid);
console.log('By category:', budget.byCategory);

// Get RSVP statistics
const rsvp = await getRSVPStats(userId);
console.log('Confirmed guests:', rsvp.confirmed);
console.log('Pending:', rsvp.pending);

// Bulk import guests
const guestsToImport = [
  { name: 'John Doe', email: 'john@example.com', group: GuestGroup.FAMILY },
  { name: 'Jane Smith', email: 'jane@example.com', group: GuestGroup.FRIENDS },
];
await bulkImportGuests(userId, guestsToImport);
```

## Features Implemented

### Core Features
- ✅ Complete authentication system (email, Google, Facebook, Apple)
- ✅ Real-time Firestore synchronization
- ✅ Task management with deadlines and categories
- ✅ Guest list with RSVP tracking
- ✅ Budget tracking with payment status
- ✅ Provider directory with search and filters
- ✅ File upload with progress tracking
- ✅ User profile management

### Advanced Features
- ✅ Real-time listeners for live updates
- ✅ Batch operations for bulk updates
- ✅ Search and filter functionality
- ✅ Aggregate calculations (ratings, budgets, RSVPs)
- ✅ Provider review system
- ✅ Wedding stories and testimonials
- ✅ Community forum
- ✅ Contest system
- ✅ Anniversary tracking
- ✅ QR code generation for guests

### UI Components
- ✅ Authentication screens (sign in/sign up)
- ✅ Dashboard with statistics
- ✅ Task manager
- ✅ Guest list manager
- ✅ Budget tracker
- ✅ Provider directory
- ✅ Gallery manager
- ✅ Responsive design with Tailwind CSS

## Development

```bash
# Install dependencies
npm install

# Run type checking and linting
npm run check:safe

# Build for production
npm run build
```

## TypeScript Types

All Firestore data models are fully typed. Import types from:

```typescript
import type {
  UserProfile,
  Tarea,
  Invitado,
  Presupuesto,
  Provider,
  Review,
  Experiencia,
  ForoPost,
  // ... and many more
} from '@/lib/firebase/types';

import {
  TaskStatus,
  TaskCategory,
  RSVPStatus,
  GuestGroup,
  PaymentStatus,
  ProviderCategory,
  // ... and many more enums
} from '@/lib/firebase/types';
```

## Next Steps

1. **Set up Firebase project** - Create project in Firebase Console
2. **Configure environment variables** - Add your Firebase config to `.env`
3. **Deploy security rules** - Apply Firestore and Storage rules
4. **Enable authentication providers** - Configure OAuth for social login
5. **Add initial data** - Seed your database with providers and sample data
6. **Set up Cloud Functions** (optional) - For advanced features like:
   - Automated email notifications
   - Scheduled reminders
   - Rating aggregation
   - Image optimization
   - Payment processing

## Production Checklist

- [ ] Enable Firebase App Check for abuse prevention
- [ ] Set up Firebase Performance Monitoring
- [ ] Configure Firebase Analytics
- [ ] Implement proper error tracking (Sentry, etc.)
- [ ] Add comprehensive logging
- [ ] Set up backup schedules for Firestore
- [ ] Implement rate limiting
- [ ] Add CAPTCHA to forms
- [ ] Configure CORS for Storage
- [ ] Set up CDN for static assets
- [ ] Implement proper SEO metadata
- [ ] Add PWA support with service workers
- [ ] Configure custom domain
- [ ] Set up SSL certificates

## Troubleshooting

### Error: "Firebase: Error (auth/api-key-not-valid)"

**Cause**: The Firebase API key in your `.env` file is not valid or is still set to the placeholder value `your_api_key_here`.

**Solution**:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create one if you haven't)
3. Click the gear icon → Project settings
4. Scroll down to "Your apps" section
5. Click on your web app (or create one with the `</>` icon)
6. Copy the configuration values
7. Replace ALL the `your_*_here` values in `.env` with your actual Firebase credentials
8. **IMPORTANT**: Restart your development server after editing `.env`

```bash
# Stop the server (Ctrl+C)
npm run dev
```

### Error: "Firebase no está configurado correctamente"

This is the new helpful error screen that appears when Firebase is not configured. It provides step-by-step instructions:

1. Crea