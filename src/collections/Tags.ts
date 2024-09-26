import type { CollectionConfig } from 'payload'
import  Payload  from 'payload'


export const Tags: CollectionConfig = {
    slug: 'tags',
    
    admin: {
        useAsTitle: "tag",
      },
      
    fields: [
        {
            name: "tag",
            type: "text",
          },
          ],
          timestamps: false, // Automatically disable createdAt and updatedAt fields

          hooks: {
            // Invio della mail quando viene creato un tag
            afterChange: [ 
              ({ operation, req }) => {
                if (operation === 'create') {
                  req.payload.sendEmail({
                    to: 'galluccioma@gmail.com',
                    from: 'galluccioma@gmail.com',
                    subject: 'Welcome To Payload',
                    html: `<h1>Thank you for your order!</h1>
                      <p>Here is your order summary:</p>
                    `,
                  })
                }
              },
            ],
          },
}