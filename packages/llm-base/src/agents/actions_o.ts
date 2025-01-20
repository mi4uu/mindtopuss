import { array_to_object } from '@mindtopuss-lib/common'
import { Literal, type Static, Type } from '@sinclair/typebox'
// export const objectFromEntries = Object.fromEntries as <Key extends PropertyKey, Entries extends ReadonlyArray<readonly [Key, Key]>>(values: Entries) => {
// 	[K in Extract<Entries[number], readonly [Key, unknown]>[0]]: K
// };
import { ZodEnum, z } from 'zod'

export const action_types_list = [
  'ANSWER',
  'VOTE',
  'SHARE',
  'THINKING',
  'FINISH',
  'REFUSE',
  'SUMMARY',
  'REMIND_ME',
  'ASK',
] as const
const action_types = array_to_object(action_types_list, z.literal)
export const get_schema = (agents: string[]) => {
  const actions = get_all_actions(agents)
  const schema = z.object({ actions: z.array(actions) })

  return schema
}
export const get_all_actions = (agents: string[]) => {
  // const agents_list=agents.map(a =>  z.literal(a))
  // const a=agents as unknown as readonly string[]
  const agents_enum = z.custom((value: string) => {
    return agents.indexOf(value) > -1
  })
  const answer = z.object(
    {
      type: z.literal('ANSWER'),
      answer: z.string({ description: 'your answer' }),
    },
    {
      description: "Provide a clear and concise answer to the user's question.",
    },
  )

  const vote = z.object(
    {
      type: z.literal(action_types.VOTE),
      vote: z.boolean({ description: 'is this the best answer?' }),
    },
    {
      description:
        'do you think that this answer solves problem, and you agree with it?',
    },
  )

  const speak = z.object(
    {
      type: z.literal(action_types.SHARE),
      content: z.string(),
    },
    {
      description:
        'if you want to say something to whole team, or provide a comment. USE ONLY AS LAST RESORT IF OTHER ACTIONS DONT FIT',
    },
  )

  const thinking = z.object(
    {
      type: z.literal(action_types.THINKING),
      through: z.string({ description: 'your thinking process' }),
    },
    {
      description:
        "steps of thinking and reasonings, your Thinking placeholder, put your thinking process here, if it doesn't fit to other action, put it here",
    },
  )

  const finish = z.object(
    {
      type: z.literal(action_types.FINISH),
    },
    {
      description:
        'if you think that you solved the problem and no more actions needed',
    },
  )

  const refuse = z.object(
    {
      type: z.literal(action_types.REFUSE),
    },
    { description: 'Skip your turn' },
  )

  const summarize = z.object(
    {
      type: z.literal(action_types.SUMMARY),
      topic: z.string(),
      content: z.string(),
      summarized_messages_ids: z.array(z.string(), {
        description: 'ids of messages that was summarized summarized',
      }),
    },
    { description: 'summarize the conversation' },
  )

  const remindme = z.object(
    {
      type: z.literal(action_types.REMIND_ME),
      input: z.string(),
    },
    {
      description:
        'ask for a reminder from this conversation about a specific topic',
    },
  )

  const ask_agent = z.object(
    {
      type: z.literal(action_types.ASK),
      input: z.string({ description: 'your question' }),
      agent: agents_enum,
      is_private: z.boolean({ description: 'is this question private?' }),
    },
    { description: 'ask other team member' },
  )

  return z.union([
    answer,
    vote,
    ask_agent,
    refuse,
    finish,
    speak,
    thinking,
    summarize,
    remindme,
    thinking,
  ])
}
