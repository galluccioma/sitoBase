import { GlobalConfig, FieldHook } from 'payload';
import payload from 'payload';



export const Banner: GlobalConfig = {
  slug: 'banner', // Nome della global nel database e URL
  access: {
    read: () => true, // Puoi specificare chi ha accesso a questa global (ad esempio, chiunque può leggere)
  },
  label: {
    singular: 'Banner Aggiornamento',
  },
  fields: [
    // SIDEBAR ADMIN
    
    {
      name: 'status',
      type: 'radio',
      options: [
        {
          value: 'draft',
          label: 'Draft',
        },
        {
          value: 'published',
          label: 'Published',
        },
      ],
      defaultValue: 'draft',
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
      name: 'link',
      type: 'text',
      label: 'Link',
      defaultValue: "https://musesaccademia.pages.dev/booking",
    },
  ],
};
