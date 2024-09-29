import { CollectionConfig, FieldHook } from 'payload';
import payload from 'payload';

import {
  HTMLConverterFeature,
  lexicalEditor,
  lexicalHTML
} from '@payloadcms/richtext-lexical'


// 'data' is all of the incoming values for the document
const formatSlug: FieldHook = async ({ value, data }) => {
  // return formatted version of title if exists, else return unmodified value
  return data?.title?.replace(/ /g, '-').toLowerCase() ?? value.replace(/ /g, '-').toLowerCase();
};


export const Mostre: CollectionConfig = {
  slug: 'mostre', // Nome della collezione nel database e URL
  admin: {
    useAsTitle: "title",
    defaultColumns: ['title', 'category', 'image', 'tags', 'status'],
   
  },
  access: {
    read: () => true,
  },
  labels: {
    singular: 'Mostra',
    plural: 'Mostre',
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
    
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
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
      name: 'dataInizio',
      type: 'date',
      label: 'Data Inizio',
    },
    {
      name: 'dataFine',
      type: 'date',
      label: 'Data Fine',
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
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          // The HTMLConverter Feature is the feature which manages the HTML serializers.
          // If you do not pass any arguments to it, it will use the default serializers.
          HTMLConverterFeature({}),
        ],
      }),
    },
    lexicalHTML('content', { name: 'content_html' }),
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