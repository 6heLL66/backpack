import React, { useState, useMemo } from 'react';
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
} from '@heroui/react';
import type { OrderHistoryDto } from '../../../api/models/OrderHistoryDto';
import { formatDate } from '../../../utils';
import { OrderSide } from '../../../api';

interface UnitHistoryTableProps {
    history: OrderHistoryDto[];
    isLoading?: boolean;
}

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export const UnitHistoryTable: React.FC<UnitHistoryTableProps> = ({
    history,
    isLoading = false
}) => {
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);

    const handleCopyId = async (id: string) => {
        try {
            await navigator.clipboard.writeText(id);
        } catch (err) {
            console.error('Failed to copy ID:', err);
        }
    };

    const columns = [
        { name: 'ACTION', uid: 'action' },
        { name: 'ACCOUNT ID', uid: 'account_id' },
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
                            <span className="text-gray-300 font-semibold font-mono">
                                {item.account_id || 'N/A'}
                            </span>
                            <Button
                                size="sm"
                                variant="light"
                                className="min-w-0 p-1 h-6 text-gray-400 hover:text-gray-300"
                                onPress={() => handleCopyId(item.account_id)}
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </Button>
                        </div>
                        <span className="text-gray-500 text-xs">Account ID</span>
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
                            {item.order?.price || 'Market'}
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
                            <span className="text-red-400 text-xs">Failed</span>
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

    const paginatedHistory = useMemo(() => {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return history.slice(startIndex, endIndex);
    }, [history, page, itemsPerPage]);

    const totalPages = Math.ceil(history.length / itemsPerPage);

    const onNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const onPreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full">
                <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="h-16 bg-gray-700/50 rounded-lg"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!history || history.length === 0) {
        return (
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-8 border border-gray-600/50 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <p className="text-gray-300 text-lg font-medium">No history found</p>
                <p className="text-gray-500 mt-2">This unit has no order history</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 px-6 py-4 border-b border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white">Unit History</h3>
                    <p className="text-gray-400 text-sm mt-1">Order history and execution details</p>
                </div>
                
                <div className="flex items-center justify-between px-6 py-3 bg-gray-800/30 border-b border-gray-700/50">
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400 text-sm">
                            Showing {((page - 1) * itemsPerPage) + 1} to {Math.min(page * itemsPerPage, history.length)} of {history.length} entries
                        </span>
                        <Select
                            size="sm"
                            value={itemsPerPage.toString()}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setPage(1);
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
                    <TableBody items={paginatedHistory} emptyContent="No history found">
                        {(item) => (
                            <TableRow key={item.id}>
                                {(columnKey) => (
                                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 bg-gray-800/30 border-t border-gray-700/50">
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="flat"
                                onPress={onPreviousPage}
                                isDisabled={page === 1}
                                className="bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                            >
                                Previous
                            </Button>
                            <Button
                                size="sm"
                                variant="flat"
                                onPress={onNextPage}
                                isDisabled={page === totalPages}
                                className="bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                            >
                                Next
                            </Button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-sm">Page</span>
                            <span className="text-gray-300 font-medium">{page}</span>
                            <span className="text-gray-400 text-sm">of</span>
                            <span className="text-gray-300 font-medium">{totalPages}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
