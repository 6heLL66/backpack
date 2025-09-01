import React from 'react';
import { Batch } from './Batch';
import type { BatchDto, IntegrationAccountDto } from '../../../api';

interface BatchesListProps {
    batches: BatchDto[];
    accounts: IntegrationAccountDto[];
    onDeleteBatch: (batchId: string) => void;
    onCreateUnit: (batchId: string) => void;
}

export const BatchesList: React.FC<BatchesListProps> = ({
    batches,
    accounts,
    onDeleteBatch,
    onCreateUnit
}) => {
    return (
        <div className="space-y-6">
            {batches.map((batch) => {
                const batchAccounts = accounts.filter(account => account.batch_id === batch.id);
                
                return (
                    <div key={batch.id} className="space-y-4">
                        <Batch
                            batch={batch}
                            accounts={batchAccounts}
                            onDeleteBatch={onDeleteBatch}
                            onCreateUnit={onCreateUnit}
                        />
                    </div>
                );
            })}
            
            {batches.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">No batches found</h3>
                    <p className="text-gray-500 text-sm">Create your first batch to start managing trading operations</p>
                </div>
            )}
        </div>
    );
};
