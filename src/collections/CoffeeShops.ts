import type { CollectionConfig } from 'payload'

export const CoffeeShops: CollectionConfig = {
  slug: 'coffee-shops',
  admin: {
    useAsTitle: 'name',
  },
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
      type: 'richText',
    },
    {
      name: 'mainImage',
      label: 'Imagen Principal (Portada)',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'gallery',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
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
      name: 'phone',
      type: 'text',
      label: 'Teléfono',
    },
    {
      name: 'website',
      type: 'text',
      label: 'Sitio Web',
    },
    {
      name: 'hours',
      type: 'json',
      label: 'Horarios',
      admin: {
        components: {
          Field: '@/components/payload/HoursField',
        },
      },
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
