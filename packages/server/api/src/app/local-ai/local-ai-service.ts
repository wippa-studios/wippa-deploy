import { isNil } from '@wippa/core-utils'
import { FastifyBaseLogger } from 'fastify'
import { system } from '../helper/system/system'
import { AppSystemProp } from '../helper/system/system-props'

const MODEL = 'gemma3:1b'
const OLLAMA_TIMEOUT_MS = 120_000

function baseUrl(): string {
    return system.get(AppSystemProp.OLLAMA_BASE_URL) ?? 'http://localhost:11434'
}

function ollamaApiUrl(path: string): string {
    const url = `${baseUrl().replace(/\/+$/, '')}${path}`
    return url
}

async function fetchFromOllama<T>(path: string, body: unknown, log: FastifyBaseLogger): Promise<T> {
    const url = ollamaApiUrl(path)
    log.debug({ url, model: MODEL }, '[localAiService] Ollama request')

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS)

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            signal: controller.signal,
        })

        if (!response.ok) {
            const text = await response.text().catch(() => 'unknown')
            throw new Error(`Ollama returned ${response.status}: ${text}`)
        }

        return (await response.json()) as T
    }
    finally {
        clearTimeout(timeout)
    }
}

type OllamaGenerateResponse = {
    model: string
    created_at: string
    response: string
    done: boolean
    context?: number[]
    total_duration?: number
    load_duration?: number
    prompt_eval_count?: number
    eval_count?: number
}

type OllamaChatMessage = {
    role: 'system' | 'user' | 'assistant'
    content: string
}

type OllamaChatResponse = {
    model: string
    created_at: string
    message: OllamaChatMessage
    done: boolean
    total_duration?: number
    load_duration?: number
    prompt_eval_count?: number
    eval_count?: number
}

export const localAiService = (log: FastifyBaseLogger) => ({

    async isAvailable(): Promise<boolean> {
        try {
            const controller = new AbortController()
            const timeout = setTimeout(() => controller.abort(), 5000)
            try {
                const response = await fetch(`${baseUrl().replace(/\/+$/, '')}/api/tags`, {
                    signal: controller.signal,
                })
                return response.ok
            }
            finally {
                clearTimeout(timeout)
            }
        }
        catch {
            return false
        }
    },

    async chatCompletion({ messages }: {
        messages: Array<{ role: 'system' | 'user' | 'assistant', content: string }>
    }): Promise<string> {
        const response = await fetchFromOllama<OllamaChatResponse>('/api/chat', {
            model: MODEL,
            messages,
            stream: false,
            options: {
                temperature: 0.7,
            },
        }, log)
        return response.message.content
    },

    async generateStructured<T>({ systemPrompt, userMessage }: {
        systemPrompt: string
        userMessage: string
    }): Promise<T> {
        const response = await fetchFromOllama<OllamaGenerateResponse>('/api/generate', {
            model: MODEL,
            system: systemPrompt,
            prompt: userMessage,
            format: 'json',
            stream: false,
            options: {
                temperature: 0,
            },
        }, log)

        try {
            return JSON.parse(response.response) as T
        }
        catch {
            log.error({ raw: response.response }, '[localAiService] Failed to parse structured JSON output')
            throw new Error('Failed to parse AI response as JSON')
        }
    },

    async generateWithRetry<T>({ systemPrompt, userMessage, schema, maxRetries = 3 }: {
        systemPrompt: string
        userMessage: string
        schema: { parse: (data: unknown) => T }
        maxRetries?: number
    }): Promise<T> {
        let lastError: unknown
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const raw = await this.generateStructured<unknown>({ systemPrompt, userMessage })
                const validated = schema.parse(raw)
                return validated
            }
            catch (err) {
                lastError = err
                log.warn({ attempt, maxRetries, error: String(err) }, '[localAiService] Retry attempt failed')
                if (attempt < maxRetries) {
                    userMessage = `${userMessage}\n\nPrevious attempt produced invalid output. Error: ${String(lastError)}\n\nPlease respond with valid JSON only.`
                }
            }
        }
        throw lastError
    },

    async diagnoseError({ stepName, errorMessage, flowName }: {
        stepName: string
        errorMessage: string
        flowName: string
    }): Promise<{ diagnosis: string, likelyCause: string, fix: string }> {
        const systemPrompt = `You are an AI assistant for the Wippa automation platform. Your job is to diagnose flow step errors and suggest fixes.

Given a step name, error message, and flow name, produce a JSON response with exactly three fields:
- "diagnosis": A 1-2 sentence plain-English explanation of what went wrong
- "likelyCause": A single sentence identifying the most likely root cause
- "fix": A 1-3 sentence actionable fix the user can apply

Respond ONLY with valid JSON.`

        const userMessage = `Flow: ${flowName}\nStep: ${stepName}\nError: ${errorMessage}`

        return this.generateWithRetry({
            systemPrompt,
            userMessage,
            schema: errorDiagnosisSchema,
        })
    },

    async generateFlowFromNl({ description, triggerType = 'WEBHOOK' }: {
        description: string
        triggerType?: string
    }): Promise<{ flowName: string, trigger: { type: string, settings: unknown }, steps: Array<{ name: string, connectorName?: string, actionName?: string, settings: unknown }> }> {
        const systemPrompt = `You are an AI assistant for the Wippa automation platform. Given a user's plain-English description of an automation flow, generate a valid flow schema.

Available trigger types: WEBHOOK, SCHEDULE

Available actions include:
- Code (run custom JavaScript/TypeScript code)
- HTTP request (make outbound HTTP calls)
- AI / Chat actions
- Data mapping / transformation

Respond with valid JSON in this exact shape:
{
  "flowName": "A short descriptive name",
  "trigger": { "type": "WEBHOOK", "settings": {} },
  "steps": [
    {
      "name": "step_display_name",
      "type": "PIECE",
      "connectorName": "connector_package_name_if_applicable",
      "actionName": "action_name_if_applicable",
      "settings": {}
    }
  ]
}

Respond ONLY with valid JSON.`

        return this.generateWithRetry({
            systemPrompt,
            userMessage: description,
            schema: nlToFlowSchema,
        })
    },
})

const errorDiagnosisSchema = {
    parse(data: unknown): { diagnosis: string, likelyCause: string, fix: string } {
        const d = data as Record<string, unknown>
        if (typeof d.diagnosis !== 'string' || typeof d.likelyCause !== 'string' || typeof d.fix !== 'string') {
            throw new Error('Invalid error diagnosis schema')
        }
        return { diagnosis: d.diagnosis, likelyCause: d.likelyCause, fix: d.fix }
    },
}

const nlToFlowSchema = {
    parse(data: unknown): { flowName: string, trigger: { type: string, settings: unknown }, steps: Array<{ name: string, connectorName?: string, actionName?: string, settings: unknown }> } {
        const d = data as Record<string, unknown>
        if (typeof d.flowName !== 'string' || !d.trigger || !Array.isArray(d.steps)) {
            throw new Error('Invalid NL-to-flow schema')
        }
        const trigger = d.trigger as Record<string, unknown>
        return {
            flowName: d.flowName,
            trigger: { type: String(trigger.type ?? 'WEBHOOK'), settings: trigger.settings ?? {} },
            steps: d.steps.map((s: unknown) => {
                const step = s as Record<string, unknown>
                return {
                    name: String(step.name ?? ''),
                    connectorName: step.connectorName ? String(step.connectorName) : undefined,
                    actionName: step.actionName ? String(step.actionName) : undefined,
                    settings: step.settings ?? {},
                }
            }),
        }
    },
}
