import re
import os

INPUT_FILE = '/home/Joel/Desktop/templates.md'
OUTPUT_FILE = '/home/Joel/Desktop/wippa-deploy/packages/server/api/src/app/template/seed-more-templates.ts'

# Connector name map (from templates.md connector names to @wippa package names)
CONNECTOR_MAP = {
    'facebook ads': '@wippa/connector-facebook-leads',
    'hubspot': '@wippa/connector-hubspot',
    'calendly': '@wippa/connector-calendly',
    'pipedrive': '@wippa/connector-pipedrive',
    'typeform': '@wippa/connector-typeform',
    'salesforce': '@wippa/connector-salesforce',
    'gmail': '@wippa/connector-gmail',
    'slack': '@wippa/connector-slack',
    'google sheets': '@wippa/connector-google-sheets',
    'sheets': '@wippa/connector-google-sheets',
    'google drive': '@wippa/connector-google-drive',
    'drive': '@wippa/connector-google-drive',
    'google calendar': '@wippa/connector-google-calendar',
    'calendar': '@wippa/connector-google-calendar',
    'google forms': '@wippa/connector-google-forms',
    'google docs': '@wippa/connector-google-docs',
    'docs': '@wippa/connector-google-docs',
    'stripe': '@wippa/connector-stripe',
    'shopify': '@wippa/connector-shopify',
    'woocommerce': '@wippa/connector-woocommerce',
    'mailchimp': '@wippa/connector-mailchimp',
    'activecampaign': '@wippa/connector-activecampaign',
    'sendgrid': '@wippa/connector-sendgrid',
    'openai': '@wippa/connector-openai',
    'claude': '@wippa/connector-claude',
    'intercom': '@wippa/connector-intercom',
    'zendesk': '@wippa/connector-zendesk',
    'discord': '@wippa/connector-discord',
    'notion': '@wippa/connector-notion',
    'trello': '@wippa/connector-trello',
    'asana': '@wippa/connector-asana',
    'twilio': '@wippa/connector-twilio',
    'zoom': '@wippa/connector-zoom',
    'github': '@wippa/connector-github',
    'gitlab': '@wippa/connector-gitlab',
    'wordpress': '@wippa/connector-wordpress',
    'webflow': '@wippa/connector-webflow',
    'airtable': '@wippa/connector-airtable',
    'docusign': '@wippa/connector-docusign',
    'dropbox': '@wippa/connector-dropbox',
    'pandadoc': '@wippa/connector-pandadoc',
    'quickbooks': '@wippa/connector-quickbooks',
    'bamboohr': '@wippa/connector-bamboohr',
    'xero': '@wippa/connector-xero',
    'clearbit': '@wippa/connector-clearbit',
    'apollo.io': '@wippa/connector-apollo',
    'clockify': '@wippa/connector-clockify',
    'harvest': '@wippa/connector-harvest',
    'pagerduty': '@wippa/connector-pagerduty',
    'sentry': '@wippa/connector-sentry',
    'uptimerobot': '@wippa/connector-uptimerobot',
    'buffer': '@wippa/connector-buffer',
    'mailerlite': '@wippa/connector-mailerlite',
    'patreon': '@wippa/connector-patreon',
    'facebook': '@wippa/connector-facebook-pages',
    'instagram': '@wippa/connector-instagram-business',
    'linkedin': '@wippa/connector-linkedin',
    'twitter (x)': '@wippa/connector-twitter',
    'twitter': '@wippa/connector-twitter',
    'expensify': '@wippa/connector-expensify',
    'binance': '@wippa/connector-binance',
    'figma': '@wippa/connector-figma',
    'trustpilot': '@wippa/connector-trustpilot',
    'jira': '@wippa/connector-jira-cloud',
    'webhook': '@wippa/connector-webhook',
    'whisper': '@wippa/connector-openai',
    'dall-e': '@wippa/connector-openai',
    'ai': '@wippa/connector-openai',
    'email': '@wippa/connector-sendgrid',
}

