import { CollectionConfig, FieldHook } from 'payload';

import { formatSlug } from '@/utilities/formatSlug';


export const Aggiornamenti: CollectionConfig = {
  slug: 'aggiornamenti', // Nome della collezione nel database e URL
  admin: {
    useAsTitle: "title",
    defaultColumns: ['title', 'category', 'image', 'tags', 'status'],
   
  },
  access: {
    read: () => true,
  },
  labels: {
    singular: 'Aggiornamento',
    plural: 'Aggiornamenti',
  },
  fields: [

    //SIDEBAR ADMIN
    {
      name: "slug",
      type: "text",
      hooks: {
        beforeChange: [
          formatSlug,
        ],
      },
      admin: {
        position: 'sidebar',
      },
      required: true,
      unique:true,

    },
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
      }
    },
    
    //MAIN 
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
      defaultValue:"https://musesaccademia.pages.dev/booking"
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
  ],
  timestamps: true, // Automatically adds createdAt and updatedAt fields

};