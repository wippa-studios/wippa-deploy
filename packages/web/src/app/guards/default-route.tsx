import { Navigate, useLocation } from 'react-router-dom';

import { platformHooks } from '@/hooks/platform-hooks';
import { authenticationSession } from '@/lib/authentication-session';
import { determineDefaultRoute } from '@/lib/route-utils';

import { LandingPage } from '../routes/landing/landing-page';

export const DefaultRoute = () => {
  const token = authenticationSession.getToken();
  const location = useLocation();
  if (!token) {
    return <LandingPage />;
  }
  if (authenticationSession.isOnboarding()) {
    return <Navigate to="/create-platform" replace />;
  }
  return <AuthenticatedDefaultRoute />;
};

const AuthenticatedDefaultRoute = () => {
  const { platform } = platformHooks.useCurrentPlatform();
  return (
    <Navigate
      to={determineDefaultRoute({
        chatEnabled: platform.plan.chatEnabled,
      })}
      replace
    ></Navigate>
  );
};
