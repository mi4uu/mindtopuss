import { array_to_object } from '@mindtopuss-lib/common'
import { Literal, type Static, Type } from '@sinclair/typebox'
// export const objectFromEntries = Object.fromEntries as <Key extends PropertyKey, Entries extends ReadonlyArray<readonly [Key, Key]>>(values: Entries) => {
// 	[K in Extract<Entries[number], readonly [Key, unknown]>[0]]: K
// };

export const action_types_list = [
  'ANSWER',
  'VOTE',
  'SPEAK',
  'THINKING',
  'FINISH',
  'REFUSE',
  'SUMMARY',
  'REMIND_ME',
  'ASK',
] as const
const action_types = array_to_object(action_types_list, Type.Literal)
export const get_schema = (agents: string[]) => {
  const actions = get_all_actions(agents)
  const schema = Type.Object(Type.Array(actions, { minItems: 1, maxItems: 5 }))
  type tschema = typeof schema
  type tschema_static = Static<tschema>
  return schema
}
export const get_all_actions = (agents: string[]) => {
  const agents_enum = Type.Enum(Object.fromEntries(agents.map((a) => [a, a])))
  const answer = Type.Object(
    {
      type: Type.Literal('ANSWER'),
      answer: Type.String({ description: 'your answer' }),
    },
    {
      description: "Provide a clear and concise answer to the user's question.",
    },
  )

  const vote = Type.Object(
    {
      type: Type.Literal('VOTE'),
      vote: Type.Boolean({ description: 'is this the best answer?' }),
    },
    {
      description:
        'do you think that this answer solves problem, and you agree with it?',
    },
  )

  const speak = Type.Object(
    {
      type: Type.Literal('SPEAK'),
      content: Type.String(),
    },
    { description: 'if you want to say something, or provide a comment' },
  )

  const thinking = Type.Object(
    {
      type: Type.Literal('THINKING'),
      through: Type.String({ description: 'your thinking process' }),
    },
    { description: 'Thinking step by step to provide a well-reasoned answer.' },
  )

  const finish = Type.Object(
    {
      type: Type.Literal('FINISH'),
    },
    {
      description:
        'if you think that you solved the problem and no more actions needed',
    },
  )

  const refuse = Type.Object(
    {
      type: Type.Literal('SKIP'),
    },
    { description: 'Skip your turn' },
  )

  const summarize = Type.Object(
    {
      type: Type.Literal('SUMMARY'),
      topic: Type.String(),
      content: Type.String(),
      summarized_messages_ids: Type.Array(Type.String(), {
        minItems: 0,
        description: 'ids of messages that was summarized summarized',
      }),
    },
    { description: 'summarize the conversation' },
  )

  const remindme = Type.Object(
    {
      type: Type.Literal('REMIND_ME'),
      input: Type.String(),
    },
    {
      description:
        'ask for a reminder from this conversation about a specific topic',
    },
  )

  const ask_agent = Type.Object(
    {
      type: Type.Literal('ASK'),
      input: Type.String({ description: 'your question' }),
      agent: agents_enum,
      is_private: Type.Boolean({ description: 'is this question private?' }),
    },
    { description: 'ask other team member' },
  )

  return Type.Union([
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
