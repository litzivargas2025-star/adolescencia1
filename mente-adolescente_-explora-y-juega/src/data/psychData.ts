export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  tag: string;
  shortDesc: string;
  fullDesc: string;
  category: "miedo" | "tristeza" | "tema";
}

export const MIEDO_INFO = {
  definicion:
    "El miedo es una emoción primaria de alarma que activa el sistema nervioso simpático cuando percibes una amenaza física o social (como ser juzgado, rechazado o equivocarte frente a otros).",
  comoActuar:
    "Haz una pausa breve antes de reaccionar, nombra en voz baja lo que sientes (“esto es miedo, no un peligro mortal”) y evita huir de inmediato si no existe un peligro real.",
  estrategias: [
    "Respiración 4-7-8: inhala 4 segundos, sostén 7 y exhala lento en 8 segundos.",
    "Anclaje 5-4-3-2-1: identifica 5 cosas que ves, 4 que tocas, 3 que oyes, 2 que hueles y 1 que saboreas.",
    "Exposición gradual: divide un reto grande (como exponer) en pasos pequeños y manejables."
  ],
  importancia:
    "Es vital para tu supervivencia: te ayuda a detectar riesgos reales, cuidar tus límites personales y prepararte con atención ante retos importantes.",
  situaciones:
    "Exponer frente al grupo, miedo a no encajar en redes o amistades, exámenes decisivos, hablar sobre tus sentimientos o temor a decepcionar a tu familia."
};

