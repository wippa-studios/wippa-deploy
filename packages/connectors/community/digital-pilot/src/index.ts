import { createConnector, PieceAuth } from '@wippa/connectors-framework';
import { addTargetAccountAction } from './lib/actions/add-target-account';
import { removeTargetAccountAction } from './lib/actions/remove-target-account';
import { newHighIntentVisitTrigger } from './lib/triggers/new-high-intent-visit';
import { newTargetAccountVisitTrigger } from './lib/triggers/new-target-account-visit';
import { digitalPilotAuth } from './lib/auth';

export const digitalPilot = createConnector({
  displayName: 'DigitalPilot',
  auth: digitalPilotAuth,
  minimumSupportedRelease: '0.36.1',
  logoUrl: 'https://cdn.activepieces.com/pieces/digital-pilot.png',
  authors: ["onyedikachi-david"],
  actions: [addTargetAccountAction, removeTargetAccountAction],
  triggers: [newHighIntentVisitTrigger, newTargetAccountVisitTrigger],
});