# Additional aliases
ADDITIONAL_ALIASES = {
    'linkedin lead gen': '@wippa/connector-linkedin',
    'twitter mention': '@wippa/connector-twitter',
    'rss feed': '@wippa/connector-rss',
    'rss': '@wippa/connector-rss',
    'news rss': '@wippa/connector-rss',
    'upwork (rss)': '@wippa/connector-rss',
    'drive (pdf)': '@wippa/connector-google-drive',
    'zoom webinar': '@wippa/connector-zoom',
    'facebook ads': '@wippa/connector-facebook-leads',
    'tiktok ads': '@wippa/connector-tiktok-ads',
    'analytics': '@wippa/connector-analytics',
    '3pl webhook': '@wippa/connector-webhook',
    'shipstation': '@wippa/connector-shipstation',
    'gumroad': '@wippa/connector-gumroad',
    'printful': '@wippa/connector-printful',
    'recharge': '@wippa/connector-recharge',
    'klaviyo': '@wippa/connector-klaviyo',
    'amazon': '@wippa/connector-amazon',
    'eventbrite': '@wippa/connector-eventbrite',
    'youtube': '@wippa/connector-youtube',
    'riverside': '@wippa/connector-riverside',
    'spotify': '@wippa/connector-spotify',
    'vimeo': '@wippa/connector-vimeo',
    'canva': '@wippa/connector-canva',
    'pinterest': '@wippa/connector-pinterest',
    'reddit': '@wippa/connector-reddit',
    'twitch': '@wippa/connector-twitch',
    'ghost': '@wippa/connector-ghost',
    'circle': '@wippa/connector-circle',
    'gorgias': '@wippa/connector-gorgias',
    'docker hub': '@wippa/connector-docker',
    'workspace': '@wippa/connector-google-workspace',
    'toggl': '@wippa/connector-toggl',
    'proposify': '@wippa/connector-proposify',
    'frame.io': '@wippa/connector-frameio',
    'jotform': '@wippa/connector-jotform',
    'smartsheet': '@wippa/connector-smartsheet',
    'teams': '@wippa/connector-microsoft-teams',
    'excel online': '@wippa/connector-microsoft-excel',
    'postgresql': '@wippa/connector-postgresql',
    'todoist': '@wippa/connector-todoist',
    'clickup': '@wippa/connector-clickup',
    'evernote': '@wippa/connector-evernote',
    'monday': '@wippa/connector-monday',
    'microsoft to do': '@wippa/connector-microsoft-to-do',
    'tasks': '@wippa/connector-google-tasks',
    'teachable': '@wippa/connector-teachable',
    'kajabi': '@wippa/connector-kajabi',
    'thinkific': '@wippa/connector-thinkific',
    'slides': '@wippa/connector-google-slides',
    'google slides': '@wippa/connector-google-slides',
    'learndash': '@wippa/connector-learndash',
    'memberful': '@wippa/connector-memberful',
    'podia': '@wippa/connector-podia',
    'zillow email': '@wippa/connector-zillow',
    'crm': '@wippa/connector-hubspot',
    'maps': '@wippa/connector-google-maps',
    'ringcentral': '@wippa/connector-ringcentral',
    'companycam': '@wippa/connector-companycam',
    'weather api': '@wippa/connector-weather',
    'strava': '@wippa/connector-strava',
    'coinmarketcap': '@wippa/connector-coinmarketcap',
    'telegram': '@wippa/connector-telegram',
    'plaid': '@wippa/connector-plaid',
    'sql': '@wippa/connector-sql',
    'fireflies': '@wippa/connector-fireflies',
    'fireflies.ai': '@wippa/connector-fireflies',
}

CONNECTOR_MAP.update(ADDITIONAL_ALIASES)

HEADING_TO_CATEGORY = {
    'Sales & CRM': 'Sales & CRM',
    'E-Commerce, Billing & Logistics': 'E-Commerce',
    'Artificial Intelligence (AI) & Advanced Workflows': 'AI & Automation',
    'Marketing, Content & Social Media': 'Marketing & Content',
    'Customer Support & Community Management': 'Customer Support',
    'Engineering, IT & DevOps': 'Engineering & DevOps',
    'Finance, HR & Agency Operations': 'Finance & Accounting',
    'Data, Documents & Forms': 'Data & Documents',
    'Productivity & Task Management': 'Productivity',
    'Industry-Specific & Niche Ops': 'Industry-Specific',
}

CATEGORY_COLORS = {
    'Sales & CRM': '#1890ff',
    'E-Commerce': '#14ae5c',
    'AI & Automation': '#a855f7',
    'Marketing & Content': '#f78a3b',
    'Customer Support': '#6e41e2',
    'Engineering & DevOps': '#0ea5e9',
    'Finance & Accounting': '#14ae5c',
    'Data & Documents': '#6366f1',
    'Productivity': '#eab308',
    'Industry-Specific': '#ec4899',
}

