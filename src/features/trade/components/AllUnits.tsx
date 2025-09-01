import React from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Accordion,
    AccordionItem
} from '@heroui/react';
import type { UnitDto, BatchDto } from '../../../api';
import { BatchAccordion } from './BatchAccordion';

interface AllUnitsProps {
    units: UnitDto[];
    batches: BatchDto[];
}

export const AllUnits: React.FC<AllUnitsProps> = ({
    units,
    batches,
}) => {
    const getBatchById = (batchId: string) => {
        return batches.find(b => b.id === batchId);
    };

    const groupedUnits = units.reduce((acc, unit) => {
        const batchId = unit.batch_id;
        if (!acc[batchId]) {
            acc[batchId] = [];
        }
        acc[batchId].push(unit);
        return acc;
    }, {} as Record<string, UnitDto[]>);

    const batchIds = Object.keys(groupedUnits);

    return (
        <Card className="bg-gray-900/50 border border-gray-800/50">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-200">All Units</h3>
                        <p className="text-gray-500 text-sm">{units.length} units across {batchIds.length} batches</p>
                    </div>
                </div>
            </CardHeader>
            <CardBody className="p-4">
                {units.length > 0 ? (
                    <div className="p-0">
                        <Accordion
                            variant="splitted"
                            className="gap-0 [&_.accordion-item]:bg-gray-800/40 [&_.accordion-item]:border [&_.accordion-item]:border-gray-700/50 [&_.accordion-item]:rounded-none [&_.accordion-item]:overflow-hidden [&_.accordion-item]:shadow-none [&_.accordion-item]:hover:shadow-none [&_.accordion-item]:transition-all [&_.accordion-item]:duration-300 [&_.accordion-item]:hover:border-gray-600/50 [&_.accordion-trigger]:text-gray-200 [&_.accordion-trigger]:font-medium [&_.accordion-trigger]:text-base [&_.accordion-trigger]:py-4 [&_.accordion-trigger]:hover:bg-gray-700/20 [&_.accordion-trigger]:transition-colors [&_.accordion-trigger]:w-full [&_.accordion-indicator]:text-gray-400 [&_.accordion-indicator]:hover:text-gray-300 [&_.accordion-indicator]:transition-colors"
                            defaultExpandedKeys={batchIds}
                        >
                            {batchIds.map((batchId) => {
                                const batch = getBatchById(batchId);
                                const batchUnits = groupedUnits[batchId];
                                
                                return (
                                    <AccordionItem
                                        key={batchId}
                                        className='px-0'
                                        aria-label={`Batch ${batch?.name || batchId}`}
                                        title={
                                            <div className="flex items-center justify-between w-full py-2 px-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                            </svg>
                                                        </div>
                                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                                            <span className="text-xs font-bold text-white">{batchUnits.length}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-gray-200">{batch?.name || 'Unknown Batch'}</h4>
                                                        <div className="flex items-center gap-3 text-sm">
                                                            <span className="text-gray-500">{batchId.slice(0, 12)}...</span>
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                                <span className="text-green-400 font-medium">{batchUnits.filter(u => u.start_processing_at).length}</span>
                                                                <span className="text-gray-500">active</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="px-3 py-1 bg-gray-700/50 rounded-full border border-gray-600/50">
                                                        <span className="text-sm text-gray-300 font-medium">
                                                            {batchUnits.length} units
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    >
                                        <BatchAccordion
                                            batchId={batchId}
                                            batch={batch}
                                            batchUnits={batchUnits}
                                        />
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-medium text-gray-300 mb-2">No units found</h4>
                        <p className="text-gray-500 text-sm">Create your first unit to start trading operations</p>
                    </div>
                )}
            </CardBody>
        </Card>
    );
};
