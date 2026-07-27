import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreatePieceSetRequestBody,
  UpdatePieceSetRequestBody,
} from '@wippa/shared';
import { t } from 'i18next';
import { toast } from 'sonner';

import { pieceCacheUtils } from '@/features/connectors';
import { projectCollectionUtils } from '@/features/projects';
import { platformHooks } from '@/hooks/platform-hooks';

import { connectorSetsApi } from '../api/connector-sets-api';

export const connectorSetKeys = {
  all: ['connector-sets'] as const,
  one: (id: string) => ['connector-sets', id] as const,
};

export const connectorSetQueries = {
  usePieceSets: () => {
    const { platform } = platformHooks.useCurrentPlatform();
    return useQuery({
      queryKey: connectorSetKeys.all,
      queryFn: () => connectorSetsApi.list(),
      enabled: platform.plan.managePiecesEnabled,
      meta: { showErrorDialog: true, loadSubsetOptions: {} },
    });
  },
  usePieceSet: (id: string) => {
    const { platform } = platformHooks.useCurrentPlatform();
    return useQuery({
      queryKey: connectorSetKeys.one(id),
      queryFn: () => connectorSetsApi.get(id),
      enabled: platform.plan.managePiecesEnabled && !!id,
      // meta: { showErrorDialog: true },
    });
  },
};

export const connectorSetMutations = {
  useCreatePieceSet: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (request: CreatePieceSetRequestBody) =>
        connectorSetsApi.create(request),
      onSuccess: () => {
        toast.success(t('Piece set created'));
        queryClient.invalidateQueries({ queryKey: connectorSetKeys.all });
      },
      onError: () => {
        toast.error(t('Failed to create piece set. Please try again.'));
      },
    });
  },
  useUpdatePieceSet: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({
        id,
        request,
      }: {
        id: string;
        request: UpdatePieceSetRequestBody;
      }) => connectorSetsApi.update(id, request),
      onSuccess: (_, { id }) => {
        toast.success(t('Your changes have been saved.'), { duration: 3000 });
        queryClient.invalidateQueries({ queryKey: connectorSetKeys.all });
        queryClient.invalidateQueries({ queryKey: connectorSetKeys.one(id) });
        pieceCacheUtils.invalidatePieceCaches(queryClient);
      },
      onError: () => {
        toast.error(t('Failed to save changes. Please try again.'));
      },
    });
  },
  useDeletePieceSet: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => connectorSetsApi.delete(id),
      onSuccess: () => {
        toast.success(t('Piece set deleted'));
        queryClient.invalidateQueries({ queryKey: connectorSetKeys.all });
        pieceCacheUtils.invalidatePieceCaches(queryClient);
        projectCollectionUtils.refetchProjects();
      },
      onError: () => {
        toast.error(t('Failed to delete piece set. Please try again.'));
      },
    });
  },
  useDuplicatePieceSet: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, name }: { id: string; name: string }) =>
        connectorSetsApi.duplicate(id, { name }),
      onSuccess: () => {
        toast.success(t('Piece set duplicated'));
        queryClient.invalidateQueries({ queryKey: connectorSetKeys.all });
      },
    });
  },
  useAssignProjects: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, projectIds }: { id: string; projectIds: string[] }) =>
        connectorSetsApi.assignProjects(id, { projectIds }),
      onSuccess: (_, { id }) => {
        toast.success(t('Your changes have been saved.'), { duration: 3000 });
        queryClient.invalidateQueries({ queryKey: connectorSetKeys.all });
        queryClient.invalidateQueries({ queryKey: connectorSetKeys.one(id) });
        queryClient.invalidateQueries({ queryKey: ['projects-for-platforms'] });
        pieceCacheUtils.invalidatePieceCaches(queryClient);
        projectCollectionUtils.refetchProjects();
      },
    });
  },
  useRemoveProject: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, projectId }: { id: string; projectId: string }) =>
        connectorSetsApi.removeProject(id, projectId),
      onSuccess: (_, { id }) => {
        toast.success(t('Your changes have been saved.'), { duration: 3000 });
        queryClient.invalidateQueries({ queryKey: connectorSetKeys.all });
        queryClient.invalidateQueries({ queryKey: connectorSetKeys.one(id) });
        queryClient.invalidateQueries({ queryKey: ['projects-for-platforms'] });
        pieceCacheUtils.invalidatePieceCaches(queryClient);
        projectCollectionUtils.refetchProjects();
      },
    });
  },
  useBulkRemoveProjects: () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, projectIds }: { id: string; projectIds: string[] }) =>
        Promise.all(
          projectIds.map((projectId) =>
            connectorSetsApi.removeProject(id, projectId),
          ),
        ),
      onSuccess: (_, { id }) => {
        toast.success(t('Your changes have been saved.'), { duration: 3000 });
        queryClient.invalidateQueries({ queryKey: connectorSetKeys.all });
        queryClient.invalidateQueries({ queryKey: connectorSetKeys.one(id) });
        queryClient.invalidateQueries({ queryKey: ['projects-for-platforms'] });
        pieceCacheUtils.invalidatePieceCaches(queryClient);
        projectCollectionUtils.refetchProjects();
      },
    });
  },
};
