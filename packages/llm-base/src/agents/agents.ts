import type { Unpack, UnpackAlt } from '@mindtopuss-lib/common'
import { CONSTRAINS, CONVERSATION, GOALS, INTRO } from './agents_pieces'
function createRecord<K extends string, T>(keys: K[], value: T): Record<K, T> {
  const record: Partial<Record<K, T>> = {}
  for (const key of keys) {
    record[key] = value
  }
  return record as Record<K, T>
}

export interface AGENT {
  name: string
  prompt: string
  description: Readonly<string>
  goals: string[]
  constrains: string[]
  conversation: string[]
  workflow?: string[]
}

const init_agent = <T extends string, D extends string>(
  name: T,
  props: {
    description?: D
    goals?: string[]
    constrains?: string[]
    conversation?: string[]
  },
): AGENT & { name: Uppercase<T>; description: D } => {
  return {
    name: name.toUpperCase() as Uppercase<T>,
    description: props.description || ('' as D),
    goals: props.goals || [],
    constrains: props.constrains || [],
    conversation: props.conversation || [],
    prompt: '',
  }
}
type ASCIICacheKey<Str extends string> = `ID-${Uppercase<Str>}`
const arr = ['a', 'b', 'n'] as const

type JoinStrings<T extends readonly string[]> = T extends readonly [
  infer F extends string,
  ...infer R extends readonly string[],
]
  ? `[${F}] ${JoinStrings<R>}`
  : ''

const joinArray = <T extends readonly string[]>(arr: T): JoinStrings<T> =>
  arr.join('_') as JoinStrings<T>
const joined = joinArray(arr)

type AgentWithPrompt<T> = T & { prompt: string }

type AgentNameMap = {
  [K in ReturnType<typeof init_agent>['name']]: ReturnType<
    typeof init_agent
  > & { name: K }
}

const setup_crew = <T extends ReturnType<typeof init_agent>>(
  agents: T[],
): { [K in T['name']]: AgentWithPrompt<AgentNameMap[K]> } => {
  const agents_names = agents.map((a) => a.name as Uppercase<T['name']>)
  const crew = agents.map((agent) => {
    const prompt = [INTRO(agent.name, agents_names)]

    if (agent.goals.length > 0) {
      prompt.push('\n## GOALS:\n')
      prompt.push(agent.goals.join('\n'))
    }

    if (agent.constrains.length > 0) {
      prompt.push('\n## CONSTRAINS:\n')
      prompt.push(agent.constrains.join('\n'))
    }
    if (agent.conversation.length > 0) {
      prompt.push('\n## CONVERSATION:\n')
      prompt.push(agent.conversation.join('\n'))
    }

    prompt.push('\n')
    prompt.push('always respond in json format matching provided schema.')
    prompt.push(
      'you can use multiple actions on one response, but also can skip and allow others to talk',
    )

    agent.prompt = prompt.join('\n')

    return [
      agent.name,
      agent as AgentWithPrompt<AgentNameMap[typeof agent.name]>,
    ]
  })
  return Object.fromEntries(crew) as {
    [K in T['name']]: AgentWithPrompt<AgentNameMap[K]>
  }
}

const agent_asistant = init_agent('assistant', {
  description:
    'even tho you have others to help, manage etc. this is your project and will be doing most of the thinking',
  goals: [GOALS.UNDERSTANDING, GOALS.SUCCESS, GOALS.TRY_DIFFERENT],
  constrains: [CONSTRAINS.DONT_REPEAT, CONSTRAINS.DONT_STICK_TO_LAST_IDEA],
  conversation: [
    CONVERSATION.STEP_BY_STEP,
    CONVERSATION.EXPLAIN,
    CONVERSATION.TAKE_TIME,
    CONVERSATION.THINHING,
  ],
})

const agent_summarizer = init_agent('summarizer', {
  goals: [GOALS.CAPTURING, GOALS.DISTILLING],
  constrains: [
    CONSTRAINS.ACCURACY,
    CONSTRAINS.NO_CREATIVE,
    CONSTRAINS.BE_PRECISE,
  ],
  conversation: [CONVERSATION.SHORTEST, CONVERSATION.DONT_EXPLAIN],
})

const agent_pm = init_agent('PROJECT MANAGER', {
  goals: [
    GOALS.UNDERSTANDING,
    GOALS.SUCCESS,
    GOALS.KEEPING,
    GOALS.ASSESSING,
    GOALS.PROVIDING,
    GOALS.PROVIDING_FEEDBACK,
    GOALS.ENSURING,
    GOALS.MONITORING,
  ],
  constrains: [CONSTRAINS.BE_PRECISE],
  conversation: [CONVERSATION.RESPOND_PROACTIVE],
})
const agent_conv_data_extractor = init_agent('RELEVANT DATA EXTRACTOR', {
  goals: [
    GOALS.UNDERSTANDING,
    GOALS.SUCCESS,
    GOALS.IDENTIFYING,
    GOALS.IMPROVE,
    GOALS.DIVIDING,
    GOALS.DISTILLING,
  ],
  constrains: [
    CONSTRAINS.NO_CREATIVE,
    CONSTRAINS.ACCURACY,
    CONSTRAINS.BE_PRECISE,
  ],
  conversation: [CONVERSATION.RESPOND_FOCUS_ON_TASK],
})

const agent_freethinker = init_agent('FREETHINKER', {
  description:
    'You are fuul of energy and fresh ideas, want to change the world or at least this around you for the better place',
  goals: [
    GOALS.CHAOS,
    GOALS.SUCCESS,
    GOALS.TRY_DIFFERENT,
    GOALS.OUT_OF_THE_BOX,
  ],
  constrains: [CONSTRAINS.DONT_STICK_TO_LAST_IDEA],
  conversation: [
    CONVERSATION.RESPOND_BALANCE,
    CONVERSATION.TAKE_TIME,
    CONVERSATION.THINHING,
    CONVERSATION.OPTIONS,
    CONVERSATION.ASK,
    CONVERSATION.STEP_BACK,
  ],
})
const agent_planner = init_agent('planner', {
  goals: [
    GOALS.UNDERSTANDING,
    GOALS.DISTILLING,
    GOALS.IDENTIFYING,
    GOALS.CONCEPT_MAP,
    GOALS.FEEDBACK,
  ],
  constrains: [CONSTRAINS.BE_PRECISE],
  conversation: [
    CONVERSATION.PROVIDE,
    CONVERSATION.THINHING,
    CONVERSATION.RESPOND_WHEN_NEEDED,
  ],
})

export const AGENTS = setup_crew([
  agent_asistant,
  agent_summarizer,
  agent_conv_data_extractor,
  agent_planner,
  agent_pm,
  agent_freethinker,
])

type ff = Unpack<typeof AGENTS>

export type AGENTS_NAMES = keyof typeof AGENTS
export const agents_names = Object.keys(AGENTS) as AGENTS_NAMES[]
