const PROTOCOL = {
  http: 'http',
  https: 'https',
} as const

const format_host = (
  protocol: (typeof PROTOCOL)[keyof typeof PROTOCOL],
  host_name: string,
  port?: number,
) => {
  return `${protocol}://${host_name}${port ? `:${port}` : ''}/v1`
}
const ollama_port = 11434 as const
const host_server = '192.168.5.50' as const
const host_local = 'localhost' as const

export const hosts: Record<string, Record<'api_base' | 'api_key', string>> = {
  server_ollama: {
    api_base: format_host(PROTOCOL.http, host_server, ollama_port),
    api_key: 'none',
  },
  local_ollama: {
    api_base: format_host(PROTOCOL.http, host_local, ollama_port),
    api_key: 'none',
  },
  server_sglang: {
    api_base: format_host(PROTOCOL.http, host_server, 30000),
    api_key: 'none',
  },
}

export const models = {}
