import { CollectionConfig, FieldHook } from 'payload'
import {
  HTMLConverterFeature,
  lexicalEditor,
  lexicalHTML,
  UploadFeature,
  HeadingFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  HorizontalRuleFeature,
} from '@payloadcms/richtext-lexical'

import { formatSlug } from '@/utilities/formatSlug'

export const Blog: CollectionConfig = {
  slug: 'blog', // Nome della collezione nel database e URL
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'image', 'tags', '_status'],
    livePreview: {
      url: ({ data }) => `${process.env.FRONTEND_URL}/blog/${data?.slug}`,
    },
  },
  access: {
    read: () => true,
  },
  versions: { drafts: true, maxPerDoc:3},

  labels: {
    singular: 'Blog Post',
    plural: 'Blog Posts',
  },

  fields: [
    //SIDEBAR ADMIN
    {
      name: 'slug',
      type: 'text',
      hooks: {
        beforeChange: [formatSlug],
      },
      admin: {
        position: 'sidebar',
      },
      required: true,
      unique: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        position: 'sidebar',
      },
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
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          // The HTMLConverter Feature is the feature which manages the HTML serializers.
          // If you do not pass any arguments to it, it will use the default serializers.
          HTMLConverterFeature({}),
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          HorizontalRuleFeature(),
          UploadFeature(),
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
}
