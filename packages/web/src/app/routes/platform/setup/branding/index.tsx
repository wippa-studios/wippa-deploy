import { t } from 'i18next';
import { AlertTriangle } from 'lucide-react';

import { CenteredPage } from '@/app/components/centered-page';
import LockedFeatureGuard from '@/app/components/locked-feature-guard';
import { AppearanceSection } from '@/app/routes/platform/setup/branding/appearance-section';
import { platformHooks } from '@/hooks/platform-hooks';

export const BrandingPage = () => {
  const { platform } = platformHooks.useCurrentPlatform();
  return (
    <LockedFeatureGuard
      featureKey="BRANDING"
      locked={!platform.plan.customAppearanceEnabled}
      lockTitle={t('Brand Wippa')}
      lockDescription={t(
        'Give your users an experience that looks like you by customizing the color, logo and more',
      )}
      lockVideoUrl="https://cdn.wippa.com.au/videos/showcase/appearance.mp4"
    >
      <CenteredPage
        title={t('Branding')}
        description={t('Configure the appearance for your platform.')}
      >
        {/* Enterprise Users Notification */}
        {platform.plan.customAppearanceEnabled && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="size-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800">Enterprise Branding</h3>
              <p className="text-blue-700">
                {t('Custom appearance is enabled for your enterprise platform.')}
              </p>
            </div>
          </div>
        )}
        
        <AppearanceSection />
      </CenteredPage>
    </LockedFeatureGuard>
  );
};
