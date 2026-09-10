# 📊 Cómo Usar Firebase Analytics en Bodas.net

## ✅ Estado Actual

Firebase Analytics ya está **completamente configurado** en tu proyecto. El servicio se inicializa automáticamente cuando la aplicación carga.

## 🎯 Eventos Recomendados para Bodas.net

### 1. Eventos de Usuario

#### Registro de Usuario
```typescript
import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

// Cuando un usuario se registra
if (analytics) {
  logEvent(analytics, 'sign_up', {
    method: 'email', // o 'google'
    user_type: 'couple' // o 'provider'
  });
}
```

#### Inicio de Sesión
```typescript
if (analytics) {
  logEvent(analytics, 'login', {
    method: 'email',
    user_type: 'couple'
  });
}
```

### 2. Eventos de Búsqueda de Proveedores

```typescript
// Cuando un usuario busca proveedores
if (analytics) {
  logEvent(analytics, 'search', {
    search_term: selectedCategory,
    province: selectedProvince,
    results_count: providers.length
  });
}
```

### 3. Eventos de Interacción con Proveedores

#### Ver Perfil de Proveedor
```typescript
if (analytics) {
  logEvent(analytics, 'view_item', {
    item_id: provider.id,
    item_name: provider.companyName,
    item_category: provider.category,
    item_location: `${provider.city}, ${provider.province}`
  });
}
```

#### Solicitar Presupuesto
```typescript
if (analytics) {
  logEvent(analytics, 'generate_lead', {
    provider_id: provider.id,
    provider_name: provider.companyName,
    category: provider.category,
    value: estimatedBudget // opcional
  });
}
```

#### Guardar Proveedor Favorito
```typescript
if (analytics) {
  logEvent(analytics, 'add_to_wishlist', {
    provider_id: provider.id,
    provider_name: provider.companyName,
    category: provider.category
  });
}
```

### 4. Eventos de Gestión de Invitados

#### Añadir Invitado
```typescript
if (analytics) {
  logEvent(analytics, 'add_guest', {
    group: guest.group,
    total_guests: totalGuestCount
  });
}
```

#### Organizar Mesas
```typescript
if (analytics) {
  logEvent(analytics, 'organize_tables', {
    table_count: tables.length,
    total_guests: totalGuests,
    seated_guests: seatedGuests
  });
}
```

### 5. Eventos de Presupuesto

```typescript
// Cuando se actualiza el presupuesto
if (analytics) {
  logEvent(analytics, 'update_budget', {
    category: budgetCategory,
    amount: budgetAmount,
    total_budget: totalBudget
  });
}
```

### 6. Eventos de Navegación

```typescript
// Al cambiar de vista/sección
if (analytics) {
  logEvent(analytics, 'screen_view', {
    screen_name: 'Guest Management',
    screen_class: 'CoupleDashboard'
  });
}
```

## 🔧 Implementación en Componentes

### Ejemplo: PublicHomepage

```typescript
import { useEffect } from 'react';
import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

function PublicHomepage() {
  useEffect(() => {
    // Registrar vista de página
    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_title: 'Home',
        page_location: window.location.href,
        page_path: window.location.pathname
      });
    }
  }, []);

  const handleSearch = () => {
    if (analytics) {
      logEvent(analytics, 'search', {
        search_term: selectedCategory || 'all',
        province: selectedProvince || 'all'
      });
    }
    setShowSearchResults(true);
  };

  return (
    // ... tu componente
  );
}
```

### Ejemplo: ProviderCard

```typescript
function ProviderCard({ provider }: { provider: ProviderCompany }) {
  const handleViewProfile = () => {
    if (analytics) {
      logEvent(analytics, 'select_content', {
        content_type: 'provider',
        item_id: provider.id,
        content_name: provider.companyName,
        content_category: provider.category
      });
    }
    // Navegar al perfil
  };

  const handleRequestQuote = () => {
    if (analytics) {
      logEvent(analytics, 'generate_lead', {
        provider_id: provider.id,
        provider_name: provider.companyName,
        category: provider.category
      });
    }
    // Abrir formulario de presupuesto
  };

  return (
    // ... tu tarjeta de proveedor
  );
}
```

## 📈 Eventos E-commerce (Para Proveedores Premium)