export const TRISTEZA_INFO = {
  definicion:
    "La tristeza es una respuesta emocional natural ante pérdidas, cambios, decepciones o desgaste acumulado; su función es invitarte a bajar el ritmo para procesar lo vivido.",
  comoActuar:
    "Valida lo que duele sin juzgarte ni forzarte a sonreír. Permítete llorar o desahogarte con calma en un lugar seguro y evita aislarte durante días enteros.",
  estrategias: [
    "Escritura expresiva: anota durante 15 minutos qué te dolió sin preocuparte por la ortografía.",
    "Co-regulación afectiva: conversa con una amistad leal, familiar u orientador escolar.",
    "Micro-autocuidado: hidrátate, sal a caminar 10 minutos con luz natural o escucha música que te abrace."
  ],
  importancia:
    "Te permite elaborar duelos y cambios propios de crecer, fortalece la empatía hacia los demás y funciona como señal para recibir apoyo y consuelo.",
  situaciones:
    "Ruptura de amistad o primer amor, mudanza o cambio de escuela, sentir que nadie te comprende, notas bajas tras mucho esfuerzo o conflictos familiares."
};

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "miedo-main",
    src: "img/miedo.png",
    title: "01. El Miedo como Sistema de Alerta",
    tag: "Fila 1 · Emoción: Miedo",
    shortDesc: "El miedo aparece para protegerte y avisarte cuando algo te importa mucho.",
    fullDesc:
      "En la adolescencia, el cerebro social se vuelve muy sensible. El miedo no significa debilidad: es una señal biológica que pide preparación, calma y límites claros.",
    category: "miedo"
  },
  {
    id: "miedo-1",
    src: "img/1.png",
    title: "02. Presión y Sombras del Juicio Social",
    tag: "Fila 1 · Emoción: Miedo",
    shortDesc: "Sentir muchas miradas encima dispara el temor a equivocarse o ser criticado.",
    fullDesc:
      "El miedo al qué dirán puede hacer que calles tus ideas. Recordar que cada persona está ocupada con sus propias inseguridades reduce la carga mental.",
    category: "miedo"
  },
  {
    id: "miedo-2",
    src: "img/2.png",
    title: "03. Refugio y Necesidad de Seguridad",
    tag: "Fila 1 · Emoción: Miedo",
    shortDesc: "Esconderse bajo las sábanas da alivio breve, pero hablar abre salidas reales.",
    fullDesc:
      "Cuando la angustia nocturna o el temor te superan, buscar un espacio tranquilo ayuda, pero compartirlo con alguien de confianza rompe el ciclo de miedo.",
    category: "miedo"
  },
  {
    id: "miedo-3",
    src: "img/3.png",
    title: "04. Señales Físicas de Nerviosismo",
    tag: "Emoción: Miedo",
    shortDesc: "Morderse las uñas o tensar manos refleja energía acumulada por anticipación.",
    fullDesc:
      "Tu cuerpo habla antes que tus palabras. Soltar los puños, estirar los hombros y exhalar largo le envía al cerebro la señal de que estás fuera de peligro.",
    category: "miedo"
  },
  {
    id: "miedo-4",
    src: "img/4.svg",
    title: "05. Miedo al Error y Exposición Escolar",
    tag: "Emoción: Miedo",
    shortDesc: "Equivocarse en clase es parte natural del aprendizaje, no una derrota.",
    fullDesc:
      "Sustituir pensamientos catastróficos (“todos se van a reír”) por frases realistas (“estoy aprendiendo y puedo pedir ayuda”) fortalece tu seguridad.",
    category: "miedo"
  },
  {
    id: "tristeza-main",
    src: "img/tristeza.png",
    title: "06. La Tristeza y la Empatía",
    tag: "Fila 2 · Emoción: Tristeza",
    shortDesc: "La tristeza invita a cuidarte con suavidad y aceptar el acompañamiento.",
    fullDesc:
      "Sentirse triste no es estar roto. Es la forma en que tu mente procesa lo que cambió o dolió, pidiendo descanso, escucha y compasión.",
    category: "tristeza"
  },
  {
    id: "tristeza-5",
    src: "img/5.png",
    title: "07. Lágrimas que Liberan Tensión",
    tag: "Fila 2 · Emoción: Tristeza",
    shortDesc: "Llorar ayuda a descargar cortisol y restaurar el equilibrio emocional.",
    fullDesc:
      "Reprimir el llanto aumenta el nudo en la garganta. Permitirte llorar en un entorno seguro reduce la sobrecarga fisiológica.",
    category: "tristeza"
  },
  {
    id: "tristeza-6",
    src: "img/6.png",
    title: "08. Silencio e Introspección Juvenil",
    tag: "Fila 2 · Emoción: Tristeza",
    shortDesc: "A veces necesitas unos minutos de silencio antes de explicar qué te duele.",
    fullDesc:
      "No tienes que fingir alegría constante para agradar. Darte tiempo para ordenar tus sentimientos es un derecho emocional.",
    category: "tristeza"
  },
  {
    id: "tristeza-7",
    src: "img/7.png",
    title: "09. Desánimo y Agotamiento Emocional",
    tag: "Emoción: Tristeza",
    shortDesc: "Cuando la tristeza dura semanas, pedir ayuda profesional es valentía.",
    fullDesc:
      "Si notas pérdida prolongada de sueño, apetito o interés en lo que antes disfrutabas, acudir con un psicólogo u orientador escolar es clave.",
    category: "tristeza"
  },
  {
    id: "tristeza-8",
    src: "img/8.svg",
    title: "10. Acompañamiento y Esperanza Compartida",
    tag: "Emoción: Tristeza",
    shortDesc: "Conversar con alguien que escucha sin juzgar devuelve luz a los días grises.",
    fullDesc:
      "Una red de apoyo sana transforma la soledad en compañía. Compartir el peso emocional lo vuelve mucho más ligero.",
    category: "tristeza"
  },
  {
    id: "tema-1",
    src: "img/img1.svg",
    title: "11. Identidad y Autodescubrimiento",
    tag: "Etapa Adolescente",
    shortDesc: "Explorar gustos, valores y voz auténtica sin copias.",
    fullDesc:
      "Entre los 13 y 18 años descubres quién eres más allá de las expectativas externas. Probar actividades sanas construye tu identidad.",
    category: "tema"
  },
  {
    id: "tema-2",
    src: "img/img2.svg",
    title: "12. Autoestima Saludable",
    tag: "Habilidad Emocional",
    shortDesc: "Valorarte por tu dignidad humana, no por apariencias o notas.",
    fullDesc:
      "La autoestima saludable consiste en tratarte con el mismo respeto y cariño con el que tratarías a tu mejor amistad.",
    category: "tema"
  },
  {
    id: "tema-3",
    src: "img/img3.svg",
    title: "13. Límites y Presión de Grupo",
    tag: "Problemática Social",
    shortDesc: "Decir no con firmeza y respeto ante la presión grupal.",
    fullDesc:
      "Poner límites claros protege tu bienestar físico y emocional sin necesidad de agredir ni someterte.",
    category: "tema"
  },
  {
    id: "tema-4",
    src: "img/img4.svg",
    title: "14. Regulación y Manejo del Estrés",
    tag: "Habilidad Emocional",
    shortDesc: "Reconocer la ola emocional y navegarla con herramientas prácticas.",
    fullDesc:
      "Regular no es reprimir: es notar qué sientes, dónde está en tu cuerpo y elegir una respuesta que te cuide.",
    category: "tema"
  },
  {
    id: "tema-5",
    src: "img/img5.svg",
    title: "15. Resiliencia y Crecimiento",
    tag: "Fortaleza Interior",
    shortDesc: "Aprender de los tropiezos y crecer con apoyo real.",
    fullDesc:
      "La resiliencia se entrena cada vez que pides ayuda, aprendes de un error y te das una nueva oportunidad.",
    category: "tema"
  },
  {
    id: "tema-6",
    src: "img/img6.svg",
    title: "16. Redes Sociales y Comparación",
    tag: "Entorno Digital",
    shortDesc: "Cuidar tu mente frente a comparaciones irreales en pantalla.",
    fullDesc:
      "Las redes muestran momentos editados, no vidas completas. Silenciar cuentas que dañan tu paz es autocuidado digital.",
    category: "tema"
  }
];

