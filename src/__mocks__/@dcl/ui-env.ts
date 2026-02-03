// Mock for @dcl/ui-env

export enum Env {
  DEVELOPMENT = 'dev',
  STAGING = 'stg',
  PRODUCTION = 'prod',
}

// env.ts exports
export function getEnvList(): Env[] {
  return [Env.DEVELOPMENT, Env.STAGING, Env.PRODUCTION]
}

export function isEnv(value: string): value is Env {
  return Object.values(Env).includes(value as Env)
}

export function parseEnvVar(envVar: string): Env {
  if (isEnv(envVar)) {
    return envVar
  }
  throw new Error(`Invalid env: ${envVar}`)
}

export function getDefaultEnv(): Env {
  return Env.DEVELOPMENT
}

export function getEnv(): Env {
  return Env.DEVELOPMENT
}

// config.ts exports
export function createConfig<T extends Record<string, unknown>>(
  config: Record<string, T>
): { get: <K extends keyof T>(key: K) => T[K] } {
  const envConfig = config[Env.DEVELOPMENT] || config['dev'] || Object.values(config)[0]
  return {
    get: <K extends keyof T>(key: K) => envConfig[key],
  }
}

// location.ts exports
export function getEnvFromTLD(): Env | null {
  return null
}

export function getEnvFromQueryParam(): Env | null {
  return null
}
