export default async function ProvincePage(props) {
    const params = await props.params;
    const { provincia } = params;
    return (<main className="p-8">
      <h1 className="text-4xl font-bold uppercase">Mariachis en {provincia.replace(/-/g, ' ')}</h1>
      <p className="mt-4">Contratación directa de artistas verificados en la provincia de {provincia.replace(/-/g, ' ')}.</p>
      <div className="mt-8 bg-green-500 p-4 rounded text-white font-bold">
        <a href="https://wa.me/34693693048">Contactar con Edwin (Artista Principal)</a>
      </div>
    </main>);
}