// Estructura de los 9 cuadros de la cuadrícula 3x3:
// Fila 1 (0, 1, 2): Emoción del Miedo con información en superposición dentro del cuadro
// Fila 2 (3, 4, 5): Emoción de la Tristeza con información en superposición dentro del cuadro
// Fila 3 / Última Fila (6, 7, 8): Ventanas de Registro/Acceso/Certificado, Explora el Tema y Los 5 Juegos
export interface GridTileConfig {
  id: string;
  src: string;
  hoverTitle: string;
  hoverTag: string;
  overlayBg: string;
  type: "miedo" | "tristeza" | "window-auth" | "window-tema" | "window-juegos";
  overlayHeading: string;
  sections?: { label: string; text: string }[];
}

export const GRID_9_TILES: GridTileConfig[] = [
  // FILA 1: EMOCIÓN DEL MIEDO
  {
    id: "grid-miedo-1",
    src: "img/miedo.png",
    hoverTitle: "Miedo · ¿Qué es y cómo actuar?",
    hoverTag: "Fila 1 · Emoción: Miedo",
    overlayBg: "#CDB4DB",
    type: "miedo",
    overlayHeading: "Emoción: Miedo (Definición y Alerta)",
    sections: [
      { label: "Definición", text: MIEDO_INFO.definicion },
      { label: "Cómo actuar", text: MIEDO_INFO.comoActuar },
      { label: "Por qué es importante", text: MIEDO_INFO.importancia }
    ]
  },
  {
    id: "grid-miedo-2",
    src: "img/1.png",
    hoverTitle: "Miedo · Estrategias de Regulación",
    hoverTag: "Fila 1 · Emoción: Miedo",
    overlayBg: "#DFD2F2",
    type: "miedo",
    overlayHeading: "Miedo al Juicio Social · Estrategias",
    sections: [
      { label: "Respiración 4-7-8", text: MIEDO_INFO.estrategias[0] },
      { label: "Anclaje 5-4-3-2-1", text: MIEDO_INFO.estrategias[1] },
      { label: "Exposición gradual", text: MIEDO_INFO.estrategias[2] }
    ]
  },
  {
    id: "grid-miedo-3",
    src: "img/2.png",
    hoverTitle: "Miedo · Situaciones y Señales",
    hoverTag: "Fila 1 · Emoción: Miedo",
    overlayBg: "#C3CEF7",
    type: "miedo",
    overlayHeading: "Situaciones Cotidianas del Miedo",
    sections: [
      { label: "En la adolescencia", text: MIEDO_INFO.situaciones },
      {
        label: "Señales físicas (`3.png`)",
        text: "Tensión en manos, nudo en el estómago o morderse las uñas avisan que tu cuerpo pide respirar lento."
      },
      {
        label: "Miedo al error (`4.svg`)",
        text: "Equivocarte en clase es aprendizaje, no derrota."
      }
    ]
  },

  // FILA 2: EMOCIÓN DE LA TRISTEZA
  {
    id: "grid-tristeza-1",
    src: "img/tristeza.png",
    hoverTitle: "Tristeza · Definición y Empatía",
    hoverTag: "Fila 2 · Emoción: Tristeza",
    overlayBg: "#A2D2FF",
    type: "tristeza",
    overlayHeading: "Emoción: Tristeza (Validación)",
    sections: [
      { label: "Definición", text: TRISTEZA_INFO.definicion },
      { label: "Cómo actuar", text: TRISTEZA_INFO.comoActuar },
      { label: "Por qué es importante", text: TRISTEZA_INFO.importancia }
    ]
  },
  {
    id: "grid-tristeza-2",
    src: "img/5.png",
    hoverTitle: "Tristeza · Estrategias de Alivio",
    hoverTag: "Fila 2 · Emoción: Tristeza",
    overlayBg: "#C8E2FC",
    type: "tristeza",
    overlayHeading: "Lágrimas y Estrategias Saludables",
    sections: [
      { label: "Escritura expresiva", text: TRISTEZA_INFO.estrategias[0] },
      { label: "Co-regulación afectiva", text: TRISTEZA_INFO.estrategias[1] },
      { label: "Micro-autocuidado", text: TRISTEZA_INFO.estrategias[2] }
    ]
  },
  {
    id: "grid-tristeza-3",
    src: "img/6.png",
    hoverTitle: "Tristeza · Situaciones y Apoyo",
    hoverTag: "Fila 2 · Emoción: Tristeza",
    overlayBg: "#B8D8F8",
    type: "tristeza",
    overlayHeading: "Situaciones y Red de Apoyo",
    sections: [
      { label: "Situaciones cotidianas", text: TRISTEZA_INFO.situaciones },
      {
        label: "Cuándo pedir ayuda (`7.png`)",
        text: "Si el desánimo dura semanas o afecta tu sueño y apetito, conversar con orientación escolar es valentía."
      },
      {
        label: "Esperanza compartida (`8.svg`)",
        text: "Una amistad leal o adulto confiable aligera el peso emocional."
      }
    ]
  },

  // FILA 3 (ÚLTIMA FILA DE LA CUADRÍCULA, DEBAJO DE TRISTEZA): LAS 3 IMÁGENES EXPUESTAS
  {
    id: "grid-row3-auth",
    src: "assets/aistudio/image_e825220e.png",
    hoverTitle: "Registro, Acceso y Certificado",
    hoverTag: "Última Fila · Ventanas MySQL",
    overlayBg: "#FFD6A5",
    type: "window-auth",
    overlayHeading: "Registro, Acceso y Certificado"
  },
  {
    id: "grid-row3-tema",
    src: "assets/aistudio/image_24a96a09.png",
    hoverTitle: "Explorar el Tema Adolescente",
    hoverTag: "Última Fila · Temas y Cards",
    overlayBg: "#FDFFB6",
    type: "window-tema",
    overlayHeading: "Explora el Tema Adolescente"
  },
  {
    id: "grid-row3-juegos",
    src: "assets/aistudio/image_a917772b.png",
    hoverTitle: "Los 5 Minijuegos Interactivos",
    hoverTag: "Última Fila · Juega y Aprende",
    overlayBg: "#B9FBC0",
    type: "window-juegos",
    overlayHeading: "Ventanas de los 5 Minijuegos"
  }
];

