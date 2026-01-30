import type { CollectionConfig } from 'payload'

export const CoffeeShops: CollectionConfig = {
  slug: 'coffee-shops',
  admin: {
    useAsTitle: 'name',
  },
  dbName: 'coffee_shops',
  fields: [
    {
      name: 'id',
      type: 'text',
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'latitude',
      type: 'number',
      required: true,
    },
    {
      name: 'longitude',
      type: 'number',
      required: true,
    },
    {
      name: 'address',
      type: 'text',
    },
    {
      name: 'googleMapsUrl',
      type: 'text',
    },
    {
      name: 'rating',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      }
    },
  ],
}
