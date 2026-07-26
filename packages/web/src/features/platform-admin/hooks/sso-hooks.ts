import { useMutation } from '@tanstack/react-query';
import { UpdatePlatformRequestBody } from '@wippa/shared';

import { platformApi } from '@/api/platforms-api';

export const ssoMutations = {
  useUpdatePlatformSso: ({
    platformId,
    refetch,
    onSuccess,
  }: {
    platformId: string;
    refetch: () => Promise<void>;
    onSuccess?: () => void;
  }) => {
    return useMutation({
      mutationFn: async (request: UpdatePlatformRequestBody) => {
        await platformApi.update(request, platformId);
        await refetch();
      },
      onSuccess: () => {
        if (onSuccess) {
          onSuccess();
        }
      },
    });
  },
};
