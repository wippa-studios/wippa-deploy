import { t } from 'i18next';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Starter',
    price: '$15',
    description: 'For small businesses getting started with automation.',
    features: [
      '5,000 tasks per month',
      'Unlimited flows',
      'All 700+ integrations',
      'Xero, Slack, Gmail, and more',
      'Email support',
      'Australian data hosting',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$39',
    description: 'For growing teams that need more power.',
    features: [
      '25,000 tasks per month',
      'Unlimited flows',
      'All 700+ integrations',
      'Priority support',
      'Team collaboration',
      'Australian data hosting',
      '5-team members',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For organisations with custom requirements.',
    features: [
      'Unlimited tasks',
      'Dedicated support',
      'Custom SLAs',
      'On-premise deployment',
      'SSO/SAML',
      'Audit logs',
      'Unlimited team members',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const competitorComparison = [
  { feature: 'Tasks per month', zapier: '750', make: '1,000', wippa: '5,000' },
  { feature: 'Monthly price (AUD)', zapier: '$30', make: '$11', wippa: '$15' },
  { feature: 'Australian hosting', zapier: '❌', make: '❌', wippa: '✅' },
  { feature: 'Data sovereignty', zapier: '❌', make: '❌', wippa: '✅' },
  { feature: 'Xero integration', zapier: '✅', make: '✅', wippa: '✅' },
  {
    feature: 'Free trial',
    zapier: '14 days',
    make: '14 days',
    wippa: '14 days',
  },
];

export const PricingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">
              <span className="text-[#f5e6a3]">W</span>ippa
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/sign-in"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              {t('Sign in')}
            </Link>
            <Link to="/sign-up">
              <Button
                size="sm"
                className="bg-[#f5e6a3] text-black hover:bg-[#d4c48a]"
              >
                {t('Get Started')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 text-center px-6">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#f5e6a3]/20 bg-[#f5e6a3]/5 text-[#f5e6a3] text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#f5e6a3]" />
            Australian-owned, Australian-hosted
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">
            Simple pricing. <span className="text-[#f5e6a3]">No lock-in.</span>
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Pay less than half what Zapier charges, get 6x more tasks, and keep
            your data in Australia.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                'relative p-8 border bg-black/50 backdrop-blur',
                plan.popular
                  ? 'border-[#f5e6a3]/40 shadow-[0_0_40px_rgba(245,230,163,0.08)]'
                  : 'border-white/10',
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#f5e6a3] text-black text-xs font-semibold rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
              <p className="text-sm text-white/40 mb-6">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.price !== 'Custom' && (
                  <span className="text-white/40 ml-1">/month</span>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-white/70"
                  >
                    <Check className="w-4 h-4 text-[#f5e6a3] mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to={plan.name === 'Enterprise' ? '/contact' : '/sign-up'}
                className="block"
              >
                <Button
                  className={cn(
                    'w-full',
                    plan.popular
                      ? 'bg-[#f5e6a3] text-black hover:bg-[#d4c48a]'
                      : 'bg-white/5 text-white hover:bg-white/10 border border-white/10',
                  )}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">
            How we stack up
          </h2>
          <p className="text-white/40 text-center mb-10 max-w-xl mx-auto">
            The best value for Australian businesses, hands down.
          </p>
          <div className="border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="text-left p-4 font-medium">Feature</th>
                  <th className="p-4 font-medium text-center">Zapier</th>
                  <th className="p-4 font-medium text-center">Make</th>
                  <th className="p-4 font-medium text-center text-[#f5e6a3]">
                    Wippa
                  </th>
                </tr>
              </thead>
              <tbody>
                {competitorComparison.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={cn(
                      i < competitorComparison.length - 1 &&
                        'border-b border-white/5',
                    )}
                  >
                    <td className="p-4 text-sm text-white/70">{row.feature}</td>
                    <td className="p-4 text-sm text-center text-white/50">
                      {row.zapier}
                    </td>
                    <td className="p-4 text-sm text-center text-white/50">
                      {row.make}
                    </td>
                    <td className="p-4 text-sm text-center text-[#f5e6a3] font-medium">
                      {row.wippa}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Data Residency Badge */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center p-10 rounded-2xl border border-white/10 bg-white/[0.02]">
          <div className="w-12 h-12 rounded-full bg-[#f5e6a3]/10 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-6 h-6 text-[#f5e6a3]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">
            Your data stays in Australia
          </h3>
          <p className="text-white/50 max-w-xl mx-auto">
            Wippa runs entirely on OVHCloud Sydney. Your customer data,
            financial records, and business logic never leave Australia. We are
            not subject to the US Cloud Act, and our infrastructure is owned by
            a European Union parent company.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'What happens during the free trial?',
                a: 'You get full access to all features for 14 days. No credit card required. When the trial ends, choose a plan that fits your needs.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. Cancel from your billing settings and your subscription ends at the current billing period. No lock-in contracts.',
              },
              {
                q: 'Is my data really only stored in Australia?',
                a: 'Yes. All infrastructure runs on OVHCloud Sydney. We do not replicate data to any region outside Australia.',
              },
              {
                q: 'Do you offer GST invoices?',
                a: 'Yes. All Australian customers receive GST-compliant invoices with our ABN.',
              },
              {
                q: 'Can I self-host instead?',
                a: 'Yes. Wippa is built on open-source technology. Enterprise customers can deploy on their own infrastructure.',
              },
            ].map((faq) => (
              <div key={faq.q}>
                <h4 className="font-medium mb-1">{faq.q}</h4>
                <p className="text-sm text-white/50">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            © 2026 Wippa. Australian-owned. ABN — coming soon.
          </p>
          <div className="flex gap-6 text-sm text-white/30">
            <Link to="/privacy" className="hover:text-white/50">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-white/50">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
