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
          timestamps: false, // Automatically disable createdAt and updatedAt fields

}
