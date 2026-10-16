(function () {
  "use strict";

  const mobileIntroSessionKey = "shalimar-mobile-intro-seen";

  function preferredLanguage() {
    try {
      const savedLanguage = localStorage.getItem("shalimar-language");
      if (savedLanguage === "en" || savedLanguage === "es") return savedLanguage;
    } catch (_) {
      /* Continue with the visitor's browser preference when storage is unavailable. */
    }

    const browserLanguages = Array.isArray(navigator.languages) && navigator.languages.length
      ? navigator.languages
      : [navigator.language || ""];

    for (const browserLanguage of browserLanguages) {
      const languageCode = String(browserLanguage).toLowerCase().split("-")[0];
      if (languageCode === "es") return "es";
      if (languageCode === "en") return "en";
    }

    return "es";
  }

  function mountMobileIntro() {
    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isMobile || reducedMotion) {
      document.documentElement.classList.remove("mobile-intro-pending");
      return;
    }

    try {
      if (window.sessionStorage.getItem(mobileIntroSessionKey) === "true") return;
    } catch (_) {
      /* Continue without session persistence when storage is unavailable. */
    }

    const language = preferredLanguage();
    const overlay = document.createElement("section");
    overlay.className = "mobile-intro";
    overlay.setAttribute("aria-label", language === "es" ? "Introducción de Shalimar Rivera" : "Shalimar Rivera introduction");
    overlay.innerHTML = `<video class="mobile-intro-video" autoplay playsinline preload="auto" aria-hidden="true"><source src="assets/Intro/intro.mp4" type="video/mp4"></video><button class="mobile-intro-skip" type="button">${language === "es" ? "Saltar introducción" : "Skip intro"}</button>`;

    const video = overlay.querySelector("video");
    const skip = overlay.querySelector(".mobile-intro-skip");
    let fallbackTimer;
    let revealStarted = false;

    function rememberIntro() {
      try { window.sessionStorage.setItem(mobileIntroSessionKey, "true"); } catch (_) {}
    }

    function revealSite() {
      if (revealStarted) return;
      revealStarted = true;
      rememberIntro();
      window.clearTimeout(fallbackTimer);
      overlay.classList.add("is-leaving");
      overlay.setAttribute("aria-hidden", "true");
      document.documentElement.classList.add("mobile-intro-reveal");
      document.documentElement.classList.remove("mobile-intro-pending");
      window.requestAnimationFrame(() => {
        void document.body.offsetWidth;
        document.documentElement.classList.add("mobile-intro-site-visible");
      });
      window.setTimeout(() => {
        overlay.remove();
        document.body.classList.remove("mobile-intro-active");
        document.documentElement.classList.remove("mobile-intro-reveal", "mobile-intro-site-visible");
      }, 1450);
    }

    function playIntro() {
      video.muted = false;
      video.defaultMuted = false;
      video.volume = 1;
      const playback = video.play();
      if (playback?.catch) playback.catch(() => {
        video.muted = true;
        video.defaultMuted = true;
        const mutedPlayback = video.play();
        if (mutedPlayback?.catch) mutedPlayback.catch(revealSite);
      });
    }

    video.addEventListener("playing", () => {
      overlay.classList.add("has-started");
      fallbackTimer = window.setTimeout(revealSite, 8500);
    }, { once: true });
    video.addEventListener("timeupdate", () => {
      if (Number.isFinite(video.duration) && video.duration - video.currentTime <= 1.2) revealSite();
    });
    video.addEventListener("ended", revealSite, { once: true });
    video.addEventListener("error", revealSite, { once: true });
    skip.addEventListener("click", revealSite);
    document.body.classList.add("mobile-intro-active");
    document.body.prepend(overlay);
    rememberIntro();
    window.requestAnimationFrame(() => overlay.classList.add("is-playing"));
    playIntro();
  }

  const pages = {
    home: { file: "index.html" },
    about: { file: "about.html" },
    brand: { file: "brand.html" },
    media: { file: "media.html" },
    press: { file: "in-the-press.html" },
    contact: { file: "contact.html" },
  };

  const silenceProducts = [
    { image: "assets/img/brands/silence-products/1bundle.jpg", href: "https://www.thesilencecollection.com/products/the-velvet-collection-5-piece-lipstick-set", name: "Velvet Collection Bundle", accent: "#d1a441" },
    { image: "assets/img/brands/silence-products/2canada.jpg", href: "https://www.thesilencecollection.com/products/canada-velvet-matte-lipstick", name: "Canada", accent: "#ee3e83" },
    { image: "assets/img/brands/silence-products/3madrid.jpg", href: "https://www.thesilencecollection.com/products/madrid-velvet-matte-lipstick", name: "Madrid", accent: "#c04458" },
    { image: "assets/img/brands/silence-products/4praga.jpg", href: "https://www.thesilencecollection.com/products/prega", name: "Praga", accent: "#a9232d" },
    { image: "assets/img/brands/silence-products/5washingtoon.jpg", href: "https://www.thesilencecollection.com/products/washington-velvet-matte-lipstick", name: "Washington", accent: "#c97858" },
    { image: "assets/img/brands/silence-products/6marilyn.jpg", href: "https://www.thesilencecollection.com/products/marilyn-velvet-matte-lipstick", name: "Marilyn", accent: "#da4775" },
  ];

  const gfyProducts = [
    { image: "assets/img/brands/goforyou-products/2gfy.webp", href: "https://www.goforyou.store/products/day-formula", key: "day", accent: "#a8c80b" },
    { image: "assets/img/brands/goforyou-products/3gfy.webp", href: "https://www.goforyou.store/products/cleanser-detox", key: "cleanse", accent: "#dc8615" },
    { image: "assets/img/brands/goforyou-products/4gfy.webp", href: "https://www.goforyou.store/products/night-formula", key: "night", accent: "#079fd5" },
    { image: "assets/img/brands/goforyou-products/5gfy.webp", href: "https://www.goforyou.store/products/creatina-monohidrate", key: "creatine", accent: "#d99117" },
  ];

  let mediaVideos = [
    { id: "qNjHGbhdGT4", title: "Water RATIONING has arrived in Puerto Rico // VIP Room", meta: "49:09 · 2 weeks ago" },
    { id: "BuA9axQnMUU", title: "Zoé Laboy: 60 SO WHAT? She breaks down prejudices // VIP Room", meta: "48:25 · 1 month ago" },
    { id: "2HcYjTqxfd0", title: "Gallo The Producer summoned to court // VIP Room", meta: "48:22 · 1 month ago" },
    { id: "Xb_RFQKd7n0", title: "Gringo: My stepfather taught me how to be a man", meta: "24:57 · 2 months ago" },
    { id: "C_ngATQi7iM", title: "Testigos hablan en el caso contra Elvia Cabrera", meta: "12:52 · 2 months ago" },
  ];

  const pressMagazinePages = [
    "assets/img/in-the-press/magazine/cover.png",
    "assets/img/in-the-press/magazine/page1.png",
    "assets/img/in-the-press/magazine/page2.png",
    "assets/img/in-the-press/magazine/page3.png",
    "assets/img/in-the-press/magazine/page4.png",
    "assets/img/in-the-press/magazine/page5.png",
    "assets/img/in-the-press/magazine/page6.png",
  ];

  const copy = {
    en: {
      announcement: "Puerto Rican media personality. Entrepreneur. Storyteller.",
      nav: { home: "Home", about: "About", brand: "Brand", media: "Media", press: "In the Press", contact: "Contact" },
      pages: {
        home: {
          title: "Beauty in your voice.",
          subtitle: "Power in your story.",
          primary: "Explore the brands",
          primaryLink: "brand.html",
          ticker: ["Puerto Rican Roots", "Caribbean Heart", "Bold Purpose"],
          duality: ["Two expressions.", "One woman."],
          panelsLabel: "Shalimar Rivera brands",
          panels: [
            ["assets/img/homepage/silence-english/SILENCE-THUMBNAIL-English.jpg", "Silence Collection — Color with a story.", "Shop now", "https://www.thesilencecollection.com"],
            ["assets/img/homepage/go-for-you-english/GO-FOR-YOU.jpg", "Go For You — Nutrition and supplements.", "Shop now", "https://www.goforyou.store"],
          ],
          story: {
            title: ["Never just", "one thing."],
            body: "I've spent my life using my voice to connect, to uplift, and to create impact. These two brands are extensions of that mission—born from my experiences, my heritage, and my belief that women can be soft and strong, creative and driven.",
            statement: "This is who I am. This is what I build.",
            cta: "Read my story",
            alt: "Shalimar Rivera seated beside a window in a black-and-white portrait.",
          },
        },
        about: {
          eyebrow: "About Shalimar",
          name: "Shalimar Rivera",
          headline: "Entrepreneur. Communicator. Presenter. A woman who turned her evolution into purpose.",
          heroAlt: "Shalimar Rivera featured on the cover of Bienestar Total magazine.",
          intro: "Shalimar Rivera has built her journey around a simple yet powerful idea: <strong>reinvention is always possible.</strong>",
          paragraphs: [
            "A Puerto Rican entrepreneur, presenter, and communicator, Shalimar has developed a career that blends media, entrepreneurship, beauty, and wellness. Her presence in front of the camera is only one part of a story shaped by discipline, business vision, and a constant pursuit of growth.",
            "As the host of <strong>“Sala VIP con Shalimar Rivera,”</strong> she has created a space where entertainment, conversations, and personalities come together through an authentic, direct, and approachable perspective.",
            "Beyond the cameras, her entrepreneurial side has led her to develop several concepts and brands, including <strong>Go For You</strong>, focused on wellness and lifestyle; <strong>Silence</strong>, her venture in the beauty industry; and <strong>Salud 24/7</strong>, a concept dedicated to promoting habits and alternatives for a healthier life.",
            "Perhaps one of the chapters that best represents her philosophy has been her entry into the world of competitive fitness. Through discipline, preparation, and consistency, Shalimar transformed a personal goal into a competitive achievement, earning significant recognition in the <strong>Bikini category</strong>. That experience reaffirmed something that has now become part of her message: <strong>age does not determine when you can begin a new version of yourself.</strong>",
            "Alongside her professional and entrepreneurial career, she continues expanding her education in the field of <strong>Management</strong>, convinced that growth never ends and that every new chapter requires new tools.",
            "Beyond titles, businesses, or cameras, Shalimar seeks to use her platform to inspire women in particular to believe in their ideas, take care of themselves, pursue new goals, and have the courage to begin again as many times as necessary.",
          ],
          pullQuote: "Reinvention is always possible.",
          closingLead: "Because for her, success is not simply about arriving at a destination.",
          closing: "It is about evolving without losing who you are.",
        },
        brand: {
          eyebrow: "Brand",
          title: "Partnerships with meaning.",
          lead: "A home for collaborations, campaigns, ventures, and brand stories aligned with Shalimar's audience and values.",
          section: "Built on trust and connection",
          body: "Add approved brand partnerships, case studies, products, and campaign results here.",
          carouselLabel: "Featured brands",
          previousSlide: "Previous brand image",
          nextSlide: "Next brand image",
          slideLabel: "Go to slide",
          slides: [
            "Silence Collection and Go For You products",
            "Silence Collection fashion campaign",
            "Go For You fitness products",
          ],
          intro: {
            eyebrow: "The brands",
            firstLine: "Two visions.",
            secondLine: "Built with purpose.",
          },
          silence: {
            label: "Silence Collection",
            subline: "Color with a story.",
            explore: "Explore Silence",
            carouselLabel: "Silence Collection products",
            previous: "Previous Silence product",
            next: "Next Silence product",
            slideLabel: "Go to Silence product",
            shop: "Shop",
            slogan: ["Be seen. Be heard.", "Be Silence."],
          },
          gfy: {
            label: "Go For You",
            subline: "Built for your goals. Powered by you.",
            explore: "Explore Go For You",
            bundleEyebrow: "The Slim System",
            bundleTitle: "Day · Cleanse · Night",
            bundleCopy: "A complete three-part system designed to support your goals from morning through night.",
            bundleShop: "Shop the system",
            formulaTitle: "Choose your formula",
            products: { day: "Slim Day Formula", cleanse: "Slim Cleanse", night: "Slim Night Formula", creatine: "Creatine" },
            shop: "Shop",
            carouselLabel: "Go For You formulas",
            previous: "Previous Go For You formula",
            next: "Next Go For You formula",
            slideLabel: "Go to Go For You formula",
            techEyebrow: "Go For You Technology",
            techTitle: "Recovery meets performance.",
            techCopy: "Advanced percussion therapy to relieve tension, improve circulation, and accelerate recovery. Designed to keep you moving at your best.",
            techCta: "Discover the device",
          },
        },
        media: {
          heroKicker: "Watch. Listen. Connect.",
          title: "Media",
          heroCopy: "Stay up to date with everything Shalimar Rivera.",
          heroCta: "Explore media",
          youtube: {
            label: "YouTube",
            description: "Interviews, conversations, news, and content that keeps you connected.",
            viewAll: "Subscribe now",
            recent: "Recent videos",
            previous: "Previous YouTube video",
            next: "Next YouTube video",
            slideLabel: "Go to YouTube video",
            checking: "Checking live status",
            live: "Live now",
            offline: "Latest videos",
          },
          facebook: {
            label: "Facebook",
            description: "Official posts, updates, conversations, and appearances.",
            viewAll: "Subscribe now",
          },
          tiktok: {
            label: "TikTok",
            description: "Recent short videos, moments, and behind-the-scenes content.",
            viewAll: "Subscribe now",
          },
          instagram: {
            label: "Instagram",
            description: "Style, appearances, everyday moments, and life behind the scenes.",
            viewAll: "Subscribe now",
          },
        },
        press: {
          eyebrow: "In the Press",
          title: "Coverage and conversation.",
          lead: "Selected articles, profiles, interviews, and news featuring Shalimar Rivera.",
          section: "Latest coverage",
          body: "Add publication logos, article titles, dates, short excerpts, and links to the original coverage here.",
          magazine: {
            eyebrow: "Featured editorial",
            label: "Revista Bienestar",
            title: "Shalimar Rivera in Revista Bienestar",
            issue: "July 2026 issue",
            copy: "Read Shalimar Rivera's latest magazine feature in Revista Bienestar.",
            cta: "Start reading",
            readerTitle: "Revista Bienestar July 2026 custom flipbook",
            previous: "Previous magazine page",
            next: "Next magazine page",
            page: "Page",
            of: "of",
            openPage: "View full screen",
            closeFullscreen: "Close full screen",
            zoomIn: "Zoom in",
            zoomOut: "Zoom out",
            resetZoom: "Reset zoom",
            cover: "Magazine cover",
          },
        },
        contact: {
          eyebrow: "Contact",
          title: "Let's create something memorable.",
          lead: "Media, speaking, appearances, partnerships, and thoughtful collaborations begin here.",
          response: "Every inquiry is delivered privately to Shalimar's team.",
          inboxLabel: "Inquiry email",
          form: {
            name: "Full name",
            email: "Email address",
            phone: "Phone (optional)",
            type: "Type of inquiry",
            typePlaceholder: "Select one",
            types: ["Media & press", "Speaking engagement", "Brand partnership", "Appearance", "Other"],
            subject: "Subject",
            message: "Tell us about your inquiry",
            send: "Send inquiry",
            sending: "Sending your inquiry…",
            sent: "SENT",
            sentCopy: "Your message is on its way. Thank you for reaching out.",
            again: "Send another inquiry",
            error: "We couldn't send your message. Please check your connection and try again.",
          },
        },
      },
      footer: {
        description: "Official website of Shalimar Rivera.",
        tagline: "Beauty in your voice. Power in your story.",
        navigate: "Explore",
        connect: "Connect",
        builtBy: "Website built by",
      },
      rights: "All rights reserved.",
    },
    es: {
      announcement: "Personalidad de medios puertorriqueña. Emprendedora. Narradora.",
      nav: { home: "Inicio", about: "Acerca de", brand: "Marca", media: "Medios", press: "En la Prensa", contact: "Contacto" },
      pages: {
        home: {
          title: "Belleza en tu voz.",
          subtitle: "Poder en tu historia.",
          primary: "Explora las marcas",
          primaryLink: "brand.html",
          ticker: ["Raíces Puertorriqueñas", "Corazón Caribeño", "Propósito Audaz"],
          duality: ["Dos expresiones.", "Una mujer."],
          panelsLabel: "Marcas de Shalimar Rivera",
          panels: [
            ["assets/img/homepage/silence-spanish/SILENCE-THUMBNAIL-Spanish.jpg", "Silence Collection — Color con historia.", "Compra ahora", "https://www.thesilencecollection.com"],
            ["assets/img/homepage/go-for-you-spanish/GoForYou-Thumbnail-Spanish.jpg", "Go For You — Nutrición y suplementos.", "Compra ahora", "https://www.goforyou.store"],
          ],
          story: {
            title: ["Nunca he sido", "una sola cosa."],
            body: "He pasado mi vida usando mi voz para conectar, inspirar y generar impacto. Estas dos marcas son extensiones de esa misión: nacen de mis experiencias, mis raíces y mi convicción de que podemos ser sensibles y fuertes, creativas y determinadas.",
            statement: "Esto es quien soy. Esto es lo que construyo.",
            cta: "Conoce mi historia",
            alt: "Retrato en blanco y negro de Shalimar Rivera sentada junto a una ventana.",
          },
        },
        about: {
          eyebrow: "Sobre Shalimar",
          name: "Shalimar Rivera",
          headline: "Emprendedora. Comunicadora. Presentadora. Una mujer que convirtió su evolución en propósito.",
          heroAlt: "Shalimar Rivera en la portada de la revista Bienestar Total.",
          intro: "Shalimar Rivera ha construido su trayectoria alrededor de una idea sencilla, pero poderosa: <strong>reinventarse siempre es posible.</strong>",
          paragraphs: [
            "Emprendedora, presentadora y comunicadora puertorriqueña, Shalimar ha desarrollado una carrera que combina medios, emprendimiento, belleza y bienestar. Su presencia frente a las cámaras es solo una parte de una historia marcada por la disciplina, la visión empresarial y una búsqueda constante de crecimiento.",
            "Como conductora de <strong>“Sala VIP con Shalimar Rivera,”</strong> ha creado un espacio donde el entretenimiento, las conversaciones y las personalidades se encuentran desde una mirada auténtica, directa y cercana.",
            "Más allá de las cámaras, su faceta empresarial la ha llevado a desarrollar diversos conceptos y marcas, entre ellos <strong>Go For You</strong>, enfocado en bienestar y estilo de vida; <strong>Silence</strong>, su propuesta dentro de la industria de la belleza; y <strong>Salud 24/7</strong>, un concepto dedicado a promover hábitos y alternativas para una vida más saludable.",
            "Quizás uno de los capítulos que mejor representa su filosofía ha sido su entrada al mundo del fitness competitivo. A través de disciplina, preparación y constancia, Shalimar transformó una meta personal en un logro competitivo, obteniendo importantes reconocimientos en la <strong>categoría Bikini</strong>. Esa experiencia reafirmó algo que hoy forma parte de su mensaje: <strong>la edad no determina cuándo puedes comenzar una nueva versión de ti misma.</strong>",
            "Paralelamente a su carrera profesional y empresarial, continúa ampliando su formación en el área de <strong>Administración</strong>, convencida de que el crecimiento nunca termina y que cada nueva etapa requiere nuevas herramientas.",
            "Más allá de los títulos, los negocios o las cámaras, Shalimar busca utilizar su plataforma para inspirar especialmente a las mujeres a creer en sus ideas, cuidarse, perseguir nuevas metas y atreverse a comenzar de nuevo todas las veces que sea necesario.",
          ],
          pullQuote: "Reinventarse siempre es posible.",
          closingLead: "Porque para ella, el éxito no consiste simplemente en llegar a un destino.",
          closing: "Consiste en evolucionar sin perder quién eres.",
        },
        brand: {
          eyebrow: "Marca",
          title: "Alianzas con significado.",
          lead: "Un hogar para colaboraciones, campañas, proyectos e historias de marca alineadas con la audiencia y los valores de Shalimar.",
          section: "Creado con confianza y conexión",
          body: "Agrega aquí alianzas aprobadas, casos de estudio, productos y resultados de campañas.",
          carouselLabel: "Marcas destacadas",
          previousSlide: "Imagen anterior de la marca",
          nextSlide: "Siguiente imagen de la marca",
          slideLabel: "Ir a la diapositiva",
          slides: [
            "Productos de Silence Collection y Go For You",
            "Campaña de moda de Silence Collection",
            "Productos de bienestar de Go For You",
          ],
          intro: {
            eyebrow: "Las marcas",
            firstLine: "Dos visiones.",
            secondLine: "Creadas con propósito.",
          },
          silence: {
            label: "Silence Collection",
            subline: "Color con historia.",
            explore: "Explora Silence",
            carouselLabel: "Productos de Silence Collection",
            previous: "Producto anterior de Silence",
            next: "Siguiente producto de Silence",
            slideLabel: "Ir al producto de Silence",
            shop: "Comprar",
            slogan: ["Be seen. Be heard.", "Be Silence."],
          },
          gfy: {
            label: "Go For You",
            subline: "Creado para tus metas. Impulsado por ti.",
            explore: "Explora Go For You",
            bundleEyebrow: "El sistema Slim",
            bundleTitle: "Día · Limpieza · Noche",
            bundleCopy: "Un sistema completo de tres partes diseñado para apoyar tus metas desde la mañana hasta la noche.",
            bundleShop: "Compra el sistema",
            formulaTitle: "Elige tu fórmula",
            products: { day: "Fórmula Slim Día", cleanse: "Slim Limpieza", night: "Fórmula Slim Noche", creatine: "Creatina" },
            shop: "Comprar",
            carouselLabel: "Fórmulas de Go For You",
            previous: "Fórmula anterior de Go For You",
            next: "Siguiente fórmula de Go For You",
            slideLabel: "Ir a la fórmula de Go For You",
            techEyebrow: "Tecnología Go For You",
            techTitle: "La recuperación se une al rendimiento.",
            techCopy: "Terapia de percusión avanzada para aliviar la tensión, mejorar la circulación y acelerar la recuperación. Diseñada para mantenerte en movimiento y dar lo mejor de ti.",
            techCta: "Descubre el dispositivo",
          },
        },
        media: {
          heroKicker: "Mira. Escucha. Conecta.",
          title: "Medios",
          heroCopy: "Mantente al día con todo lo relacionado con Shalimar Rivera.",
          heroCta: "Explora los medios",
          youtube: {
            label: "YouTube",
            description: "Entrevistas, conversaciones, noticias y contenido que te mantiene conectado.",
            viewAll: "Suscríbete ahora",
            recent: "Videos recientes",
            previous: "Video anterior de YouTube",
            next: "Siguiente video de YouTube",
            slideLabel: "Ir al video de YouTube",
            checking: "Verificando transmisión en vivo",
            live: "En vivo ahora",
            offline: "Últimos videos",
          },
          facebook: {
            label: "Facebook",
            description: "Publicaciones oficiales, actualizaciones, conversaciones y apariciones.",
            viewAll: "Suscríbete ahora",
          },
          tiktok: {
            label: "TikTok",
            description: "Videos cortos recientes, momentos y contenido detrás de cámaras.",
            viewAll: "Suscríbete ahora",
          },
          instagram: {
            label: "Instagram",
            description: "Estilo, apariciones, momentos cotidianos y la vida detrás de cámaras.",
            viewAll: "Suscríbete ahora",
          },
        },
        press: {
          eyebrow: "En la Prensa",
          title: "Cobertura y conversación.",
          lead: "Artículos, perfiles, entrevistas y noticias seleccionadas sobre Shalimar Rivera.",
          section: "Cobertura reciente",
          body: "Agrega logotipos, títulos, fechas, resúmenes breves y enlaces a la cobertura original.",
          magazine: {
            eyebrow: "Editorial destacada",
            label: "Revista Bienestar",
            title: "Shalimar Rivera en Revista Bienestar",
            issue: "Edición de julio de 2026",
            copy: "Lee la más reciente aparición de Shalimar Rivera en Revista Bienestar.",
            cta: "Comenzar a leer",
            readerTitle: "Flipbook personalizado de Revista Bienestar, julio de 2026",
            previous: "Página anterior de la revista",
            next: "Siguiente página de la revista",
            page: "Página",
            of: "de",
            openPage: "Ver en pantalla completa",
            closeFullscreen: "Cerrar pantalla completa",
            zoomIn: "Acercar",
            zoomOut: "Alejar",
            resetZoom: "Restablecer zoom",
            cover: "Portada de la revista",
          },
        },
        contact: {
          eyebrow: "Contacto",
          title: "Creemos algo memorable.",
          lead: "Medios, conferencias, apariciones, alianzas y colaboraciones con propósito comienzan aquí.",
          response: "Cada consulta se entrega de forma privada al equipo de Shalimar.",
          inboxLabel: "Correo de consultas",
          form: {
            name: "Nombre completo",
            email: "Correo electrónico",
            phone: "Teléfono (opcional)",
            type: "Tipo de consulta",
            typePlaceholder: "Selecciona una opción",
            types: ["Medios y prensa", "Conferencia", "Alianza de marca", "Aparición", "Otro"],
            subject: "Asunto",
            message: "Cuéntanos sobre tu consulta",
            send: "Enviar consulta",
            sending: "Enviando tu consulta…",
            sent: "ENVIADO",
            sentCopy: "Tu mensaje va en camino. Gracias por comunicarte.",
            again: "Enviar otra consulta",
            error: "No pudimos enviar tu mensaje. Verifica tu conexión e inténtalo de nuevo.",
          },
        },
      },
      footer: {
        description: "Sitio oficial de Shalimar Rivera.",
        tagline: "Belleza en tu voz. Poder en tu historia.",
        navigate: "Explorar",
        connect: "Conectar",
        builtBy: "Sitio web creado por",
      },
      rights: "Todos los derechos reservados.",
    },
  };

  let lang = preferredLanguage();
  const page = document.body.dataset.page || "home";
  let storyObserver;
  let aboutObserver;
  let contactAnimationTimers = [];
  let brandCarouselTimer;
  let silenceCarouselTimer;
  let gfyCarouselTimer;
  let mediaYouTubePlayer;
  let mediaFacebookResizeObserver;

  function navLinks(mobile) {
    return Object.keys(pages)
      .map((key) => `<a class="nav-link" href="${pages[key].file}"${key === page ? ' aria-current="page"' : ""}${mobile ? " data-mobile-link" : ""}>${copy[lang].nav[key]}</a>`)
      .join("");
  }

  function renderChrome() {
    const t = copy[lang];
    document.documentElement.lang = lang;
    document.getElementById("site-chrome").innerHTML = `<div class="announcement" role="note">${t.announcement}</div><header class="site-header"><div class="header-inner"><a class="wordmark" href="index.html" aria-label="Shalimar Rivera home">SHALIMAR RIVERA</a><nav class="desktop-nav" aria-label="Primary navigation">${navLinks(false)}</nav><div class="header-actions"><div class="language-toggle" aria-label="Language"><button type="button" data-lang="en" aria-pressed="${lang === "en"}">EN</button><button type="button" data-lang="es" aria-pressed="${lang === "es"}">ES</button></div><button class="menu-button" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav"><span></span></button></div></div><nav id="mobile-nav" class="mobile-nav" data-open="false" aria-label="Mobile navigation"><div class="mobile-nav-inner"><div class="mobile-nav-links">${navLinks(true)}</div></div></nav></header>`;
    bindChrome();
  }

  function waveText(text, offset) {
    return Array.from(text).map((character, index) => {
      const step = index + offset;
      const x = ((step % 5) - 2) * 4;
      const y = ((step % 4) - 1.5) * 5;
      const content = character === " " ? "&nbsp;" : character;
      return `<span class="hero-char${character === " " ? " hero-char-space" : ""}" aria-hidden="true" style="--i:${step};--particle-x:${x}px;--particle-y:${y}px">${content}</span>`;
    }).join("");
  }

  function wavePhrase(text, offset) {
    const words = text.split(" ");
    const rows = [words.slice(0, 2).join(" "), words.slice(2).join(" ")];
    let step = offset;
    return rows.map((row) => {
      const animatedRow = waveText(row, step);
      step += Array.from(row).length + 2;
      return `<span class="hero-copy-row">${animatedRow}</span>`;
    }).join("");
  }

  function storyWords(text) {
    return text.split(/\s+/).map((word, index) => `<span class="story-word" style="--word-i:${index}">${word}</span>`).join(" ");
  }

  function escapeMediaText(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    })[character]);
  }

  function mediaVideoMeta(video) {
    if (video.meta) return video.meta;
    const published = new Date(video.published || "");
    if (Number.isNaN(published.getTime())) return "";
    const date = new Intl.DateTimeFormat(lang === "es" ? "es-PR" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(published);
    return `${lang === "es" ? "Publicado" : "Published"} ${date}`;
  }

  function homeMarkup(p) {
    const secondLineOffset = Array.from(p.title).length + 5;
    const tickerItems = Array.from({ length: 4 }, () => p.ticker).flat();
    const tickerGroup = tickerItems.map((item) => `<span class="broadcast-item">${item}</span><span class="broadcast-dot">•</span>`).join("");
    const panels = p.panels.map(([src, alt, cta, href]) => `<article class="brand-panel"><img src="${src}" alt="${alt}" width="1200" height="1200" loading="lazy" decoding="async"><a class="hero-cta brand-panel-cta" href="${href}" target="_blank" rel="noopener noreferrer"><span>${cta}</span></a></article>`).join("");
    return `<section class="hero" aria-labelledby="home-hero-title"><div class="hero-content"><h1 class="hero-message" id="home-hero-title" aria-label="${p.title} ${p.subtitle}"><span class="hero-line hero-line-light">${wavePhrase(p.title, 0)}</span><span class="hero-line hero-line-gold">${wavePhrase(p.subtitle, secondLineOffset)}</span></h1><a class="hero-cta" href="${p.primaryLink}">${p.primary}</a></div></section><aside class="broadcast-ticker" aria-label="${p.ticker.join(" • ")}"><div class="broadcast-track" aria-hidden="true"><div class="broadcast-group">${tickerGroup}</div><div class="broadcast-group">${tickerGroup}</div></div></aside><section class="duality-intro" aria-labelledby="duality-title"><h2 class="duality-title" id="duality-title"><span class="duality-light">${p.duality[0]}</span><span class="duality-gold">${p.duality[1]}</span></h2></section><section class="brand-panels" aria-label="${p.panelsLabel}"><div class="brand-panels-grid">${panels}</div></section><section class="my-story" aria-labelledby="my-story-title"><div class="my-story-grid"><figure class="my-story-visual"><img src="assets/img/homepage/my-story/my-story.png" alt="${p.story.alt}" width="1600" height="1200" loading="lazy" decoding="async"></figure><div class="my-story-content"><h2 class="my-story-title" id="my-story-title"><span>${p.story.title[0]}</span><span>${p.story.title[1]}</span></h2><p class="my-story-copy">${storyWords(p.story.body)}</p><p class="my-story-statement">${storyWords(p.story.statement)}</p><div class="my-story-footer"><p class="my-story-signature" aria-label="Shalimar Rivera">Shalimar Rivera <span aria-hidden="true">♥</span></p><a class="hero-cta my-story-cta" href="about.html">${p.story.cta}</a></div></div></div></section>`;
  }

  function mediaMarkup(p) {
    const videoCards = mediaVideos.map((video, index) => {
      const title = escapeMediaText(video.title);
      const thumbnail = escapeMediaText(video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`);
      const href = `https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}`;
      return `<article class="media-video-card${index === 0 ? " is-active" : ""}" data-media-video-card><a class="media-video-frame" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${title}"><img src="${thumbnail}" alt="${title}" width="480" height="270" loading="lazy" decoding="async"><span class="media-video-play" aria-hidden="true">▶</span></a><div class="media-video-copy"><h3>${title}</h3><p>${escapeMediaText(mediaVideoMeta(video))}</p></div></article>`;
    }).join("");
    const videoDots = mediaVideos.map((video, index) => `<button class="media-video-dot${index === 0 ? " is-active" : ""}" type="button" data-media-video-dot="${index}" aria-label="${p.youtube.slideLabel} ${index + 1}: ${escapeMediaText(video.title)}" aria-current="${index === 0 ? "true" : "false"}"><span></span></button>`).join("");
    const facebookUrl = encodeURIComponent("https://www.facebook.com/p/Shalimar-Rivera-Oficial-100045231345959/");
    return `<section class="media-hero" aria-labelledby="media-hero-title"><img src="assets/img/media/63341016-73f9-4338-9f01-4245d8726bfe.jpeg" alt="Shalimar Rivera preparing backstage in a crystal gown" width="1320" height="929" fetchpriority="high" decoding="async"><div class="media-hero-overlay"></div><div class="media-hero-content"><p class="media-hero-kicker"><span aria-hidden="true"></span>${p.heroKicker}</p><h1 id="media-hero-title">${p.title}</h1><p>${p.heroCopy}</p><a class="hero-cta media-hero-cta" href="#youtube-feed">${p.heroCta}</a></div></section><div class="media-feed"><section class="media-social-section media-youtube" id="youtube-feed" aria-labelledby="media-youtube-title"><header class="media-section-header"><div><p class="media-platform-kicker"><span class="media-platform-icon media-youtube-icon" aria-hidden="true">▶</span>${p.youtube.label}</p><h2 id="media-youtube-title">${p.youtube.description}</h2></div><a href="https://www.youtube.com/@ShalimarRiveraTV/videos" target="_blank" rel="noopener noreferrer">${p.youtube.viewAll} <span aria-hidden="true">→</span></a></header><div class="media-live-status" data-media-live-status><span></span>${p.youtube.checking}</div><div class="media-live-player" data-media-live-player hidden><iframe id="media-live-frame" src="https://www.youtube-nocookie.com/embed/live_stream?channel=UC7Y4eYyORrCvsqdAdICUGSw&autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1" title="Shalimar Rivera TV live stream" allow="autoplay; encrypted-media; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><div class="media-video-fallback" data-media-video-fallback><h3 class="media-recent-title">${p.youtube.recent}</h3><div class="media-video-carousel" data-media-video-carousel tabindex="0" aria-roledescription="carousel" aria-label="${p.youtube.recent}"><div class="media-video-track" data-media-video-track>${videoCards}</div><button class="media-feed-arrow media-feed-prev" type="button" data-media-video-prev aria-label="${p.youtube.previous}"><span aria-hidden="true">‹</span></button><button class="media-feed-arrow media-feed-next" type="button" data-media-video-next aria-label="${p.youtube.next}"><span aria-hidden="true">›</span></button><div class="media-video-dots">${videoDots}</div><p class="sr-only" aria-live="polite" data-media-video-status>${mediaVideos[0].title}, 1 of ${mediaVideos.length}</p></div></div></section><section class="media-social-section media-facebook" aria-labelledby="media-facebook-title"><header class="media-section-header"><div><p class="media-platform-kicker"><span class="media-platform-icon media-facebook-icon" aria-hidden="true">f</span>${p.facebook.label}</p><h2 id="media-facebook-title">${p.facebook.description}</h2></div><a href="https://www.facebook.com/p/Shalimar-Rivera-Oficial-100045231345959/" target="_blank" rel="noopener noreferrer">${p.facebook.viewAll} <span aria-hidden="true">→</span></a></header><div class="media-facebook-embed"><iframe src="https://www.facebook.com/plugins/page.php?href=${facebookUrl}&tabs=timeline&width=500&height=680&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false" title="Shalimar Rivera Oficial Facebook posts" width="500" height="680" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe></div></section><section class="media-social-section media-tiktok" aria-labelledby="media-tiktok-title"><header class="media-section-header"><div><p class="media-platform-kicker"><span class="media-platform-icon media-tiktok-icon" aria-hidden="true">♪</span>${p.tiktok.label}</p><h2 id="media-tiktok-title">${p.tiktok.description}</h2></div><a href="https://www.tiktok.com/@shalimarrivera" target="_blank" rel="noopener noreferrer">${p.tiktok.viewAll} <span aria-hidden="true">→</span></a></header><div class="media-tiktok-embed"><blockquote class="tiktok-embed" cite="https://www.tiktok.com/@shalimarrivera" data-unique-id="shalimarrivera" data-embed-type="creator"><section><a target="_blank" rel="noopener noreferrer" href="https://www.tiktok.com/@shalimarrivera">@shalimarrivera</a></section></blockquote></div></section></div>`;
  }

  function magazineMarkup(p) {
    const spreadCount = Math.ceil((pressMagazinePages.length - 1) / 2);
    const dots = Array.from({ length: spreadCount + 1 }, (_, index) => {
      const label = index === 0 ? p.magazine.cover : `${p.magazine.page} ${(index - 1) * 2 + 1}–${Math.min(index * 2, pressMagazinePages.length - 1)}`;
      return `<button class="press-book-dot${index === 0 ? " is-active" : ""}" type="button" data-press-dot="${index - 1}" aria-label="${label}" aria-current="${index === 0 ? "true" : "false"}"><span></span></button>`;
    }).join("");
    const surface = (name) => `<div class="press-pageflip" data-press-pageflip="${name}" aria-label="${p.magazine.readerTitle}"></div>`;
    return `<section class="media-social-section media-magazine" id="featured-magazine" aria-labelledby="media-magazine-title"><header class="media-section-header media-magazine-header"><div><p class="media-platform-kicker"><span class="media-magazine-monogram" aria-hidden="true">B</span>${p.magazine.label}</p><h2 id="media-magazine-title">${p.magazine.copy}</h2></div><span class="media-magazine-issue">${p.magazine.issue}</span></header><div class="media-magazine-stage"><div class="media-magazine-copy"><p class="media-magazine-eyebrow">${p.magazine.eyebrow}</p><h3>${p.magazine.title}</h3><p>${p.magazine.issue}</p><a class="hero-cta media-magazine-cta" href="#press-flipbook">${p.magazine.cta}</a></div><div class="press-flipbook" id="press-flipbook" data-press-flipbook tabindex="0" role="region" aria-roledescription="flipbook" aria-label="${p.magazine.readerTitle}"><div class="press-book-shell">${surface("inline")}<button class="press-book-arrow press-book-prev" type="button" data-press-prev aria-label="${p.magazine.previous}"><span aria-hidden="true">‹</span></button><button class="press-book-arrow press-book-next" type="button" data-press-next aria-label="${p.magazine.next}"><span aria-hidden="true">›</span></button></div><div class="press-book-controls"><p class="press-book-counter" data-press-counter>${p.magazine.cover}</p><div class="press-book-dots">${dots}</div><button class="press-book-open" type="button" data-press-open>${p.magazine.openPage}</button></div><p class="sr-only" aria-live="polite" data-press-status>${p.magazine.cover}</p><div class="press-fullscreen-viewer" data-press-fullscreen hidden role="dialog" aria-modal="true" aria-label="${p.magazine.readerTitle}"><div class="press-fullscreen-camera" data-press-camera>${surface("fullscreen")}</div><button class="press-fullscreen-arrow press-fullscreen-prev" type="button" data-press-fullscreen-prev aria-label="${p.magazine.previous}"><span aria-hidden="true">‹</span></button><button class="press-fullscreen-arrow press-fullscreen-next" type="button" data-press-fullscreen-next aria-label="${p.magazine.next}"><span aria-hidden="true">›</span></button><p class="press-fullscreen-counter" data-press-fullscreen-counter>${p.magazine.cover}</p><div class="press-fullscreen-tools" role="group" aria-label="${p.magazine.readerTitle}"><button type="button" data-press-zoom-out aria-label="${p.magazine.zoomOut}">−</button><button type="button" data-press-zoom-reset aria-label="${p.magazine.resetZoom}">100%</button><button type="button" data-press-zoom-in aria-label="${p.magazine.zoomIn}">+</button></div><button class="press-fullscreen-close" type="button" data-press-fullscreen-close aria-label="${p.magazine.closeFullscreen}"><span aria-hidden="true">×</span></button></div></div></div></section>`;
  }

  function pressMarkup(p) {
    return `<div class="media-feed press-feed">${magazineMarkup(p)}</div>`;
  }

  function instagramMarkup(p) {
    return `<section class="media-social-section media-instagram" aria-labelledby="media-instagram-title"><header class="media-section-header"><div><p class="media-platform-kicker"><span class="media-platform-icon media-instagram-icon" aria-hidden="true"></span>${p.instagram.label}</p><h2 id="media-instagram-title">${p.instagram.description}</h2></div><a href="https://www.instagram.com/shalimarrivera/?hl=en" target="_blank" rel="noopener noreferrer">${p.instagram.viewAll} <span aria-hidden="true">→</span></a></header><div class="media-instagram-embed"><iframe src="https://www.instagram.com/shalimarrivera/embed/" title="Shalimar Rivera Instagram profile" width="540" height="650" loading="lazy" allow="encrypted-media; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin"></iframe></div></section>`;
  }

  function developmentMarkup() {
    const title = lang === "es" ? "En desarrollo" : "Under Development";
    return `<section class="development-page" aria-labelledby="development-title"><h1 class="development-title" id="development-title">${title}</h1></section>`;
  }

  function contactMarkup() {
    const p = copy[lang].pages.contact;
    const f = p.form;
    const typeOptions = f.types.map((type) => `<option value="${type}">${type}</option>`).join("");
    const inboxAddress = "inquiry@shalimarrivera.com";
    const deliverySubject = lang === "es"
      ? `[${inboxAddress}] Nueva consulta desde ShalimarRivera.com`
      : `[${inboxAddress}] New inquiry from ShalimarRivera.com`;
    return `<article class="contact-page"><section class="contact-intro" aria-labelledby="contact-title"><p class="contact-eyebrow"><span></span>${p.eyebrow}<span></span></p><h1 id="contact-title">${p.title}</h1><p>${p.lead}</p><div class="contact-intro-rule" aria-hidden="true"><i></i><b></b><i></i></div><small>${p.response}<a class="contact-inbox" href="mailto:${inboxAddress}">${p.inboxLabel}: ${inboxAddress}</a></small></section><section class="contact-stage" aria-label="${p.eyebrow}"><span class="contact-orbit contact-orbit-one" aria-hidden="true"></span><span class="contact-orbit contact-orbit-two" aria-hidden="true"></span><div class="contact-card" data-contact-card><div class="contact-card-glow" aria-hidden="true"></div><form class="contact-inquiry-form" data-contact-form><input type="hidden" name="_subject" value="${deliverySubject}"><input type="hidden" name="_template" value="table"><input type="hidden" name="_url" value="https://shalimarrivera.com/contact.html"><input type="hidden" name="Inquiry mailbox" value="${inboxAddress}"><input type="hidden" name="Language" value="${lang === "es" ? "Español" : "English"}"><label class="contact-honeypot" aria-hidden="true">Leave this field empty<input type="text" name="_honey" tabindex="-1" autocomplete="off"></label><div class="contact-fields"><label class="contact-field"><span>${f.name}</span><input type="text" name="Name" autocomplete="name" required></label><label class="contact-field"><span>${f.email}</span><input type="email" name="email" autocomplete="email" required></label><label class="contact-field"><span>${f.phone}</span><input type="tel" name="Phone" autocomplete="tel"></label><label class="contact-field contact-select-field"><span>${f.type}</span><select name="Inquiry type" required><option value="" selected disabled>${f.typePlaceholder}</option>${typeOptions}</select></label><label class="contact-field contact-field-wide"><span>${f.subject}</span><input type="text" name="Subject" required></label><label class="contact-field contact-field-wide contact-message-field"><span>${f.message}</span><textarea name="Message" rows="6" required></textarea></label></div><div class="contact-submit-row"><button class="hero-cta contact-submit" type="submit" data-contact-submit><span data-contact-submit-label>${f.send}</span><span class="contact-submit-shimmer" aria-hidden="true"></span></button><p class="contact-form-status" data-contact-status aria-live="polite"></p></div></form><div class="contact-flight" aria-hidden="true"><div class="contact-envelope"><span class="contact-envelope-back"></span><span class="contact-envelope-letter"></span><span class="contact-envelope-front"></span><span class="contact-envelope-flap"></span><span class="contact-envelope-seal">SR</span></div></div><section class="contact-success" data-contact-success aria-hidden="true" aria-live="polite"><p class="contact-sent-word">${f.sent}</p><p>${f.sentCopy}</p><button type="button" data-contact-again>${f.again}</button></section></div></section></article>`;
  }

  function bindContactForm() {
    contactAnimationTimers.forEach((timer) => window.clearTimeout(timer));
    contactAnimationTimers = [];
    const form = document.querySelector("[data-contact-form]");
    if (!form) return;
    const card = form.closest("[data-contact-card]");
    const submit = form.querySelector("[data-contact-submit]");
    const submitLabel = form.querySelector("[data-contact-submit-label]");
    const status = form.querySelector("[data-contact-status]");
    const success = card.querySelector("[data-contact-success]");
    const again = card.querySelector("[data-contact-again]");
    const labels = copy[lang].pages.contact.form;
    const endpoint = "https://formsubmit.co/ajax/shalimarrivera7@gmail.com";

    function setTimer(callback, delay) {
      const timer = window.setTimeout(() => {
        if (card.isConnected) callback();
      }, delay);
      contactAnimationTimers.push(timer);
    }

    function resetExperience() {
      contactAnimationTimers.forEach((timer) => window.clearTimeout(timer));
      contactAnimationTimers = [];
      card.classList.remove("is-sending", "is-delivering", "is-sent", "has-error");
      success.setAttribute("aria-hidden", "true");
      submit.disabled = false;
      submitLabel.textContent = labels.send;
      status.textContent = "";
      form.querySelector("input:not([type=hidden])")?.focus();
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      card.classList.remove("has-error");
      card.classList.add("is-sending");
      submit.disabled = true;
      submitLabel.textContent = labels.sending;
      status.textContent = labels.sending;

      try {
        const payload = Object.fromEntries(new FormData(form).entries());
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json().catch(() => ({}));
        const serviceMessage = String(result.message || "");
        const awaitingActivation = /activat|confirm|verif/i.test(serviceMessage);
        if (!response.ok && !awaitingActivation) {
          throw new Error(result.message || `Message delivery failed (${response.status})`);
        }

        status.textContent = "";
        card.classList.remove("is-sending");
        card.classList.add("is-delivering");
        form.reset();
        setTimer(() => {
          card.classList.add("is-sent");
          success.setAttribute("aria-hidden", "false");
        }, 1450);
      } catch (error) {
        console.error("Contact form delivery error:", error);
        card.classList.remove("is-sending");
        card.classList.add("has-error");
        submit.disabled = false;
        submitLabel.textContent = labels.send;
        status.textContent = labels.error;
      }
    });

    again.addEventListener("click", resetExperience);
  }

  function aboutMarkup() {
    const p = copy[lang].pages.about;
    const paragraphs = p.paragraphs.map((paragraph, index) => `<p data-about-reveal style="--about-delay:${Math.min(index * 90, 360)}ms">${paragraph}</p>`).join("");
    return `<article class="about-page"><section class="about-hero" aria-label="${p.eyebrow}"><picture><source media="(max-width: 640px)" srcset="assets/img/about/mobile-hero/mobile-about-me-hero.png"><img src="assets/img/about/desktop-hero/desktop-about-me-hero.png" alt="${p.heroAlt}" width="1920" height="1080" fetchpriority="high" decoding="async"></picture><div class="about-hero-vignette" aria-hidden="true"></div></section><section class="about-biography" aria-labelledby="about-title"><header class="about-bio-intro" data-about-reveal><p class="about-eyebrow"><span></span>${p.eyebrow}<span></span></p><h1 class="about-name" id="about-title">${p.name}</h1><p class="about-headline">${p.headline}</p></header><div class="about-ornament" aria-hidden="true"><span></span></div><div class="about-editorial"><aside class="about-pullquote" data-about-reveal><span class="about-quote-mark" aria-hidden="true">“</span><p>${p.pullQuote}</p></aside><div class="about-copy"><p class="about-intro-copy" data-about-reveal>${p.intro}</p>${paragraphs}</div></div><footer class="about-closing" data-about-reveal><p>${p.closingLead}</p><strong>${p.closing}</strong><span aria-hidden="true"></span></footer></section></article>`;
  }

  function standardMarkup(p) {
    return `<section class="page-hero"><div class="page-hero-content"><p class="eyebrow">${p.eyebrow}</p><h1 class="display">${p.title}</h1><p class="lead">${p.lead}</p></div></section><section class="content-section"><h2 class="section-title">${p.section}</h2><p class="section-copy">${p.body}</p></section>`;
  }

  function brandMarkup(p) {
    const desktop = [
      "assets/img/brands/hero/Desktop/desktop-brands-hero-1.webp",
      "assets/img/brands/hero/Desktop/desktop-brand-hero-2-silence.webp",
      "assets/img/brands/hero/Desktop/desktop-brand-hero-3-goforyou.webp",
    ];
    const mobile = [
      "assets/img/brands/hero/Mobile/Mobile-brands-hero-1.webp",
      "assets/img/brands/hero/Mobile/mobile-brand-hero-2-silence.webp",
      "assets/img/brands/hero/Mobile/mobile-brand-hero-3-goforyou.webp",
    ];
    const slides = desktop.map((src, index) => `<div class="brand-carousel-slide${index === 0 ? " is-active" : ""}" data-brand-slide aria-hidden="${index !== 0}"><picture><source media="(max-width: 640px)" srcset="${mobile[index]}"><img src="${src}" alt="${p.slides[index]}" width="1920" height="1080"${index === 0 ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async"></picture></div>`).join("");
    const dots = p.slides.map((_, index) => `<button class="brand-carousel-dot${index === 0 ? " is-active" : ""}" type="button" data-brand-dot="${index}" aria-label="${p.slideLabel} ${index + 1}" aria-current="${index === 0 ? "true" : "false"}"><span></span></button>`).join("");
    const silenceCards = silenceProducts.map((product, index) => `<article class="silence-product-card${index === 0 ? " is-active" : " is-after"}" data-silence-card style="--product-accent:${product.accent};--tilt-x:0deg;--tilt-y:0deg"><img src="${product.image}" alt="${product.name} Velvet Collection lipstick" width="1600" height="2000" loading="${index < 3 ? "eager" : "lazy"}"${index === 0 ? ' fetchpriority="high"' : ""} decoding="async"><div class="silence-card-footer"><a class="hero-cta silence-product-cta" href="${product.href}" target="_blank" rel="noopener noreferrer"><span>${p.silence.shop} ${product.name}</span></a></div></article>`).join("");
    const silenceDots = silenceProducts.map((product, index) => `<button class="silence-carousel-dot${index === 0 ? " is-active" : ""}" type="button" data-silence-dot="${index}" aria-label="${p.silence.slideLabel} ${index + 1}: ${product.name}" aria-current="${index === 0 ? "true" : "false"}"><span></span></button>`).join("");
    const gfyCards = gfyProducts.map((product, index) => {
      const name = p.gfy.products[product.key];
      return `<article class="gfy-product-card${index === 0 ? " is-active" : " is-after"}" data-gfy-card style="--product-accent:${product.accent};--tilt-x:0deg;--tilt-y:0deg"><img src="${product.image}" alt="${name}" width="1600" height="2000" loading="lazy" decoding="async"><div class="gfy-card-footer"><a class="hero-cta gfy-product-cta" href="${product.href}" target="_blank" rel="noopener noreferrer"><span>${p.gfy.shop} ${name}</span></a></div></article>`;
    }).join("");
    const gfyDots = gfyProducts.map((product, index) => `<button class="gfy-carousel-dot${index === 0 ? " is-active" : ""}" type="button" data-gfy-dot="${index}" aria-label="${p.gfy.slideLabel} ${index + 1}: ${p.gfy.products[product.key]}" aria-current="${index === 0 ? "true" : "false"}"><span></span></button>`).join("");
    const brandAndSilenceMarkup = `<section class="brand-hero-carousel" data-brand-carousel aria-roledescription="carousel" aria-label="${p.carouselLabel}" tabindex="0"><div class="brand-carousel-track">${slides}</div><button class="brand-carousel-arrow brand-carousel-arrow-prev" type="button" data-brand-prev aria-label="${p.previousSlide}"><span aria-hidden="true">‹</span></button><button class="brand-carousel-arrow brand-carousel-arrow-next" type="button" data-brand-next aria-label="${p.nextSlide}"><span aria-hidden="true">›</span></button><div class="brand-carousel-dots">${dots}</div><p class="sr-only" aria-live="polite" data-brand-status>${p.slides[0]}, 1 of ${p.slides.length}</p></section><section class="brand-intro" aria-labelledby="brand-intro-title"><div class="brand-intro-inner"><p class="brand-intro-eyebrow"><span>${p.intro.eyebrow}</span></p><h1 class="brand-intro-title" id="brand-intro-title"><span>${p.intro.firstLine}</span><span>${p.intro.secondLine}</span></h1></div></section><section class="silence-showcase" aria-labelledby="silence-showcase-title"><div class="silence-showcase-shell"><header class="silence-showcase-header"><div class="silence-wordmark"><img src="assets/img/brands/silence logo/LOGO-GOLD-SILENCE.svg" alt="${p.silence.label}"></div><p class="silence-subline">${p.silence.subline}</p><a class="hero-cta silence-explore-cta" href="https://www.thesilencecollection.com" target="_blank" rel="noopener noreferrer">${p.silence.explore}</a></header><div class="silence-carousel" data-silence-carousel aria-roledescription="carousel" aria-label="${p.silence.carouselLabel}" tabindex="0"><div class="silence-product-track" data-silence-track>${silenceCards}</div><button class="silence-carousel-arrow silence-carousel-prev" type="button" data-silence-prev aria-label="${p.silence.previous}"><span aria-hidden="true">‹</span></button><button class="silence-carousel-arrow silence-carousel-next" type="button" data-silence-next aria-label="${p.silence.next}"><span aria-hidden="true">›</span></button><div class="silence-carousel-dots">${silenceDots}</div><p class="sr-only" aria-live="polite" data-silence-status>${silenceProducts[0].name}, 1 of ${silenceProducts.length}</p></div><footer class="silence-showcase-footer"><h2 class="silence-slogan" id="silence-showcase-title"><span>${p.silence.slogan[0]}</span><span>${p.silence.slogan[1]}</span></h2><div class="silence-s-mark" aria-hidden="true"><img src="assets/img/brands/silence logo/LOGO-GOLD-S.svg" alt=""></div></footer></div></section>`;
    const gfyMarkup = `<section class="gfy-showcase" aria-labelledby="gfy-showcase-title"><div class="gfy-showcase-shell"><header class="gfy-showcase-header"><h2 class="gfy-wordmark" id="gfy-showcase-title">GO FOR <span>YOU!</span></h2><p class="gfy-subline">${p.gfy.subline}</p><a class="hero-cta gfy-explore-cta" href="https://www.goforyou.store" target="_blank" rel="noopener noreferrer">${p.gfy.explore}</a></header><article class="gfy-bundle-card"><div class="gfy-bundle-media"><img src="assets/img/brands/goforyou-products/1gfy.webp" alt="${p.gfy.bundleTitle}" width="1600" height="2000" loading="lazy" decoding="async"></div><div class="gfy-bundle-copy"><p class="gfy-eyebrow">${p.gfy.bundleEyebrow}</p><h3>${p.gfy.bundleTitle}</h3><p>${p.gfy.bundleCopy}</p><a class="hero-cta gfy-bundle-cta" href="https://www.goforyou.store/products/kit" target="_blank" rel="noopener noreferrer">${p.gfy.bundleShop}</a></div></article><div class="gfy-formula-heading"><span></span><h3>${p.gfy.formulaTitle}</h3><span></span></div><div class="gfy-carousel" data-gfy-carousel aria-roledescription="carousel" aria-label="${p.gfy.carouselLabel}" tabindex="0"><div class="gfy-product-track" data-gfy-track>${gfyCards}</div><button class="gfy-carousel-arrow gfy-carousel-prev" type="button" data-gfy-prev aria-label="${p.gfy.previous}"><span aria-hidden="true">‹</span></button><button class="gfy-carousel-arrow gfy-carousel-next" type="button" data-gfy-next aria-label="${p.gfy.next}"><span aria-hidden="true">›</span></button><div class="gfy-carousel-dots">${gfyDots}</div><p class="sr-only" aria-live="polite" data-gfy-status>${p.gfy.products[gfyProducts[0].key]}, 1 of ${gfyProducts.length}</p></div><article class="gfy-tech"><div class="gfy-tech-media"><img src="assets/img/brands/goforyou-products/6gfy.webp" alt="${p.gfy.techTitle}" width="1600" height="2000" loading="lazy" decoding="async"></div><div class="gfy-tech-copy"><p class="gfy-eyebrow">${p.gfy.techEyebrow}</p><h3>${p.gfy.techTitle}</h3><p>${p.gfy.techCopy}</p><a class="hero-cta gfy-tech-cta" href="https://www.goforyou.store/products/go-for-you-perfect-body" target="_blank" rel="noopener noreferrer">${p.gfy.techCta}</a></div></article></div></section>`;
    return brandAndSilenceMarkup + gfyMarkup;
  }

  function bindSilenceCarousel() {
    clearInterval(silenceCarouselTimer);
    const carousel = document.querySelector("[data-silence-carousel]");
    if (!carousel) return;
    const track = carousel.querySelector("[data-silence-track]");
    const cards = Array.from(carousel.querySelectorAll("[data-silence-card]"));
    const dots = Array.from(carousel.querySelectorAll("[data-silence-dot]"));
    const status = carousel.querySelector("[data-silence-status]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const section = carousel.closest(".silence-showcase");
    let current = 0;
    let scrollTimer;

    section.dataset.animate = "true";
    if (reducedMotion || !("IntersectionObserver" in window)) {
      section.classList.add("is-visible");
    } else {
      const revealObserver = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        section.classList.add("is-visible");
        revealObserver.disconnect();
      }, { threshold: 0.12 });
      revealObserver.observe(section);
    }

    function setActive(index) {
      current = (index + cards.length) % cards.length;
      carousel.style.setProperty("--silence-accent", silenceProducts[current].accent);
      [0, 1, 2].forEach((offset) => {
        const image = cards[(current + offset) % cards.length].querySelector("img");
        if (!image) return;
        image.loading = "eager";
        if (offset === 0) image.fetchPriority = "high";
      });
      cards.forEach((card, cardIndex) => {
        const delta = cardIndex - current;
        card.classList.toggle("is-active", delta === 0);
        card.classList.toggle("is-before", delta < 0);
        card.classList.toggle("is-after", delta > 0);
        if (delta !== 0) {
          card.style.setProperty("--tilt-x", "0deg");
          card.style.setProperty("--tilt-y", "0deg");
        }
      });
      dots.forEach((dot, dotIndex) => {
        const active = dotIndex === current;
        dot.classList.toggle("is-active", active);
        dot.classList.remove("is-progressing");
        if (active && !reducedMotion) window.requestAnimationFrame(() => dot.classList.add("is-progressing"));
        dot.setAttribute("aria-current", String(active));
      });
      status.textContent = `${silenceProducts[current].name}, ${current + 1} of ${cards.length}`;
    }

    function show(index, userInitiated) {
      const next = (index + cards.length) % cards.length;
      const card = cards[next];
      setActive(next);
      track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2, behavior: reducedMotion ? "auto" : "smooth" });
      if (userInitiated) restart();
    }

    function stop() { clearInterval(silenceCarouselTimer); }
    function start() {
      if (reducedMotion || document.hidden) return;
      stop();
      silenceCarouselTimer = window.setInterval(() => show(current + 1, false), 5800);
    }
    function restart() { stop(); start(); }

    carousel.querySelector("[data-silence-prev]").addEventListener("click", () => show(current - 1, true));
    carousel.querySelector("[data-silence-next]").addEventListener("click", () => show(current + 1, true));
    dots.forEach((dot) => dot.addEventListener("click", () => show(Number(dot.dataset.silenceDot), true)));
    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") { event.preventDefault(); show(current - 1, true); }
      if (event.key === "ArrowRight") { event.preventDefault(); show(current + 1, true); }
    });
    track.addEventListener("scroll", () => {
      clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        const center = track.scrollLeft + track.clientWidth / 2;
        const closest = cards.reduce((best, card, index) => Math.abs(card.offsetLeft + card.clientWidth / 2 - center) < best.distance ? { index, distance: Math.abs(card.offsetLeft + card.clientWidth / 2 - center) } : best, { index: 0, distance: Infinity });
        setActive(closest.index);
      }, 90);
    }, { passive: true });
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("focusin", stop);
    carousel.addEventListener("focusout", (event) => { if (!carousel.contains(event.relatedTarget)) start(); });
    track.addEventListener("pointerdown", stop);
    track.addEventListener("pointerup", restart);
    carousel.addEventListener("pointermove", (event) => {
      if (reducedMotion || event.pointerType !== "mouse") return;
      const activeCard = cards[current];
      const rect = activeCard.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return;
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      activeCard.style.setProperty("--tilt-x", `${(-y * 5).toFixed(2)}deg`);
      activeCard.style.setProperty("--tilt-y", `${(x * 7).toFixed(2)}deg`);
    });
    carousel.addEventListener("pointerleave", () => {
      cards[current].style.setProperty("--tilt-x", "0deg");
      cards[current].style.setProperty("--tilt-y", "0deg");
    });
    setActive(0);
    start();
  }

  function bindGfyCarousel() {
    clearInterval(gfyCarouselTimer);
    const carousel = document.querySelector("[data-gfy-carousel]");
    if (!carousel) return;
    const track = carousel.querySelector("[data-gfy-track]");
    const cards = Array.from(carousel.querySelectorAll("[data-gfy-card]"));
    const dots = Array.from(carousel.querySelectorAll("[data-gfy-dot]"));
    const status = carousel.querySelector("[data-gfy-status]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const p = copy[lang].pages.brand.gfy;
    let current = 0;
    let scrollTimer;

    function setActive(index) {
      current = (index + cards.length) % cards.length;
      carousel.style.setProperty("--gfy-accent", gfyProducts[current].accent);
      cards.forEach((card, cardIndex) => {
        const delta = cardIndex - current;
        card.classList.toggle("is-active", delta === 0);
        card.classList.toggle("is-before", delta < 0);
        card.classList.toggle("is-after", delta > 0);
        if (delta !== 0) {
          card.style.setProperty("--tilt-x", "0deg");
          card.style.setProperty("--tilt-y", "0deg");
        }
      });
      dots.forEach((dot, dotIndex) => {
        const active = dotIndex === current;
        dot.classList.toggle("is-active", active);
        dot.classList.remove("is-progressing");
        if (active && !reducedMotion) window.requestAnimationFrame(() => dot.classList.add("is-progressing"));
        dot.setAttribute("aria-current", String(active));
      });
      status.textContent = `${p.products[gfyProducts[current].key]}, ${current + 1} of ${cards.length}`;
    }

    function show(index, userInitiated) {
      const next = (index + cards.length) % cards.length;
      setActive(next);
      const card = cards[next];
      track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2, behavior: reducedMotion ? "auto" : "smooth" });
      if (userInitiated) restart();
    }
    function stop() { clearInterval(gfyCarouselTimer); }
    function start() {
      if (reducedMotion || document.hidden) return;
      stop();
      gfyCarouselTimer = window.setInterval(() => show(current + 1, false), 5800);
    }
    function restart() { stop(); start(); }

    carousel.querySelector("[data-gfy-prev]").addEventListener("click", () => show(current - 1, true));
    carousel.querySelector("[data-gfy-next]").addEventListener("click", () => show(current + 1, true));
    dots.forEach((dot) => dot.addEventListener("click", () => show(Number(dot.dataset.gfyDot), true)));
    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") { event.preventDefault(); show(current - 1, true); }
      if (event.key === "ArrowRight") { event.preventDefault(); show(current + 1, true); }
    });
    track.addEventListener("scroll", () => {
      clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        const center = track.scrollLeft + track.clientWidth / 2;
        const closest = cards.reduce((best, card, index) => {
          const distance = Math.abs(card.offsetLeft + card.clientWidth / 2 - center);
          return distance < best.distance ? { index, distance } : best;
        }, { index: 0, distance: Infinity });
        setActive(closest.index);
      }, 90);
    }, { passive: true });
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("focusin", stop);
    carousel.addEventListener("focusout", (event) => { if (!carousel.contains(event.relatedTarget)) start(); });
    track.addEventListener("pointerdown", stop);
    track.addEventListener("pointerup", restart);
    carousel.addEventListener("pointermove", (event) => {
      if (reducedMotion || event.pointerType !== "mouse") return;
      const card = cards[current];
      const rect = card.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return;
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.style.setProperty("--tilt-x", `${(-y * 5).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${(x * 7).toFixed(2)}deg`);
    });
    carousel.addEventListener("pointerleave", () => {
      cards[current].style.setProperty("--tilt-x", "0deg");
      cards[current].style.setProperty("--tilt-y", "0deg");
    });
    setActive(0);
    start();
  }

  function bindBrandCarousel() {
    clearInterval(brandCarouselTimer);
    const carousel = document.querySelector("[data-brand-carousel]");
    if (!carousel) return;
    const slides = Array.from(carousel.querySelectorAll("[data-brand-slide]"));
    const dots = Array.from(carousel.querySelectorAll("[data-brand-dot]"));
    const status = carousel.querySelector("[data-brand-status]");
    const p = copy[lang].pages.brand;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let current = 0;
    let pointerStart = null;

    function show(index, userInitiated) {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === current;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
      });
      dots.forEach((dot, dotIndex) => {
        const active = dotIndex === current;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-current", String(active));
      });
      status.textContent = `${p.slides[current]}, ${current + 1} of ${slides.length}`;
      if (userInitiated) restart();
    }

    function stop() {
      clearInterval(brandCarouselTimer);
    }

    function start() {
      if (reducedMotion || document.hidden) return;
      stop();
      brandCarouselTimer = window.setInterval(() => show(current + 1, false), 6500);
    }

    function restart() {
      stop();
      start();
    }

    carousel.querySelector("[data-brand-prev]").addEventListener("click", () => show(current - 1, true));
    carousel.querySelector("[data-brand-next]").addEventListener("click", () => show(current + 1, true));
    dots.forEach((dot) => dot.addEventListener("click", () => show(Number(dot.dataset.brandDot), true)));
    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") { event.preventDefault(); show(current - 1, true); }
      if (event.key === "ArrowRight") { event.preventDefault(); show(current + 1, true); }
    });
    carousel.addEventListener("pointerdown", (event) => { pointerStart = event.clientX; });
    carousel.addEventListener("pointerup", (event) => {
      if (pointerStart === null) return;
      const distance = event.clientX - pointerStart;
      pointerStart = null;
      if (Math.abs(distance) > 45) show(current + (distance < 0 ? 1 : -1), true);
    });
    carousel.addEventListener("pointercancel", () => { pointerStart = null; });
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("focusin", stop);
    carousel.addEventListener("focusout", (event) => { if (!carousel.contains(event.relatedTarget)) start(); });
    document.addEventListener("visibilitychange", () => document.hidden ? stop() : start(), { once: true });
    start();
  }

  function bindMediaVideoCarousel() {
    const carousel = document.querySelector("[data-media-video-carousel]");
    if (!carousel) return;
    const track = carousel.querySelector("[data-media-video-track]");
    const cards = Array.from(carousel.querySelectorAll("[data-media-video-card]"));
    const dots = Array.from(carousel.querySelectorAll("[data-media-video-dot]"));
    const status = carousel.querySelector("[data-media-video-status]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let current = 0;
    let scrollTimer;

    function setActive(index) {
      current = Math.max(0, Math.min(index, cards.length - 1));
      cards.forEach((card, cardIndex) => card.classList.toggle("is-active", cardIndex === current));
      dots.forEach((dot, dotIndex) => {
        const active = dotIndex === current;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-current", String(active));
      });
      status.textContent = `${mediaVideos[current].title}, ${current + 1} of ${cards.length}`;
    }

    function show(index) {
      const next = (index + cards.length) % cards.length;
      setActive(next);
      const card = cards[next];
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: reducedMotion ? "auto" : "smooth" });
    }

    carousel.querySelector("[data-media-video-prev]").addEventListener("click", () => show(current - 1));
    carousel.querySelector("[data-media-video-next]").addEventListener("click", () => show(current + 1));
    dots.forEach((dot) => dot.addEventListener("click", () => show(Number(dot.dataset.mediaVideoDot))));
    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") { event.preventDefault(); show(current - 1); }
      if (event.key === "ArrowRight") { event.preventDefault(); show(current + 1); }
    });
    track.addEventListener("scroll", () => {
      clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        const closest = cards.reduce((best, card, index) => {
          const distance = Math.abs(card.offsetLeft - track.scrollLeft - track.offsetLeft);
          return distance < best.distance ? { index, distance } : best;
        }, { index: 0, distance: Infinity });
        setActive(closest.index);
      }, 100);
    }, { passive: true });
    track.scrollLeft = 0;
    setActive(0);
    window.setTimeout(() => {
      if (!document.body.contains(track)) return;
      track.scrollTo({ left: 0, behavior: "auto" });
      setActive(0);
    }, 1200);
  }

  function bindPressFlipbookLegacy() {
    const flipbook = document.querySelector("[data-press-flipbook]");
    if (!flipbook) return;
    const dots = Array.from(flipbook.querySelectorAll("[data-press-dot]"));
    const inlineSurface = flipbook.querySelector('[data-press-surface="inline"]');
    const fullscreenSurface = flipbook.querySelector('[data-press-surface="fullscreen"]');
    const counter = flipbook.querySelector("[data-press-counter]");
    const status = flipbook.querySelector("[data-press-status]");
    const openPage = flipbook.querySelector("[data-press-open]");
    const fullscreenViewer = flipbook.querySelector("[data-press-fullscreen]");
    const fullscreenCamera = flipbook.querySelector("[data-press-camera]");
    const fullscreenCounter = flipbook.querySelector("[data-press-fullscreen-counter]");
    const fullscreenClose = flipbook.querySelector("[data-press-fullscreen-close]");
    const fullscreenPrev = flipbook.querySelector("[data-press-fullscreen-prev]");
    const fullscreenNext = flipbook.querySelector("[data-press-fullscreen-next]");
    const previousButton = flipbook.querySelector("[data-press-prev]");
    const nextButton = flipbook.querySelector("[data-press-next]");
    const zoomInButton = flipbook.querySelector("[data-press-zoom-in]");
    const zoomOutButton = flipbook.querySelector("[data-press-zoom-out]");
    const zoomResetButton = flipbook.querySelector("[data-press-zoom-reset]");
    const labels = copy[lang].pages.press.magazine;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobileFullscreen = window.matchMedia("(max-width: 760px), (max-width: 950px) and (max-height: 520px)");
    const spreadCount = Math.ceil((pressMagazinePages.length - 1) / 2);
    let currentSpread = -1;
    let fullscreenFocus = "cover";
    let animating = false;
    let inlineDrag = null;
    let fullscreenGesture = null;
    let userZoom = 1;
    let fullscreenPanX = 0;
    let fullscreenPanY = 0;
    let pinchGesture = null;
    let closingFullscreen = false;
    const fullscreenPointers = new Map();

    const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, reducedMotion ? 0 : duration));

    function surfaceParts(surface) {
      return {
        cover: surface.querySelector(".press-book-cover"),
        coverImage: surface.querySelector("[data-press-cover]"),
        left: surface.querySelector(".press-page-left"),
        leftImage: surface.querySelector("[data-press-left]"),
        right: surface.querySelector(".press-page-right"),
        rightImage: surface.querySelector("[data-press-right]"),
        turning: surface.querySelector("[data-press-turning]"),
        strips: Array.from(surface.querySelectorAll("[data-press-turn-strip]")),
        turnFront: Array.from(surface.querySelectorAll("[data-press-turn-front]")),
        turnBack: Array.from(surface.querySelectorAll("[data-press-turn-back]")),
      };
    }

    const inlineParts = surfaceParts(inlineSurface);
    const fullscreenParts = surfaceParts(fullscreenSurface);

    function pageSource(pageNumber) {
      return pressMagazinePages[pageNumber] || "";
    }

    function pageDescription(pageNumber) {
      return pageNumber === 0 ? labels.cover : `${labels.page} ${pageNumber}`;
    }

    function spreadPages(spreadIndex) {
      if (spreadIndex < 0) return [0, 0];
      const left = spreadIndex * 2 + 1;
      return [left, Math.min(left + 1, pressMagazinePages.length - 1)];
    }

    function assignImage(image, pageNumber) {
      const source = pageSource(pageNumber);
      if (source && image.getAttribute("src") !== source) image.src = source;
      image.alt = pageDescription(pageNumber);
    }

    function assignTurnFace(faces, pageNumber) {
      const source = pageSource(pageNumber);
      faces.forEach((face) => { face.style.backgroundImage = `url("${source}")`; });
    }

    function setStaticSurface(surface, spreadIndex) {
      const parts = surface === inlineSurface ? inlineParts : fullscreenParts;
      const isCover = spreadIndex < 0;
      surface.classList.toggle("is-cover", isCover);
      surface.classList.remove("is-turning");
      surface.style.removeProperty("transition");
      if (surface === inlineSurface) surface.style.transform = isCover ? "translateX(-25%)" : "translateX(0)";
      else surface.style.removeProperty("transform");
      parts.turning.hidden = true;
      parts.turning.className = "press-turning-leaf";
      parts.turning.style.removeProperty("transform");
      parts.turning.style.removeProperty("transition");
      parts.strips.forEach((strip) => {
        strip.style.removeProperty("transform");
        strip.style.removeProperty("transition");
        strip.style.removeProperty("filter");
      });
      parts.cover.hidden = !isCover;
      parts.left.hidden = isCover;
      parts.right.hidden = isCover;
      if (isCover) {
        assignImage(parts.coverImage, 0);
      } else {
        const [left, right] = spreadPages(spreadIndex);
        assignImage(parts.leftImage, left);
        assignImage(parts.rightImage, right);
      }
    }

    function readingLabel(focus = "spread") {
      if (currentSpread < 0) return labels.cover;
      const [left, right] = spreadPages(currentSpread);
      if (focus === "left") return `${labels.page} ${left} ${labels.of} ${pressMagazinePages.length - 1}`;
      if (focus === "right") return `${labels.page} ${right} ${labels.of} ${pressMagazinePages.length - 1}`;
      return `${labels.page} ${left}–${right} ${labels.of} ${pressMagazinePages.length - 1}`;
    }

    function updateControls() {
      const inlineLabel = readingLabel("spread");
      const fullLabel = readingLabel(fullscreenFocus);
      counter.textContent = inlineLabel;
      fullscreenCounter.textContent = fullLabel;
      status.textContent = fullscreenViewer.hidden ? inlineLabel : fullLabel;
      dots.forEach((dot) => {
        const active = Number(dot.dataset.pressDot) === currentSpread;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-current", String(active));
      });
      previousButton.disabled = currentSpread < 0;
      nextButton.disabled = currentSpread >= spreadCount - 1;
      const atBeginning = currentSpread < 0;
      const atEnd = currentSpread === spreadCount - 1 && (!mobileFullscreen.matches || fullscreenFocus === "right");
      fullscreenPrev.disabled = atBeginning;
      fullscreenNext.disabled = atEnd;
    }

    function setFocus(mode, announce = true) {
      fullscreenFocus = mode;
      fullscreenCamera.classList.remove("is-focus-left", "is-focus-right", "is-focus-cover", "is-focus-spread");
      fullscreenCamera.classList.add(`is-focus-${mode}`);
      if (announce) updateControls();
    }

    function prepareTurn(surface, targetSpread, direction) {
      const parts = surface === inlineSurface ? inlineParts : fullscreenParts;
      const fromSpread = currentSpread;
      const forward = direction === "forward";
      const openingCover = fromSpread < 0 && forward;
      const closingCover = targetSpread < 0 && !forward;
      const fromPages = spreadPages(fromSpread);
      const toPages = spreadPages(targetSpread);

      surface.classList.add("is-turning");
      parts.cover.hidden = true;
      parts.left.hidden = false;
      parts.right.hidden = false;
      parts.turning.hidden = false;
      parts.turning.className = `press-turning-leaf is-${direction}`;
      parts.turning.style.transition = "none";
      parts.turning.style.transform = "rotateY(0deg)";

      if (forward) {
        if (openingCover) {
          assignImage(parts.leftImage, toPages[0]);
          assignTurnFace(parts.turnFront, 0);
        } else {
          assignImage(parts.leftImage, fromPages[0]);
          assignTurnFace(parts.turnFront, fromPages[1]);
        }
        assignImage(parts.rightImage, toPages[1]);
        assignTurnFace(parts.turnBack, toPages[0]);
      } else {
        if (closingCover) {
          assignImage(parts.leftImage, fromPages[0]);
          assignImage(parts.rightImage, fromPages[1]);
          assignTurnFace(parts.turnFront, fromPages[0]);
          assignTurnFace(parts.turnBack, 0);
        } else {
          assignImage(parts.leftImage, toPages[0]);
          assignImage(parts.rightImage, fromPages[1]);
          assignTurnFace(parts.turnFront, fromPages[0]);
          assignTurnFace(parts.turnBack, toPages[1]);
        }
      }
      return { surface, parts, targetSpread, direction, openingCover, closingCover };
    }

    function setTurnProgress(turn, progress, animate = false, duration = 0) {
      const amount = Math.max(0, Math.min(1, progress));
      const columnCount = Math.max(...turn.parts.strips.map((strip) => Number(strip.dataset.pressTurnColumn))) + 1;
      const rowCount = Math.max(...turn.parts.strips.map((strip) => Number(strip.dataset.pressTurnRow))) + 1;
      const leafWidth = Math.max(1, turn.surface.getBoundingClientRect().width / 2);
      const stripWidth = leafWidth / columnCount;
      const forward = turn.direction === "forward";

      for (let row = 0; row < rowCount; row += 1) {
        const rowPosition = rowCount === 1 ? .5 : row / (rowCount - 1);
        const centerStrength = rowCount === 1 ? .38 : Math.sin(Math.PI * rowPosition);
        const rowAmount = Math.max(0, Math.min(1, amount + Math.sin(Math.PI * amount) * .12 * (centerStrength - .38)));
        let accumulatedX = 0;
        let accumulatedZ = 0;

        for (let logicalColumn = 0; logicalColumn < columnCount; logicalColumn += 1) {
          const actualColumn = forward ? logicalColumn : columnCount - 1 - logicalColumn;
          const strip = turn.parts.strips[row * columnCount + actualColumn];
          const distanceFromHinge = logicalColumn / Math.max(1, columnCount - 1);
          const delayedProgress = Math.max(0, Math.min(1, (rowAmount - (1 - distanceFromHinge) * .38) / .62));
          const curvedProgress = delayedProgress * delayedProgress * (3 - 2 * delayedProgress);
          const degrees = (forward ? -180 : 180) * curvedProgress;
          const radians = degrees * Math.PI / 180;
          const projectedWidth = Math.cos(radians) * stripWidth;
          const projectedDepth = Math.abs(Math.sin(radians)) * stripWidth;
          const originalCenter = (actualColumn + .5) * stripWidth;
          const targetCenter = forward
            ? accumulatedX + projectedWidth / 2
            : leafWidth - accumulatedX - projectedWidth / 2;
          const targetDepth = accumulatedZ + projectedDepth / 2;
          const verticalBow = Math.sin(Math.PI * amount) * (rowPosition - .5) * -5;
          const brightness = .68 + .32 * Math.abs(Math.cos(radians));
          strip.style.transition = animate ? `transform ${duration}ms cubic-bezier(.2,.72,.18,1),filter ${duration}ms ease` : "none";
          strip.style.transform = `translate3d(${targetCenter - originalCenter}px,${verticalBow}px,${targetDepth}px) rotateY(${degrees}deg)`;
          strip.style.filter = `brightness(${brightness})`;
          accumulatedX += projectedWidth;
          accumulatedZ += projectedDepth;
        }
      }

      turn.surface.style.transition = animate ? `transform ${duration}ms cubic-bezier(.2,.72,.18,1)` : "none";
      turn.parts.turning.style.setProperty("--press-turn-progress", String(amount));
      turn.parts.turning.style.setProperty("--press-fold-shadow", String(Math.sin(Math.PI * amount) * .72));
      if (turn.surface === inlineSurface && turn.openingCover) turn.surface.style.transform = `translateX(${-25 * (1 - amount)}%)`;
      if (turn.surface === inlineSurface && turn.closingCover) turn.surface.style.transform = `translateX(${-25 * amount}%)`;
    }

    function finishTurn(turn, committed) {
      if (committed) currentSpread = turn.targetSpread;
      setStaticSurface(inlineSurface, currentSpread);
      setStaticSurface(fullscreenSurface, currentSpread);
      animating = false;
      updateControls();
    }

    function animatePreparedTurn(turn, commit, startProgress = 0) {
      const target = commit ? 1 : 0;
      const remaining = Math.abs(target - startProgress);
      const duration = reducedMotion ? 0 : Math.max(170, Math.round(820 * remaining));
      animating = true;
      return new Promise((resolve) => {
        if (duration === 0) {
          setTurnProgress(turn, target);
          finishTurn(turn, commit);
          resolve(commit);
          return;
        }
        const startedAt = performance.now();
        const animateFrame = (now) => {
          const elapsed = Math.min(1, (now - startedAt) / duration);
          const eased = elapsed * elapsed * (3 - 2 * elapsed);
          setTurnProgress(turn, startProgress + (target - startProgress) * eased);
          if (elapsed < 1) {
            window.requestAnimationFrame(animateFrame);
          } else {
            finishTurn(turn, commit);
            resolve(commit);
          }
        };
        window.requestAnimationFrame(animateFrame);
      });
    }

    function validTarget(targetSpread) {
      return targetSpread >= -1 && targetSpread < spreadCount && targetSpread !== currentSpread;
    }

    async function turnTo(targetSpread, surface = inlineSurface) {
      if (animating || !validTarget(targetSpread)) return false;
      const direction = targetSpread > currentSpread ? "forward" : "backward";
      const turn = prepareTurn(surface, targetSpread, direction);
      setTurnProgress(turn, 0);
      return animatePreparedTurn(turn, true, 0);
    }

    function beginInlineDrag(event) {
      if (animating || event.button > 0 || event.target.closest("button")) return;
      inlineDrag = { startX: event.clientX, startTime: performance.now(), turn: null, progress: 0 };
      inlineSurface.setPointerCapture?.(event.pointerId);
    }

    function moveInlineDrag(event) {
      if (!inlineDrag || animating) return;
      const delta = event.clientX - inlineDrag.startX;
      if (!inlineDrag.turn && Math.abs(delta) > 7) {
        const direction = delta < 0 ? "forward" : "backward";
        const target = currentSpread + (direction === "forward" ? 1 : -1);
        if (!validTarget(target)) return;
        inlineDrag.turn = prepareTurn(inlineSurface, target, direction);
      }
      if (!inlineDrag.turn) return;
      event.preventDefault();
      const pageWidth = Math.max(1, inlineSurface.getBoundingClientRect().width / 2);
      const directionalDistance = inlineDrag.turn.direction === "forward" ? -delta : delta;
      inlineDrag.progress = Math.max(0, Math.min(1, directionalDistance / pageWidth));
      setTurnProgress(inlineDrag.turn, inlineDrag.progress);
    }

    function endInlineDrag(event) {
      if (!inlineDrag) return;
      const drag = inlineDrag;
      inlineDrag = null;
      if (!drag.turn) return;
      const elapsed = Math.max(1, performance.now() - drag.startTime);
      const delta = event.clientX - drag.startX;
      const directionalDistance = drag.turn.direction === "forward" ? -delta : delta;
      const velocity = Math.max(0, directionalDistance) / elapsed;
      animatePreparedTurn(drag.turn, drag.progress > .28 || velocity > .55, drag.progress);
    }

    function cancelInlineDrag() {
      if (!inlineDrag) return;
      const drag = inlineDrag;
      inlineDrag = null;
      if (drag.turn) animatePreparedTurn(drag.turn, false, drag.progress);
    }

    inlineSurface.addEventListener("pointerdown", beginInlineDrag);
    inlineSurface.addEventListener("pointermove", moveInlineDrag);
    inlineSurface.addEventListener("pointerup", endInlineDrag);
    inlineSurface.addEventListener("pointercancel", cancelInlineDrag);
    previousButton.addEventListener("click", () => turnTo(currentSpread - 1));
    nextButton.addEventListener("click", () => turnTo(currentSpread + 1));
    dots.forEach((dot) => dot.addEventListener("click", () => turnTo(Number(dot.dataset.pressDot))));
    flipbook.addEventListener("keydown", (event) => {
      if (!fullscreenViewer.hidden) return;
      if (event.key === "ArrowLeft") { event.preventDefault(); turnTo(currentSpread - 1); }
      if (event.key === "ArrowRight") { event.preventDefault(); turnTo(currentSpread + 1); }
    });

    function pointerDistance() {
      const points = Array.from(fullscreenPointers.values());
      if (points.length < 2) return 0;
      return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
    }

    function cameraScale() {
      return mobileFullscreen.matches && (fullscreenFocus === "left" || fullscreenFocus === "right") ? 2 : 1;
    }

    function clampFullscreenPan() {
      if (userZoom <= 1) {
        fullscreenPanX = 0;
        fullscreenPanY = 0;
        return;
      }
      const rect = fullscreenSurface.getBoundingClientRect();
      const maxX = Math.max(0, (rect.width * userZoom * cameraScale() - window.innerWidth) / 2);
      const maxY = Math.max(0, (rect.height * userZoom * cameraScale() - window.innerHeight) / 2);
      fullscreenPanX = Math.max(-maxX, Math.min(maxX, fullscreenPanX));
      fullscreenPanY = Math.max(-maxY, Math.min(maxY, fullscreenPanY));
    }

    function applyFullscreenTransform() {
      fullscreenSurface.style.setProperty("--press-user-zoom", String(userZoom));
      fullscreenSurface.style.setProperty("--press-pan-x", `${fullscreenPanX}px`);
      fullscreenSurface.style.setProperty("--press-pan-y", `${fullscreenPanY}px`);
      zoomResetButton.textContent = `${Math.round(userZoom * 100)}%`;
      zoomOutButton.disabled = userZoom === 1;
      zoomInButton.disabled = userZoom === 2;
    }

    function setFullscreenZoom(value) {
      userZoom = Math.min(2, Math.max(1, value));
      if (userZoom < 1.03) userZoom = 1;
      clampFullscreenPan();
      applyFullscreenTransform();
    }

    async function fullscreenForward() {
      if (animating || userZoom !== 1) return;
      if (!mobileFullscreen.matches) {
        await turnTo(currentSpread + 1, fullscreenSurface);
        setFocus(currentSpread < 0 ? "cover" : "spread");
        return;
      }
      if (currentSpread < 0) {
        setFocus("spread", false);
        if (await turnTo(0, fullscreenSurface)) {
          await wait(100);
          if (fullscreenViewer.hidden) return;
          setFocus("left");
        }
      } else if (fullscreenFocus === "left") {
        setFocus("right");
      } else if (fullscreenFocus === "right" && currentSpread < spreadCount - 1) {
        setFocus("spread");
        await wait(470);
        if (fullscreenViewer.hidden) return;
        if (await turnTo(currentSpread + 1, fullscreenSurface)) {
          await wait(100);
          if (fullscreenViewer.hidden) return;
          setFocus("left");
        }
      }
    }

    async function fullscreenBackward() {
      if (animating || userZoom !== 1 || currentSpread < 0) return;
      if (!mobileFullscreen.matches) {
        await turnTo(currentSpread - 1, fullscreenSurface);
        setFocus(currentSpread < 0 ? "cover" : "spread");
        return;
      }
      if (fullscreenFocus === "right") {
        setFocus("left");
      } else if (fullscreenFocus === "left") {
        setFocus("spread");
        await wait(470);
        if (fullscreenViewer.hidden) return;
        if (await turnTo(currentSpread - 1, fullscreenSurface)) {
          await wait(100);
          if (fullscreenViewer.hidden) return;
          setFocus(currentSpread < 0 ? "cover" : "right");
        }
      }
    }

    fullscreenViewer.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button")) return;
      event.preventDefault();
      fullscreenViewer.setPointerCapture?.(event.pointerId);
      fullscreenPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (fullscreenPointers.size === 1) {
        fullscreenGesture = { x: event.clientX, y: event.clientY, panX: fullscreenPanX, panY: fullscreenPanY };
      } else if (fullscreenPointers.size === 2) {
        pinchGesture = { distance: pointerDistance(), zoom: userZoom };
        fullscreenGesture = null;
      }
    });

    fullscreenViewer.addEventListener("pointermove", (event) => {
      if (!fullscreenPointers.has(event.pointerId)) return;
      event.preventDefault();
      fullscreenPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (fullscreenPointers.size >= 2 && pinchGesture) {
        const distance = pointerDistance();
        if (pinchGesture.distance > 0) setFullscreenZoom(pinchGesture.zoom * distance / pinchGesture.distance);
      } else if (fullscreenPointers.size === 1 && fullscreenGesture && userZoom > 1) {
        fullscreenPanX = fullscreenGesture.panX + event.clientX - fullscreenGesture.x;
        fullscreenPanY = fullscreenGesture.panY + event.clientY - fullscreenGesture.y;
        clampFullscreenPan();
        applyFullscreenTransform();
      }
    });

    function endFullscreenPointer(event) {
      const wasSingle = fullscreenPointers.size === 1;
      const start = fullscreenGesture;
      fullscreenPointers.delete(event.pointerId);
      if (wasSingle && start && userZoom === 1) {
        const distanceX = event.clientX - start.x;
        const distanceY = event.clientY - start.y;
        if (Math.abs(distanceX) > 48 && Math.abs(distanceX) > Math.abs(distanceY) * 1.15) {
          if (distanceX < 0) fullscreenForward();
          else fullscreenBackward();
        }
      }
      if (fullscreenPointers.size === 1) {
        const remaining = Array.from(fullscreenPointers.values())[0];
        fullscreenGesture = { x: remaining.x, y: remaining.y, panX: fullscreenPanX, panY: fullscreenPanY };
      } else {
        fullscreenGesture = null;
      }
      if (fullscreenPointers.size < 2) pinchGesture = null;
    }
    fullscreenViewer.addEventListener("pointerup", endFullscreenPointer);
    fullscreenViewer.addEventListener("pointercancel", endFullscreenPointer);

    async function closeFullscreen() {
      if (closingFullscreen) return;
      closingFullscreen = true;
      if (document.fullscreenElement === fullscreenViewer) {
        try { await document.exitFullscreen(); } catch (_) {}
      }
      fullscreenViewer.hidden = true;
      document.body.classList.remove("press-viewer-open");
      fullscreenPointers.clear();
      fullscreenPanX = 0;
      fullscreenPanY = 0;
      setFullscreenZoom(1);
      setFocus(currentSpread < 0 ? "cover" : "spread", false);
      openPage.focus({ preventScroll: true });
      closingFullscreen = false;
    }
    async function openFullscreen() {
      setStaticSurface(fullscreenSurface, currentSpread);
      fullscreenViewer.hidden = false;
      document.body.classList.add("press-viewer-open");
      fullscreenPanX = 0;
      fullscreenPanY = 0;
      setFullscreenZoom(1);
      setFocus(currentSpread < 0 ? "cover" : "spread", false);
      try {
        await fullscreenViewer.requestFullscreen?.({ navigationUI: "hide" });
      } catch (_) {
        /* The fixed viewer remains available when native fullscreen is restricted. */
      }
      fullscreenClose.focus({ preventScroll: true });
      if (mobileFullscreen.matches && currentSpread >= 0) {
        await wait(100);
        setFocus("left");
      } else {
        updateControls();
      }
    }
    openPage.addEventListener("click", openFullscreen);
    fullscreenClose.addEventListener("click", closeFullscreen);
    fullscreenPrev.addEventListener("click", fullscreenBackward);
    fullscreenNext.addEventListener("click", fullscreenForward);
    zoomInButton.addEventListener("click", () => setFullscreenZoom(userZoom + .25));
    zoomOutButton.addEventListener("click", () => setFullscreenZoom(userZoom - .25));
    zoomResetButton.addEventListener("click", () => setFullscreenZoom(1));
    fullscreenSurface.addEventListener("dblclick", () => setFullscreenZoom(userZoom === 1 ? 1.5 : 1));
    fullscreenViewer.addEventListener("wheel", (event) => {
      if (fullscreenViewer.hidden) return;
      event.preventDefault();
      setFullscreenZoom(userZoom + (event.deltaY < 0 ? .25 : -.25));
    }, { passive: false });
    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement && !fullscreenViewer.hidden && !closingFullscreen) closeFullscreen();
    });
    window.addEventListener("resize", () => {
      if (fullscreenViewer.hidden) return;
      setFocus(currentSpread < 0 ? "cover" : mobileFullscreen.matches ? "left" : "spread", false);
      clampFullscreenPan();
      applyFullscreenTransform();
      updateControls();
    });
    document.addEventListener("keydown", (event) => {
      if (fullscreenViewer.hidden) return;
      if (event.key === "Escape") closeFullscreen();
      if (event.key === "ArrowLeft") { event.preventDefault(); fullscreenBackward(); }
      if (event.key === "ArrowRight") { event.preventDefault(); fullscreenForward(); }
      if (event.key === "Tab") {
        const controls = Array.from(fullscreenViewer.querySelectorAll("button:not(:disabled)"));
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
    setStaticSurface(inlineSurface, currentSpread);
    setStaticSurface(fullscreenSurface, currentSpread);
    setFullscreenZoom(1);
    updateControls();
  }

  function bindPressFlipbook() {
    const flipbook = document.querySelector("[data-press-flipbook]");
    if (!flipbook) return;
    const inlineElement = flipbook.querySelector('[data-press-pageflip="inline"]');
    const fullscreenElement = flipbook.querySelector('[data-press-pageflip="fullscreen"]');
    const fullscreenViewer = flipbook.querySelector("[data-press-fullscreen]");
    const fullscreenCamera = flipbook.querySelector("[data-press-camera]");
    const openButton = flipbook.querySelector("[data-press-open]");
    const closeButton = flipbook.querySelector("[data-press-fullscreen-close]");
    const previousButton = flipbook.querySelector("[data-press-prev]");
    const nextButton = flipbook.querySelector("[data-press-next]");
    const fullscreenPrevious = flipbook.querySelector("[data-press-fullscreen-prev]");
    const fullscreenNext = flipbook.querySelector("[data-press-fullscreen-next]");
    const counter = flipbook.querySelector("[data-press-counter]");
    const fullscreenCounter = flipbook.querySelector("[data-press-fullscreen-counter]");
    const status = flipbook.querySelector("[data-press-status]");
    const dots = Array.from(flipbook.querySelectorAll("[data-press-dot]"));
    const zoomInButton = flipbook.querySelector("[data-press-zoom-in]");
    const zoomOutButton = flipbook.querySelector("[data-press-zoom-out]");
    const zoomResetButton = flipbook.querySelector("[data-press-zoom-reset]");
    const labels = copy[lang].pages.press.magazine;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobileFullscreen = window.matchMedia("(max-width: 760px), (max-width: 950px) and (max-height: 520px)");
    const lastSpreadPage = Math.max(1, pressMagazinePages.length - 2);
    let currentPage = 0;
    let fullscreenFocus = "cover";
    let fullscreenBook = null;
    let syncing = false;
    let sequenceRunning = false;
    let userZoom = 1;
    let panX = 0;
    let panY = 0;
    let gesture = null;
    let pinch = null;
    let closingFullscreen = false;
    let openingFullscreen = false;
    let fullscreenAttempt = 0;
    let ignoreFullscreenExitUntil = 0;
    let focusClipTimer = 0;
    const pointers = new Map();

    if (!window.St?.PageFlip) {
      status.textContent = "The magazine reader could not load.";
      return;
    }

    const pageFlipSettings = (mouseEnabled) => ({
      width: 1000,
      height: 1294,
      size: "stretch",
      minWidth: 80,
      maxWidth: 1000,
      minHeight: 104,
      maxHeight: 1294,
      drawShadow: true,
      flippingTime: reducedMotion ? 100 : 900,
      usePortrait: false,
      autoSize: true,
      maxShadowOpacity: .62,
      showCover: true,
      mobileScrollSupport: false,
      useMouseEvents: mouseEnabled,
      showPageCorners: mouseEnabled,
      swipeDistance: 35,
      disableFlipByClick: true,
    });

    const inlineBook = new window.St.PageFlip(inlineElement, pageFlipSettings(true));
    inlineBook.loadFromImages(pressMagazinePages);
    const sharpPages = document.createElement("div");
    const sharpLeftPage = document.createElement("img");
    const sharpRightPage = document.createElement("img");
    sharpPages.className = "press-sharp-pages is-cover";
    sharpPages.setAttribute("aria-hidden", "true");
    sharpLeftPage.className = "press-sharp-page press-sharp-page-left";
    sharpRightPage.className = "press-sharp-page press-sharp-page-right";
    sharpLeftPage.alt = "";
    sharpRightPage.alt = "";
    sharpLeftPage.draggable = false;
    sharpRightPage.draggable = false;
    sharpPages.append(sharpLeftPage, sharpRightPage);
    inlineElement.appendChild(sharpPages);
    inlineElement.classList.add("is-cover");
    const inlineHome = inlineElement.parentElement;
    const inlineAnchor = document.createComment("press flipbook home");
    inlineHome.insertBefore(inlineAnchor, inlineElement.nextSibling);
    const fullscreenHome = fullscreenViewer.parentElement;
    const fullscreenAnchor = document.createComment("press fullscreen home");
    fullscreenHome.insertBefore(fullscreenAnchor, fullscreenViewer.nextSibling);
    fullscreenElement.remove();
    fullscreenBook = inlineBook;
    const pageAssetsReady = Promise.all(pressMagazinePages.map((source) => new Promise((resolve) => {
      const image = new Image();
      image.onload = resolve;
      image.onerror = resolve;
      image.src = source;
      if (image.complete) resolve();
    })));

    const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, reducedMotion ? 0 : duration));
    const spreadIndex = () => currentPage <= 0 ? -1 : Math.floor((currentPage - 1) / 2);
    const canonicalPage = (page) => page <= 0 ? 0 : Math.floor((page - 1) / 2) * 2 + 1;

    function assignSharpPage(image, page) {
      const source = pressMagazinePages[page] || "";
      if (source && image.getAttribute("src") !== source) image.src = source;
    }

    function showSharpPages() {
      const isCover = currentPage <= 0;
      sharpPages.classList.toggle("is-cover", isCover);
      if (isCover) {
        assignSharpPage(sharpRightPage, 0);
      } else {
        const left = canonicalPage(currentPage);
        assignSharpPage(sharpLeftPage, left);
        assignSharpPage(sharpRightPage, Math.min(left + 1, pressMagazinePages.length - 1));
      }
      sharpPages.hidden = false;
    }

    function readingLabel(focus = "spread") {
      if (currentPage <= 0) return labels.cover;
      const left = canonicalPage(currentPage);
      const right = Math.min(left + 1, pressMagazinePages.length - 1);
      if (focus === "left") return `${labels.page} ${left} ${labels.of} ${pressMagazinePages.length - 1}`;
      if (focus === "right") return `${labels.page} ${right} ${labels.of} ${pressMagazinePages.length - 1}`;
      return `${labels.page} ${left}–${right} ${labels.of} ${pressMagazinePages.length - 1}`;
    }

    function updateControls() {
      const inlineLabel = readingLabel("spread");
      const fullLabel = readingLabel(fullscreenFocus);
      counter.textContent = inlineLabel;
      fullscreenCounter.textContent = fullLabel;
      status.textContent = fullscreenViewer.hidden ? inlineLabel : fullLabel;
      dots.forEach((dot) => {
        const active = Number(dot.dataset.pressDot) === spreadIndex();
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-current", String(active));
      });
      previousButton.disabled = currentPage <= 0;
      nextButton.disabled = currentPage >= lastSpreadPage;
      fullscreenPrevious.disabled = currentPage <= 0;
      fullscreenNext.disabled = currentPage >= lastSpreadPage && (!mobileFullscreen.matches || fullscreenFocus === "right");
    }

    function syncBooks(page, source) {
      if (syncing) return;
      syncing = true;
      currentPage = canonicalPage(page);
      if (source !== inlineBook && inlineBook.getCurrentPageIndex() !== currentPage) inlineBook.turnToPage(currentPage);
      inlineElement.classList.toggle("is-cover", currentPage <= 0);
      syncing = false;
      updateControls();
      if (inlineBook.getState() === "read") showSharpPages();
    }

    inlineBook.on("flip", (event) => syncBooks(Number(event.data), inlineBook));
    inlineBook.on("changeState", (event) => {
      if (currentPage <= 0 && event.data !== "read") inlineElement.classList.remove("is-cover");
      if (event.data === "read") {
        inlineElement.classList.toggle("is-cover", currentPage <= 0);
        showSharpPages();
      } else {
        sharpPages.hidden = true;
      }
    });
    showSharpPages();

    function createFullscreenBook() {
      return inlineBook;
    }

    function setFocus(mode, announce = true) {
      fullscreenFocus = mode;
      window.clearTimeout(focusClipTimer);
      fullscreenCamera.classList.remove("is-focus-left", "is-focus-right", "is-focus-cover", "is-focus-spread", "is-focus-clipped");
      fullscreenCamera.classList.add(`is-focus-${mode}`);
      if (mobileFullscreen.matches && mode !== "spread") {
        focusClipTimer = window.setTimeout(() => {
          if (!fullscreenViewer.hidden && fullscreenFocus === mode) fullscreenCamera.classList.add("is-focus-clipped");
        }, reducedMotion ? 0 : 480);
      }
      if (announce) updateControls();
    }

    function flipInline(targetSpread) {
      if (targetSpread < -1 || targetSpread > Math.floor((pressMagazinePages.length - 2) / 2)) return;
      inlineBook.flip(targetSpread < 0 ? 0 : targetSpread * 2 + 1, "bottom");
    }

    previousButton.addEventListener("click", () => inlineBook.flipPrev("bottom"));
    nextButton.addEventListener("click", () => inlineBook.flipNext("bottom"));
    dots.forEach((dot) => dot.addEventListener("click", () => flipInline(Number(dot.dataset.pressDot))));
    flipbook.addEventListener("keydown", (event) => {
      if (!fullscreenViewer.hidden) return;
      if (event.key === "ArrowLeft") { event.preventDefault(); inlineBook.flipPrev("bottom"); }
      if (event.key === "ArrowRight") { event.preventDefault(); inlineBook.flipNext("bottom"); }
    });

    function cameraScale() {
      return mobileFullscreen.matches && (fullscreenFocus === "left" || fullscreenFocus === "right") ? 2 : 1;
    }

    function clampPan() {
      if (userZoom <= 1) {
        panX = 0;
        panY = 0;
        return;
      }
      const rect = inlineElement.getBoundingClientRect();
      const maxX = Math.max(0, (rect.width * userZoom * cameraScale() - window.innerWidth) / 2);
      const maxY = Math.max(0, (rect.height * userZoom * cameraScale() - window.innerHeight) / 2);
      panX = Math.max(-maxX, Math.min(maxX, panX));
      panY = Math.max(-maxY, Math.min(maxY, panY));
    }

    function applyZoom() {
      inlineElement.style.setProperty("--press-user-zoom", String(userZoom));
      inlineElement.style.setProperty("--press-pan-x", `${panX}px`);
      inlineElement.style.setProperty("--press-pan-y", `${panY}px`);
      zoomResetButton.textContent = `${Math.round(userZoom * 100)}%`;
      zoomOutButton.disabled = userZoom === 1;
      zoomInButton.disabled = userZoom === 2;
    }

    function setZoom(value) {
      userZoom = Math.min(2, Math.max(1, value));
      if (userZoom < 1.03) userZoom = 1;
      clampPan();
      applyZoom();
    }

    async function fullscreenForward() {
      if (sequenceRunning || userZoom !== 1 || !fullscreenBook) return;
      if (!mobileFullscreen.matches) {
        fullscreenBook.flipNext("bottom");
        return;
      }
      sequenceRunning = true;
      if (currentPage <= 0) {
        setFocus("spread");
        fullscreenBook.flipNext("bottom");
        await wait(950);
        if (!fullscreenViewer.hidden) setFocus("left");
      } else if (fullscreenFocus === "left") {
        setFocus("right");
        await wait(470);
      } else if (fullscreenFocus === "right" && currentPage < lastSpreadPage) {
        setFocus("spread");
        await wait(470);
        if (!fullscreenViewer.hidden) {
          fullscreenBook.flipNext("bottom");
          await wait(950);
          if (!fullscreenViewer.hidden) setFocus("left");
        }
      }
      sequenceRunning = false;
    }

    async function fullscreenBackward() {
      if (sequenceRunning || userZoom !== 1 || currentPage <= 0 || !fullscreenBook) return;
      if (!mobileFullscreen.matches) {
        fullscreenBook.flipPrev("bottom");
        return;
      }
      sequenceRunning = true;
      if (fullscreenFocus === "right") {
        setFocus("left");
        await wait(470);
      } else if (fullscreenFocus === "left") {
        setFocus("spread");
        await wait(470);
        if (!fullscreenViewer.hidden) {
          fullscreenBook.flipPrev("bottom");
          await wait(950);
          if (!fullscreenViewer.hidden) setFocus(currentPage <= 0 ? "cover" : "right");
        }
      }
      sequenceRunning = false;
    }

    function pointerDistance() {
      const values = Array.from(pointers.values());
      if (values.length < 2) return 0;
      return Math.hypot(values[0].x - values[1].x, values[0].y - values[1].y);
    }

    fullscreenViewer.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button")) return;
      event.preventDefault();
      fullscreenViewer.setPointerCapture?.(event.pointerId);
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size === 1) gesture = { x: event.clientX, y: event.clientY, panX, panY };
      if (pointers.size === 2) {
        pinch = { distance: pointerDistance(), zoom: userZoom };
        gesture = null;
      }
    });

    fullscreenViewer.addEventListener("pointermove", (event) => {
      if (!pointers.has(event.pointerId)) return;
      event.preventDefault();
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size >= 2 && pinch) {
        const distance = pointerDistance();
        if (pinch.distance > 0) setZoom(pinch.zoom * distance / pinch.distance);
      } else if (pointers.size === 1 && gesture && userZoom > 1) {
        panX = gesture.panX + event.clientX - gesture.x;
        panY = gesture.panY + event.clientY - gesture.y;
        clampPan();
        applyZoom();
      }
    });

    function endPointer(event) {
      const wasSingle = pointers.size === 1;
      const start = gesture;
      pointers.delete(event.pointerId);
      if (wasSingle && start && userZoom === 1) {
        const distanceX = event.clientX - start.x;
        const distanceY = event.clientY - start.y;
        if (Math.abs(distanceX) > 48 && Math.abs(distanceX) > Math.abs(distanceY) * 1.15) {
          if (distanceX < 0) fullscreenForward();
          else fullscreenBackward();
        }
      }
      if (pointers.size === 1) {
        const remaining = Array.from(pointers.values())[0];
        gesture = { x: remaining.x, y: remaining.y, panX, panY };
      } else gesture = null;
      if (pointers.size < 2) pinch = null;
    }

    fullscreenViewer.addEventListener("pointerup", endPointer);
    fullscreenViewer.addEventListener("pointercancel", endPointer);

    async function closeFullscreen() {
      if (closingFullscreen) return;
      closingFullscreen = true;
      fullscreenAttempt += 1;
      openingFullscreen = false;
      ignoreFullscreenExitUntil = performance.now() + 1200;
      if (document.fullscreenElement === fullscreenViewer) {
        try { await document.exitFullscreen(); } catch (_) {}
      }
      inlineHome.insertBefore(inlineElement, inlineAnchor);
      fullscreenHome.insertBefore(fullscreenViewer, fullscreenAnchor);
      fullscreenViewer.hidden = true;
      fullscreenViewer.classList.remove("is-loading");
      document.body.classList.remove("press-viewer-open");
      pointers.clear();
      sequenceRunning = false;
      panX = 0;
      panY = 0;
      setZoom(1);
      setFocus(currentPage <= 0 ? "cover" : "spread", false);
      window.requestAnimationFrame(() => inlineBook.update());
      openButton.focus({ preventScroll: true });
      closingFullscreen = false;
    }

    async function openFullscreen() {
      if (openingFullscreen || !fullscreenViewer.hidden) return;
      openingFullscreen = true;
      const attempt = ++fullscreenAttempt;
      document.body.appendChild(fullscreenViewer);
      fullscreenViewer.hidden = false;
      fullscreenViewer.classList.add("is-loading");
      document.body.classList.add("press-viewer-open");
      fullscreenCamera.appendChild(inlineElement);
      panX = 0;
      panY = 0;
      setZoom(1);
      setFocus(currentPage <= 0 ? "cover" : "spread", false);
      const book = createFullscreenBook();
      book.update();
      book.turnToPage(currentPage);
      if (!mobileFullscreen.matches) {
        try { fullscreenViewer.requestFullscreen?.({ navigationUI: "hide" })?.catch?.(() => {}); } catch (_) {}
      }
      await pageAssetsReady;
      await new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)));
      if (attempt !== fullscreenAttempt || fullscreenViewer.hidden) return;
      book.update();
      book.turnToPage(currentPage);
      if (mobileFullscreen.matches && currentPage > 0) {
        await wait(100);
        if (!fullscreenViewer.hidden) setFocus("left");
      } else updateControls();
      fullscreenViewer.classList.remove("is-loading");
      openingFullscreen = false;
      closeButton.focus({ preventScroll: true });
    }

    openButton.addEventListener("click", openFullscreen);
    closeButton.addEventListener("click", closeFullscreen);
    fullscreenPrevious.addEventListener("click", fullscreenBackward);
    fullscreenNext.addEventListener("click", fullscreenForward);
    zoomInButton.addEventListener("click", () => setZoom(userZoom + .25));
    zoomOutButton.addEventListener("click", () => setZoom(userZoom - .25));
    zoomResetButton.addEventListener("click", () => setZoom(1));
    fullscreenCamera.addEventListener("dblclick", () => setZoom(userZoom === 1 ? 1.5 : 1));
    fullscreenViewer.addEventListener("wheel", (event) => {
      if (fullscreenViewer.hidden) return;
      event.preventDefault();
      setZoom(userZoom + (event.deltaY < 0 ? .25 : -.25));
    }, { passive: false });
    document.addEventListener("fullscreenchange", () => {
      if (!document.fullscreenElement && !fullscreenViewer.hidden && !closingFullscreen && performance.now() >= ignoreFullscreenExitUntil) closeFullscreen();
      if (document.fullscreenElement === fullscreenViewer) {
        window.requestAnimationFrame(() => window.requestAnimationFrame(() => fullscreenBook?.update()));
      }
    });
    window.addEventListener("resize", () => {
      if (fullscreenViewer.hidden) return;
      window.requestAnimationFrame(() => fullscreenBook?.update());
      setFocus(currentPage <= 0 ? "cover" : mobileFullscreen.matches ? "left" : "spread", false);
      clampPan();
      applyZoom();
      updateControls();
    });
    document.addEventListener("keydown", (event) => {
      if (fullscreenViewer.hidden) return;
      if (event.key === "Escape") closeFullscreen();
      if (event.key === "ArrowLeft") { event.preventDefault(); fullscreenBackward(); }
      if (event.key === "ArrowRight") { event.preventDefault(); fullscreenForward(); }
    });

    setFocus("cover", false);
    applyZoom();
    updateControls();
  }

  function bindMediaEmbeds() {
    const facebookEmbed = document.querySelector(".media-facebook-embed");
    const facebookFrame = facebookEmbed?.querySelector("iframe");
    mediaFacebookResizeObserver?.disconnect();
    if (facebookEmbed && facebookFrame) {
      const fitFacebookPreview = () => {
        const embedStyle = window.getComputedStyle(facebookEmbed);
        const frameStyle = window.getComputedStyle(facebookFrame);
        const horizontalPadding = parseFloat(embedStyle.paddingLeft) + parseFloat(embedStyle.paddingRight);
        const availableWidth = Math.floor(facebookEmbed.clientWidth - horizontalPadding);
        const pluginWidth = Math.max(180, Math.min(500, availableWidth));
        const pluginHeight = Math.round(parseFloat(frameStyle.height)) || 680;
        const dimensions = `${pluginWidth}x${pluginHeight}`;
        if (facebookFrame.dataset.pluginDimensions === dimensions) return;
        const source = new URL(facebookFrame.src);
        source.searchParams.set("width", String(pluginWidth));
        source.searchParams.set("height", String(pluginHeight));
        facebookFrame.dataset.pluginDimensions = dimensions;
        facebookFrame.width = pluginWidth;
        facebookFrame.height = pluginHeight;
        facebookFrame.style.width = `${pluginWidth}px`;
        facebookFrame.src = source.toString();
      };
      fitFacebookPreview();
      if ("ResizeObserver" in window) {
        mediaFacebookResizeObserver = new ResizeObserver(() => window.requestAnimationFrame(fitFacebookPreview));
        mediaFacebookResizeObserver.observe(facebookEmbed);
      }
    }

    const liveFrame = document.getElementById("media-live-frame");
    if (!liveFrame) return;
    const status = document.querySelector("[data-media-live-status]");
    const livePlayer = document.querySelector("[data-media-live-player]");
    const fallback = document.querySelector("[data-media-video-fallback]");
    const labels = copy[lang].pages.media.youtube;
    let resolved = false;

    function showLive() {
      resolved = true;
      livePlayer.hidden = false;
      fallback.hidden = true;
      status.classList.add("is-live");
      status.innerHTML = `<span></span>${labels.live}`;
    }

    function showFallback() {
      if (resolved) return;
      resolved = true;
      livePlayer.hidden = true;
      fallback.hidden = false;
      status.classList.remove("is-live");
      status.innerHTML = `<span></span>${labels.offline}`;
    }

    function initializeYouTubePlayer() {
      if (!document.getElementById("media-live-frame") || !window.YT?.Player) return;
      try { mediaYouTubePlayer?.destroy?.(); } catch (_) {}
      try {
        mediaYouTubePlayer = new window.YT.Player("media-live-frame", {
          events: {
            onReady(event) {
              try { event.target.mute(); event.target.playVideo(); } catch (_) { showFallback(); }
            },
            onStateChange(event) {
              if (event.data === window.YT.PlayerState.PLAYING) showLive();
            },
            onError() { showFallback(); },
          },
        });
      } catch (_) { showFallback(); }
    }

    if (window.YT?.Player) initializeYouTubePlayer();
    else {
      window.onYouTubeIframeAPIReady = initializeYouTubePlayer;
      if (!document.getElementById("youtube-iframe-api")) {
        const script = document.createElement("script");
        script.id = "youtube-iframe-api";
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.head.appendChild(script);
      }
    }
    window.setTimeout(showFallback, 7000);

    document.getElementById("tiktok-embed-script")?.remove();
    const tiktokScript = document.createElement("script");
    tiktokScript.id = "tiktok-embed-script";
    tiktokScript.src = "https://www.tiktok.com/embed.js";
    tiktokScript.async = true;
    document.body.appendChild(tiktokScript);
  }

  function bindStoryAnimation() {
    if (storyObserver) storyObserver.disconnect();
    const section = document.querySelector(".my-story");
    if (!section) return;
    section.dataset.animate = "true";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      section.dataset.visible = "true";
      return;
    }
    storyObserver = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      section.dataset.visible = "true";
      storyObserver.disconnect();
    }, { threshold: 0.22 });
    storyObserver.observe(section);
  }

  function bindAboutAnimation() {
    if (aboutObserver) aboutObserver.disconnect();
    const items = Array.from(document.querySelectorAll("[data-about-reveal]"));
    if (!items.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      items.forEach((item) => { item.dataset.visible = "true"; });
      return;
    }
    aboutObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.dataset.visible = "true";
        aboutObserver.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -7%" });
    items.forEach((item) => aboutObserver.observe(item));
  }

  function renderPage() {
    contactAnimationTimers.forEach((timer) => window.clearTimeout(timer));
    contactAnimationTimers = [];
    const p = copy[lang].pages[page];
    const main = document.getElementById("main");
    main.innerHTML = page === "home" ? homeMarkup(p) : page === "about" ? aboutMarkup(p) : page === "brand" ? brandMarkup(p) : page === "media" ? mediaMarkup(p) : page === "press" ? pressMarkup(p) : page === "contact" ? contactMarkup(p) : standardMarkup(p);
    if (page === "media") {
      const mediaFeed = main.querySelector(".media-feed");
      mediaFeed?.insertAdjacentHTML("beforeend", instagramMarkup(p));
    }
    const year = new Date().getFullYear();
    const footer = copy[lang].footer;
    document.getElementById("site-footer").innerHTML = `<footer class="site-footer site-footer-compact"><div class="footer-compact-inner"><nav class="footer-social" aria-label="${footer.connect}"><a href="https://www.instagram.com/shalimarrivera/?hl=en" target="_blank" rel="noopener noreferrer">Instagram</a><a href="https://www.youtube.com/@ShalimarRiveraTV/videos" target="_blank" rel="noopener noreferrer">YouTube</a><a href="https://www.facebook.com/p/Shalimar-Rivera-Oficial-100045231345959/" target="_blank" rel="noopener noreferrer">Facebook</a><a href="https://www.tiktok.com/@shalimarrivera" target="_blank" rel="noopener noreferrer">TikTok</a></nav><div class="footer-legal"><p>© ${year} Shalimar Rivera. ${copy[lang].rights}</p><p class="footer-credit">${footer.builtBy} <a href="https://crovextech.com" target="_blank" rel="noopener noreferrer">Crovex Tech</a></p></div></div></footer>`;
    bindContactForm();
    bindStoryAnimation();
    bindAboutAnimation();
    bindBrandCarousel();
    bindSilenceCarousel();
    bindGfyCarousel();
    bindMediaVideoCarousel();
    bindMediaEmbeds();
    bindPressFlipbook();
  }

  function bindChrome() {
    document.querySelectorAll("[data-lang]").forEach((button) => button.addEventListener("click", () => {
      lang = button.dataset.lang;
      localStorage.setItem("shalimar-language", lang);
      render();
    }));
    const button = document.querySelector(".menu-button");
    const nav = document.querySelector(".mobile-nav");
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!open));
      button.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      nav.dataset.open = String(!open);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") button.click();
    }, { once: true });
  }

  function render() {
    renderChrome();
    renderPage();
  }

  async function refreshScheduledSocialFeed() {
    if (page !== "media") return;
    try {
      const miamiDay = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());
      const response = await fetch(`assets/data/social-feed.json?day=${encodeURIComponent(miamiDay)}`, { cache: "no-store" });
      if (!response.ok) return;
      const feed = await response.json();
      const videos = Array.isArray(feed.videos) ? feed.videos.filter((video) => (
        video && /^[A-Za-z0-9_-]{11}$/.test(String(video.id)) && typeof video.title === "string"
      )).slice(0, 5) : [];
      if (!videos.length) return;
      mediaVideos = videos;
      renderPage();
    } catch (_) {
      /* Keep the bundled fallback videos if the scheduled feed is unavailable. */
    }
  }

  mountMobileIntro();
  render();
  refreshScheduledSocialFeed();
})();
