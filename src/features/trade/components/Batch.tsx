import React, { useState } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Divider,
    User
} from '@heroui/react';
import type { BatchDto, IntegrationAccountDto } from '../../../api';
import { AccountService } from '../../../api';
import { formatDateShort } from '../../../utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useBatchBalances } from '../queries';
import { useNavigate } from 'react-router';

interface BatchProps {
    batch: BatchDto;
    accounts: IntegrationAccountDto[];
    onDeleteBatch: (batchId: string) => void;
    onCreateUnit: (batchId: string) => void;
}

export const Batch: React.FC<BatchProps> = ({
    batch,
    accounts,
    onDeleteBatch,
    onCreateUnit
}) => {
    const queryClient = useQueryClient();
    const [isDeleting, setIsDeleting] = useState(false);

    const { balances } = useBatchBalances(batch.id);

    const navigate = useNavigate();

    const deleteBatchMutation = useMutation({
        mutationFn: async (batchId: string) => {
            const promises = accounts.map(account => AccountService.accountUpdateApiBackpackAccountsAccountIdPatch({ requestBody: { batch_id: null }, accountId: account.id }));
            await Promise.all(promises);
            await AccountService.batchDeleteApiBackpackBatchesBatchIdDelete({ batchId });
            return batchId;
        },
        onSuccess: (batchId) => {
            queryClient.invalidateQueries({ queryKey: ['batches'] });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            queryClient.invalidateQueries({ queryKey: ['active-units'] });
            onDeleteBatch(batchId);
        }
    });

    const handleDeleteBatch = async () => {
        setIsDeleting(true);
        try {
            if (confirm('Are you sure you want to delete this batch?')) {
                await deleteBatchMutation.mutateAsync(batch.id);
            }
        } finally {
            setIsDeleting(false);
        }
    };



    const batchAccounts = accounts.filter(account => 
        account.batch_id === batch.id
    );

    console.log(balances);

    return (
        <Card className="bg-gray-900/50 border border-gray-800/50 hover:border-gray-700/50 transition-colors">
            <CardHeader className="pb-3">
                <div className="flex flex-1 justify-between items-start">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-200">
                                    {batch.name}
                                </h2>

                                <Button onPress={() => AccountService.cancelPositionApiBackpackAccountsPositionsDelete({ symbol: 'BTC_USDC_PERP', accountIds: batchAccounts.map(account => account.id) })}>Close all positions</Button>
                                <Button onPress={() => AccountService.cancelAllOrdersApiBackpackAccountsOrdersDelete({ symbol: 'BTC_USDC_PERP', accountIds: batchAccounts.map(account => account.id) })}>Close all orders</Button>
                                <p className="text-gray-500 text-sm">Created {formatDateShort(batch.created_at)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" variant='ghost' onPress={() => navigate(`/trade/history/${batch.id}`)}>History</Button>
                        <Button
                            size="sm"
                            onPress={() => onCreateUnit(batch.id)}
                            className="bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30"
                        >
                            Create Unit
                        </Button>
                        <Button
                            size="sm"
                            variant="flat"
                            onPress={handleDeleteBatch}
                            isDisabled={isDeleting}
                            className="bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/20"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <Divider className="bg-gray-800/50" />
            <CardBody className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3 col-span-1">
                        <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            Batch Info
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center p-2 bg-gray-800/30 rounded border border-gray-700/30">
                                <span className="text-gray-400 text-sm">Accounts</span>
                                <span className="text-gray-200 font-medium">{batchAccounts.length}</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-gray-800/30 rounded border border-gray-700/30">
                                <span className="text-gray-400 text-sm">ID</span>
                                <span className="text-gray-200 text-xs font-mono">{batch.id}</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3 col-span-2">
                        <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            Accounts
                        </h3>
                        <div className="space-y-2">
                            {batchAccounts.length > 0 ? (
                                batchAccounts.map((account) => (
                                    <div key={account.id} className="flex items-center gap-2 p-2 bg-gray-800/30 rounded border border-gray-700/30">
                                        <User
                                            name={`Account ${account.id}`}
                                            description={account.api_key ? `API: ${account.api_key}` : 'No API key'}
                                            avatarProps={{
                                                src: `https://api.dicebear.com/7.x/identicon/svg?seed=${account.id}`,
                                                className: 'w-8 h-8'
                                            }}
                                            classNames={{
                                                name: 'text-gray-200 text-sm font-medium',
                                                description: 'text-gray-500 text-xs'
                                            }}
                                        />
                                        <div className="flex flex-col items-center">
                                            <span className="text-gray-200 text-sm font-medium">
                                                {balances
                                                    ? parseFloat(balances[account.id].netEquity).toFixed(2) 
                                                    : '0.00'}$
                                            </span>
                                            <span className="text-gray-400 text-xs">
                                                {balances
                                                    ? parseFloat(balances[account.id].netEquityAvailable).toFixed(2) 
                                                    : '0.00'}$
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-3 bg-gray-800/30 rounded border border-gray-700/30 text-center">
                                    <p className="text-gray-500 text-sm">No accounts associated</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};