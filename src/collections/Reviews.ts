import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  fields: [
    {
      name: 'id',
      type: 'text',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'shop',
      type: 'relationship',
      relationTo: 'coffee-shops',
      required: true,
    },
    {
      name: 'rating',
      type: 'text', // Keeping as text to match current schema, but could be number
      required: true,
    },
    {
      name: 'coffeeRating',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'foodRating',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'placeRating',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'priceRating',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'comment',
      type: 'textarea',
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    }
  ],
}
