import { PieceAuth, createConnector } from '@wippa/connectors-framework';
import { fetchTopStories } from './lib/actions/top-stories-in-hacker-news';

export const hackernews = createConnector({
  displayName: 'Hacker News',
  description: 'A social news website',

  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/hackernews.png',
  auth: PieceAuth.None(),
  categories: [],
  authors: ["kishanprmr","AbdulTheActivePiecer","khaledmashaly","abuaboud"],
  actions: [fetchTopStories],
  triggers: [],
});
