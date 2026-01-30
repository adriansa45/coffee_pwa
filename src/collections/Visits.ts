import type { CollectionConfig } from 'payload'

export const Visits: CollectionConfig = {
  slug: 'visits',
  dbName: 'visits',
  fields: [
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
      name: 'visitedAt',
      type: 'date',
      defaultValue: () => new Date(),
    },
  ],
}
