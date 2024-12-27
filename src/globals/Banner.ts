import { GlobalConfig, FieldHook } from 'payload';
import { relationship } from 'node_modules/payload/dist/fields/validations';


export const Banner: GlobalConfig = {
  slug: 'banner', // Nome della global nel database e URL
  access: {
    read: () => true, // Puoi specificare chi ha accesso a questa global (ad esempio, chiunque può leggere)
  },

  label: {
    singular: 'Banner Aggiornamento',
  },
  
  admin:{
    livePreview:{
      url:process.env.FRONTEND_URL
    },
  },
  
  fields: [
    // SIDEBAR ADMIN
    
    {
      name: 'mostra',
      type: 'checkbox',
      label: 'mostra sul sito',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },

    // MAIN
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
      label: 'Short Description',
      required: true,
      admin: {
        placeholder: 'A brief summary of the blog post',
      },
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Image',
      relationTo: 'media', // Assuming you have a media collection for uploads
      admin: {
        description: 'Upload an image to accompany the blog post',
        position: 'sidebar',
      },
    },
    {
      name: 'cta',
      type: 'text',
      label: 'Cta',
      defaultValue: "Scopri di più",
    },
    {
      name: 'link',
      type: 'text',
      label: 'Link',
      defaultValue: "https://musesaccademia.pages.dev/booking",
    },
  ],
};
