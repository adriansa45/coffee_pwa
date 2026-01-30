import type { CollectionConfig } from 'payload'
import { auth as betterAuth } from '@/lib/auth'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
  },
  auth: {
    strategies: [
      {
        name: 'better-auth',
        authenticate: async ({ headers }) => {
          try {
            const session = await betterAuth.api.getSession({
              headers: headers,
            })

            if (session) {
              return {
                user: {
                  ...session.user,
                  collection: 'users',
                } as any,
              }
            }
          } catch (error) {
            console.error('Better Auth Strategy Error:', error)
          }

          return {
            user: null,
          }
        },
      },
    ],
  },
  dbName: 'user', // Sync with Better Auth table name
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
      name: 'role',
      type: 'select',
      defaultValue: 'customer',
      required: true,
      options: [
        { label: 'Customer', value: 'customer' },
        { label: 'Admin', value: 'admin' },
        { label: 'Coffee Shop', value: 'coffee_shop' },
      ],
    },
    {
      name: 'emailVerified',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        readOnly: true,
      }
    },
    {
      name: 'image',
      type: 'text',
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
