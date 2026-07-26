import { describe, expect, it } from 'vitest'
import { connectorExpertise } from '../../../../src/app/mcp/tools/piece-expertise'

describe('connectorExpertise.getNotes', () => {
    it('returns curated notes by short name and by full piece name', () => {
        expect(connectorExpertise.getNotes({ connectorName: 'airtable' })).toMatch(/linked-record/i)
        expect(connectorExpertise.getNotes({ connectorName: '@wippa/connector-airtable' })).toMatch(/linked-record/i)
    })

    it('appends the action-specific note when an action is given', () => {
        const note = connectorExpertise.getNotes({ connectorName: 'airtable', actionName: 'find_record' })
        expect(note).toContain('list_records')
    })

    it('encodes the high-value traps (Stripe dollars, Sheets letters, Slack channel id)', () => {
        expect(connectorExpertise.getNotes({ connectorName: 'stripe' })).toMatch(/decimal|dollars|smallest unit/i)
        expect(connectorExpertise.getNotes({ connectorName: 'google-sheets' })).toMatch(/letter/i)
        expect(connectorExpertise.getNotes({ connectorName: 'slack' })).toMatch(/channel id|Cxxxx|resolved/i)
    })

    it('returns undefined for an uncurated piece (generic-first: absence is fine)', () => {
        expect(connectorExpertise.getNotes({ connectorName: 'some-obscure-piece' })).toBeUndefined()
        expect(connectorExpertise.hasNotes({ connectorName: 'some-obscure-piece' })).toBe(false)
    })
})
