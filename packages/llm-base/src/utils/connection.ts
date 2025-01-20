import OpenAI from 'openai'

export const get_client = (api_key: string, api_base: string): OpenAI => {
  const api_key_ = process.env?.OPENAI_API_KEY || api_key
  const api_base_ = process.env?.OPENAI_BASE_URL || api_base
  const client = new OpenAI({
    apiKey: api_key_,
    baseURL: api_base_,
  })
  return client
}
