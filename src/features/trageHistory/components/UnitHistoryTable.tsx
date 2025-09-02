import React from 'react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Button,
    Select,
    SelectItem,
    Spinner,
    Tooltip
} from '@heroui/react';
import type { OrderHistoryDto } from '../../../api/models/OrderHistoryDto';
import type { PaginatedResponseDto_OrderHistoryDto_ } from '../../../api/models/PaginatedResponseDto_OrderHistoryDto_';
import { formatDate } from '../../../utils';
import { OrderSide } from '../../../api';

interface UnitHistoryTableProps {
    paginatedData: PaginatedResponseDto_OrderHistoryDto_ | undefined;
    isLoading?: boolean;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
    currentPage: number;
    itemsPerPage: number;
}

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export const UnitHistoryTable: React.FC<UnitHistoryTableProps> = ({
    paginatedData,
    isLoading = false,
    onPageChange,
    onItemsPerPageChange,
    currentPage,
    itemsPerPage
}) => {

    const handleCopyId = async (id: string) => {
        try {
            await navigator.clipboard.writeText(id);
        } catch (err) {
            console.error('Failed to copy ID:', err);
        }
    };

    const columns = [
        { name: 'ACTION', uid: 'action' },
        { name: 'IDS', uid: 'account_id' },
        { name: 'SIZE', uid: 'size' },
        { name: 'PRICE', uid: 'price' },
        { name: 'SIDE', uid: 'side' },
        { name: 'STATUS', uid: 'status' },
        { name: 'CREATED', uid: 'created_at' }
    ];

    const getActionColor = (action: string) => {
        switch (action) {
            case 'create_market_order':
                return 'success';
            case 'close_market_order':
                return 'warning';
            case 'create_limit_order':
                return 'primary';
            case 'close_limit_order':
                return 'secondary';
            default:
                return 'default';
        }
    };

    const getActionLabel = (action: string) => {
        switch (action) {
            case 'create_market_order':
                return 'Create Market';
            case 'close_market_order':
                return 'Close Market';
            case 'create_limit_order':
                return 'Create Limit';
            case 'close_limit_order':
                return 'Close Limit';
            default:
                return action;
        }
    };

    const renderCell = (item: OrderHistoryDto, columnKey: React.Key) => {
        switch (columnKey) {
            case 'action':
                return (
                    <div className="flex flex-col gap-2">
                        <Chip 
                            color={getActionColor(item.action) as any}
                            variant="flat" 
                            size="sm"
                            className="font-semibold"
                        >
                            {getActionLabel(item.action)}
                        </Chip>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-xs">ID:</span>
                            <code className="text-gray-300 text-xs bg-gray-800/50 px-2 py-1 rounded font-mono cursor-pointer hover:bg-gray-700/50" onClick={() => handleCopyId(item.id)}>
                                {item.id}
                            </code>
                        </div>
                    </div>
                );
            case 'account_id':
                return (
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-300 font-mono text-sm">
                                {item.account_id ? item.account_id : 'N/A'}
                            </span>
                            <button
                                onClick={() => handleCopyId(item.account_id)}
                                className="p-1 rounded hover:bg-gray-700/50 transition-colors group"
                                title="Copy Account ID"
                            >
                                <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </button>
                        </div>
                        <span className="text-gray-500 text-xs mt-1">Account ID</span>
                    </div>
                );
            case 'size':
                return (
                    <div className="flex flex-col">
                        <span className="text-gray-300 font-semibold">
                            {item.order?.size || 'N/A'}
                        </span>
                        <span className="text-gray-500 text-xs">Size</span>
                    </div>
                );
            case 'price':
                return (
                    <div className="flex flex-col">
                        <span className="text-gray-300">
                            {item.order?.price || 'N/A'}
                        </span>
                        <span className="text-gray-500 text-xs">Price</span>
                    </div>
                );
            case 'side':
                return (
                    <div className="flex flex-col">
                        {item.order?.side ? (
                            <Chip 
                                color={item.order.side === OrderSide.BID ? 'success' : 'danger'}
                                variant="flat" 
                                size="sm"
                            >
                                {item.order.side}
                            </Chip>
                        ) : (
                            <span className="text-gray-500">N/A</span>
                        )}
                        <span className="text-gray-500 text-xs">Side</span>
                    </div>
                );
            case 'status':
                return (
                    <div className="flex flex-col">
                        {item.error ? (
                            <Tooltip
                                content={
                                    <div className="max-w-md p-2">
                                        <div className="flex items-start gap-2">
                                            <svg className="w-3 h-3 text-orange-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                            <div className="text-gray-100 text-xs leading-relaxed whitespace-pre-wrap">
                                                {item.error}
                                            </div>
                                        </div>
                                    </div>
                                }
                                placement="top"
                                classNames={{
                                    content: "bg-gray-800/95 border border-gray-600/50 shadow-xl backdrop-blur-sm"
                                }}
                                showArrow
                            >
                                <span className="text-orange-400 text-xs cursor-help hover:text-orange-300 transition-colors">
                                    Failed
                                </span>
                            </Tooltip>
                        ) : (
                            <span className="text-green-400 text-xs">Success</span>
                        )}
                        <span className="text-gray-500 text-xs">Status</span>
                    </div>
                );
            case 'created_at':
                return (
                    <div className="flex flex-col">
                        <span className="text-gray-300">{formatDate(item.created_at, {second: '2-digit'})}</span>
                        <span className="text-gray-500 text-xs">Created</span>
                    </div>
                );
            default:
                return null;
        }
    };

    const history = paginatedData?.items || [];
    const totalCount = paginatedData?.count || 0;
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const onNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const onPreviousPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    return (
        <div className="w-full mt-8">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 px-6 py-4 border-b border-gray-700/50">
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">Unit History</h3>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">Order history and execution details</p>
                </div>
                
                <div className="flex items-center justify-between px-6 py-3 bg-gray-800/30 border-b border-gray-700/50">
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400 text-sm">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} entries
                        </span>
                        <Select
                            size="sm"
                            selectedKeys={new Set([itemsPerPage.toString()])}
                            onSelectionChange={(keys) => {
                                const selectedValue = Array.from(keys)[0] as string;
                                onItemsPerPageChange(Number(selectedValue));
                                onPageChange(1);
                            }}
                            className="w-24"
                        >
                            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                                <SelectItem key={option} textValue={option.toString()}>
                                    {option}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                </div>

                <div className="relative">
                    <Table
                        aria-label="Unit history table"
                        classNames={{
                            wrapper: "min-h-[400px]",
                            th: "bg-gray-800/50 text-gray-300 border-b border-gray-700/50 px-6 py-4 font-semibold",
                            td: "border-b border-gray-700/30 px-6 py-4",
                            tr: "hover:bg-gray-700/20 transition-colors duration-200",
                            table: "min-w-full"
                        }}
                    >
                        <TableHeader columns={columns}>
                            {(column) => (
                                <TableColumn key={column.uid} className="text-left">
                                    {column.name}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody items={history} emptyContent="No history found">
                            {(item) => (
                                <TableRow key={item.id}>
                                    {(columnKey) => (
                                        <TableCell>{renderCell(item, columnKey)}</TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    
                    {isLoading && (
                        <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center">
                            <div className="bg-gray-800/90 rounded-lg px-4 py-3 flex items-center gap-3">
                                <Spinner size="sm" color="primary" />
                                <span className="text-gray-200 text-sm">Updating data...</span>
                            </div>
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 bg-gray-800/30 border-t border-gray-700/50">
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="flat"
                                onPress={onPreviousPage}
                                isDisabled={currentPage === 1}
                                className="bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                            >
                                Previous
                            </Button>
                            <Button
                                size="sm"
                                variant="flat"
                                onPress={onNextPage}
                                isDisabled={currentPage === totalPages}
                                className="bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                            >
                                Next
                            </Button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-sm">Page</span>
                            <span className="text-gray-300 font-medium">{currentPage}</span>
                            <span className="text-gray-400 text-sm">of</span>
                            <span className="text-gray-300 font-medium">{totalPages}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
