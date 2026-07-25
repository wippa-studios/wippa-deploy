import { SeekPage } from '@activepieces/core-utils'
import { ListTemplatesRequestQuery, Template, TemplateType } from '@activepieces/shared'
import { repoFactory } from '../core/db/repo-factory'
import { TemplateEntity } from './template.entity'

const templateRepo = repoFactory<Template>(TemplateEntity)

export const communityTemplates = {
    getOrThrow: async (id: string): Promise<Template> => {
        const template = await templateRepo().findOneBy({ id, type: TemplateType.OFFICIAL })
        if (!template) {
            throw new Error(`Template ${id} not found`)
        }
        return template
    },
    getCategories: async (): Promise<string[]> => {
        const templates = await templateRepo().find({ where: { type: TemplateType.OFFICIAL } })
        const categories = new Set<string>()
        for (const t of templates) {
            for (const c of t.categories) {
                categories.add(c)
            }
        }
        return Array.from(categories)
    },
    list: async (_request: ListTemplatesRequestQuery): Promise<SeekPage<Template>> => {
        const templates = await templateRepo().find({
            where: { type: TemplateType.OFFICIAL },
            order: { created: 'DESC' },
        })
        return {
            data: templates,
            next: null,
            previous: null,
        }
    },
}
