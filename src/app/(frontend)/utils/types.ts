export type Page = {
    TITLE: string
    DESCRIPTION: string
    IMAGE:string
  }
  
  export interface Site extends Page {
    AUTHOR: string
  }
  
  export type Links = {
    TEXT: string
    HREF: string
  }[]
  
  export type Socials = {
    NAME: string
    ICON: string
    TEXT: string
    HREF: string
  }[]
  
  export type Faq = {
    QUESTION: string
    ANSWER: string
  }
  
  export type Fase = {
    TITLE: string
    DESCRIPTION: string
  }
  
