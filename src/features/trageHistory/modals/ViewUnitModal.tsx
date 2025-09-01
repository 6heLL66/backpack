import React from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Chip,
    Divider
} from '@heroui/react';
import type { UnitDto } from '../../../api/models/UnitDto';
import { UnitHistoryTable } from '../components';
import { useUnitHistory } from '../../trade/queries';
import { formatDate } from '../../../utils';

interface ViewUnitModalProps {
    isOpen: boolean;
    onClose: () => void;
    unit: UnitDto | null;
}

export const ViewUnitModal: React.FC<ViewUnitModalProps> = ({
    isOpen,
    onClose,
    unit
}) => {
    const unitHistoryQuery = useUnitHistory(unit?.id || '');

    if (!unit) return null;

    const unitSummary = [
        { label: 'Unit ID', value: unit.id, type: 'id' },
        { label: 'Symbol', value: unit.symbol, type: 'symbol' },
        { label: 'Size', value: unit.size, type: 'size' },
        { label: 'Batch ID', value: unit.batch_id, type: 'id' },
        { label: 'Created At', value: formatDate(unit.created_at), type: 'date' },
        { label: 'Deleted At', value: unit.deleted_at ? formatDate(unit.deleted_at) : 'N/A', type: 'date' }
    ];

    const renderValue = (value: string, type: string) => {
        switch (type) {
            case 'id':
                return (
                    <span className="font-mono text-sm bg-gray-800/50 px-2 py-1 rounded text-gray-300">
                        {value.slice(0, 8)}...{value.slice(-8)}
                    </span>
                );
            case 'email':
                return <span className="text-blue-400">{value}</span>;
            case 'symbol':
                return (
                    <Chip color="primary" variant="flat" size="sm">
                        {value}
                    </Chip>
                );
            case 'size':
                return <span className="text-green-400 font-semibold">{value}</span>;
            case 'date':
                return <span className="text-gray-300">{value}</span>;
            default:
                return <span className="text-gray-300">{value}</span>;
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="full" scrollBehavior="inside">
            <ModalContent className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-gray-700/50">
                <ModalHeader className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-b border-gray-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Unit Details & History</h2>
                            <p className="text-gray-400 text-sm">View unit information and order history</p>
                        </div>
                    </div>
                </ModalHeader>
                
                <ModalBody className="p-6 space-y-6">
                    <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-6 border border-gray-600/50">
                        <h3 className="text-lg font-semibold text-white mb-4">Unit Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {unitSummary.map((detail, index) => (
                                <div key={index} className="space-y-2">
                                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                                        {detail.label}
                                    </label>
                                    <div className="min-h-[2.5rem] flex items-center">
                                        {renderValue(detail.value, detail.type)}
                                    </div>
                                    {index < unitSummary.length - 1 && (
                                        <Divider className="my-4" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Order History</h3>
                        <UnitHistoryTable 
                            history={unitHistoryQuery.data || []}
                            isLoading={unitHistoryQuery.isLoading}
                        />
                    </div>
                </ModalBody>
                
                <ModalFooter className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-t border-gray-700/50">
                    <Button
                        variant="flat"
                        onPress={onClose}
                        className="bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 border-gray-600/50"
                    >
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
