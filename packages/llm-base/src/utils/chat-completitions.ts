import type OpenAI from 'openai'
import type { APIPromise } from 'openai/core.mjs'

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

export const create_chat_completitions = (
  client: OpenAI,
  model: string,
  task: string,
  user_inputs: string[],
  system_prompt: string,
): APIPromise<OpenAI.Chat.Completions.ChatCompletion> => {
  return client.chat.completions.create({
    model: model, // Use GPT-4 or any other model
    messages: [
      format_system_message(system_prompt),
      format_user_message(task),
      ...user_inputs.map((input) => format_user_message(input)),
    ],
    temperature: 0.7,
  })
}
