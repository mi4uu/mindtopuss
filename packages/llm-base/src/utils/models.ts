import { Enum, type InferValue } from 'better-enums'

const PROTOCOLS = Enum(['http', 'https'])
type Protocol = InferValue<typeof PROTOCOLS>
const Protocols = PROTOCOLS.accessor
const HOST_TYPES = Enum(['ollama', 'sglang'])
type Host = InferValue<typeof HOST_TYPES>
const Host_types = HOST_TYPES.accessor

const format_host = (protocol: Protocol, host_name: string, port?: number) => {
  return `${protocol}://${host_name}${port ? `:${port}` : ''}/v1`
}
const ollama_port = 11434 as const
const host_server = '192.168.5.50' as const
const host_local = 'localhost' as const
type host = Record<'api_base' | 'api_key' | 'type', string>

export const hosts: Record<string, host> = {
  server_ollama: {
    api_base: format_host(Protocols.http, host_server, ollama_port),
    api_key: 'none',
    type: Host_types.ollama,
  },
  local_ollama: {
    api_base: format_host(Protocols.http, host_local, ollama_port),
    api_key: 'none',
    type: Host_types.ollama,
  },
  server_sglang: {
    api_base: format_host(Protocols.http, host_server, 30000),
    api_key: 'none',
    type: Host_types.sglang,
  },
}

export const get_model = async (host: host) => {
  if (host.type === Host_types.ollama) {
    const models_req = await fetch(`${host.api_base}/models`)
    const models = (await models_req.json()) as {
      models: { name: string; family: string; size: number }[]
    }
    const ok_models = models.models
      .filter((m) => ['qwen2', 'llama'].includes(m.family))
      .sort((a, b) => a.size - b.size)
    if (ok_models.length < 2) return ok_models[0].name
    return ok_models[Math.ceil(ok_models.length / 2)].name
  }

  const models_req = await fetch(`${host.api_base}/models`)
  const models = (await models_req.json()) as { data: { id: string }[] }
  return models.data[0].id
}