# Common trigger names by connector key (lowercase)
TRIGGER_NAMES = {
    '@wippa/connector-facebook-leads': 'new_lead',
    '@wippa/connector-hubspot': 'new_contact',
    '@wippa/connector-calendly': 'new_event',
    '@wippa/connector-pipedrive': 'new_deal',
    '@wippa/connector-typeform': 'new_submission',
    '@wippa/connector-salesforce': 'new_lead',
    '@wippa/connector-gmail': 'new_email',
    '@wippa/connector-slack': 'new_message',
    '@wippa/connector-google-sheets': 'new_row',
    '@wippa/connector-google-drive': 'new_file',
    '@wippa/connector-google-calendar': 'new_event',
    '@wippa/connector-google-forms': 'new_submission',
    '@wippa/connector-google-docs': 'new_document',
    '@wippa/connector-stripe': 'new_payment',
    '@wippa/connector-shopify': 'new_order',
    '@wippa/connector-woocommerce': 'new_order',
    '@wippa/connector-mailchimp': 'new_subscriber',
    '@wippa/connector-activecampaign': 'new_contact',
    '@wippa/connector-sendgrid': 'new_event',
    '@wippa/connector-openai': 'new_completion',
    '@wippa/connector-claude': 'new_completion',
    '@wippa/connector-intercom': 'new_conversation',
    '@wippa/connector-zendesk': 'new_ticket',
    '@wippa/connector-discord': 'new_message',
    '@wippa/connector-notion': 'new_page',
    '@wippa/connector-trello': 'new_card',
    '@wippa/connector-asana': 'new_task',
    '@wippa/connector-twilio': 'new_message',
    '@wippa/connector-zoom': 'new_recording',
    '@wippa/connector-github': 'new_issue',
    '@wippa/connector-gitlab': 'new_merge_request',
    '@wippa/connector-wordpress': 'new_post',
    '@wippa/connector-webflow': 'new_form_submission',
    '@wippa/connector-airtable': 'new_record',
    '@wippa/connector-docusign': 'new_envelope',
    '@wippa/connector-dropbox': 'new_file',
    '@wippa/connector-pandadoc': 'new_document',
    '@wippa/connector-quickbooks': 'new_invoice',
    '@wippa/connector-bamboohr': 'new_employee',
    '@wippa/connector-xero': 'new_invoice',
    '@wippa/connector-clearbit': 'new_enrichment',
    '@wippa/connector-apollo': 'new_contact',
    '@wippa/connector-clockify': 'new_time_entry',
    '@wippa/connector-harvest': 'new_time_entry',
    '@wippa/connector-pagerduty': 'new_incident',
    '@wippa/connector-sentry': 'new_error',
    '@wippa/connector-uptimerobot': 'new_alert',
    '@wippa/connector-buffer': 'new_post',
    '@wippa/connector-mailerlite': 'new_subscriber',
    '@wippa/connector-patreon': 'new_pledge',
    '@wippa/connector-facebook-pages': 'new_post',
    '@wippa/connector-instagram-business': 'new_photo',
    '@wippa/connector-linkedin': 'new_lead',
    '@wippa/connector-twitter': 'new_tweet',
    '@wippa/connector-expensify': 'new_expense',
    '@wippa/connector-binance': 'new_order',
    '@wippa/connector-figma': 'new_comment',
    '@wippa/connector-trustpilot': 'new_review',
    '@wippa/connector-jira-cloud': 'new_issue',
    '@wippa/connector-webhook': 'catch_webhook',
}

# Common action names by connector key (lowercase)
ACTION_NAMES = {
    '@wippa/connector-hubspot': 'create_or_update_contact',
    '@wippa/connector-pipedrive': 'create_deal',
    '@wippa/connector-salesforce': 'create_lead',
    '@wippa/connector-gmail': 'send_email',
    '@wippa/connector-slack': 'send_channel_message',
    '@wippa/connector-google-sheets': 'add_row',
    '@wippa/connector-google-drive': 'upload_file',
    '@wippa/connector-google-calendar': 'create_event',
    '@wippa/connector-google-docs': 'create_document',
    '@wippa/connector-stripe': 'create_payment',
    '@wippa/connector-shopify': 'create_product',
    '@wippa/connector-woocommerce': 'create_order',
    '@wippa/connector-mailchimp': 'add_subscriber',
    '@wippa/connector-activecampaign': 'add_contact',
    '@wippa/connector-sendgrid': 'send_email',
    '@wippa/connector-openai': 'generate_text',
    '@wippa/connector-claude': 'generate_text',
    '@wippa/connector-intercom': 'create_conversation',
    '@wippa/connector-zendesk': 'create_ticket',
    '@wippa/connector-discord': 'send_message',
    '@wippa/connector-notion': 'create_page',
    '@wippa/connector-trello': 'create_card',
    '@wippa/connector-asana': 'create_task',
    '@wippa/connector-twilio': 'send_sms',
    '@wippa/connector-zoom': 'create_meeting',
    '@wippa/connector-github': 'create_issue',
    '@wippa/connector-gitlab': 'create_merge_request',
    '@wippa/connector-wordpress': 'create_post',
    '@wippa/connector-webflow': 'create_item',
    '@wippa/connector-airtable': 'add_record',
    '@wippa/connector-docusign': 'send_envelope',
    '@wippa/connector-dropbox': 'upload_file',
    '@wippa/connector-pandadoc': 'create_document',
    '@wippa/connector-quickbooks': 'create_invoice',
    '@wippa/connector-bamboohr': 'add_employee',
    '@wippa/connector-xero': 'create_invoice',
    '@wippa/connector-clearbit': 'enrich_company',
    '@wippa/connector-apollo': 'add_contact',
    '@wippa/connector-pagerduty': 'create_incident',
    '@wippa/connector-sentry': 'create_issue',
    '@wippa/connector-uptimerobot': 'create_alert',
    '@wippa/connector-buffer': 'create_post',
    '@wippa/connector-mailerlite': 'add_subscriber',
    '@wippa/connector-patreon': 'create_pledge',
    '@wippa/connector-facebook-pages': 'create_post',
    '@wippa/connector-instagram-business': 'create_photo',
    '@wippa/connector-linkedin': 'create_post',
    '@wippa/connector-twitter': 'create_tweet',
    '@wippa/connector-figma': 'create_comment',
    '@wippa/connector-trustpilot': 'create_review',
    '@wippa/connector-jira-cloud': 'create_issue',
    '@wippa/connector-webhook': 'return_response',
    '@wippa/connector-google-forms': 'add_submission',
}

