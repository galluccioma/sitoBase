
import config from '@payload-config'
import { draftMode } from 'next/headers.js'
import { getPayload } from 'payload'

import { Banner, Blog, Category } from '@/payload-types'


export const fetchBlogPosts = async (): Promise<Partial<Blog>[]> => {
    const currentDate = new Date()
    const payload = await getPayload({ config })
  
    const data = await payload.find({
      collection: 'blog',
      depth: 4,
      limit: 300,
      select: {
        slug: true,
        image: true,
        category: true,
        title: true,
      },
      sort: '-publishedOn',
      where: {
        _status: {equals: 'published',}
      },
    })
    return data.docs
  }

  export const fetchBlogPost = async (slug: string): Promise<Blog> => {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config })
  
    const data = await payload.find({
      collection: 'blog',
      depth: 2,
      draft,
      limit: 1,
      where: {
        and: [
          { slug: { equals: slug } },
          ...(draft
            ? []
            : [
                {
                  _status: {
                    equals: 'published',
                  },
                },
              ]),
        ],
      },
    })
  
    return data.docs[0]
  }

  export const fetchCategory = async (): Promise<Partial<Category>[]> => {
    const payload = await getPayload({ config })
  
    const data = await payload.find({
      collection: 'categories',
      depth: 4,
      limit: 300,
      select: {
        categorie: true,
        image:true,
      },
      sort: '-publishedOn',
      where: {
      },
    })
    return data.docs
  }
  export const fetchGlobalBanner = async (): Promise<Banner> => {
    const payload = await getPayload({ config })
  
    const data = await payload.findGlobal({
        slug: 'banner',
      depth: 2,
      
    })
    return data
  }