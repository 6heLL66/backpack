import React, { useState } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Divider,
    Input,
    Spinner
} from '@heroui/react';
import type { BatchDto, IntegrationAccountDto } from '../../../api';
import { AccountService } from '../../../api';
import { formatDateShort } from '../../../utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccountsLeverages, useBatchBalances } from '../queries';
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
    const [editingLeverage, setEditingLeverage] = useState<string | null>(null);
    const [leverageValues, setLeverageValues] = useState<Record<string, number>>({});

    const { balances } = useBatchBalances(batch.id);

    const { data: accountsLeverages = {} } = useAccountsLeverages();

    const navigate = useNavigate();

    const updateLeveragesMutation = useMutation({
        mutationFn: async ({ accountIds, leverage }: { accountIds: string[], leverage: number }) => {
            await AccountService.accountsUpdateLeveragesApiBackpackAccountsLeveragesPatch({ accountIds, requestBody: { leverage } });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accountsLeverages'] });
            setEditingLeverage(null);
            setLeverageValues({});
        },
        onError: (error) => {
            console.error('Failed to update leverage:', error);
        }
    });

    const handleUpdateLeverage = (accountId: string, leverage: number) => {
        updateLeveragesMutation.mutate({ accountIds: [accountId], leverage });
    };

    const handleStartEditLeverage = (accountId: string) => {
        setEditingLeverage(accountId);
        setLeverageValues(prev => ({
            ...prev,
            [accountId]: accountsLeverages[accountId] || 1
        }));
    };

    const handleCancelEditLeverage = () => {
        setEditingLeverage(null);
        setLeverageValues({});
    };

    const handleLeverageChange = (accountId: string, value: string) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue > 0) {
            setLeverageValues(prev => ({
                ...prev,
                [accountId]: numValue
            }));
        }
    };

    const handleCopyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

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
                        <div className="space-y-2">
                            {batchAccounts.length > 0 ? (
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="grid grid-cols-4 gap-4 px-3 py-2 text-xs font-medium text-gray-400 border-b border-gray-700/30">
                                        <div className="w-32">Account</div>
                                        <div className="text-center">Net Equity</div>
                                        <div className="text-center">Available</div>
                                        <div className="text-center">Leverage</div>
                                    </div>
                                    {batchAccounts.map((account) => (
                                        <div key={account.id} className="grid grid-cols-4 gap-4 items-center p-1 pl-3 bg-gray-800/30 rounded-lg border border-gray-700/30 hover:border-gray-600/50 transition-colors">
                                            <div className="w-32 flex items-center gap-2">
                                                <img
                                                    src={`https://api.dicebear.com/7.x/identicon/svg?seed=${account.id}`}
                                                    alt={`Account ${account.id}`}
                                                    className="w-6 h-6 rounded-full flex-shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-gray-200 text-xs font-medium truncate">
                                                            {account.id}
                                                        </span>
                                                        <button
                                                            onClick={() => handleCopyToClipboard(account.id)}
                                                            className="p-1 ml-2 cursor-pointer rounded hover:bg-gray-700/50 transition-colors group"
                                                            title="Copy ID"
                                                        >
                                                            <svg className="w-3 h-3 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    {account.api_key && (
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <span className="text-gray-500 text-xs truncate">
                                                                {account.api_key.substring(0, 8)}...
                                                            </span>
                                                            <button
                                                                onClick={() => handleCopyToClipboard(account.api_key)}
                                                                className="p-1 ml-2 cursor-pointer rounded hover:bg-gray-700/50 transition-colors group"
                                                                title="Copy API Key"
                                                            >
                                                                <svg className="w-3 h-3 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="text-center">
                                                <div className="text-gray-200 text-sm font-medium">
                                                {balances
                                                    ? parseFloat(balances[account.id].netEquity).toFixed(2) 
                                                    : '0.00'}$
                                                </div>
                                            </div>
                                            
                                            <div className="text-center">
                                                <div className="text-gray-400 text-sm">
                                                {balances
                                                    ? parseFloat(balances[account.id].netEquityAvailable).toFixed(2) 
                                                    : '0.00'}$
                                                </div>
                                        </div>

                                            <div className="flex justify-center">
                                                {editingLeverage === account.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            type="number"
                                                            size="sm"
                                                            min="1"
                                                            max="100"
                                                            step="0.1"
                                                            value={leverageValues[account.id]?.toString() || ''}
                                                            onChange={(e) => handleLeverageChange(account.id, e.target.value)}
                                                            className="w-20"
                                                            classNames={{
                                                                input: "text-center text-blue-300 bg-gray-800/50 border-blue-500/30",
                                                                inputWrapper: "bg-gray-800/50 border-blue-500/30 hover:border-blue-500/50"
                                                            }}
                                                            placeholder="1.0"
                                                        />
                                                        <Button
                                                            size="sm"
                                                            color="success"
                                                            variant="flat"
                                                            onPress={() => handleUpdateLeverage(account.id, leverageValues[account.id])}
                                                            isDisabled={updateLeveragesMutation.isPending}
                                                            className="min-w-0 px-2"
                                                        >
                                                            {updateLeveragesMutation.isPending ? (
                                                                <Spinner size="sm" color="success" />
                                                            ) : (
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            color="danger"
                                                            variant="flat"
                                                            onPress={handleCancelEditLeverage}
                                                            className="min-w-0 px-2"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-blue-500/20 text-blue-300 text-xs px-3 py-1.5 rounded-lg border border-blue-500/30 flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                            </svg>
                                            {accountsLeverages[account.id] ? `${accountsLeverages[account.id]}x` : 'N/A'}
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onPress={() => handleStartEditLeverage(account.id)}
                                                            className="min-w-0 px-2 text-gray-400 hover:text-gray-200"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    </div>
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