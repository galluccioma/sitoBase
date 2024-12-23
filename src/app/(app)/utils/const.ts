import type { Site, Page, Links, Socials} from "./types"




// Global
export const SITE: Site = {
  TITLE: "Solarc",
  DESCRIPTION: "Pannelli solari",
  AUTHOR: "Galluccio Mezio Antonio",
  IMAGE:"",

}

// Studio Page 
export const METODO: Page = {
  TITLE: "il nostro metodo",
  DESCRIPTION: "Come lavoriamo.",
  IMAGE:"",
}

// Team Page 
export const ABOUT: Page = {
  TITLE: "Chi siamo",
  DESCRIPTION: "About me, my skills and tools.",
  IMAGE:"",
}

// Servizi Page 
export const SERVIZI: Page = {
  TITLE: "I Servizi",
  DESCRIPTION: "About me, my skills and tools.",
  IMAGE:"",
}

// Servizi Contatti 
export const CONTATTI: Page = {
  TITLE: "Contatti",
  DESCRIPTION: "Contatti",
  IMAGE:"",
}

//  Lavora  PAGE
export const LAVORA: Page = {
  TITLE: "Lavora con noi",
  DESCRIPTION: "Open Positionss",
  IMAGE:"",
}

//  CASESTUDY  PAGE
export const CASESTUDY: Page = {
  TITLE: " I Nostri Progetti di Successo",
  DESCRIPTION: "Una collezione di casi studio per scoprire come abbiamo trasformato insieme ai nostri clienti le loro sfide in successi concreti. Ogni progetto racconta un viaggio di innovazione e risultati straordinari, mostrando il nostro impegno e la nostra esperienza nel superare le aspettative. Dai un’occhiata ai risultati che abbiamo raggiunto e lasciati ispirare da come possiamo fare lo stesso per te.",
  IMAGE:"",
}

// Links
export const LINKS: Links = [
  { 
    TEXT: "Home", 
    HREF: "/", 
  },
  { 
    TEXT: "Servizi", 
    HREF: "/servizi", 
  },
  { 
    TEXT: "Progetti", 
    HREF: "/progetti", 
  },
  { 
    TEXT: "Chi siamo", 
    HREF: "/chisiamo", 
  },
  { 
    TEXT: "Faq", 
    HREF: "/faq", 
  },

]

// Socials
export const SOCIALS: Socials = [
  { 
    NAME: "Email",
    ICON: "email", 
    TEXT: "amministrazione@solarc.srl",
    HREF: "mailto:amministrazione@solarc.srl",
  },
  { 
    NAME: "Telefono",
    ICON: "tel", 
    TEXT: "3534776022",
    HREF: "tel:3534776022",
  },
  // { 
  //   NAME: "LinkedIn",
  //   ICON: "linkedin",
  //   TEXT: "galluccioma",
  //   HREF: "https://www.linkedin.com/in/galluccioma",
  // },
]