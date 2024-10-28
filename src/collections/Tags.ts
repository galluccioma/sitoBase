import type { CollectionConfig } from 'payload'


export const Tags: CollectionConfig = {
    slug: 'tags',
    
    admin: {
        useAsTitle: "tag",
        hidden:true,
      },
      
    fields: [
        {
            name: "tag",
            type: "text",
          },
          ],
          timestamps: false, // Automatically disable createdAt and updatedAt fields
}