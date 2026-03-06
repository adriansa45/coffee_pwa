import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  dbName: 'admin_users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'id',
      type: 'text',
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'image',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Customer', value: 'customer' },
        { label: 'Cafe Staff', value: 'CafeStaff' },
        { label: 'Cafe Admin', value: 'CafeAdmin' },
        { label: 'Coffee Shop', value: 'coffee_shop' },
      ],
      defaultValue: 'customer',
    },
    {
      name: 'userCode',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'totalVisitsCount',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'currentTier',
      type: 'text',
      defaultValue: 'Explorador/a',
    },
    {
        name: 'shopId',
        type: 'text',
    }
  ],
  timestamps: true,
}
