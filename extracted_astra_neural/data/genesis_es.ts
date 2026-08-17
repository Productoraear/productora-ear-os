import { InitializedTool } from '../types';

export const genesis_es: InitializedTool[] = [
  {
    title: "Consejo Estratégico (El Consejo)",
    points: [
      "Motor principal de toma de decisiones.",
      "Convoca un panel de personas de IA especializadas.",
      "Analiza un dilema central desde perspectivas múltiples y a menudo conflictivas.",
      "Produce un informe sintetizado con recomendaciones accionables."
    ],
    design: "Diseñado para contrarrestar sesgos cognitivos (como el sesgo de confirmación) al forzar la consideración de diversos puntos de vista. Simula una junta de asesoría estratégica de alto nivel.",
    synergy: [
      "Puede utilizar los resultados del Arsenal de Propuestas de Valor como contexto.",
      "Las ideas del Atlas Cultural pueden ser inyectadas en el dilema para un análisis más matizado.",
      "Los resultados pueden alimentar al Constructor de Narrativas para crear historias convincentes."
    ],
    polymorphic: [
      "Artista: Decidiendo entre un contrato discográfico y un lanzamiento independiente.",
      "Emprendedor: Evaluando un pivote en el modelo de negocio.",
      "Mánager: Formulando una estrategia de respuesta a una crisis."
    ],
    kpis: [
      "Claridad de la recomendación final.",
      "Identificación de riesgos u oportunidades no considerados previamente.",
      "Confianza del usuario en el camino estratégico a seguir."
    ],
    criticalConsiderations: [
      "La calidad del dilema de entrada es primordial.",
      "El usuario debe estar abierto a desafiar sus propias suposiciones."
    ]
  },
  {
    title: "Constructor de Narrativas",
    points: [
      "Destila la esencia de un proyecto, marca o individuo.",
      "Utiliza el marco 'Por qué, Cómo, Qué' (Círculo Dorado).",
      "Genera activos de comunicación clave: elevator pitch, manifiesto, puntos clave para entrevistas."
    ],
    design: "Basado en 'Empieza por el porqué' de Simon Sinek. Impone un enfoque de comunicación impulsado por el propósito, asegurando que el mensaje central resuene a un nivel emocional antes de explicar los aspectos funcionales.",
    synergy: [
      "El 'Porqué' definido puede servir como principio rector para el Consejo Estratégico.",
      "El elevator pitch resultante es un componente clave para el Arsenal de Propuestas de Valor.",
      "El manifiesto puede guiar la creación de contenido para campañas de marketing."
    ],
    polymorphic: [
      "Artista: Definiendo su mensaje central para un nuevo ciclo de álbum.",
      "Autor: Creando una plataforma de autor y una propuesta de libro convincentes.",
      "Startup: Alineando al equipo fundador y creando un pitch para inversores."
    ],
    kpis: [
      "Consistencia del mensaje en todos los activos generados.",
      "Resonancia emocional del manifiesto.",
      "Concisión e impacto del elevator pitch."
    ],
    criticalConsiderations: [
      "Requiere una introspección genuina por parte del usuario.",
      "El 'Porqué' debe ser auténtico para ser efectivo."
    ]
  },
  {
    title: "Arsenal de Propuestas de Valor",
    points: [
        "Desarrolla propuestas de valor personalizadas para diferentes stakeholders.",
        "Identifica las fortalezas y objetivos centrales del proyecto.",
        "Anticipa preguntas, objeciones y posibles 'banderas rojas' desde la perspectiva de cada stakeholder."
    ],
    design: "Va más allá de una propuesta de valor única para todos. Es una herramienta de empatía estratégica, que obliga al usuario a ver su proyecto a través de los ojos de otros (inversores, fans, críticos, etc.) y a preparar argumentos específicos.",
    synergy: [
        "Proporciona información muy específica para el Consejo Estratégico.",
        "La propuesta central puede ser refinada utilizando el Constructor de Narrativas.",
        "Las 'banderas rojas' anticipadas son entradas perfectas para la Auditoría Interna Extrema."
    ],
    polymorphic: [
        "Cineasta: Presentando un proyecto a productores, y luego a distribuidores.",
        "Músico: Negociando un contrato con un sello, y luego explicando su valor a su base de fans.",
        "Emprendedor: Vendiendo su visión a un inversor, a un posible empleado clave y a un cliente early adopter."
    ],
    kpis: [
        "Especificidad y relevancia de los mensajes para cada stakeholder.",
        "Precisión en la anticipación de posibles preguntas y objeciones.",
        "Fuerza en la identificación de 'banderas rojas'."
    ],
    criticalConsiderations: [
        "Requiere una comprensión clara de lo que valoran los diferentes stakeholders.",
        "Puede revelar debilidades fundamentales en la oferta principal del proyecto."
    ]
  },
  {
    title: "Auditoría Interna Extrema (La Forja)",
    points: [
      "Una herramienta de honestidad radical y pensamiento de primeros principios.",
      "Somete una directiva, estrategia o creencia central a una auditoría brutal y sin filtros.",
      "Identifica suposiciones ocultas, analiza mediante inversión (¿qué garantiza el fracaso?), y evalúa las consecuencias de segundo y tercer orden."
    ],
    design: "Diseñada como un asesino de egos y un probador de lógica. Obliga al usuario a defender sus ideas contra un adversario puramente racional y pesimista, forjándolas así en algo más fuerte o revelando sus defectos fatales.",
    synergy: [
      "La prueba de estrés definitiva para cualquier recomendación del Consejo Estratégico.",
      "Puede usarse para auditar el 'Porqué' central del Constructor de Narrativas.",
      "Perfecta para examinar las 'banderas rojas' identificadas por el Arsenal de Propuestas de Valor."
    ],
    polymorphic: [
      "Empresa: Auditando su declaración de misión en busca de consistencia lógica.",
      "Individuo: Examinando una creencia central sobre su trayectoria profesional.",
      "Gestor de Proyectos: Poniendo a prueba la premisa central de un proyecto de alto riesgo."
    ],
    kpis: [
      "Número y profundidad de las suposiciones centrales identificadas.",
      "Gravedad y plausibilidad de los modos de fallo identificados.",
      "Capacidad de acción del veredicto final de 'puntos críticos de fallo'."
    ],
    criticalConsiderations: [
      "El usuario debe estar preparado para un resultado incómodo y desafiante.",
      "Su valor es directamente proporcional a la honestidad del usuario en su directiva de entrada."
    ]
  }
];