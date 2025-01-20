import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

const Step = z.object({
  explanation: z.string(),
  output: z.string(),
})
import { colorize } from 'json-colorizer'

const MathReasoning = z.object({
  steps: z.array(Step),
  final_answer: z.string(),
})

// const model="prithivMLmods/Deepthink-Reasoning-7B"
//const api_base = 'https://openai.lipinski.app/v1'
const api_base = 'http://localhost:11434/v1'

const api_key = 'xxx'
const models_req = await fetch(`${api_base}/models`)
const models = (await models_req.json()) as { data: { id: string }[] }
const model = models.data[0].id
console.log('MODELS:')
console.log(colorize(models.data))

const openai = new OpenAI({ apiKey: api_key, baseURL: api_base })
const completion = await openai.beta.chat.completions.parse({
  apiBase: api_base,
  apiKey: api_key,
  model: model,
  messages: [
    {
      role: 'system',
      content:
        'You are a helpful math tutor. Guide the user through the solution step by step.',
    },
    { role: 'user', content: 'how can I solve 8x + 7 = -23' },
  ],
  response_format: zodResponseFormat(MathReasoning, 'math_reasoning'),
})

const math_reasoning = completion.choices[0].message.parsed
console.log(JSON.stringify(math_reasoning, null, 2))

console.log(colorize(zodResponseFormat(MathReasoning, 'math_reasoning')))