export const DIMENSIONES_CAMBIO = [
  {
    titulo: "CAMBIOS FÍSICOS",
    texto:
      "Desarrollo acelerado, maduración biológica y adaptación a una nueva imagen corporal que requiere aceptación y acompañamiento saludable."
  },
  {
    titulo: "CAMBIOS COGNITIVOS",
    texto:
      "Surgimiento del pensamiento abstracto, juicio crítico, búsqueda de autonomía y cuestionamiento de normas establecidas."
  },
  {
    titulo: "CAMBIOS PSICOSOCIALES",
    texto:
      "Construcción de la identidad, necesidad de pertenencia al grupo de pares e intensidad en la vivencia afectiva."
  }
];

export const FRASES_MOTIVACIONALES = [
  "Sé tú, sin pedir permiso. Tu autenticidad vale muchísimo más que encajar.",
  "Tu valor no es un número: ni una calificación, ni un peso, ni los likes te definen.",
  "Eres suficiente tal como eres, incluso en los días en que sientes dudas o cansancio.",
  "Habla bonito de ti: tu mente escucha y cree cada palabra que te repites.",
  "No encajes, destaca. Tus emociones son brújulas sabias, no defectos.",
  "Pedir ayuda cuando la tristeza o el miedo pesan es un acto enorme de valentía."
];

