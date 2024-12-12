import { GlobalConfig } from 'payload'

export const Validazione: GlobalConfig = {
  slug: 'validazione', // Nome della global nel database e URL
  access: { 
    update: () => false ,
},

  label: {
    singular: 'Validazione biglietti',
  },

  admin: {
    // Nasconde il pulsante API
    hideAPIURL: true,
    // Personalizza la barra di amministrazione per nascondere il pulsante Salva
  },

  fields: [
    {
      name: 'view',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/Validazione',
        },
      },
    },
  ],
}
