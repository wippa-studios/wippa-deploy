import { ApEdition, ApFlagId } from '@wippa/shared';
import { t } from 'i18next';
import { ChevronsUpDown, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { OnboardingWizard } from '@/app/components/onboarding-wizard';
import { useEmbedding } from '@/components/providers/embed-provider';
import { Button } from '@/components/ui/button';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar-shadcn';
import { PlatformSwitcher } from '@/features/projects';
import { useAuthorization } from '@/hooks/authorization-hooks';
import { flagsHooks } from '@/hooks/flags-hooks';
import { platformHooks } from '@/hooks/platform-hooks';
import { determineDefaultRoute } from '@/lib/route-utils';

function SidebarLogoCollapsed({ linkTo }: { linkTo?: string }) {
  const branding = flagsHooks.useWebsiteBranding();
  const navigate = useNavigate();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => navigate(linkTo || '/')}
      className="h-10! w-8! p-0! group-data-[collapsible=icon]:h-10! items-center justify-center"
    >
      <img
        src={branding.logos.logoIconUrl}
        alt={t('home')}
        className="h-5! w-5! shrink-0"
        draggable={false}
      />
    </Button>
  );
}

export const AppSidebarHeader = () => {
  const { embedState } = useEmbedding();
  const { data: edition } = flagsHooks.useFlag<ApEdition>(ApFlagId.EDITION);
  const showSwitcher = edition === ApEdition.CLOUD && !embedState.isEmbedded;
  const { state } = useSidebar();
  const { platform: currentPlatform } = platformHooks.useCurrentPlatform();
  const defaultRoute = determineDefaultRoute({
    chatEnabled: currentPlatform.plan.chatEnabled,
  });
  const branding = flagsHooks.useWebsiteBranding();
  const [wizardOpen, setWizardOpen] = useState(false);

  const wizardButton = state !== 'collapsed' && (
    <button
      onClick={() => setWizardOpen(true)}
      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#f5e6a3] border border-[#f5e6a3]/20 rounded-lg hover:bg-[#f5e6a3]/5 transition-colors"
    >
      <Sparkles className="w-3.5 h-3.5" />
      {t('Start the wizard')}
    </button>
  );

  return (
    <>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center">
            <SidebarLogoCollapsed linkTo={defaultRoute} />
            {state !== 'collapsed' && (
              <div className="flex-1 min-w-0">
                <PlatformSwitcher>
                  <SidebarMenuButton className="h-10! w-full">
                    <span className="truncate font-medium flex-1 text-left text-sm">
                      {currentPlatform?.name ?? branding.websiteName}
                    </span>
                    <ChevronsUpDown className="ml-auto size-3! shrink-0" />
                  </SidebarMenuButton>
                </PlatformSwitcher>
              </div>
            )}
          </SidebarMenuItem>
          {wizardButton && (
            <SidebarMenuItem>
              {wizardButton}
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarHeader>
      <OnboardingWizard open={wizardOpen} onOpenChange={setWizardOpen} />
    </>
  );
};;
