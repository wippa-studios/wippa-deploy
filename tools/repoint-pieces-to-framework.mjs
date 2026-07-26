// Repoint community pieces: imports of @wippa/core-utils / core-piece-types
// now come from @wippa/connectors-framework (which re-exports them), so pieces
// depend only on framework + common. Also drops the core-* deps from package.json.

import fs from 'node:fs'
import path from 'node:path'

const REPO = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const COMMUNITY = path.join(REPO, 'packages', 'pieces', 'community')

function walk(dir) {
    let result = []
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) result = result.concat(walk(full))
        else if (full.endsWith('.ts')) result.push(full)
    }
    return result
}

let filesChanged = 0
let pkgsChanged = 0
for (const piece of fs.readdirSync(COMMUNITY)) {
    const dir = path.join(COMMUNITY, piece)
    const src = path.join(dir, 'src')
    if (!fs.existsSync(src)) continue

    for (const file of walk(src)) {
        let content = fs.readFileSync(file, 'utf8')
        if (!content.includes('@wippa/core-utils') && !content.includes('@wippa/core-connector-types')) continue
        const next = content
            .replaceAll("from '@wippa/core-utils'", "from '@wippa/connectors-framework'")
            .replaceAll("from '@wippa/core-connector-types'", "from '@wippa/connectors-framework'")
        if (next !== content) {
            fs.writeFileSync(file, next)
            filesChanged++
        }
    }

    const pkgPath = path.join(dir, 'package.json')
    if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
        const deps = pkg.dependencies ?? {}
        let changed = false
        for (const coreDep of ['@wippa/core-utils', '@wippa/core-connector-types']) {
            if (deps[coreDep]) { delete deps[coreDep]; changed = true }
        }
        if (changed && !deps['@wippa/connectors-framework']) {
            deps['@wippa/connectors-framework'] = 'workspace:*'
        }
        if (changed) {
            pkg.dependencies = deps
            fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
            pkgsChanged++
        }
    }
}
console.log(`files repointed to framework: ${filesChanged}`)
console.log(`package.json files cleaned of core-* deps: ${pkgsChanged}`)
