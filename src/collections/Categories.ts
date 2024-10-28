import type { CollectionConfig } from 'payload'
export const Categories: CollectionConfig = {
    slug: 'categories',
    admin: {
        useAsTitle: "categorie",
        hidden:true,
      },
    fields: [
        {
            name: "categorie",
            type: "text",
          },
          ],
          timestamps: false, // Automatically disable createdAt and updatedAt fields

}
