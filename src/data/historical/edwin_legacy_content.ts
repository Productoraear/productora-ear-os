export interface HistoricalServiceCopy {
  id: string;
  titulo: string;
  subtitulo: string;
  cuerpo: string;
  imagenReferencia: string;
}

export const EDWIN_ARCHIVED_SERVICES: HistoricalServiceCopy[] = [
  {
    id: 'mariachi-cumpleanos',
    titulo: 'Contratar mariachis para regalo de cumpleaños',
    subtitulo: 'Emoción 100% y satisfacción garantizada...',
    cuerpo: 'Contratar mariachis para regalo de cumpleaños y conseguir esa sonrisa. Esta es la cara que se les quedo a las hijas con el regalo sorpresa que su madre y su padre han organizado por su visita y su cumpleaños... Llegar a su casa y que desde su ventana, balcón o salón pueda sentir el brillo de las trompetas, la cadencia de los violines, el trinar de un requinto, la guitarra jugando...',
    imagenReferencia: 'https://web.archive.org/web/20230512110955im_/https://edwinagudelo.es/wp-content/uploads/2020/... (imagen histórica recuperada)'
  },
  {
    id: 'regalo-boda',
    titulo: 'Regalo de boda',
    subtitulo: 'CONTRATAR MARIACHIS EN TU BODA, UN GRAN ACIERTO.',
    cuerpo: 'Un gran regalo de boda. Un día maravilloso no se puede ver empañado por no tener las personas adecuadas para ayudarte a conseguir que todo salga como tu lo sueñas. Debe de ser un compromiso adicional hay en juego mucho más que dinero, están implicados sentimientos como la ilusión, la emoción de esperar la...',
    imagenReferencia: 'https://web.archive.org/web/20230512110955im_/https://edwinagudelo.es/wp-content/uploads/2020/... (imagen histórica recuperada)'
  }
];

export const EDWIN_ARCHIVED_META = {
  sloganPrincipal: 'Servicios Edwin Agudelo con mariachis o como solista para tu fiesta o regalo.',
  sloganSecundario: 'Seré tu mejor cómplice para sorprender, emocionar y decirle a esa persona especial cuanto le quieres...',
  fuenteHistorica: 'https://web.archive.org/web/20230512110955/https://edwinagudelo.es/'
};