SIMPLE_ACTION_TRIGGER_NAMES = {
    '@wippa/connector-facebook-leads': ('new_lead', 'create_lead'),
    '@wippa/connector-hubspot': ('new_contact', 'create_or_update_contact'),
    '@wippa/connector-calendly': ('new_event', 'create_event'),
    '@wippa/connector-pipedrive': ('new_deal', 'create_deal'),
    '@wippa/connector-typeform': ('new_submission', 'create_submission'),
    '@wippa/connector-salesforce': ('new_lead', 'create_lead'),
    '@wippa/connector-gmail': ('new_email', 'send_email'),
    '@wippa/connector-slack': ('new_message', 'send_channel_message'),
    '@wippa/connector-google-sheets': ('new_row', 'add_row'),
    '@wippa/connector-google-drive': ('new_file', 'upload_file'),
    '@wippa/connector-google-calendar': ('new_event', 'create_event'),
    '@wippa/connector-google-forms': ('new_submission', 'add_submission'),
    '@wippa/connector-google-docs': ('new_document', 'create_document'),
    '@wippa/connector-stripe': ('new_payment', 'create_payment'),
    '@wippa/connector-shopify': ('new_order', 'create_order'),
    '@wippa/connector-woocommerce': ('new_order', 'create_order'),
    '@wippa/connector-mailchimp': ('new_subscriber', 'add_subscriber'),
    '@wippa/connector-activecampaign': ('new_contact', 'add_contact'),
    '@wippa/connector-sendgrid': ('new_event', 'send_email'),
    '@wippa/connector-openai': ('new_completion', 'generate_text'),
    '@wippa/connector-claude': ('new_completion', 'generate_text'),
    '@wippa/connector-intercom': ('new_conversation', 'create_conversation'),
    '@wippa/connector-zendesk': ('new_ticket', 'create_ticket'),
    '@wippa/connector-discord': ('new_message', 'send_message'),
    '@wippa/connector-notion': ('new_page', 'create_page'),
    '@wippa/connector-trello': ('new_card', 'create_card'),
    '@wippa/connector-asana': ('new_task', 'create_task'),
    '@wippa/connector-twilio': ('new_message', 'send_sms'),
    '@wippa/connector-zoom': ('new_recording', 'create_meeting'),
    '@wippa/connector-github': ('new_issue', 'create_issue'),
    '@wippa/connector-gitlab': ('new_merge_request', 'create_merge_request'),
    '@wippa/connector-wordpress': ('new_post', 'create_post'),
    '@wippa/connector-webflow': ('new_form_submission', 'create_item'),
    '@wippa/connector-airtable': ('new_record', 'add_record'),
    '@wippa/connector-docusign': ('new_envelope', 'send_envelope'),
    '@wippa/connector-dropbox': ('new_file', 'upload_file'),
    '@wippa/connector-pandadoc': ('new_document', 'create_document'),
    '@wippa/connector-quickbooks': ('new_invoice', 'create_invoice'),
    '@wippa/connector-bamboohr': ('new_employee', 'add_employee'),
    '@wippa/connector-xero': ('new_invoice', 'create_invoice'),
    '@wippa/connector-clearbit': ('new_enrichment', 'enrich_company'),
    '@wippa/connector-apollo': ('new_contact', 'add_contact'),
    '@wippa/connector-clockify': ('new_time_entry', 'create_time_entry'),
    '@wippa/connector-harvest': ('new_time_entry', 'create_time_entry'),
    '@wippa/connector-pagerduty': ('new_incident', 'create_incident'),
    '@wippa/connector-sentry': ('new_error', 'create_issue'),
    '@wippa/connector-uptimerobot': ('new_alert', 'create_alert'),
    '@wippa/connector-buffer': ('new_post', 'create_post'),
    '@wippa/connector-mailerlite': ('new_subscriber', 'add_subscriber'),
    '@wippa/connector-patreon': ('new_pledge', 'create_pledge'),
    '@wippa/connector-facebook-pages': ('new_post', 'create_post'),
    '@wippa/connector-instagram-business': ('new_photo', 'create_photo'),
    '@wippa/connector-linkedin': ('new_lead', 'create_post'),
    '@wippa/connector-twitter': ('new_tweet', 'create_tweet'),
    '@wippa/connector-expensify': ('new_expense', 'create_expense'),
    '@wippa/connector-binance': ('new_order', 'create_order'),
    '@wippa/connector-figma': ('new_comment', 'create_comment'),
    '@wippa/connector-trustpilot': ('new_review', 'create_review'),
    '@wippa/connector-jira-cloud': ('new_issue', 'create_issue'),
    '@wippa/connector-webhook': ('catch_webhook', 'return_response'),
}

