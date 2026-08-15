import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-[#1A1B26] text-white h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Bienvenido a EAR OS V2</h1>
        <p className="text-xl mb-8">El ecosistema de eventos, artistas y proyectos.</p>
        <button className="bg-yellow-300 text-black px-6 py-3 rounded-lg hover:bg-yellow-400 transition duration-300 ease-in-out">
          Empezar
        </button>
      </div>
    </div>
  );
};

export default LandingPage;