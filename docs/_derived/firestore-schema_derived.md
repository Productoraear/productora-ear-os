<!-- 
  LIVING DOCS DERIVED SNAPSHOT
  Canonical Source: docs\artists\firestore-schema.md
  Generated At: 2026-08-06T21:56:57.7733281Z
  Hash SHA256: 3239F8859690FA3CA06C3124E5A13822187EFEA55E19D96B36807A23456BB758
  Freshness Score: 0/100
  Mode: HUMAN_CANONICAL | Status: STALE
  DO NOT EDIT DIRECTLY - EDIT CANONICAL SOURCE
-->
# Firestore Database Schema Specification — VIMUME Talent OS V2

This document details the sovereign database collection schema designed to manage the high-conversion artist roster, booking pipelines, and financial ledger agreements of Productora EAR.

---

## 📂 Core Collections

### 1. `ear_artist_profiles`
Main collection storing artistic details, metadata, and territorial exclusivity agreements.
- **Path**: `/ear_artist_profiles/{artistId}`
- **Fields**:
  ```json
  {
    "id": "ART-WAG-001",
    "user_id": "UID_EDWIN_AGUDELO",
    "artisticName": "Edwin Agudelo",
    "legalName": "Edwin Agudelo y Sol de Oro SL",
    "shortBio": "Productor insignia de mariachi de gala y estimulación cognitiva.",
    "longBio": "Con más de 20 años de trayectoria musical, Edwin Agudelo...",
    "baseOperations": "Madrid, España",
    "genres": ["Mariachi Sinfónico", "Estimulación Gamma"],
    "profileImageUrl": "https://productoraear.com/assets/edwin_profile.jpg",
    "mediaGallery": [
      "https://productoraear.com/assets/gallery_1.jpg",
      "https://productoraear.com/assets/gallery_2.jpg"
    ],
    "socialLinks": {
      "spotify": "https://open.spotify.com/artist/edwin",
      "instagram": "https://instagram.com/edwin"
    },
    "territories": ["Madrid", "Barcelona", "Sevilla", "Valencia"],
    "createdAt": "2026-05-17T09:00:00Z"
  }
  ```

### 2. `ear_smart_contracts`
Legal agreements, commission distributions, and initial advance allocations.
- **Path**: `/ear_smart_contracts/{contractId}`
- **Fields**:
  ```json
  {
    "id": "CTR-WAG-001",
    "artistId": "ART-WAG-001",
    "title": "Acuerdo de Co-Edición Sinfónica del Colibrí",
    "commissionLabelPercent": 25,
    "commissionArtistPercent": 75,
    "advancePaymentEur": 5000,
    "effectiveDate": "2026-05-01",
    "expirationDate": "2028-05-01",
    "status": "FIRMADO",
    "signedPdfUrl": "https://productoraear.com/vault/contracts/ctr_wag_001.pdf"
  }
  ```

### 3. `ear_bookings`
Performance dates, event types, travel details, and Stripe deposit ledger logs.
- **Path**: `/ear_bookings/{bookingId}`
- **Fields**:
  ```json
  {
    "id": "BKG-2026-001",
    "artistId": "ART-WAG-001",
    "clientName": "Carmen Rodríguez",
    "eventType": "Boda",
    "eventDate": "2026-06-20",
    "location": "Madrid",
    "durationMinutes": 90,
    "totalCachéEur": 750,
    "depositEur": 100,
    "stripePaymentId": "ch_3M7t9...",
    "status": "CONFIRMADO"
  }
  ```

---

## 🛡️ Firestore Security Rules (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function hasRole(role) {
      return request.auth != null && request.auth.token.role == role;
    }

    match /ear_artist_profiles/{artistId} {
      allow read: if request.auth != null;
      allow write: if hasRole('super_admin') || hasRole('label_admin') || (hasRole('artist') && request.auth.uid == resource.data.user_id);
    }

    match /ear_smart_contracts/{contractId} {
      allow read: if request.auth != null && (hasRole('super_admin') || hasRole('label_admin') || request.auth.uid == resource.data.user_id);
      allow write: if hasRole('super_admin') || hasRole('label_admin');
    }

    match /ear_bookings/{bookingId} {
      allow read, write: if request.auth != null;
    }
  }
}
```