# Connector display names for the trigger displayName
TRIGGER_DISPLAY_NAMES = {
    '@wippa/connector-facebook-leads': 'New Facebook Lead',
    '@wippa/connector-hubspot': 'New Contact',
    '@wippa/connector-calendly': 'New Booking',
    '@wippa/connector-pipedrive': 'New Deal',
    '@wippa/connector-typeform': 'New Submission',
    '@wippa/connector-salesforce': 'New Lead',
    '@wippa/connector-gmail': 'New Email',
    '@wippa/connector-slack': 'New Message',
    '@wippa/connector-google-sheets': 'New Row',
    '@wippa/connector-google-drive': 'New File',
    '@wippa/connector-google-calendar': 'New Event',
    '@wippa/connector-google-forms': 'New Submission',
    '@wippa/connector-google-docs': 'New Document',
    '@wippa/connector-stripe': 'New Payment',
    '@wippa/connector-shopify': 'New Order',
    '@wippa/connector-woocommerce': 'New Order',
    '@wippa/connector-mailchimp': 'New Subscriber',
    '@wippa/connector-activecampaign': 'New Contact',
    '@wippa/connector-sendgrid': 'New Event',
    '@wippa/connector-openai': 'New Completion',
    '@wippa/connector-claude': 'New Completion',
    '@wippa/connector-intercom': 'New Conversation',
    '@wippa/connector-zendesk': 'New Ticket',
    '@wippa/connector-discord': 'New Message',
    '@wippa/connector-notion': 'New Page',
    '@wippa/connector-trello': 'New Card',
    '@wippa/connector-asana': 'New Task',
    '@wippa/connector-twilio': 'New Message',
    '@wippa/connector-zoom': 'New Recording',
    '@wippa/connector-github': 'New Issue',
    '@wippa/connector-gitlab': 'New Merge Request',
    '@wippa/connector-wordpress': 'New Post',
    '@wippa/connector-webflow': 'New Form Submission',
    '@wippa/connector-airtable': 'New Record',
    '@wippa/connector-docusign': 'New Envelope',
    '@wippa/connector-dropbox': 'New File',
    '@wippa/connector-pandadoc': 'New Document',
    '@wippa/connector-quickbooks': 'New Invoice',
    '@wippa/connector-bamboohr': 'New Employee',
    '@wippa/connector-xero': 'New Invoice',
    '@wippa/connector-clearbit': 'New Enrichment',
    '@wippa/connector-apollo': 'New Contact',
    '@wippa/connector-clockify': 'New Time Entry',
    '@wippa/connector-harvest': 'New Time Entry',
    '@wippa/connector-pagerduty': 'New Incident',
    '@wippa/connector-sentry': 'New Error',
    '@wippa/connector-uptimerobot': 'New Alert',
    '@wippa/connector-buffer': 'New Post',
    '@wippa/connector-mailerlite': 'New Subscriber',
    '@wippa/connector-patreon': 'New Pledge',
    '@wippa/connector-facebook-pages': 'New Post',
    '@wippa/connector-instagram-business': 'New Photo',
    '@wippa/connector-linkedin': 'New Lead',
    '@wippa/connector-twitter': 'New Tweet',
    '@wippa/connector-expensify': 'New Expense',
    '@wippa/connector-binance': 'New Order',
    '@wippa/connector-figma': 'New Comment',
    '@wippa/connector-trustpilot': 'New Review',
    '@wippa/connector-jira-cloud': 'New Issue',
    '@wippa/connector-webhook': 'Catch Webhook',
}

ACTION_DISPLAY_NAMES = {
    '@wippa/connector-hubspot': 'Create or Update Contact',
    '@wippa/connector-pipedrive': 'Create Deal',
    '@wippa/connector-salesforce': 'Create Lead',
    '@wippa/connector-gmail': 'Send Email',
    '@wippa/connector-slack': 'Send Channel Message',
    '@wippa/connector-google-sheets': 'Add Row',
    '@wippa/connector-google-drive': 'Upload File',
    '@wippa/connector-google-calendar': 'Create Event',
    '@wippa/connector-google-docs': 'Create Document',
    '@wippa/connector-stripe': 'Create Payment',
    '@wippa/connector-shopify': 'Create Product',
    '@wippa/connector-woocommerce': 'Create Order',
    '@wippa/connector-mailchimp': 'Add Subscriber',
    '@wippa/connector-activecampaign': 'Add Contact',
    '@wippa/connector-sendgrid': 'Send Email',
    '@wippa/connector-openai': 'Generate Text',
    '@wippa/connector-claude': 'Generate Text',
    '@wippa/connector-intercom': 'Create Conversation',
    '@wippa/connector-zendesk': 'Create Ticket',
    '@wippa/connector-discord': 'Send Message',
    '@wippa/connector-notion': 'Create Page',
    '@wippa/connector-trello': 'Create Card',
    '@wippa/connector-asana': 'Create Task',
    '@wippa/connector-twilio': 'Send SMS',
    '@wippa/connector-zoom': 'Create Meeting',
    '@wippa/connector-github': 'Create Issue',
    '@wippa/connector-gitlab': 'Create Merge Request',
    '@wippa/connector-wordpress': 'Create Post',
    '@wippa/connector-webflow': 'Create Item',
    '@wippa/connector-airtable': 'Add Record',
    '@wippa/connector-docusign': 'Send Envelope',
    '@wippa/connector-dropbox': 'Upload File',
    '@wippa/connector-pandadoc': 'Create Document',
    '@wippa/connector-quickbooks': 'Create Invoice',
    '@wippa/connector-bamboohr': 'Add Employee',
    '@wippa/connector-xero': 'Create Invoice',
    '@wippa/connector-clearbit': 'Enrich Company',
    '@wippa/connector-apollo': 'Add Contact',
    '@wippa/connector-pagerduty': 'Create Incident',
    '@wippa/connector-sentry': 'Create Issue',
    '@wippa/connector-uptimerobot': 'Create Alert',
    '@wippa/connector-buffer': 'Create Post',
    '@wippa/connector-mailerlite': 'Add Subscriber',
    '@wippa/connector-patreon': 'Create Pledge',
    '@wippa/connector-facebook-pages': 'Create Post',
    '@wippa/connector-instagram-business': 'Create Photo',
    '@wippa/connector-linkedin': 'Create Post',
    '@wippa/connector-twitter': 'Create Tweet',
    '@wippa/connector-figma': 'Create Comment',
    '@wippa/connector-trustpilot': 'Create Review',
    '@wippa/connector-jira-cloud': 'Create Issue',
    '@wippa/connector-webhook': 'Return Response',
}

