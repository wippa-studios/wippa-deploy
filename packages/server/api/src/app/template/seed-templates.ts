import { apId } from '@wippa/core-utils'
import { FlowVersionTemplate, TemplateStatus, TemplateType } from '@wippa/shared'
import { FastifyBaseLogger } from 'fastify'
import { repoFactory } from '../core/db/repo-factory'
import { templateValidator } from './template-validator'
import { TemplateEntity } from './template.entity'

const templateRepo = repoFactory(TemplateEntity)

type TemplateSeed = {
    name: string
    summary: string
    description: string
    tags: Array<{ title: string, color: string }>
    author: string
    categories: string[]
    pieces: string[]
    flows: FlowVersionTemplate[]
}

const XERO_PIECE = '@wippa/piece-xero'
const XERO_VERSION = '~0.6.8'
const SLACK_PIECE = '@wippa/piece-slack'
const SLACK_VERSION = '~0.17.0'
const SENDGRID_PIECE = '@wippa/piece-sendgrid'
const SENDGRID_VERSION = '~0.5.0'

function now(): string {
    return new Date().toISOString()
}

function stepName(): string {
    return `step_${Math.random().toString(36).substring(2, 8)}`
}

const TEMPLATES: TemplateSeed[] = [
    {
        name: 'New Xero Invoice → Email Reminder',
        summary: 'Automatically send an email reminder when a new invoice is created in Xero.',
        description: 'When a new sales invoice is created in Xero, this template instantly sends a reminder email via SendGrid to the customer. No manual follow-up needed.',
        tags: [{ title: 'Invoicing', color: '#14ae5c' }],
        author: 'Wippa',
        categories: ['Invoicing', 'Xero'],
        pieces: [XERO_PIECE, SENDGRID_PIECE],
        flows: [{
            displayName: 'New Xero Invoice → Email Reminder',
            trigger: {
                name: stepName(),
                valid: true,
                displayName: 'New Sales Invoice',
                type: 'PIECE_TRIGGER',
                lastUpdatedDate: now(),
                settings: {
                    pieceName: XERO_PIECE,
                    pieceVersion: XERO_VERSION,
                    triggerName: 'xero_new_sales_invoice',
                    input: {},
                    propertySettings: {},
                },
                nextAction: {
                    name: stepName(),
                    valid: true,
                    displayName: 'Send Email',
                    type: 'PIECE',
                    lastUpdatedDate: now(),
                    settings: {
                        pieceName: SENDGRID_PIECE,
                        pieceVersion: SENDGRID_VERSION,
                        actionName: 'send_email',
                        input: {
                            to: '{{trigger.contact_email}}',
                            subject: 'Invoice {{trigger.invoice_number}} is ready',
                            content: 'Hi {{trigger.contact_name}},\n\nYour invoice {{trigger.invoice_number}} for {{trigger.total}} is now available in Xero.\n\nThanks,\n{{trigger.contact_name}}\'s Team',
                        },
                        errorHandlingOptions: {},
                    },
                },
            },
            valid: true,
            schemaVersion: '22',
            connectionIds: [],
            agentIds: [],
            notes: [],
        }],
    },
    {
        name: 'Overdue Invoice → Follow-up Sequence',
        summary: 'Automatically remind customers when their invoice becomes overdue.',
        description: 'Monitors Xero for updated invoices marked as overdue and sends a friendly payment reminder email to the customer via SendGrid.',
        tags: [{ title: 'Collections', color: '#f94949' }],
        author: 'Wippa',
        categories: ['Invoicing', 'Xero'],
        pieces: [XERO_PIECE, SENDGRID_PIECE],
        flows: [{
            displayName: 'Overdue Invoice → Follow-up',
            trigger: {
                name: stepName(),
                valid: true,
                displayName: 'Updated Sales Invoice',
                type: 'PIECE_TRIGGER',
                lastUpdatedDate: now(),
                settings: {
                    pieceName: XERO_PIECE,
                    pieceVersion: XERO_VERSION,
                    triggerName: 'xero_updated_sales_invoice',
                    input: {},
                    propertySettings: {},
                },
                nextAction: {
                    name: stepName(),
                    valid: true,
                    displayName: 'Send Overdue Reminder',
                    type: 'PIECE',
                    lastUpdatedDate: now(),
                    settings: {
                        pieceName: SENDGRID_PIECE,
                        pieceVersion: SENDGRID_VERSION,
                        actionName: 'send_email',
                        input: {
                            to: '{{trigger.contact_email}}',
                            subject: 'Payment Reminder: Invoice {{trigger.invoice_number}} is overdue',
                            content: 'Hi {{trigger.contact_name}},\n\nThis is a friendly reminder that invoice {{trigger.invoice_number}} for {{trigger.total}} is now overdue.\n\nPlease arrange payment at your earliest convenience.\n\nThanks.',
                        },
                        errorHandlingOptions: {},
                    },
                },
            },
            valid: true,
            schemaVersion: '22',
            connectionIds: [],
            agentIds: [],
            notes: [],
        }],
    },
    {
        name: 'New Lead → Xero Contact + Slack Notification',
        summary: 'When a new lead comes in, create a Xero contact and notify your team in Slack.',
        description: 'Capture new leads from a form or CRM, automatically create them as a contact in Xero, and send a Slack message to your team so they can follow up immediately.',
        tags: [{ title: 'Sales', color: '#1890ff' }],
        author: 'Wippa',
        categories: ['Sales', 'Xero', 'CRM'],
        pieces: [XERO_PIECE, SLACK_PIECE],
        flows: [{
            displayName: 'New Lead → Xero Contact + Slack',
            trigger: {
                name: stepName(),
                valid: true,
                displayName: 'New Contact',
                type: 'PIECE_TRIGGER',
                lastUpdatedDate: now(),
                settings: {
                    pieceName: XERO_PIECE,
                    pieceVersion: XERO_VERSION,
                    triggerName: 'xero_new_contact',
                    input: {},
                    propertySettings: {},
                },
                nextAction: {
                    name: stepName(),
                    valid: true,
                    displayName: 'Send Slack Notification',
                    type: 'PIECE',
                    lastUpdatedDate: now(),
                    settings: {
                        pieceName: SLACK_PIECE,
                        pieceVersion: SLACK_VERSION,
                        actionName: 'send_channel_message',
                        input: {
                            text: 'New contact created in Xero: {{trigger.name}} ({{trigger.email}})',
                        },
                        errorHandlingOptions: {},
                    },
                },
            },
            valid: true,
            schemaVersion: '22',
            connectionIds: [],
            agentIds: [],
            notes: [],
        }],
    },
    {
        name: 'Xero Payment Received → Slack Alert',
        summary: 'Get a Slack notification when a payment is received in Xero.',
        description: 'Monitors Xero for new payments and sends your team a Slack message with the payment details. Stay on top of incoming payments without logging into Xero.',
        tags: [{ title: 'Payments', color: '#14ae5c' }],
        author: 'Wippa',
        categories: ['Payments', 'Xero'],
        pieces: [XERO_PIECE, SLACK_PIECE],
        flows: [{
            displayName: 'Payment Received → Slack Alert',
            trigger: {
                name: stepName(),
                valid: true,
                displayName: 'New Payment',
                type: 'PIECE_TRIGGER',
                lastUpdatedDate: now(),
                settings: {
                    pieceName: XERO_PIECE,
                    pieceVersion: XERO_VERSION,
                    triggerName: 'xero_new_payment',
                    input: {},
                    propertySettings: {},
                },
                nextAction: {
                    name: stepName(),
                    valid: true,
                    displayName: 'Send Payment Notification',
                    type: 'PIECE',
                    lastUpdatedDate: now(),
                    settings: {
                        pieceName: SLACK_PIECE,
                        pieceVersion: SLACK_VERSION,
                        actionName: 'send_channel_message',
                        input: {
                            text: 'Payment received: ${{trigger.amount}} from {{trigger.contact_name}} for invoice {{trigger.invoice_number}}',
                        },
                        errorHandlingOptions: {},
                    },
                },
            },
            valid: true,
            schemaVersion: '22',
            connectionIds: [],
            agentIds: [],
            notes: [],
        }],
    },
    {
        name: 'New Xero Bill → Email to Accounts',
        summary: 'When a new bill is added in Xero, email the details to your accounts team.',
        description: 'Automatically forward new Xero bill details to your accounts team via email so they can review and approve payments promptly.',
        tags: [{ title: 'Accounting', color: '#f78a3b' }],
        author: 'Wippa',
        categories: ['Accounting', 'Xero'],
        pieces: [XERO_PIECE, SENDGRID_PIECE],
        flows: [{
            displayName: 'New Bill → Email Notification',
            trigger: {
                name: stepName(),
                valid: true,
                displayName: 'New Bill',
                type: 'PIECE_TRIGGER',
                lastUpdatedDate: now(),
                settings: {
                    pieceName: XERO_PIECE,
                    pieceVersion: XERO_VERSION,
                    triggerName: 'xero_new_bill',
                    input: {},
                    propertySettings: {},
                },
                nextAction: {
                    name: stepName(),
                    valid: true,
                    displayName: 'Email Bill Details',
                    type: 'PIECE',
                    lastUpdatedDate: now(),
                    settings: {
                        pieceName: SENDGRID_PIECE,
                        pieceVersion: SENDGRID_VERSION,
                        actionName: 'send_email',
                        input: {
                            to: 'accounts@example.com',
                            subject: 'New Bill from {{trigger.contact_name}}',
                            content: 'A new bill has been created in Xero:\n\nSupplier: {{trigger.contact_name}}\nAmount: {{trigger.total}}\nDue Date: {{trigger.due_date}}\nReference: {{trigger.reference}}',
                        },
                        errorHandlingOptions: {},
                    },
                },
            },
            valid: true,
            schemaVersion: '22',
            connectionIds: [],
            agentIds: [],
            notes: [],
        }],
    },
    {
        name: 'Xero Invoice Status Change → Customer Alert',
        summary: 'Notify customers when their invoice status changes (paid, overdue, etc).',
        description: 'Watch for changes to Xero sales invoices and automatically email the customer when their invoice is paid, overdue, or otherwise updated.',
        tags: [{ title: 'Customer Service', color: '#6e41e2' }],
        author: 'Wippa',
        categories: ['Invoicing', 'Xero', 'Customer Service'],
        pieces: [XERO_PIECE, SENDGRID_PIECE],
        flows: [{
            displayName: 'Invoice Status Change → Customer Email',
            trigger: {
                name: stepName(),
                valid: true,
                displayName: 'Updated Sales Invoice',
                type: 'PIECE_TRIGGER',
                lastUpdatedDate: now(),
                settings: {
                    pieceName: XERO_PIECE,
                    pieceVersion: XERO_VERSION,
                    triggerName: 'xero_updated_sales_invoice',
                    input: {},
                    propertySettings: {},
                },
                nextAction: {
                    name: stepName(),
                    valid: true,
                    displayName: 'Email Status Update',
                    type: 'PIECE',
                    lastUpdatedDate: now(),
                    settings: {
                        pieceName: SENDGRID_PIECE,
                        pieceVersion: SENDGRID_VERSION,
                        actionName: 'send_email',
                        input: {
                            to: '{{trigger.contact_email}}',
                            subject: 'Invoice {{trigger.invoice_number}} status update',
                            content: 'Hi {{trigger.contact_name}},\n\nYour invoice {{trigger.invoice_number}} has been updated.\n\nCurrent status: {{trigger.status}}\nAmount: {{trigger.total}}\n\nThank you.',
                        },
                        errorHandlingOptions: {},
                    },
                },
            },
            valid: true,
            schemaVersion: '22',
            connectionIds: [],
            agentIds: [],
            notes: [],
        }],
    },
]

export async function seedTemplates(log: FastifyBaseLogger): Promise<void> {
    const existing = await templateRepo().find({ where: { type: TemplateType.OFFICIAL }, take: 1 })
    if (existing.length > 0) {
        log.info('Templates already seeded, skipping')
        return
    }

    log.info('Seeding Wippa templates...')
    for (const tpl of TEMPLATES) {
        const prepared = await templateValidator.validateAndPrepare({
            flows: tpl.flows,
            platformId: undefined,
            log,
        })
        const template = {
            id: apId(),
            name: tpl.name,
            type: TemplateType.OFFICIAL,
            summary: tpl.summary,
            description: tpl.description,
            tags: tpl.tags,
            blogUrl: null,
            metadata: null,
            author: tpl.author,
            categories: tpl.categories,
            pieces: prepared.pieces,
            flows: prepared.flows,
            status: TemplateStatus.PUBLISHED,
            platformId: undefined,
            created: now(),
            updated: now(),
        }
        await templateRepo().save(template)
        log.info(`  ✓ Seeded: ${tpl.name}`)
    }
    log.info(`Seeded ${TEMPLATES.length} templates`)
}
