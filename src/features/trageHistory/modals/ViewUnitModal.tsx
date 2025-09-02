import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Chip,
    Select,
    SelectItem,
    Input
} from '@heroui/react';
import type { UnitDto } from '../../../api/models/UnitDto';
import { UnitHistoryTable } from '../components';
import { useUnitHistory } from '../../trade/queries';
import { formatDate, toLocalDateTimeString, fromLocalDateTimeString } from '../../../utils';

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
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const [selectedAction, setSelectedAction] = useState<string | null>(null);
    const [dateFrom, setDateFrom] = useState<string | null>(null);
    const [dateTo, setDateTo] = useState<string | null>(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    });
    
    useEffect(() => {
        if (unit?.created_at && !dateFrom) {
            setDateFrom(toLocalDateTimeString(unit.created_at));
        }
    }, [unit?.created_at, dateFrom]);

    const offset = (currentPage - 1) * itemsPerPage;
    const unitHistoryQuery = useUnitHistory(
        unit?.id || '', 
        itemsPerPage, 
        offset,
        selectedAction,
        dateFrom ? fromLocalDateTimeString(dateFrom) : null,
        dateTo ? fromLocalDateTimeString(dateTo) : null
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const handleActionFilterChange = (action: string | null) => {
        setSelectedAction(action);
        setCurrentPage(1);
    };

    const handleDateFromChange = (date: string | null) => {
        setDateFrom(date);
        setCurrentPage(1);
    };

    const handleDateToChange = (date: string | null) => {
        setDateTo(date);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSelectedAction(null);
        if (unit?.created_at) {
            setDateFrom(toLocalDateTimeString(unit.created_at));
        } else {
            setDateFrom(null);
        }
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        setDateTo(`${year}-${month}-${day}T${hours}:${minutes}`);
        setCurrentPage(1);
    };

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
                    <span className="font-mono text-xs bg-gray-800/60 px-2 py-1 rounded-md text-gray-200 border border-gray-700/50 break-all">
                        {value}
                    </span>
                );
            case 'email':
                return <span className="text-blue-400 text-sm font-medium break-all">{value}</span>;
            case 'symbol':
                return (
                    <Chip color="primary" variant="flat" size="sm" className="text-xs">
                        {value}
                    </Chip>
                );
            case 'size':
                return <span className="text-green-400 font-semibold text-sm">{value}</span>;
            case 'date':
                return <span className="text-gray-200 text-sm">{value}</span>;
            default:
                return <span className="text-gray-200 text-sm break-all">{value}</span>;
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
                    <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/60 rounded-2xl p-5 border border-gray-600/50 shadow-xl backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-white">Unit Summary</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {unitSummary.map((detail, index) => (
                                <div key={index} className="bg-gray-900/40 rounded-xl p-4 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-200 group">
                                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 group-hover:text-gray-300 transition-colors">
                                        {detail.label}
                                    </div>
                                    <div className="min-h-[1.5rem] flex items-start">
                                        {renderValue(detail.value, detail.type)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Order History</h3>
                                    <p className="text-gray-400 text-sm">Filter and view order execution details</p>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                variant="flat"
                                onPress={clearFilters}
                                className="bg-gradient-to-r from-red-600/20 to-orange-600/20 text-red-300 hover:from-red-500/30 hover:to-orange-500/30 border border-red-500/30 hover:border-red-400/50 transition-all duration-200 backdrop-blur-sm"
                                startContent={
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                }
                            >
                                Clear Filters
                            </Button>
                        </div>
                        
                        <div className="bg-gradient-to-br from-gray-800/40 to-gray-700/40 rounded-3xl p-6 border border-gray-600/30 shadow-2xl backdrop-blur-sm mt-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                </div>
                                <h4 className="text-lg font-semibold text-white">Advanced Filters</h4>
                                <div className="flex-1 h-px bg-gradient-to-r from-gray-600/50 to-transparent"></div>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="bg-gray-900/30 rounded-2xl p-5 border border-gray-700/40 hover:border-gray-600/60 transition-all duration-300 group">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-200 block">Action Type</label>
                                            <p className="text-xs text-gray-400">Filter by order action</p>
                                        </div>
                                    </div>
                                    <Select
                                        size="sm"
                                        placeholder="All Actions"
                                        selectedKeys={selectedAction ? new Set([selectedAction]) : new Set()}
                                        onSelectionChange={(keys) => {
                                            const selected = Array.from(keys)[0] as string;
                                            handleActionFilterChange(selected || null);
                                        }}
                                        classNames={{
                                            trigger: "bg-gray-800/60 border-gray-600/40 hover:bg-gray-700/60 hover:border-blue-500/50 transition-all duration-200",
                                            value: "text-gray-200",
                                            listbox: "bg-gray-800/95 border border-gray-600/50 backdrop-blur-sm",
                                            popoverContent: "bg-transparent"
                                        }}
                                        className="w-full"
                                    >
                                        <SelectItem 
                                            key="create_market_order" 
                                            textValue="Create Market Order"
                                            classNames={{
                                                base: "hover:bg-gray-700/50 transition-colors duration-200"
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                <span>Create Market Order</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem 
                                            key="close_market_order" 
                                            textValue="Close Market Order"
                                            classNames={{
                                                base: "hover:bg-gray-700/50 transition-colors duration-200"
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                                                <span>Close Market Order</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem 
                                            key="create_limit_order" 
                                            textValue="Create Limit Order"
                                            classNames={{
                                                base: "hover:bg-gray-700/50 transition-colors duration-200"
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                                <span>Create Limit Order</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem 
                                            key="close_limit_order" 
                                            textValue="Close Limit Order"
                                            classNames={{
                                                base: "hover:bg-gray-700/50 transition-colors duration-200"
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                                                <span>Close Limit Order</span>
                                            </div>
                                        </SelectItem>
                                    </Select>
                                </div>
                                
                                <div className="bg-gray-900/30 rounded-2xl p-5 border border-gray-700/40 hover:border-gray-600/60 transition-all duration-300 group">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-200 block">Date From</label>
                                            <p className="text-xs text-gray-400">Start date & time</p>
                                        </div>
                                    </div>
                                    <Input
                                        type="datetime-local"
                                        size="sm"
                                        value={dateFrom || ''}
                                        onChange={(e) => handleDateFromChange(e.target.value || null)}
                                        placeholder="Unit creation date"
                                        classNames={{
                                            input: "bg-gray-800/60 text-gray-200 border-gray-600/40 focus:border-green-500/50 transition-all duration-200",
                                            inputWrapper: "bg-gray-800/60 border-gray-600/40 hover:bg-gray-700/60 focus-within:bg-gray-700/60 transition-all duration-200"
                                        }}
                                        className="w-full"
                                    />
                                </div>
                                
                                <div className="bg-gray-900/30 rounded-2xl p-5 border border-gray-700/40 hover:border-gray-600/60 transition-all duration-300 group">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-200 block">Date To</label>
                                            <p className="text-xs text-gray-400">End date & time</p>
                                        </div>
                                    </div>
                                    <Input
                                        type="datetime-local"
                                        size="sm"
                                        value={dateTo || ''}
                                        onChange={(e) => handleDateToChange(e.target.value || null)}
                                        placeholder="Current time"
                                        classNames={{
                                            input: "bg-gray-800/60 text-gray-200 border-gray-600/40 focus:border-red-500/50 transition-all duration-200",
                                            inputWrapper: "bg-gray-800/60 border-gray-600/40 hover:bg-gray-700/60 focus-within:bg-gray-700/60 transition-all duration-200"
                                        }}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <UnitHistoryTable 
                            paginatedData={unitHistoryQuery.data}
                            isLoading={unitHistoryQuery.isLoading}
                            onPageChange={handlePageChange}
                            onItemsPerPageChange={handleItemsPerPageChange}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
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
