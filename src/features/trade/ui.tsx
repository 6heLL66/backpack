import {
    Card,
    CardBody,
    Button
} from '@heroui/react';
import { AccountService } from '../../api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { CreateBatchModal, CreateUnitModal } from './modals';
import { BatchesList, AllUnits } from './components';
import { useMarkets, useActiveUnits } from './queries';

export const Trade = () => {
    const queryClient = useQueryClient();
    const [isCreateBatchModalOpen, setIsCreateBatchModalOpen] = useState(false);
    const [isCreateUnitModalOpen, setIsCreateUnitModalOpen] = useState(false);
    const [selectedBatchId, setSelectedBatchId] = useState<string>('');

    const {query: marketsQuery} = useMarkets()

    const { data: accounts = [], isLoading } = useQuery({
        queryKey: ['accounts'],
        queryFn: () => AccountService.accountsListApiBackpackAccountsGet()
    });

    const batchesQuery = useQuery({
        queryKey: ['batches'],
        queryFn: () => AccountService.batchListApiBackpackBatchesGet()
    });

    const unitsQuery = useActiveUnits();

    if (marketsQuery.isLoading || batchesQuery.isLoading || isLoading || unitsQuery.isLoading) {
        return (
            <div className="w-full space-y-6">
                <div className="animate-pulse">
                    <div className="h-32 bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-2xl mb-6"></div>
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="h-48 bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-2xl mb-6"></div>
                    ))}
                </div>
            </div>
        );
    }

    const totalAccounts = accounts.filter(account => account.batch_id).length;
    const totalBatches = batchesQuery.data?.length || 0;
    const totalUnits = unitsQuery.data?.length || 0;

    const handleDeleteBatch = () => {
        queryClient.invalidateQueries({ queryKey: ['batches'] });
        queryClient.invalidateQueries({ queryKey: ['accounts'] });
        queryClient.invalidateQueries({ queryKey: ['units'] });
    };

    const handleCreateUnit = (batchId: string) => {
        setSelectedBatchId(batchId);
        setIsCreateUnitModalOpen(true);
    };

    return (
        <>
            <div className="space-y-8">
                <Card className="bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 border border-gray-700/50 hover:border-indigo-500/50 hover:shadow-2xl transition-all duration-500 hover:bg-gray-800/60 backdrop-blur-sm">
                    <CardBody className="p-8">
                        <div className="flex justify-between items-start mb-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent mb-2">
                                            Trade
                                        </h1>
                                        <p className="text-gray-300 text-xl">Monitor and manage your trading activities</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-4 backdrop-blur-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-blue-400 text-sm font-medium">Total Accounts</p>
                                                <p className="text-2xl font-bold text-white">{totalAccounts}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-xl p-4 backdrop-blur-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-purple-400 text-sm font-medium">Total Batches</p>
                                                <p className="text-2xl font-bold text-white">{totalBatches}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-xl p-4 backdrop-blur-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-emerald-400 text-sm font-medium">Total Units</p>
                                                <p className="text-2xl font-bold text-white">{totalUnits}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <Button
                                color="primary"
                                size="lg"
                                onPress={() => setIsCreateBatchModalOpen(true)}
                                className="bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 hover:from-blue-600 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                                startContent={
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                }
                            >
                                Create Batch
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                {batchesQuery.data && batchesQuery.data.length > 0 ? (
                    <div className="space-y-12">
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                                <h2 className="text-3xl font-bold text-gray-200">Your Batches</h2>
                                <div className="flex-1 h-px bg-gradient-to-r from-gray-700 to-transparent"></div>
                            </div>
                            
                            <BatchesList
                                batches={batchesQuery.data}
                                accounts={accounts}
                                onDeleteBatch={handleDeleteBatch}
                                onCreateUnit={handleCreateUnit}
                            />
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
                                <h2 className="text-3xl font-bold text-gray-200">All Units Overview</h2>
                                <div className="flex-1 h-px bg-gradient-to-r from-gray-700 to-transparent"></div>
                            </div>
                            
                            <AllUnits
                                units={unitsQuery.data || []}
                                batches={batchesQuery.data}
                            />
                        </div>
                    </div>
                ) : (
                    <Card className="bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 border border-gray-700/50 p-12 text-center backdrop-blur-sm">
                        <div className="w-24 h-24 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-200 mb-3">No batches yet</h3>
                        <p className="text-gray-400 text-lg mb-6">Create your first batch to start organizing your trading operations</p>
                        <Button
                            color="primary"
                            size="lg"
                            onPress={() => setIsCreateBatchModalOpen(true)}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                            Create Your First Batch
                        </Button>
                    </Card>
                )}
            </div>

            <CreateBatchModal
                isOpen={isCreateBatchModalOpen}
                onClose={() => setIsCreateBatchModalOpen(false)}
                accounts={accounts}
                onSuccess={() => {
                    queryClient.invalidateQueries({ queryKey: ['batches'] });
                    queryClient.invalidateQueries({ queryKey: ['accounts'] });
                }}
            />

            <CreateUnitModal 
                isOpen={isCreateUnitModalOpen} 
                onClose={() => setIsCreateUnitModalOpen(false)} 
                batchId={selectedBatchId}
                accounts={accounts}
                markets={marketsQuery.data || []}
            />
        </>
    )
}