DEFAULT_CONNECTOR_VERSION = '~0.5.0'


def normalize_connector_name(name):
    name = name.strip().strip('*').strip()
    name_lower = name.lower()

    # Special normalization for known patterns
    name_lower = name_lower.replace('lead gen', 'lead gen')

    return name_lower


def lookup_connector(name):
    key = normalize_connector_name(name)
    if key in CONNECTOR_MAP:
        return CONNECTOR_MAP[key]
    return None


def lookup_trigger_name(connector_pkg):
    if connector_pkg in SIMPLE_ACTION_TRIGGER_NAMES:
        return SIMPLE_ACTION_TRIGGER_NAMES[connector_pkg][0]
    base = connector_pkg.replace('@wippa/connector-', '')
    return f'new_{base}'


def lookup_action_name(connector_pkg):
    if connector_pkg in SIMPLE_ACTION_TRIGGER_NAMES:
        return SIMPLE_ACTION_TRIGGER_NAMES[connector_pkg][1]
    base = connector_pkg.replace('@wippa/connector-', '')
    return f'create_{base}'


def lookup_trigger_display(connector_pkg):
    if connector_pkg in TRIGGER_DISPLAY_NAMES:
        return TRIGGER_DISPLAY_NAMES[connector_pkg]
    base = connector_pkg.replace('@wippa/connector-', '')
    return f'New {base.replace("-", " ").title()}'


def lookup_action_display(connector_pkg):
    if connector_pkg in ACTION_DISPLAY_NAMES:
        return ACTION_DISPLAY_NAMES[connector_pkg]
    base = connector_pkg.replace('@wippa/connector-', '')
    words = base.replace('-', ' ').title()
    return words


def generate_action_block(action_pkg, step_name_value):
    action_name = lookup_action_name(action_pkg)
    action_display = lookup_action_display(action_pkg)
    return f'''                    name: stepName(),
                    valid: true,
                    displayName: '{action_display}',
                    type: 'PIECE',
                    lastUpdatedDate: now(),
                    settings: {{
                        connectorName: '{action_pkg}',
                        connectorVersion: '{DEFAULT_CONNECTOR_VERSION}',
                        actionName: '{action_name}',
                        input: {{}},
                        errorHandlingOptions: {{}},
                    }},'''


def generate_trigger_block(trigger_pkg, action_pkg, display_name):
    trigger_name = lookup_trigger_name(trigger_pkg)
    trigger_display = lookup_trigger_display(trigger_pkg)

    input_str = ''
    if trigger_pkg == '@wippa/connector-webhook':
        input_str = 'authType: \'none\''

    lines = f'''            trigger: {{
                name: stepName(),
                valid: true,
                displayName: '{trigger_display}',
                type: FlowTriggerType.PIECE,
                lastUpdatedDate: now(),
                settings: {{
                    connectorName: '{trigger_pkg}',
                    connectorVersion: '{DEFAULT_CONNECTOR_VERSION}',
                    triggerName: '{trigger_name}',
                    input: {{{input_str}}}{',' if input_str else ''}
                }},'''

    if action_pkg:
        lines += f'''
                nextAction: {{
{generate_action_block(action_pkg, '')}
                }},'''

    lines += '''
            },'''
    return lines


