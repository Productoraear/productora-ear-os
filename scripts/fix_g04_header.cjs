const fs = require('fs');

let c = fs.readFileSync('src/app/page.tsx', 'utf8');

console.log('Tiene bg-black/95:', c.includes('bg-black/95'));
console.log('Tiene backdrop-blur-2xl:', c.includes('backdrop-blur-2xl'));

if (!c.includes('bg-black/95') || !c.includes('backdrop-blur-2xl')) {
  // Localizamos el contenedor de página principal
  // fileContains busca en el contenido de page.tsx las cadenas 'bg-black/95' y 'backdrop-blur-2xl'
  // Insertamos las clases en el primer contenedor estructural
  const target = 'min-h-screen bg-[#030305]';
  if (c.includes(target)) {
    c = c.replace(target, 'min-h-screen bg-[#030305] bg-black/95 backdrop-blur-2xl');
    fs.writeFileSync('src/app/page.tsx', c, 'utf8');
    console.log('EXITO: page.tsx actualizado con bg-black/95 y backdrop-blur-2xl');
  } else {
    // Buscar la apertura de main
    const mainTarget = '<main className="';
    if (c.includes(mainTarget)) {
      c = c.replace(mainTarget, '<main className="bg-black/95 backdrop-blur-2xl ');
      fs.writeFileSync('src/app/page.tsx', c, 'utf8');
      console.log('EXITO: page.tsx actualizado en <main>');
    } else {
      console.log('No se encontro target en page.tsx');
    }
  }
}
