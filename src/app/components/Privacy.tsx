import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="pt-24 bg-black min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-display font-bold text-white mb-8 border-b border-white/10 pb-8">Política de Privacidad</h1>
        
        <div className="prose prose-invert prose-lg text-gray-400 font-body">
          <p className="text-xl text-white mb-8">
            En Productora EAR, nos tomamos su privacidad tan en serio como la ejecución de sus eventos.
          </p>
          
          <h3 className="text-white font-display mt-8 mb-4">1. Recopilación de Información</h3>
          <p>
            Recopilamos información cuando usted se registra en nuestro sitio, inicia sesión en su cuenta, realiza una compra, participa en un concurso y/o cuando cierra sesión. La información recopilada incluye su nombre, dirección de correo electrónico, número de teléfono y/o tarjeta de crédito.
          </p>

          <h3 className="text-white font-display mt-8 mb-4">2. Uso de la Información</h3>
          <p>
            Cualquier información que recopilamos de usted puede usarse para:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Personalizar su experiencia y responder a sus necesidades individuales.</li>
            <li>Proporcionar contenido publicitario personalizado.</li>
            <li>Mejorar nuestro sitio web.</li>
            <li>Mejorar el servicio al consumidor y sus necesidades de soporte.</li>
            <li>Contactar por correo electrónico.</li>
            <li>Administrar un concurso, promoción o encuesta.</li>
          </ul>

          <h3 className="text-white font-display mt-8 mb-4">3. Protección del Comercio Electrónico</h3>
          <p>
            Somos los únicos propietarios de la información recopilada en este sitio. Su información de identificación personal no será vendida, intercambiada, transferida ni dada a ninguna otra empresa por ninguna razón, sin su consentimiento, a menos que sea necesario para cumplir con una solicitud y/o transacción, por ejemplo, para enviar un pedido.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
