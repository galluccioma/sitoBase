import { CollectionConfig } from 'payload';
import { recapMail } from './mail/recap';

export const FormSubmission: CollectionConfig = {
  slug: 'form-submissions',
  access: {
    create: () => true,
  },
  labels: {
    singular: 'Compilaizone Form',
    plural: 'Compilaizoni Form',
  },
  fields: [
    {
      type: 'text',
      name: 'email',
      label: 'From Email',
      admin: {

      },
    },
    {
      type: 'textarea',
      name: 'message',
      label: 'Message',
      admin: {

      },
    },
    {
      type: 'text',
      name: 'source',
      label: 'Source',
      admin: {
        position: 'sidebar',

      },
    },
  ],

  hooks: {
    afterChange: [
     recapMail,
    ],
    
  },
};
