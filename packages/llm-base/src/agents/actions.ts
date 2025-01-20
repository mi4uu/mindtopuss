import { array_to_object } from '@mindtopuss-lib/common'
import { Literal, type Static, Type } from '@sinclair/typebox'
import { zodToJsonSchema } from 'zod-to-json-schema'

// export const objectFromEntries = Object.fromEntries as <Key extends PropertyKey, Entries extends ReadonlyArray<readonly [Key, Key]>>(values: Entries) => {
// 	[K in Extract<Entries[number], readonly [Key, unknown]>[0]]: K
// };
import { ZodAny, ZodEnum, ZodObject, z } from 'zod'

export const action_types_list = [
  'ANSWER',
  'VOTE',
  'SHARE',
  // 'THINKING',
  'FINISH',
  'REFUSE',
  'SUMMARY',
  'REMIND_ME',
  'ASK',
  'NOTE',
  'SEARCH_WEB',
] as const
const action_types = array_to_object(action_types_list, (x) => x)

export const get_schema = (agents: string[]) => {
  const Step = z.object({
    explanation: z.string().optional(),
    output: z.string(),
  })

  const actions = get_all_actions(agents)

  const schema = z.object({
    thinking: z
      .array(Step)
      .describe(
        'thinking process, notes, steps, it wont be shared ar avilable for anyone except you. you can think it thru in here.',
      ),
    actions: z
      .array(
        z.object({
          //action:z.enum(action_types_list),
          action: actions,
          output: z.string(),
        }),
      )
      .describe(
        'provide list of action to get closer to solving main problem. to get new information, inform someone etc. here you can put your previous idea in motion',
      ),

    is_solved: z
      .boolean()
      .describe('is problem solved, or if we could do better?'),
  })

  return schema
}

export const get_all_actions = (agents: string[]) => {
  const all_actions = [
    z
      .object({
        action: z.literal(action_types.ASK),
        agent: z.string(),
        is_private: z.boolean({ description: 'is this question private?' }),
      })
      .describe('ask other team member'),
    z
      .object({
        action: z.literal(action_types.SUMMARY),
        topic: z.string(),
        summarized_messages_ids: z.array(z.string(), {
          description: 'ids of messages that was summarized summarized',
        }),
      })
      .describe('use for results of summarize'),
    z
      .object({ action: z.literal(action_types.REMIND_ME) })
      .describe(
        'ask for a reminder from this conversation about a specific topic',
      ),
    z
      .object({
        action: z.literal(action_types.REFUSE),
      })
      .describe('Skip your turn'),
    z
      .object({
        action: z.literal(action_types.NOTE),
        topic: z.string(),
        importance: z.number().min(0).max(10),
      })
      .describe('if you want to leave some note to future self'),
    z
      .object({
        action: z.literal(action_types.SEARCH_WEB),
      })
      .describe('if you want query web for some topic'),
    z.object(
      {
        action: z.literal(action_types.ANSWER),
        answer: z.string({ description: 'your answer' }),
      },
      {
        description:
          "Provide a clear and concise answer to the user's question.",
      },
    ),

    z.object(
      {
        action: z.literal(action_types.VOTE),
        vote: z.boolean({ description: 'is this the best answer?' }),
      },
      {
        description:
          'do you think that last "answer" solves problem, and you agree with it?',
      },
    ),
  ] as const

  return z.union(all_actions)

  // return z.object(all_actions)

  // return z.union([
  //   // answer,
  //   // vote,
  //   ask_agent,
  //   refuse,
  //   // finish,
  //   // speak,
  //   // thinking,
  //   summarize,
  //   remindme,
  //   // thinking,
  // ])
}
