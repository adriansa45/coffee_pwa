import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
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
      name: 'brandColor',
      type: 'text',
      defaultValue: '#820E2B',
      admin: {
        description: 'Color hexadecimal preferido del usuario',
      },
    },
    {
      name: 'fcmToken',
      type: 'text',
      admin: {
        description: 'Token de Firebase Cloud Messaging para notificaciones',
      },
    },
  ],
  timestamps: true,
}
