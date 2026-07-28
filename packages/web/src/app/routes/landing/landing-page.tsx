import { t } from 'i18next';
import { Shield, Zap, Globe2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { flagsHooks } from '@/hooks/flags-hooks';
import { cn } from '@/lib/utils';

const WippaWordmark = () => (
  <span className="font-display text-2xl font-extrabold tracking-tight text-white">
    <span className="text-[#d4c48a]">W</span>ippa
  </span>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const branding = flagsHooks.useWebsiteBranding();

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-[#333]">
        <div className="max-w-[1160px] mx-auto px-6 flex items-center justify-between h-16">
          <WippaWordmark />
          <div className="flex items-center gap-3">
            <Link
              to="/pricing"
              className="text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              {t('Pricing')}
            </Link>
            <Link
              to="/sign-in"
              className="text-sm font-medium text-white/60 hover:text-white transition-colors"
            >
              {t('Sign in')}
            </Link>
            <button
              onClick={() => navigate('/sign-up')}
              className="px-5 py-2 text-sm font-semibold bg-[#f5e6a3] text-black rounded-full hover:bg-[#d4c48a] transition-all"
            >
              {t('Get Started')}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-[640px] text-center py-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#f5e6a3]/20 bg-[#f5e6a3]/6 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5e6a3]" />
            <span className="text-xs text-[#f5e6a3] font-medium">
              Australian-owned · Australian-hosted
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight mb-4">
            Automate your work.
            <br />
            <span className="bg-gradient-to-r from-[#f5e6a3] to-[#d4c48a] bg-clip-text text-transparent">
              Keep your data in Australia.
            </span>
          </h1>

          <p className="text-[#999] text-lg leading-relaxed mb-8 max-w-[520px] mx-auto">
            {branding?.websiteName ?? 'Wippa'} connects your apps, automates
            workflows, and runs entirely on Australian servers. The smarter
            alternative to Zapier and Make.
          </p>

          <div className="flex items-center justify-center gap-4 mb-16">
            <button
              onClick={() => navigate('/sign-up')}
              className="px-7 py-3 text-sm font-semibold bg-[#f5e6a3] text-black rounded-full hover:bg-[#d4c48a] hover:scale-105 transition-all"
            >
              {t('Start free trial')}
            </button>
            <Link
              to="/sign-in"
              className="px-7 py-3 text-sm font-semibold text-white/80 border-2 border-white/20 rounded-full hover:border-[#f5e6a3] hover:text-[#f5e6a3] transition-all"
            >
              {t('Sign in')}
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-[#333]">
            {[
              { num: '700+', label: 'Integrations' },
              { num: 'AU-based', label: 'Sydney DC' },
              { num: '$19', label: 'Starts at /mo' },
              { num: '6×', label: 'More tasks than Zapier' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-2xl font-bold text-white">
                  {stat.num}
                </div>
                <div className="text-xs text-white/35 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <section className="border-t border-[#333] py-12">
        <div className="max-w-[1160px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: 'Visual flow builder',
              desc: 'Drag, drop, and connect. No coding required.',
            },
            {
              icon: Shield,
              title: 'Australian-hosted',
              desc: 'All data stays on Australian servers. No US Cloud Act.',
            },
            {
              icon: Globe2,
              title: 'Xero-specialized',
              desc: '20+ Xero actions and triggers. Built for Australian business.',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className={cn(
                'bg-[#111] border border-[#333] rounded-xl p-6',
                'hover:border-[#f5e6a3]/25 transition-colors',
              )}
            >
              <feature.icon className="w-6 h-6 text-[#f5e6a3] mb-3" />
              <h3 className="font-display text-base font-semibold text-white mb-1">
                {feature.title}
              </h3>
              <p className="text-sm text-[#999]">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#333] py-6">
        <div className="max-w-[1160px] mx-auto px-6 flex items-center justify-between flex-wrap gap-3">
          <WippaWordmark />
          <p className="text-xs text-white/30">
            Australian automation platform · Your data stays in Australia
          </p>
        </div>
      </footer>
    </div>
  );
};

LandingPage.displayName = 'LandingPage';
export { LandingPage };
