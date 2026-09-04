export interface ServiceOffering {
  id: string;
  categoria: 'particular' | 'corporativo' | 'digital';
  titulo: string;
  resumen: string;
  detalles: string;
  inversionMinima?: number;
}

export const EDWIN_LEGACY_SERVICES: ServiceOffering[] = [
  {
    id: 'regalo-cumpleanos',
    categoria: 'particular',
    titulo: 'Contratar mariachis para regalo de cumpleaños',
    resumen: 'Llegar a su casa y que desde su ventana, balcón o salón pueda sentir el brillo de los instrumentos.',
    detalles: 'Contratar mariachis para regalo de cumpleaños y conseguir esa sonrisa inolvidable. Incluye la ejecución en directo bajo repertorio de autor.'
  },
  {
    id: 'regalo-boda',
    categoria: 'particular',
    titulo: 'Regalo de boda',
    resumen: 'Un día maravilloso no se puede ver empañado por improvisaciones.',
    detalles: 'Compromiso total con los sentimientos, la ilusión y la emoción de esperar el gran momento con una propuesta lírica de alto nivel.'
  },
  {
    id: 'quince-anos',
    categoria: 'particular',
    titulo: 'Fiesta de quince años',
    resumen: 'Regalo especial y tradicional para una fecha muy esperada en familia.',
    detalles: 'Una celebración tradicional adaptada a la máxima exigencia artística y sensibilidad musical.'
  },
  {
    id: 'dia-madre-padre',
    categoria: 'particular',
    titulo: 'Regalo Día de la Madre y del Padre',
    resumen: '¡Vamos y se lo decimos cantando!',
    detalles: 'Conexión profunda con las emociones familiares mediante canciones que exaltan la figura materna y paterna sin clichés.'
  },
  {
    id: 'conciertos-caballo',
    categoria: 'corporativo',
    titulo: 'Conciertos y show cantando a caballo',
    resumen: 'Espectáculo ecuestre con grandes éxitos de los corridos y rancheras.',
    detalles: 'Temas icónicos como El patas blancas, Caballo prieto azabache o El caballo blanco interpretados en directo con exhibición ecuestre.'
  },
  {
    id: 'serenata-virtual',
    categoria: 'digital',
    titulo: 'Serenata virtual / Vídeo personalizado',
    resumen: 'Un detalle exclusivo para la persona que quieres desde cualquier lugar del mundo.',
    detalles: 'Vídeo en alta calidad de imagen y sonido enviado directamente por email, adaptado a historias de cumpleaños, aniversarios o declaraciones.'
  },
  {
    id: 'cancion-personalizada',
    categoria: 'digital',
    titulo: 'Canción personalizada de autor',
    resumen: 'Un regalo diferente y exclusivo que llega directo al corazón.',
    detalles: 'Composición e interpretación a medida basada en los detalles emocionales facilitados por el cliente. Satisfacción garantizada.'
  }
];

export const MANAGEMENT_CONTACT = {
  managerGeneral: {
    nombre: 'Adriana Lenis',
    rol: 'Manager General',
    telefono: '+34 659 116 376'
  },
  jefaPrensa: {
    nombre: 'Eliana Tovar',
    rol: 'Jefa de Prensa',
    telefono: '+34 679 286 157'
  }
};
