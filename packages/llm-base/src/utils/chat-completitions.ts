import type OpenAI from 'openai'
import type { ParsedChatCompletion } from 'openai/resources/beta/chat/completions.mjs'

const role_system = 'system' as const
const role_user = 'user' as const

const default_system_prompt =
  'You are a helpful assistant that thinks step by step.'

const format_system_message = (system_prompt = default_system_prompt) => {
  return { role: role_system, content: system_prompt }
}

const format_user_message = (message: string) => {
  return { role: role_user, content: message }
}

const format_topic_message = (topic: string) => {
  return `# Task definition:\n ${topic}`
}
const format_topic_answer = (topic: string) => {
  return `# One of previous answers:\n ${topic}`
}

export const create_chat_completitions = async (
  client: OpenAI,
  model: string,
  task: string,
  user_inputs: string[],
  system_prompt: string,
  response_format: OpenAI.ResponseFormatJSONSchema,
  should_eval?: boolean,
) => {
  // client.chat.completions.create
  const chat_params = {
    model: model, // Use GPT-4 or any other model
    messages: [
      format_system_message(system_prompt),
      format_user_message(task),
      ...user_inputs.map((input) => format_user_message(input)),
    ],
    temperature: 0,
    max_tokens: 5012,
    response_format: response_format,
  }
  if (should_eval) {
    type x = ReturnType<typeof client.beta.chat.completions.parse>
    return await client.beta.chat.completions.parse(chat_params)
  }
  return await client.chat.completions.create(chat_params)
}
type xx = ReturnType<typeof create_chat_completitions>