```typescript
// Cuando un proveedor se suscribe a Premium
if (analytics) {
  logEvent(analytics, 'purchase', {
    transaction_id: subscriptionId,
    value: subscriptionPrice,
    currency: 'EUR',
    items: [{
      item_id: 'premium_subscription',
      item_name: 'Suscripción Premium',
      item_category: 'subscription',
      price: subscriptionPrice,
      quantity: 1
    }]
  });
}

// Cuando se inicia el proceso de pago
if (analytics) {
  logEvent(analytics, 'begin_checkout', {
    value: subscriptionPrice,
    currency: 'EUR',
    items: [{
      item_id: 'premium_subscription',
      item_name: 'Suscripción Premium'
    }]
  });
}
```

## 🎯 Custom Events (Eventos Personalizados)

```typescript
// Eventos específicos de Bodas.net
if (analytics) {
  // Cuando se confirma una fecha de boda
  logEvent(analytics, 'set_wedding_date', {
    date: weddingDate,
    days_until_wedding: daysUntilWedding
  });

  // Cuando se completa el checklist
  logEvent(analytics, 'checklist_progress', {
    completed_tasks: completedTasks,
    total_tasks: totalTasks,
    completion_percentage: (completedTasks / totalTasks) * 100
  });

  // Cuando se envían invitaciones
  logEvent(analytics, 'send_invitations', {
    invitation_count: invitationsSent,
    method: 'email' // o 'physical'
  });
}
```

## 🔍 Debugging

### Ver Eventos en Tiempo Real

1. Ve a Firebase Console
2. **Analytics** → **DebugView**
3. Activa el modo debug en tu navegador:

```javascript
// En la consola del navegador
window['FIREBASE_ANALYTICS_DEBUG'] = true;
```

### Ver en Consola del Navegador

```typescript
import { setAnalyticsCollectionEnabled } from 'firebase/analytics';

// Activar/desactivar en desarrollo
if (import.meta.env.DEV) {
  console.log('Analytics enabled:', analytics !== null);
}
```

## 📊 Métricas Clave a Rastrear

### Para Parejas (Couples)
- Búsquedas de proveedores
- Proveedores contactados
- Presupuesto total configurado
- Número de invitados agregados
- Tareas completadas en checklist
- Tiempo desde registro hasta fecha de boda

### Para Proveedores (Providers)
- Vistas de perfil
- Solicitudes de presupuesto recibidas
- Tasa de conversión (solicitudes → confirmaciones)
- Promociones creadas
- Respuestas enviadas
- Tiempo de respuesta promedio

## 🚀 Mejores Prácticas

1. **Siempre verifica que analytics existe**:
   ```typescript
   if (analytics) {
     logEvent(...);
   }
   ```

2. **No envíes información personal identificable**:
   ```typescript
   // ❌ MAL
   logEvent(analytics, 'user_action', {
     email: user.email,
     phone: user.phone
   });

   // ✅ BIEN
   logEvent(analytics, 'user_action', {
     user_id: user.uid,
     user_type: 'couple'
   });
   ```

3. **Usa nombres de eventos consistentes**:
   - Usa snake_case para nombres de eventos
   - Mantén un documento con todos los eventos
   - Usa parámetros estándar cuando sea posible

4. **Limita el número de eventos personalizados**:
   - Firebase tiene límites: 500 eventos distintos
   - Agrupa eventos similares usando parámetros

## 📱 Ver Resultados

### Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/u/0/project/fincas-para-boda/analytics)
2. **Analytics** → **Dashboard**
3. Verás métricas en tiempo real y reportes

### Reportes Disponibles
- **Users**: Usuarios activos, demografía
- **Events**: Eventos más frecuentes
- **Conversions**: Eventos de conversión configurados
- **Retention**: Retención de usuarios
- **Revenue**: Ingresos (si configuras e-commerce)

## 🎯 Próximos Pasos

1. Revisa los componentes principales y añade eventos
2. Configura conversiones en Firebase Console
3. Crea funnels personalizados
4. Integra con Google Ads (opcional)
5. Analiza datos y optimiza la experiencia de usuario

---

**Proyecto**: Bodas.net (fincas-para-boda)
**Firebase Project ID**: fincas-para-boda
**Analytics ID**: G-3KL3053K1Q
