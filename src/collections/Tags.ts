import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
  },
  dbName: 'tags',
  fields: [
    {
      name: 'id',
      type: 'text',
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
  ],
}
