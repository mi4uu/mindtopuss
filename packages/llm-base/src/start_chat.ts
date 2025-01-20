import { type Static, Type } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import { colorize } from 'json-colorizer'
import type { OpenAI } from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'
import { get_schema } from './agents/actions'
import { AGENTS } from './agents/agents.ts'
import { create_chat_completitions } from './utils/chat-completitions'
import { get_client } from './utils/connection'
import { get_model, hosts } from './utils/models'

const agents_names = Object.keys(AGENTS) as Array<keyof typeof AGENTS>
const connection = hosts.server_sglang
const client = get_client(connection.api_key, connection.api_base)

const model = await get_model(hosts.server_sglang)
const schema = get_schema(agents_names)

const task = `A user wants to plan a 7-day trip to Japan with a budget of $2000. The user enjoys cultural experiences, nature, and trying local food. Your team of agents must work together to create a detailed trip plan. Include the following:
1. Destinations and daily itinerary.
2. Estimated costs for flights, accommodations, and activities.
3. Recommendations for local food and cultural experiences.
4. Weather considerations for the travel dates.
Each agent should contribute their expertise, and the final output should be a cohesive plan.`
// console.log(colorize( zodResponseFormat(schema, 'resp')))
const schema_00 = zodToJsonSchema(schema, {
  target: 'openAi',
  errorMessages: true,
  strictUnions: true,
})

const schema_01 = {
  type: 'json_schema',
  json_schema: { name: 'respond-in-schema', schema: zodToJsonSchema(schema) },
}
const schema_02 = zodResponseFormat(schema, 'respond-in-schema')
console.log({
  schema_00_len: JSON.stringify(schema_00).length,

  schema_01_len: JSON.stringify(schema_01).length,
  schema_02_len: JSON.stringify(schema_02).length,
})

const response_schema = schema_01

const history = ['']
for (let i = 0; i < 1; i++) {
  // console.log(JSON.stringify(schema,null,2))
  for (const agent_name of agents_names) {
    const agent = AGENTS[agent_name]
    const system_prompt = agent.prompt
    const parse = true
    const response = await create_chat_completitions(
      client,
      model,
      task,
      history,
      system_prompt,
      response_schema as OpenAI.ResponseFormatJSONSchema,
      parse,
    )

    const message = response.choices[0].message
    type Message = typeof message
    interface parsed_msg extends Message {
      parsed: string
    }

    if (message) {
      try {
        if (parse) {
          console.log(colorize((message as parsed_msg).parsed))
        } else {
          if (message.content)
            console.log(colorize(JSON.parse(message.content)))
          else console.log('no response')
        }
      } catch (e) {
        if (message.content) console.log(message.content)
        else console.log('no response')
      }
    } else {
      console.log('no message')
    }
    //   const content_parsed=Value.Convert(schema,content)
    //   console.log(content_parsed)
    break
  }
}
