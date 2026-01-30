import { getPayload as getPayloadLocal } from 'payload'
import { config } from '@/payload.config'

export const getPayload = async () => {
  return await getPayloadLocal({ config })
}
