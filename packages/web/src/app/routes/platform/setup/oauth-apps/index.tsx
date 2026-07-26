import { useMutation, useQuery } from '@tanstack/react-query';
import { t } from 'i18next';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import { oauthAppsApi } from '@/features/connections/api/oauth-apps';

export default function OAuthAppsPage() {
  const { data: oauthApps, refetch } = useQuery({
    queryKey: ['platform-oauth-apps'],
    queryFn: () => oauthAppsApi.listPlatformOAuth2Apps({}),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => oauthAppsApi.delete(id),
    onSuccess: () => {
      refetch();
      toast.success(t('OAuth app deleted'));
    },
    onError: () => toast.error(t('Failed to delete OAuth app')),
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('OAuth Apps')}</h1>
          <p className="text-muted-foreground text-sm">
            {t('Manage OAuth2 client credentials for your connectors')}
          </p>
        </div>
        <AddOAuthAppDialog onSuccess={() => refetch()} />
      </div>
      <Separator />
      <Card className="p-4">
        <DataTable
          columns={[
            { accessorKey: 'connectorName', header: t('Connector') },
            { accessorKey: 'clientId', header: t('Client ID') },
            {
              id: 'actions',
              cell: ({ row }) => (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate(row.original.id)}
                >
                  {t('Delete')}
                </Button>
              ),
            },
          ]}
          data={oauthApps?.data ?? []}
        />
      </Card>
    </div>
  );
}

function AddOAuthAppDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [connectorName, setPieceName] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  const upsertMutation = useMutation({
    mutationFn: () =>
      oauthAppsApi.upsert({
        connectorName,
        clientId,
        clientSecret,
      }),
    onSuccess: () => {
      setOpen(false);
      setPieceName('');
      setClientId('');
      setClientSecret('');
      onSuccess();
      toast.success(t('OAuth app created'));
    },
    onError: () => toast.error(t('Failed to create OAuth app')),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t('Add OAuth App')}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('Add OAuth App')}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <Label>{t('Connector Name')}</Label>
            <Input
              value={connectorName}
              onChange={(e) => setPieceName(e.target.value)}
              placeholder="@wippa/connector-slack"
            />
          </div>
          <div>
            <Label>{t('Client ID')}</Label>
            <Input
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>
          <div>
            <Label>{t('Client Secret')}</Label>
            <Input
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              type="password"
            />
          </div>
          <Button onClick={() => upsertMutation.mutate()} disabled={!connectorName || !clientId}>
            {t('Save')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
