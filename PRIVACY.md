# Wippa Privacy Policy

**Last updated: July 2026**

## Our commitment to data sovereignty

Wippa is an Australian-owned automation platform. We are committed to keeping your data within Australia and protecting it in accordance with Australian privacy law.

## 1. Who we are

Wippa (ABN — coming soon) operates the Wippa automation platform at app.wippa.com.au. We are a registered Australian business.

## 2. Data residency — where your data lives

All Wippa infrastructure is hosted on dedicated servers in **OVHCloud Sydney, Australia (APAC-Sydney)**. Specifically:

- **Application servers** — OVHCloud Sydney
- **Database servers** (PostgreSQL) — OVHCloud Sydney
- **Cache servers** (Redis) — OVHCloud Sydney
- **File storage** — OVHCloud Sydney

We do not replicate, cache, or store any customer data outside Australia. We are not subject to the United States Cloud Act (CLOUD Act) and do not have servers in any jurisdiction outside Australia.

## 3. What data we collect

### Account data
When you sign up for Wippa, we collect:
- Your name and email address
- Your business name
- A hashed password (we never store plain-text passwords)

### Usage data
- Flow definitions (your automation logic)
- Connection credentials (OAuth tokens, API keys — these are encrypted at rest)
- Execution logs and run history

### Payment data
We use **Stripe** for payment processing. Stripe handles all credit card data and bank details. We never store payment card information on our infrastructure. Stripe is certified as a PCI Level 1 Service Provider.

### Analytics
With your consent, we collect anonymised usage statistics to improve the product. You can disable this in your account settings.

## 4. How we use your data

- To operate and maintain the Wippa platform
- To process your payments via Stripe
- To send transactional emails (password resets, billing notices, flow failure alerts)
- To improve and debug the platform

We do **not**:
- Sell your data to third parties
- Use your data for advertising
- Share your data with US-based cloud providers
- Train AI models on your data

## 5. Data retention

- Account data: retained for the duration of your account plus 30 days after deletion
- Execution logs: retained for 90 days
- Flow definitions: retained until you delete them or close your account
- Backups: retained for 14 days

## 6. Your rights under Australian law

Under the Privacy Act 1988 (Cth) and the Australian Privacy Principles, you have the right to:
- Access your personal data
- Correct inaccurate data
- Request deletion of your data
- Object to processing of your data

To exercise any of these rights, contact us at privacy@wippa.com.au.

## 7. Data security

- All data in transit is encrypted via TLS 1.3
- All data at rest is encrypted using AES-256
- OAuth tokens and API keys are encrypted with per-tenant encryption keys
- Infrastructure is protected by a dedicated firewall and intrusion detection
- Access to production systems is restricted to authorised personnel only

## 8. Third-party subprocessors

| Subprocessor | Purpose | Location |
|---|---|---|
| OVHCloud | Infrastructure hosting | Sydney, Australia |
| Stripe | Payment processing | USA (PCI DSS compliant) |
| SendGrid | Transactional email delivery | USA (data minimised to email address only) |

## 9. International data transfers

The only data that leaves Australia is:
- **Payment processing** via Stripe (limited to payment amount, currency, and billing details)
- **Email delivery** via SendGrid (limited to recipient email address)

No customer automation data, flow definitions, or business logic ever leaves Australia.

## 10. Changes to this policy

We will notify you of any material changes via email and a notice on the platform. Continued use of Wippa after changes constitutes acceptance of the updated policy.

## 11. Contact

For privacy inquiries:

- **Email:** privacy@wippa.com.au
- **Mail:** [Address — coming soon]

If you are unsatisfied with our response, you may lodge a complaint with the Office of the Australian Information Commissioner (OAIC).