def parse_templates():
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    current_category = None
    templates = []
    errors = []

    lines = content.split('\n')
    for line in lines:
        # Match: ### **<emoji> <number>\. <category>**
        cat_match = re.match(r'^###\s+\*{1,2}\s*\S*\s*(\d+)\\\.\s+(.+?)\s*\*{1,2}\s*$', line.strip())
        if cat_match:
            current_category = cat_match.group(2).strip()
            continue

        stripped = line.strip()
        if not stripped.startswith('|') or stripped.startswith('| :---') or stripped.startswith('|---') or stripped.startswith('| Integration Path'):
            continue

        parts = stripped.split('|')
        if len(parts) < 4:
            continue

        path_part = parts[1].strip()
        desc_part = parts[2].strip()

        if not path_part or not desc_part:
            continue

        # Skip separator/header rows
        if path_part.startswith(':') or path_part.startswith('-'):
            continue
        if 'Integration Path' in path_part or 'Use Case / Description' in path_part:
            continue

        # Parse connector names: "**ConnectorA** → **ConnectorB**" or "**ConnectorA** → **ConnectorB** → **ConnectorC**"
        connector_matches = re.findall(r'\*\*(.*?)\*\*', path_part)
        if not connector_matches:
            continue

        connectors = [c.strip() for c in connector_matches]

        # Map connectors to packages
        pkg_list = []
        for c in connectors:
            pkg = lookup_connector(c)
            if pkg:
                pkg_list.append(pkg)
            else:
                errors.append(f"Unknown connector '{c}' in row: {path_part}")

        if len(pkg_list) < 1:
            errors.append(f"No mapped connectors for: {path_part}")
            continue

        template_name = path_part.replace('**', '').strip()

        # Generate summary and description
        summary = desc_part.rstrip('.')
        description = desc_part.rstrip('.')

        # Category and tag
        cat_name = HEADING_TO_CATEGORY.get(current_category, current_category or 'Uncategorized')

        # Pieces: list of unique packages
        pieces = list(dict.fromkeys(pkg_list))  # deduplicate preserving order

        # Trigger = first connector, Action = last connector (if different)
        trigger_pkg = pkg_list[0]
        action_pkg = pkg_list[-1] if len(pkg_list) > 1 else None

        # If trigger and action are same but there's a middle connector, use the middle
        if action_pkg == trigger_pkg and len(pkg_list) > 2:
            action_pkg = pkg_list[1]

        # Don't create self-loop triggers (e.g. Gmail → OpenAI → Gmail, the action should be OpenAI)
        if len(pkg_list) >= 2 and pkg_list[0] == pkg_list[-1]:
            action_pkg = pkg_list[1]

        templates.append({
            'name': template_name,
            'summary': summary,
            'description': description,
            'category': cat_name,
            'trigger_pkg': trigger_pkg,
            'action_pkg': action_pkg,
            'pieces': pieces,
            'raw_path': path_part,
        })

    return templates, errors


def escape_ts(s):
    s = s.replace('\\', '\\\\')
    s = s.replace("'", "\\'")
    s = s.replace('`', '\\`')
    s = s.replace('${', '\\${')
    return s


