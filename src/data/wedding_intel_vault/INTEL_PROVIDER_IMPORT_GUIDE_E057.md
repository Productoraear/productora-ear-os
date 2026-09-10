# 📋 Provider Import Guide - Bodas.net Clone

## 🎯 Overview

Your comprehensive wedding planning platform is now fully equipped to handle **14,000+ providers** from bodas.net. This guide explains how to import, manage, and leverage your massive provider database.

---

## 📊 Data Structure for Provider Import

### Expected CSV/JSON Format

Your provider data should match the `ProviderCompany` interface:

```typescript
{
  companyName: string;           // Company name
  province: string;              // One of 50 Spanish provinces
  city: string;                  // City name
  category: ProviderCategory;    // venue, catering, photography, etc.
  subcategory: string;           // Detailed activity (Finca, DJ, etc.)
  contactEmail: string;          // Contact email
  contactPhone: string;          // Phone number
  website?: string;              // Optional website
  description: string;           // Company description
  services: string[];            // Array of services offered
  photos: string[];              // Array of photo URLs
  videos: string[];              // Array of video URLs
  verified: boolean;             // Verification status
  premium: boolean;              // Premium status
  topProvider: boolean;          // Top provider badge
  rating: {
    average: number;             // Average rating (0-5)
    count: number;               // Number of reviews
  };
  promotions: Promotion[];       // Active promotions
}
```

---

## 🚀 Import Methods

### Method 1: Bulk Firebase Import (Recommended for 14K+ records)

**Using Firebase Admin SDK (Node.js script):**

```javascript
// import-providers.js
const admin = require('firebase-admin');
const fs = require('fs');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function importProviders() {
  // Read your provider data (CSV, JSON, etc.)
  const providers = JSON.parse(fs.readFileSync('providers.json', 'utf8'));

  // Batch write (500 records per batch max)
  const batchSize = 500;

  for (let i = 0; i < providers.length; i += batchSize) {
    const batch = db.batch();
    const chunk = providers.slice(i, i + batchSize);

    chunk.forEach(provider => {
      const docRef = db.collection('companies').doc();
      batch.set(docRef, {
        ...provider,
        userId: 'bulk-import', // Placeholder - update later
        availability: true,
        stats: { views: 0, contacts: 0, bookings: 0 },
        legalAccepted: true,
        privacyAccepted: true,
        registrationDate: admin.firestore.Timestamp.now(),
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now()
      });
    });

    await batch.commit();
    console.log(`Imported batch ${i / batchSize + 1} (${chunk.length} records)`);
  }

  console.log('✅ Import complete!');
}

importProviders().catch(console.error);
```

**Run the import:**
```bash
npm install firebase-admin
node import-providers.js
```

---

### Method 2: CSV to JSON Conversion

**If your data is in CSV format:**

```javascript
// csv-to-json.js
const fs = require('fs');
const csv = require('csv-parser');

const results = [];
const categoryMap = {
  'Banquetes': 'venue',
  'Fotógrafos': 'photography',
  'Vídeo': 'video',
  'Música': 'music',
  // ... add all category mappings
};

fs.createReadStream('bodas-providers.csv')
  .pipe(csv())
  .on('data', (row) => {
    results.push({
      companyName: row['Nombre Empresa'],
      province: row['Provincia'],
      city: row['Ciudad'],
      category: categoryMap[row['Categoría']] || 'other',
      subcategory: row['Subcategoría'],
      contactEmail: row['Email'],
      contactPhone: row['Teléfono'],
      website: row['Web'],
      description: row['Descripción'] || '',
      services: row['Servicios']?.split(',') || [],
      photos: [],
      videos: [],
      verified: row['Verificado'] === 'Si',
      premium: row['Premium'] === 'Si',
      topProvider: false,
      rating: {
        average: parseFloat(row['Rating']) || 0,
        count: parseInt(row['Num Reviews']) || 0
      },
      promotions: []
    });
  })
  .on('end', () => {
    fs.writeFileSync('providers.json', JSON.stringify(results, null, 2));
    console.log('✅ CSV converted to JSON');
    console.log(`Total providers: ${results.length}`);
  });
```

---

## 🔍 Advanced Search & Filtering

### Built-in Search Features

Your platform now includes:

