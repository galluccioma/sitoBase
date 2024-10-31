import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    hidden:true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
}
