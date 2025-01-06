import OpenAI from 'openai'

export const get_client = (): OpenAI => {
  const api_key = process.env?.OPENAI_API_KEY || 'default'
  const api_base =
    process.env?.OPENAI_BASE_URL || 'http://192.168.5.50:30000/v1'
  const client = new OpenAI({
    apiKey: api_key,
    baseURL: api_base,
  })
  return client
}