1. **Province-based filtering** - 50 Spanish provinces
2. **Category filtering** - 15+ provider categories
3. **Subcategory filtering** - 8+ subcategories per category
4. **Price range filtering** - Min/max budget
5. **Rating filtering** - Minimum star rating
6. **Verified providers only** - Trust badge
7. **Premium providers** - Featured positioning
8. **Availability status** - Currently accepting bookings

### Search Implementation Example

```typescript
// Advanced provider search
const { data: searchResults } = useCollection<ProviderCompany>(
  'companies',
  [
    { field: 'province', operator: '==', value: 'Madrid' },
    { field: 'category', operator: '==', value: 'venue' },
    { field: 'verified', operator: '==', value: true },
    { field: 'rating.average', operator: '>=', value: 4.0 }
  ],
  'rating.average',
  'desc',
  20
);
```

---

## 🎨 Categories & Subcategories

### All 15 Provider Categories

1. **Venue** - Finca, Hotel, Hacienda, Castillo, Jardín, Playa, Restaurante, Casa Rural
2. **Catering** - Menú tradicional, Menú moderno, Vegetariano, Finger food, BBQ, Food trucks
3. **Photography** - Reportaje, Artística, Vintage, Fotografía + álbum
4. **Video** - Tradicional, Cinematográfico, Dron, Same day edit, Videoclip
5. **Music** - DJ, Banda en directo, Orquesta, Jazz, Guitarrista, Ceremonia
6. **Decoration** - Floral, Vintage, Moderna, Iluminación, Centros de mesa
7. **Flowers** - Ramos de novia, Decoración floral, Centros de mesa, Arcos florales
8. **Dress** - Clásico, Moderno, Vintage, A medida, Alquiler
9. **Suits** - Clásico, Moderno, Esmoquin, Chaqué, Alquiler
10. **Makeup** - Novia, Invitadas, Prueba de maquillaje, Tratamiento facial
11. **Hair** - Recogido, Suelto, Extensiones, Tocado, Prueba de peinado
12. **Invitations** - Clásicas, Modernas, Save the date, Menús, Tarjetas
13. **Transportation** - Coche clásico, Moderno, Limusina, Autobús, Calesa
14. **Accommodation** - Hotel, Casa rural, Apartamentos, Paquetes especiales
15. **Other** - Wedding planner, Animación, Photocall, Fuegos artificiales

---

## 🏆 Features Implemented

### For Couples (Usuarios)

✅ **Guest Management**
- Complete guest CRUD operations
- 8 predefined guest groups
- RSVP tracking (Pending, Confirmed, Declined)
- Table assignment system
- Excel import/export
- Menu preferences
- Dietary restrictions
- Contact information management
- QR code generation (ready for implementation)

✅ **Budget Management**
- 13 predefined budget categories
- Estimated vs actual tracking
- Paid/Pending status
- Payment due dates
- Category-wise breakdown
- Total budget calculation
- Download & print options

✅ **Provider Search & Discovery**
- Advanced filtering by province
- Category and subcategory filters
- Rating-based filtering
- Verified provider badges
- Premium provider highlighting
- Featured promotions display
- Provider comparison tools

✅ **Catalog/Wardrobe**
- Wedding dress catalog
- Suit catalog
- Party attire section
- Featured designers (Justin Alexander, Rosa Clará, Aire Barcelona, etc.)
- Save favorite items
- Company recommendations

✅ **Quote Requests**
- Request quotes from multiple providers
- Include wedding details (date, guest count, budget)
- Track quote status
- Compare received quotes

### For Providers (Proveedores)

✅ **Company Registration**
- 3-step onboarding process
- Province and category selection
- Contact information
- Service description
- Terms & conditions acceptance

✅ **Provider Dashboard**
- Overview with key metrics
- Profile views tracking
- Pending quote requests
- Contact statistics
- Rating display
- Performance tips

✅ **Quote Management**
- View all quote requests
- Filter by status (pending, viewed, responded, accepted, declined)
- Respond with custom pricing
- Message couples directly
- Track conversion rates

✅ **Analytics & Statistics**
- Profile view trends (30-day graph)
- Conversion rate tracking
- Competitor comparison
- Search position ranking
- Profile completion percentage

✅ **Calendar Integration**
- Booking management (coming soon)
- Availability tracking
- Event scheduling

✅ **Messaging System**
- Direct communication with couples (infrastructure ready)
- Conversation history
- Unread message tracking

---

## 📍 Geographic Coverage

### 50 Spanish Provinces Supported