export interface ToolkitCard {
  id: string;
  titulo: string;
  categoria: string;
  resumen: string;
  explicacion: string;
  tipClave: string;
  imagen: string;
  color: string;
}

export const TOOLKIT_CARDS: ToolkitCard[] = [
  {
    id: "tool-1",
    titulo: "Respiración 4-7-8",
    categoria: "Regulación Emocional",
    resumen: "Calma el sistema nervioso antes de exámenes o exposiciones.",
    explicacion:
      "Inhala por la nariz durante 4 segundos, mantén el aire 7 segundos y exhala suavemente por la boca durante 8 segundos. Repítelo 3 ciclos cuando sientas taquicardia o bloqueo por miedo.",
    tipClave:
      "Exhalar más lento de lo que inhalas activa el nervio vago y envía la señal física de seguridad a tu cerebro adolescente.",
    imagen: "img/miedo.png",
    color: "#CDB4DB"
  },
  {
    id: "tool-2",
    titulo: "Reencuadre de Pensamientos",
    categoria: "Autoconocimiento",
    resumen: "Transforma la autocrítica severa en diálogo realista y amable.",
    explicacion:
      "Cuando aparezca un pensamiento absoluto (“todo me sale mal”, “nadie me quiere”), pregúntate qué evidencia real existe y qué le dirías a tu mejor amistad si estuviera pasando por lo mismo.",
    tipClave:
      "Cambiar “soy un fracaso” por “hoy me costó este tema y puedo pedir ayuda” protege tu autoestima frente al error.",
    imagen: "img/img1.svg",
    color: "#A2D2FF"
  },
  {
    id: "tool-3",
    titulo: "Pausa Asertiva (90 s)",
    categoria: "Comunicación Asertiva",
    resumen: "Defiende tus límites sin explotar ni quedarte en silencio.",
    explicacion:
      "La descarga química intensa de una emoción dura alrededor de 90 segundos. Haz una pausa, toma agua y responde usando frases en primera persona: “Yo siento… cuando… y necesito…”.",
    tipClave:
      "Decir “no” con calma ante presiones en redes o en el grupo fortalece tu respeto propio.",
    imagen: "img/img3.svg",
    color: "#FFAFCC"
  },
  {
    id: "tool-4",
    titulo: "Anclaje 5-4-3-2-1",
    categoria: "Manejo del Estrés",
    resumen: "Detiene pensamientos anticipatorios volviendo al presente.",
    explicacion:
      "Nombra mentalmente 5 cosas que ves, 4 texturas que tocas, 3 sonidos que escuchas, 2 aromas que percibes y 1 sensación agradable o sabor. Saca a la mente del bucle de preocupación.",
    tipClave:
      "Funciona discretamente en el salón de clases, el transporte o antes de dormir sin que nadie lo note.",
    imagen: "img/3.png",
    color: "#FFD6A5"
  },
  {
    id: "tool-5",
    titulo: "Diario de Validación",
    categoria: "Autocuidado y Tristeza",
    resumen: "Descarga el peso de la tristeza con escritura expresiva.",
    explicacion:
      "Escribe durante 10–15 minutos exactamente lo que te dolió o frustró sin corregir ortografía ni censurarte. Validar que algo duele reduce el nudo en la garganta.",
    tipClave:
      "Si el desánimo dura más de dos semanas, usa tus notas para explicar con claridad cómo te sientes a un orientador o familiar.",
    imagen: "img/tristeza.png",
    color: "#FDFFB6"
  },
  {
    id: "tool-6",
    titulo: "Red de Apoyo Confiable",
    categoria: "Vínculos Saludables",
    resumen: "Conecta con adultos y amistades seguras cuando el peso crece.",
    explicacion:
      "Identifica desde hoy 3 personas con las que puedes hablar sin miedo a burlas: una amistad leal, un familiar cercano y tu orientador escolar o docente tutor.",
    tipClave:
      "Pedir ayuda a tiempo no es debilidad; es la estrategia psicológica más protectora entre los 13 y 18 años.",
    imagen: "img/8.svg",
    color: "#B9FBC0"
  }
];

