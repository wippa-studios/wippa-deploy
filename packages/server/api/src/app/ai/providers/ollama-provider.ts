import { httpClient, HttpMethod } from '@wippa/pieces-common'
import { AIProviderModel, AIProviderModelType, OpenAICompatibleProviderAuthConfig, OpenAICompatibleProviderConfig } from '@wippa/shared'
import { FastifyBaseLogger } from 'fastify'
import { AIProviderStrategy } from './ai-provider'

export const ollamaProvider: AIProviderStrategy<OpenAICompatibleProviderAuthConfig, OpenAICompatibleProviderConfig> = {
    name: 'Ollama',
    async validateConnection(authConfig: OpenAICompatibleProviderAuthConfig, config: OpenAICompatibleProviderConfig, _log: FastifyBaseLogger): Promise<void> {
        await ollamaProvider.listModels(authConfig, config)
    },
    async listModels(_authConfig: OpenAICompatibleProviderAuthConfig, config: OpenAICompatibleProviderConfig): Promise<AIProviderModel[]> {
        const baseUrl = config.baseUrl ?? 'http://localhost:11434'
        const listUrl = `${baseUrl.replace(/\/$/, '')}/api/tags`
        
        const res = await httpClient.sendRequest<{ models: OllamaModel[] }>({
            url: listUrl,
            method: HttpMethod.GET,
            timeout: 5000,
        })

        return (res.body.models ?? []).map((model: OllamaModel) => ({
            id: model.name,
            name: model.name,
            type: AIProviderModelType.TEXT,
        }))
    },
}

type OllamaModel = {
    name: string
    model: string
    modified_at: string
    size: number
}