- **North**: Álava, Asturias, Cantabria, Guipúzcoa, La Coruña, La Rioja, León, Lugo, Navarra, Orense, Pontevedra, Vizcaya
- **Central**: Ávila, Burgos, Guadalajara, Madrid, Palencia, Salamanca, Segovia, Soria, Valladolid, Zamora
- **East**: Barcelona, Castellón, Girona, Lérida, Tarragona, Valencia
- **South**: Almería, Cádiz, Córdoba, Granada, Huelva, Jaén, Málaga, Sevilla
- **West**: Badajoz, Cáceres
- **Islands**: Islas Baleares, Las Palmas, Santa Cruz de Tenerife
- **Other**: Albacete, Alicante, Ciudad Real, Cuenca, Huesca, Murcia, Teruel, Toledo, Zaragoza

---

## 🔐 Firebase Setup Requirements

### Firestore Collections

Your platform uses these collections:

1. **companies** - Provider company profiles (your 14,000+ providers)
2. **guests** - Guest list management
3. **tables** - Table seating arrangements
4. **quoteRequests** - Quote request system
5. **conversations** - Messaging between couples and providers
6. **messages** - Individual messages
7. **articles** - Blog/editorial content
8. **promotions** - Provider promotions

### Security Rules Example

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read for companies (providers)
    match /companies/{companyId} {
      allow read: if true;
      allow write: if request.auth != null &&
        (request.auth.uid == resource.data.userId ||
         request.auth.uid == request.resource.data.userId);
    }

    // Quote requests
    match /quoteRequests/{quoteId} {
      allow read, write: if request.auth != null;
    }

    // Guest management (private to user)
    match /guests/{guestId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📈 Performance Optimization

### For Large Provider Database (14,000+ records)

**1. Implement Pagination:**
```typescript
const pageSize = 20;
const { data, hasMore, loadMore } = useCollectionPaginated<ProviderCompany>(
  'companies',
  filters,
  'rating.average',
  'desc',
  pageSize
);
```

**2. Use Composite Indexes:**
Create in Firebase Console:
- `companies` collection
  - Index: `province ASC`, `category ASC`, `rating.average DESC`
  - Index: `category ASC`, `verified ASC`, `rating.average DESC`
  - Index: `province ASC`, `verified ASC`, `premium DESC`

**3. Implement Search with Algolia (Recommended):**
```bash
npm install algoliasearch instantsearch.js react-instantsearch
```

**4. Cache Provider Data:**
- Use TanStack Query's 5-minute stale time (already configured)
- Implement service worker for offline access

---

## 🎯 Next Steps

### Immediate Actions

1. **Import Your Provider Data**
   - Convert your bodas.net data to the required format
   - Run the bulk import script
   - Verify data integrity

2. **Configure Firebase**
   - Set up Firestore indexes
   - Configure security rules
   - Enable authentication

3. **Customize Branding**
   - Update logo and colors
   - Customize email templates
   - Add your domain

### Advanced Features to Implement

1. **Provider Photo/Video Upload**
   - Firebase Storage integration
   - Image optimization
   - Gallery management

2. **Review System**
   - Verified reviews only
   - Photo reviews
   - Provider responses

3. **Advanced Search**
   - Algolia integration
   - Fuzzy search
   - Autocomplete

4. **Payment Integration**
   - Stripe Connect for provider payments
   - Commission tracking
   - Premium subscriptions

5. **Email Notifications**
   - Quote request notifications
   - Booking confirmations
   - Review requests

---

## 💡 Tips for Success

### Provider Quality
- Verify all provider contact information
- Require minimum photo count for visibility
- Implement review moderation
- Highlight top-rated providers

### User Experience
- Fast search results (<500ms)
- Mobile-responsive design
- Clear CTAs for quote requests
- Simple registration process

### SEO Optimization
- Provider pages with SEO-friendly URLs
- Meta descriptions for each category
- Structured data markup
- Province-specific landing pages

---

## 📞 Support

For questions about:
- Data import issues
- Firebase configuration
- Feature customization
- Performance optimization

Contact the development team or refer to the main documentation.

---

## 🎉 Summary

Your bodas.net-inspired platform is ready for:
- ✅ 14,000+ provider management
- ✅ Advanced search and filtering
- ✅ Quote request system
- ✅ Provider dashboards
- ✅ Guest management
- ✅ Budget tracking
- ✅ Multi-category support
- ✅ Geographic coverage (all Spain)
- ✅ Scalable architecture

**Start importing your providers today and launch your wedding planning empire! 🚀💍**
