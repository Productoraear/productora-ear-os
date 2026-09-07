const admin = require('firebase-admin');

// Quick verification script to check database state

const serviceAccount = require('./service-account-key.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function verifyDatabase() {
    console.log('🔍 VERIFICACIÓN DE BASE DE DATOS UNIO\n');
    console.log('='.repeat(70));

    // 1. Total proveedores
    const totalSnapshot = await db.collection('providers').count().get();
    const total = totalSnapshot.data().count;
    console.log(`\n📊 TOTAL PROVEEDORES: ${total.toLocaleString()}`);

    // 2. Por categoría
    console.log('\n📂 PROVEEDORES POR CATEGORÍA:');
    const categories = [
        'Fincas', 'Fotógrafos', 'Videógrafos', 'Catering', 'Restaurantes',
        'Música', 'Decoración', 'Floristas', 'Peluquería y Maquillaje',
        'Vestidos de Novia', 'Trajes de Novio', 'Joyería y Accesorios',
        'Invitaciones', 'Tartas de Boda', 'Coches de Boda', 'Otros'
    ];

    const categoryCounts = {};
    for (const cat of categories) {
        const snapshot = await db.collection('providers')
            .where('category', '==', cat)
            .count()
            .get();
        const count = snapshot.data().count;
        if (count > 0) {
            categoryCounts[cat] = count;
        }
    }

    Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([cat, count]) => {
            const percentage = ((count / total) * 100).toFixed(1);
            console.log(`   ${cat.padEnd(25)} ${count.toString().padStart(6)} (${percentage}%)`);
        });

    // 3. Con datos completos
    console.log('\n✅ CALIDAD DE DATOS:');

    const withPricing = await db.collection('providers')
        .where('pricing.min', '>', 0)
        .count()
        .get();
    console.log(`   Con precios: ${withPricing.data().count.toLocaleString()} (${((withPricing.data().count / total) * 100).toFixed(1)}%)`);

    const withImages = await db.collection('providers')
        .where('images', '!=', [])
        .count()
        .get();
    console.log(`   Con imágenes: ${withImages.data().count.toLocaleString()} (${((withImages.data().count / total) * 100).toFixed(1)}%)`);

    // 4. Sample de proveedores (primeros 5)
    console.log('\n📋 MUESTRA DE PROVEEDORES (primeros 5):');
    const sample = await db.collection('providers')
        .orderBy('name')
        .limit(5)
        .get();

    sample.docs.forEach((doc, idx) => {
        const data = doc.data();
        console.log(`\n   ${idx + 1}. ${data.name}`);
        console.log(`      Categoría: ${data.category}`);
        console.log(`      Ubicación: ${data.location || 'N/A'}`);
        console.log(`      Precio: ${data.pricing?.min ? `€${data.pricing.min}` : 'Consultar'}`);
        console.log(`      Imágenes: ${data.images?.length || 0}`);
        console.log(`      Score: ${data.metadata?.completeness_score || 'N/A'}/100`);
    });

    console.log('\n' + '='.repeat(70));
    console.log('✅ VERIFICACIÓN COMPLETADA\n');

    if (total >= 13000) {
        console.log('🎉 BASE DE DATOS LISTA PARA PRODUCCIÓN');
        console.log(`📈 ${total.toLocaleString()} proveedores disponibles`);
        console.log('🚀 Next.js puede consultar estos datos');
    } else {
        console.log('⚠️  Menos proveedores de lo esperado');
    }
}

verifyDatabase()
    .then(() => process.exit(0))
    .catch(err => {
        console.error('❌ Error:', err);
        process.exit(1);
    });