export const WORD_SEARCH_ROWS = [
  "RESILIENCIAQ",
  "MAUTOESTIMAT",
  "ENMXPLKVJBNR",
  "MQZICALMAWFI",
  "PGHYETRUSALS",
  "ABVNCDQJKPQT",
  "TWSGLZOHMORE",
  "IPLIMITEXYNZ",
  "ADFCVBNUJOKA",
  "WVALENTIAGHM",
  "QZXCVBNMLKJH",
  "PLRESPIRARTS"
];

export const WORD_SEARCH_TARGETS = [
  "RESILIENCIA",
  "AUTOESTIMA",
  "EMPATIA",
  "TRISTEZA",
  "MIEDO",
  "CALMA",
  "LIMITE",
  "VALENTIA",
  "APOYO",
  "RESPIRAR"
];

export interface RuletaSituation {
  id: string;
  tema: string;
  situacion: string;
  opciones: {
    texto: string;
    esBuena: boolean;
    asertividad: string;
    porque: string;
    consejo: string;
  }[];
}

export const RULETA_SITUACIONES: RuletaSituation[] = [
  {
    id: "r1",
    tema: "Presión en Redes",
    situacion:
      "Un grupo de amigos te presiona para compartir un meme burlándose de un compañero nuevo.",
    opciones: [
      {
        texto: "Lo compartes para que no te excluyan del grupo.",
        esBuena: false,
        asertividad: "Baja asertividad (20%)",
        porque:
          "Sumarte a una burla hiere a alguien más y normaliza el ciberacoso por miedo al rechazo.",
        consejo:
          "Di con calma: 'Paso, no me parece gracioso burlarnos de alguien' y cambia de conversación."
      },
      {
        texto: "Expresas que no te parece justo y no reenvías nada.",
        esBuena: true,
        asertividad: "Alta asertividad (95%)",
        porque: "Pones un límite claro sin agredir y demuestras integridad y empatía real.",
        consejo:
          "Si la burla escala, avisa a un orientador o docente para frenar el acoso a tiempo."
      },
      {
        texto: "No dices nada, pero le das 'me gusta' para quedar bien.",
        esBuena: false,
        asertividad: "Asertividad pasiva (35%)",
        porque: "Dar apoyo silencioso valida el daño hacia tu compañero y genera culpa interna.",
        consejo: "Apoyar en privado al compañero afectado también hace una gran diferencia."
      }
    ]
  },
  {
    id: "r2",
    tema: "Miedo Académico",
    situacion:
      "Mañana tienes una exposición oral y sientes taquicardia y miedo a quedarte en blanco.",
    opciones: [
      {
        texto: "Finges estar enfermo para no ir a clases mañana.",
        esBuena: false,
        asertividad: "Evitación (25%)",
        porque:
          "Evitar la situación alivia por un momento, pero multiplica el miedo para la próxima vez.",
        consejo: "Prepara 3 tarjetas clave de apoyo y practica frente al espejo o un amigo."
      },
      {
        texto: "Practicas respiración 4-7-8, ordenas 3 ideas clave y descansas bien.",
        esBuena: true,
        asertividad: "Alta regulación emocional (95%)",
        porque: "Calmas la respuesta física de alarma y ayudas a tu memoria a funcionar con claridad.",
        consejo:
          "Recuerda que hablar despacio y tomar agua durante la exposición es completamente válido."
      },
      {
        texto: "Te desvelas hasta las 3 AM memorizando cada palabra exacta.",
        esBuena: false,
        asertividad: "Sobrecarga ansiosa (40%)",
        porque: "Dormir poco deteriora la concentración y aumenta los nervios al día siguiente.",
        consejo: "Prioriza dormir 7–8 horas y repasa ideas principales en voz alta."
      }
    ]
  },
  {
    id: "r3",
    tema: "Tristeza y Aislamiento",
    situacion:
      "Llevas varios días sintiendo tristeza profunda por una pelea con tu mejor amistad.",
    opciones: [
      {
        texto: "Te encierras todo el fin de semana y bloqueas a todos sin hablar.",
        esBuena: false,
        asertividad: "Aislamiento (30%)",
        porque: "Aislarte completamente intensifica los pensamientos negativos y retrasa la solución.",
        consejo:
          "Date un rato para calmarte, pero mantén abierta la comunicación con personas que te quieren."
      },
      {
        texto: "Escribes cómo te sientes y hablas con un familiar o amigo de confianza.",
        esBuena: true,
        asertividad: "Alta inteligencia emocional (95%)",
        porque: "Poner palabras a la tristeza ordena la mente y permite recibir acompañamiento afectivo.",
        consejo:
          "Cuando ambos estén tranquilos, propón una charla honesta usando frases con 'yo siento'."
      },
      {
        texto: "Finges en redes que estás súper feliz para darle celos.",
        esBuena: false,
        asertividad: "Evasión emocional (35%)",
        porque:
          "Usar las redes como máscara aumenta la distancia entre lo que sientes y lo que muestras.",
        consejo: "No necesitas demostrar nada en pantalla; enfócate en sanar tu vínculo o tu paz."
      }
    ]
  },
  {
    id: "r4",
    tema: "Límites en Amistad",
    situacion:
      "Un amigo te pide que le pases la contraseña de tus redes sociales como 'prueba de confianza'.",
    opciones: [
      {
        texto: "Se la das por miedo a que se enoje contigo.",
        esBuena: false,
        asertividad: "Límite vulnerado (15%)",
        porque:
          "La confianza sana respeta la privacidad; ceder tus contraseñas te expone a riesgos.",
        consejo: "Tus cuentas y tu intimidad te pertenecen solo a ti."
      },
      {
        texto: "Le explicas con firmeza que tu privacidad no está en negociación.",
        esBuena: true,
        asertividad: "Alta asertividad (100%)",
        porque: "Estableces un límite digital saludable y cuidas tus datos y relaciones.",
        consejo: "Quien te respeta de verdad nunca te pedirá tus contraseñas."
      },
      {
        texto: "Le das una contraseña falsa y luego discuten fuerte.",
        esBuena: false,
        asertividad: "Comunicación indirecta (40%)",
        porque: "Evitar decir 'no' de frente prolonga el conflicto y la desconfianza.",
        consejo: "Sé claro y sereno desde el primer momento."
      }
    ]
  }
];
