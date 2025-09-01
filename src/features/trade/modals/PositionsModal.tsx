import React from 'react';
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
    Divider,
} from '@heroui/react';
import type { OrderDto, PositionDto } from '../../../api';

interface PositionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    positions: PositionDto[];
    orders: OrderDto[];
    symbol?: string;
}

export const PositionsModal: React.FC<PositionsModalProps> = ({
    isOpen,
    onClose,
    positions,
    orders,
    symbol
}) => {
    const filteredPositions = symbol 
        ? positions.filter(pos => pos.symbol === symbol)
        : positions;

    const filteredOrders = symbol 
        ? orders.filter(order => order.symbol === symbol)
        : orders;

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
            case 'side':
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
            case 'size':
                return (
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-200 font-medium">
                            {parseFloat(position.netQuantity).toFixed(4)}
                        </span>
                        <span className="text-xs text-gray-400">
                            ${parseFloat(position.netExposureNotional).toFixed(2)}
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
            case 'pnl':
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
            case 'funding':
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
            case 'side':
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
            case 'status':
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
        <Modal isOpen={isOpen} onClose={onClose} size="5xl" scrollBehavior="inside">
            <ModalContent className="bg-gray-900 border border-gray-700">
                <ModalHeader className="flex flex-col gap-1 border-b border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-200">
                        {symbol ? `${symbol} Positions` : 'Batch Positions'}
                    </h3>
                    <p className="text-sm text-gray-400">
                        {filteredPositions.length} position{filteredPositions.length !== 1 ? 's' : ''}
                    </p>
                </ModalHeader>
                <ModalBody className="py-4 space-y-6">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-200 mb-3">Positions</h4>
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

                    <Divider className="bg-gray-700" />

                    <div>
                        <h4 className="text-lg font-semibold text-gray-200 mb-3">Orders</h4>
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

