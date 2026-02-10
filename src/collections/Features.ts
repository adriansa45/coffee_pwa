import type { CollectionConfig } from 'payload'

export const Features: CollectionConfig = {
  slug: 'features',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icono (Lucide name)',
      admin: {
          description: 'Nombre del icono de Lucide (ej: Coffee, Dog, Car)',
      }
    },
    {
        name: 'color',
        type: 'text',
        label: 'Color Personalizado',
        admin: {
            description: 'Código hex del color (ej: #FF0000). Si se deja vacío, se usará el color de marca.',
        }
    }
  ],
}