def generate_ts(templates, errors):
    lines = []
    lines.append("import { FlowVersionTemplate, TemplateStatus, TemplateType } from '@wippa/shared'")
    lines.append("import { FlowTriggerType } from '@wippa/core-execution'")
    lines.append("import { FastifyBaseLogger } from 'fastify'")
    lines.append("import { repoFactory } from '../core/db/repo-factory'")
    lines.append("import { templateValidator } from './template-validator'")
    lines.append("import { TemplateEntity } from './template.entity'")
    lines.append("import { apId } from '@wippa/core-utils'")
    lines.append("")
    lines.append("const templateRepo = repoFactory(TemplateEntity)")
    lines.append("")
    lines.append("type TemplateSeed = {")
    lines.append("    name: string")
    lines.append("    summary: string")
    lines.append("    description: string")
    lines.append("    tags: Array<{ title: string; color: string }>")
    lines.append("    author: string")
    lines.append("    categories: string[]")
    lines.append("    pieces: string[]")
    lines.append("    flows: FlowVersionTemplate[]")
    lines.append("}")
    lines.append("")
    lines.append("function now(): string {")
    lines.append("    return new Date().toISOString()")
    lines.append("}")
    lines.append("")
    lines.append("function stepName(): string {")
    lines.append("    return `step_${Math.random().toString(36).substring(2, 8)}`")
    lines.append("}")
    lines.append("")

    lines.append(f"const MORE_TEMPLATES: TemplateSeed[] = [")

    for i, tpl in enumerate(templates):
        cat_color = CATEGORY_COLORS.get(tpl['category'], '#1890ff')

        connector_const_names = []
        for j, pkg in enumerate(tpl['pieces']):
            const_name = f"_{pkg.replace('@wippa/connector-', '').replace('-', '_').upper()}_PIECE"
            const_name = re.sub(r'[^A-Z_]', '', const_name)
            if not const_name:
                const_name = f'_PIECE_{j}'
            connector_const_names.append(const_name)

        trigger_pkg = tpl['trigger_pkg']
        action_pkg = tpl['action_pkg']

        trigger_name = lookup_trigger_name(trigger_pkg)
        trigger_display = lookup_trigger_display(trigger_pkg)

        trigger_block = f'''            trigger: {{
                name: stepName(),
                valid: true,
                displayName: '{trigger_display}',
                type: FlowTriggerType.PIECE,
                lastUpdatedDate: now(),
                settings: {{
                    connectorName: '{trigger_pkg}',
                    connectorVersion: '{DEFAULT_CONNECTOR_VERSION}',
                    triggerName: '{trigger_name}',
                    input: {{}}'''
        if trigger_pkg == '@wippa/connector-webhook':
            trigger_block = f'''            trigger: {{
                name: stepName(),
                valid: true,
                displayName: 'Catch Webhook',
                type: FlowTriggerType.PIECE,
                lastUpdatedDate: now(),
                settings: {{
                    connectorName: '{trigger_pkg}',
                    connectorVersion: '{DEFAULT_CONNECTOR_VERSION}',
                    triggerName: 'catch_webhook',
                    input: {{ authType: 'none' }}'''

        if action_pkg:
            action_name = lookup_action_name(action_pkg)
            action_display = lookup_action_display(action_pkg)
            if action_pkg == '@wippa/connector-webhook':
                action_block = f'''                nextAction: {{
                    name: stepName(),
                    valid: true,
                    displayName: 'Return Response',
                    type: 'PIECE',
                    lastUpdatedDate: now(),
                    settings: {{
                        connectorName: '{action_pkg}',
                        connectorVersion: '{DEFAULT_CONNECTOR_VERSION}',
                        actionName: 'return_response',
                        input: {{}},
                        errorHandlingOptions: {{}},
                    }},
                }},'''
            else:
                action_block = f'''                nextAction: {{
                    name: stepName(),
                    valid: true,
                    displayName: '{action_display}',
                    type: 'PIECE',
                    lastUpdatedDate: now(),
                    settings: {{
                        connectorName: '{action_pkg}',
                        connectorVersion: '{DEFAULT_CONNECTOR_VERSION}',
                        actionName: '{action_name}',
                        input: {{}},
                        errorHandlingOptions: {{}},
                    }},
                }},'''
        else:
            action_block = ''

        trigger_block += ',\n                },'
        if action_block:
            trigger_block += f'\n{action_block}'
        trigger_block += '\n            },'

        escd_summary = escape_ts(tpl['summary'])
        escd_desc = escape_ts(tpl['description'])
        escd_name = escape_ts(tpl['name'])

        pieces_str = ', '.join(f"'{p}'" for p in tpl['pieces'])

        lines.append('    {')
        lines.append(f"        name: '{escd_name}',")
        lines.append(f"        summary: '{escd_summary}',")
        lines.append(f"        description: '{escd_desc}',")
        lines.append(f"        tags: [{{ title: '{tpl['category']}', color: '{cat_color}' }}],")
        lines.append("        author: 'Wippa',")
        lines.append(f"        categories: ['{tpl['category']}'],")
        lines.append(f"        pieces: [{pieces_str}],")
        lines.append(f"        flows: [{{")
        lines.append(f"            displayName: '{escd_name}',")
        lines.append(trigger_block)
        lines.append("            valid: true,")
        lines.append("            schemaVersion: '22',")
        lines.append("        }],")
        if i < len(templates) - 1:
            lines.append("    },")
        else:
            lines.append("    },")

    lines.append("]")
    lines.append("")

    lines.append("export async function seedMoreTemplates(log: FastifyBaseLogger): Promise<void> {")
    lines.append("    log.info('Seeding additional Wippa templates...')")
    lines.append("    let seededCount = 0")
    lines.append("    for (const tpl of MORE_TEMPLATES) {")
    lines.append("        const existing = await templateRepo().findOne({ where: { name: tpl.name, type: TemplateType.OFFICIAL } })")
    lines.append("        if (existing) {")
    lines.append("            log.debug(`Skipping already-seeded: ${tpl.name}`)")
    lines.append("            continue")
    lines.append("        }")
    lines.append("        const prepared = await templateValidator.validateAndPrepare({")
    lines.append("            flows: tpl.flows,")
    lines.append("            platformId: undefined,")
    lines.append("            log,")
    lines.append("        })")
    lines.append("        const template = {")
    lines.append("            id: apId(),")
    lines.append("            name: tpl.name,")
    lines.append("            type: TemplateType.OFFICIAL,")
    lines.append("            summary: tpl.summary,")
    lines.append("            description: tpl.description,")
    lines.append("            tags: tpl.tags,")
    lines.append("            blogUrl: null,")
    lines.append("            metadata: null,")
    lines.append("            author: tpl.author,")
    lines.append("            categories: tpl.categories,")
    lines.append("            pieces: prepared.pieces,")
    lines.append("            flows: prepared.flows,")
    lines.append("            status: TemplateStatus.PUBLISHED,")
    lines.append("            platformId: undefined,")
    lines.append("            created: now(),")
    lines.append("            updated: now(),")
    lines.append("        }")
    lines.append("        await templateRepo().save(template)")
    lines.append("        log.info(`  ✓ Seeded: ${tpl.name}`)")
    lines.append("        seededCount++")
    lines.append("    }")
    lines.append("    log.info(`Seeded ${seededCount} additional templates`)")
    lines.append("}")
    lines.append("")

    return '\n'.join(lines)


def main():
    print("Parsing templates.md...")
    templates, errors = parse_templates()

    print(f"Found {len(templates)} template rows")
    if errors:
        print("\nWarnings/Errors:")
        for e in errors:
            print(f"  - {e}")

    print(f"\nGenerating {OUTPUT_FILE}...")
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    ts_content = generate_ts(templates, errors)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(ts_content)

    print(f"Done! Generated {len(templates)} templates.")
    return len(templates), errors


if __name__ == '__main__':
    main()
