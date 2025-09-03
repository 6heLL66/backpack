import React, { useState } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Tabs,
    Tab,
} from '@heroui/react';
import type { OrderDto, PositionDto } from '../../../api';
import { UnitHistoryTable } from '../../trageHistory/components';
import { useUnitHistory } from '../queries';

interface PositionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    positions: PositionDto[];
    orders: OrderDto[];
    symbol?: string;
    unitId?: string;
}

export const PositionsModal: React.FC<PositionsModalProps> = ({
    isOpen,
    onClose,
    positions,
    orders,
    symbol,
    unitId
}) => {
    const [selectedTab, setSelectedTab] = useState('positions');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);

    const filteredPositions = symbol 
        ? positions.filter(pos => pos.symbol === symbol)
        : positions;

    const filteredOrders = symbol 
        ? orders.filter(order => order.symbol === symbol)
        : orders;

    const offset = (currentPage - 1) * itemsPerPage;
    const unitHistoryQuery = useUnitHistory(
        unitId || '', 
        itemsPerPage, 
        offset
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const positionColumns = [
        { name: 'Symbol', uid: 'symbol' },
        { name: 'Side', uid: 'side' },
        { name: 'Size', uid: 'size' },
        { name: 'Entry Price', uid: 'entryPrice' },
        { name: 'Mark Price', uid: 'markPrice' },
        { name: 'PnL', uid: 'pnl' },
        { name: 'Funding', uid: 'funding' },
        { name: 'Liquidation', uid: 'liquidation' }
    ];

    const orderColumns = [
        { name: 'Symbol', uid: 'symbol' },
        { name: 'Side', uid: 'side' },
        { name: 'Type', uid: 'orderType' },
        { name: 'Quantity', uid: 'quantity' },
        { name: 'Executed Qty', uid: 'executedQuantity' },
        { name: 'Price', uid: 'price' },
        { name: 'Status', uid: 'status' },
        { name: 'Time', uid: 'createdAt' }
    ];

    const renderPositionCell = (position: PositionDto, columnKey: React.Key) => {
        switch (columnKey) {
            case 'symbol':
                return (
                    <Chip 
                        color="primary" 
                        variant="flat" 
                        size="sm"
                        className="bg-blue-500/10 text-blue-300 border border-blue-500/20"
                    >
                        {position.symbol}
                    </Chip>
                );
            case 'side': {
                const isLong = parseFloat(position.netQuantity) > 0;
                const sideColor = isLong ? 'success' : 'danger';
                const sideBg = isLong ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20';
                const sideText = isLong ? 'LONG' : 'SHORT';
                
                return (
                    <Chip 
                        color={sideColor}
                        variant="flat" 
                        size="sm"
                        className={sideBg}
                    >
                        {sideText}
                    </Chip>
                );
            }
            case 'size':
                return (
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-200 font-medium">
                            {parseFloat(position.netQuantity).toFixed(4)}
                        </span>
                        <span className="text-xs text-gray-400">
                            ${parseFloat(position.netCost).toFixed(2)}
                        </span>
                    </div>
                );
            case 'entryPrice':
                return (
                    <span className="text-gray-200 font-medium">
                        ${parseFloat(position.entryPrice).toFixed(4)}
                    </span>
                );
            case 'markPrice':
                return (
                    <span className="text-gray-200 font-medium">
                        ${parseFloat(position.markPrice).toFixed(4)}
                    </span>
                );
            case 'pnl': {
                const pnl = parseFloat(position.pnlUnrealized);
                const pnlColor = pnl >= 0 ? 'success' : 'danger';
                const pnlBg = pnl >= 0 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20';
                
                return (
                    <div className="flex flex-col gap-1">
                        <Chip 
                            color={pnlColor}
                            variant="flat" 
                            size="sm"
                            className={pnlBg}
                        >
                            ${pnl.toFixed(2)}
                        </Chip>
                        <span className="text-xs text-gray-400">
                            Realized: ${parseFloat(position.pnlRealized).toFixed(2)}
                        </span>
                    </div>
                );
            }
            case 'funding': {
                const funding = parseFloat(position.cumulativeFundingPayment);
                const fundingColor = funding >= 0 ? 'success' : 'danger';
                const fundingBg = funding >= 0 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20';
                
                return (
                    <div className="flex flex-col gap-1">
                        <Chip 
                            color={fundingColor}
                            variant="flat" 
                            size="sm"
                            className={fundingBg}
                        >
                            ${funding.toFixed(4)}
                        </Chip>
                        <span className="text-xs text-gray-400">
                            Interest: ${parseFloat(position.cumulativeInterest).toFixed(4)}
                        </span>
                    </div>
                );
            }
            case 'liquidation':
                return (
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-200 font-medium">
                            ${parseFloat(position.estLiquidationPrice).toFixed(4)}
                        </span>
                        <span className="text-xs text-gray-400">
                            Break-even: ${parseFloat(position.breakEvenPrice).toFixed(4)}
                        </span>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderOrderCell = (order: OrderDto, columnKey: React.Key) => {
        switch (columnKey) {
            case 'symbol':
                return (
                    <Chip 
                        color="primary" 
                        variant="flat" 
                        size="sm"
                        className="bg-blue-500/10 text-blue-300 border border-blue-500/20"
                    >
                        {order.symbol}
                    </Chip>
                );
            case 'side': {
                const sideColor = order.side === 'Bid' ? 'success' : 'danger';
                const sideBg = order.side === 'Bid' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20';
                return (
                    <Chip 
                        color={sideColor}
                        variant="flat" 
                        size="sm"
                        className={sideBg}
                    >
                        {order.side}
                    </Chip>
                );
            }
            case 'orderType':
                return (
                    <Chip 
                        color="secondary" 
                        variant="flat" 
                        size="sm"
                        className="bg-purple-500/10 text-purple-300 border border-purple-500/20"
                    >
                        {order.orderType}
                    </Chip>
                );
            case 'quantity':
                return (
                    <span className="text-gray-200 font-medium">
                        {parseFloat(order.quantity).toFixed(4)}
                    </span>
                );
            case 'executedQuantity':
                return (
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-200 font-medium">
                            {parseFloat(order.executedQuantity).toFixed(4)}
                        </span>
                        <span className="text-xs text-gray-400">
                            ${parseFloat(order.executedQuoteQuantity).toFixed(2)}
                        </span>
                    </div>
                );
            case 'price':
                return (
                    <span className="text-gray-200 font-medium">
                        {order.price ? `$${parseFloat(order.price).toFixed(4)}` : 'Market'}
                    </span>
                );
            case 'status': {
                const statusColor = order.status === 'FILLED' ? 'success' : 'warning';
                const statusBg = order.status === 'FILLED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
                return (
                    <Chip 
                        color={statusColor}
                        variant="flat" 
                        size="sm"
                        className={statusBg}
                    >
                        {order.status}
                    </Chip>
                );
            }
            case 'createdAt':
                return (
                    <span className="text-gray-400 text-sm">
                        {new Date(order.createdAt).toLocaleString()}
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="5xl" className="min-w-[1400px]" scrollBehavior="inside">
            <ModalContent className="bg-gray-900 border border-gray-700">
                <ModalHeader className="flex flex-col gap-1 border-b border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-200">
                        {symbol ? `${symbol} Positions` : 'Batch Positions'}
                    </h3>
                    <p className="text-sm text-gray-400">
                        {filteredPositions.length} position{filteredPositions.length !== 1 ? 's' : ''}
                    </p>
                </ModalHeader>
                <ModalBody className="py-4">
                    <Tabs
                        selectedKey={selectedTab}
                        onSelectionChange={(key) => setSelectedTab(key as string)}
                        classNames={{
                            tabList: "bg-gray-800/50 border border-gray-700/50 rounded-lg p-1",
                            tab: "text-gray-400 data-[selected=true]:text-white data-[selected=true]:bg-blue-500/20 data-[selected=true]:border-blue-500/30",
                            tabContent: "text-gray-300",
                            panel: "pt-6"
                        }}
                        className="w-full"
                    >
                        <Tab
                            key="positions"
                            title={
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <span>Positions</span>
                                    <Chip size="sm" color="primary" variant="flat" className="ml-1">
                                        {filteredPositions.length}
                                    </Chip>
                                </div>
                            }
                        >
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-200">Current Positions</h4>
                                </div>
                                <div className="overflow-x-auto rounded-lg border border-gray-700/30">
                                    <Table
                                        aria-label="Detailed positions"
                                        classNames={{
                                            wrapper: "min-h-[300px]",
                                            th: "bg-gray-800/50 text-gray-300 border-b border-gray-700/50 px-4 py-3 font-semibold text-sm",
                                            td: "border-b border-gray-700/30 px-4 py-3",
                                            tr: "hover:bg-gray-800/30 transition-colors duration-200",
                                            table: "min-w-full"
                                        }}
                                    >
                                        <TableHeader columns={positionColumns}>
                                            {(column) => (
                                                <TableColumn key={column.uid} className="text-left">
                                                    {column.name}
                                                </TableColumn>
                                            )}
                                        </TableHeader>
                                        <TableBody items={filteredPositions}>
                                            {(position) => (
                                                <TableRow key={`${position.symbol}-${position.entryPrice}`}>
                                                    {(columnKey) => (
                                                        <TableCell>{renderPositionCell(position, columnKey)}</TableCell>
                                                    )}
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </Tab>

                        <Tab
                            key="orders"
                            title={
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <span>Orders</span>
                                    <Chip size="sm" color="secondary" variant="flat" className="ml-1">
                                        {filteredOrders.length}
                                    </Chip>
                                </div>
                            }
                        >
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h4 className="text-lg font-semibold text-gray-200">Active Orders</h4>
                                </div>
                                <div className="overflow-x-auto rounded-lg border border-gray-700/30">
                                    <Table
                                        aria-label="Active orders"
                                        classNames={{
                                            wrapper: "min-h-[300px]",
                                            th: "bg-gray-800/50 text-gray-300 border-b border-gray-700/50 px-4 py-3 font-semibold text-sm",
                                            td: "border-b border-gray-700/30 px-4 py-3",
                                            tr: "hover:bg-gray-800/30 transition-colors duration-200",
                                            table: "min-w-full"
                                        }}
                                    >
                                        <TableHeader columns={orderColumns}>
                                            {(column) => (
                                                <TableColumn key={column.uid} className="text-left">
                                                    {column.name}
                                                </TableColumn>
                                            )}
                                        </TableHeader>
                                        <TableBody items={filteredOrders}>
                                            {(order) => (
                                                <TableRow key={order.id}>
                                                    {(columnKey) => (
                                                        <TableCell>{renderOrderCell(order, columnKey)}</TableCell>
                                                    )}
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </Tab>

                        <Tab
                            key="unit-history"
                            title={
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Unit History</span>
                                    <Chip size="sm" color="warning" variant="flat" className="ml-1">
                                        {unitHistoryQuery.data?.count || 0}
                                    </Chip>
                                </div>
                            }
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-200">Unit Order History</h4>
                                    </div>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="flat"
                                        onPress={() => unitHistoryQuery.refetch()}
                                        isLoading={unitHistoryQuery.isFetching}
                                        className="bg-orange-500/10 text-orange-300 border border-orange-500/20 hover:bg-orange-500/20 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </Button>
                                </div>
                                {unitId ? (
                                    <UnitHistoryTable 
                                        paginatedData={unitHistoryQuery.data}
                                        isLoading={unitHistoryQuery.isLoading}
                                        onPageChange={handlePageChange}
                                        onItemsPerPageChange={handleItemsPerPageChange}
                                        currentPage={currentPage}
                                        itemsPerPage={itemsPerPage}
                                    />
                                ) : (
                                    <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-8 border border-gray-600/50 text-center">
                                        <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-300 text-lg font-medium">No Unit Selected</p>
                                        <p className="text-gray-500 mt-2">Select a unit to view its order history</p>
                                    </div>
                                )}
                            </div>
                        </Tab>
                    </Tabs>
                </ModalBody>
                <ModalFooter className="border-t border-gray-700">
                    <Button 
                        color="primary" 
                        variant="flat" 
                        onPress={onClose}
                        className="bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20"
                    >
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

