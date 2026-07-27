import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PieceSelectorConfig } from '@wippa/shared';
import { t } from 'i18next';
import { toast } from 'sonner';

import { platformApi } from '@/api/platforms-api';
import { pieceCacheUtils, piecesApi } from '@/features/connectors';

export const platformPiecesMutations = {
  useTogglePiecePin: ({
    platformId,
    pinnedPieces,
    refetch,
  }: {
    platformId: string;
    pinnedPieces: string[];
    refetch: () => Promise<void>;
  }) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (connectorName: string) => {
        const newPinnedPieces = pinnedPieces.includes(connectorName)
          ? pinnedPieces.filter((name) => name !== connectorName)
          : [...pinnedPieces, connectorName];
        await platformApi.update({ pinnedPieces: newPinnedPieces }, platformId);
        await refetch();
      },
      onSuccess: () => {
        pieceCacheUtils.invalidatePieceCaches(queryClient);
        toast.success(t('Your changes have been saved.'), { duration: 3000 });
      },
    });
  },
  useUpdatePieceSelectorConfig: ({
    platformId,
    refetch,
  }: {
    platformId: string;
    refetch: () => Promise<void>;
  }) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (pieceSelectorConfig: PieceSelectorConfig | null) => {
        await platformApi.update({ pieceSelectorConfig }, platformId);
        await refetch();
      },
      onSuccess: () => {
        pieceCacheUtils.invalidatePieceCaches(queryClient);
        toast.success(t('Your changes have been saved.'), { duration: 3000 });
      },
      onError: () => {
        toast.error(t('Failed to save changes. Please try again.'));
      },
    });
  },
  useSyncPieces: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async () => {
        await piecesApi.syncFromCloud();
      },
      onSuccess: () => {
        pieceCacheUtils.invalidatePieceCaches(queryClient);
        toast.success(t('Pieces synced'), {
          description: t(
            'Pieces have been synced from the Wippa cloud.',
          ),
        });
      },
    });
  },
};
