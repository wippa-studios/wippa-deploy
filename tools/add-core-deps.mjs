// Follow-up to sever-pieces-shared.mjs: declare the core packages a piece now
// imports as workspace dependencies, so bun symlinks them (tsc/build resolution).

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

let updated = 0
for (const piece of fs.readdirSync(COMMUNITY)) {
    const dir = path.join(COMMUNITY, piece)
    const src = path.join(dir, 'src')
    const pkgPath = path.join(dir, 'package.json')
    if (!fs.existsSync(src) || !fs.existsSync(pkgPath)) continue

    let usesUtils = false
    let usesPieceTypes = false
    for (const file of walk(src)) {
        const content = fs.readFileSync(file, 'utf8')
        if (content.includes("'@wippa/core-utils'")) usesUtils = true
        if (content.includes("'@wippa/core-connector-types'")) usesPieceTypes = true
    }
    if (!usesUtils && !usesPieceTypes) continue

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
    pkg.dependencies = pkg.dependencies ?? {}
    let changed = false
    if (usesUtils && !pkg.dependencies['@wippa/core-utils']) {
        pkg.dependencies['@wippa/core-utils'] = 'workspace:*'
        changed = true
    }
    if (usesPieceTypes && !pkg.dependencies['@wippa/core-connector-types']) {
        pkg.dependencies['@wippa/core-connector-types'] = 'workspace:*'
        changed = true
    }
    if (changed) {
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
        updated++
    }
}
console.log(`package.json files updated with core deps: ${updated}`)
