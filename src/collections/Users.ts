import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
  },
  auth: true,
  dbName: 'user', // Sync with Better Auth table name
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
        name: 'role',
        type: 'select',
        defaultValue: 'customer',
        options: [
            { label: 'Customer', value: 'customer' },
            { label: 'Admin', value: 'admin' },
            { label: 'Coffee Shop', value: 'coffee_shop' },
        ],
    },
    {
        name: 'userCode',
        type: 'text',
        unique: true,
        admin: {
            readOnly: true,
        }
    },
    {
        name: 'shopId',
        type: 'relationship',
        relationTo: 'coffee-shops',
    }
  ],
}
