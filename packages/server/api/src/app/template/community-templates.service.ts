import { SeekPage } from '@wippa/core-utils'
import { ListTemplatesRequestQuery, Template, TemplateType } from '@wippa/shared'
import { ArrayContains } from 'typeorm'
import { repoFactory } from '../core/db/repo-factory'
import { CANONICAL_CATEGORIES } from './template-categories'
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
        const categories = new Set<string>([...CANONICAL_CATEGORIES])
        for (const t of templates) {
            for (const c of t.categories) {
                categories.add(c)
            }
        }
        return Array.from(categories).sort()
    },
    list: async (request: ListTemplatesRequestQuery): Promise<SeekPage<Template>> => {
        const templates = await templateRepo().find({
            where: {
                type: TemplateType.OFFICIAL,
                ...(request.category ? { categories: ArrayContains([request.category]) } : {}),
            },
            order: { created: 'DESC' },
        })

        const filtered = request.search
            ? templates.filter(t =>
                t.name.toLowerCase().includes(request.search!.toLowerCase()) ||
                t.summary?.toLowerCase().includes(request.search!.toLowerCase()) ||
                t.description?.toLowerCase().includes(request.search!.toLowerCase()),
            )
            : templates

        return {
            data: filtered,
            next: null,
            previous: null,
        }
    },
}
