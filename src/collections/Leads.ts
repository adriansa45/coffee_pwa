import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const Leads: CollectionConfig = {
  slug: 'leeds',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'coffeeShopName', 'createdAt'],
  },
  access: {
    create: anyone,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'coffeeShopName',
      type: 'text',
      required: true,
    },
    {
      name: 'instagramUser',
      type: 'text',
    },
  ],
  timestamps: true,
}
