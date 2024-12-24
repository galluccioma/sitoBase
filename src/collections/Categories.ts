import type { CollectionConfig } from 'payload'
export const Categories: CollectionConfig = {
    slug: 'categories',
    admin: {
        useAsTitle: "categorie",
      },
    fields: [
        {
            name: "categorie",
            type: "text",
          },
          ],
          timestamps: false, // Automatically disable createdAt and updatedAt fields

}
