import React from 'react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Badge,
    Button
} from '@heroui/react';
import { type UnitDto, type BatchDto, type PositionDto, DefaultService } from '../../../api';
import { useBatchOrders, useBatchPositions, useMarkets } from '../queries';
import { formatDateShort } from '../../../utils';
import { PositionsModal } from '../modals';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface BatchAccordionProps {
    batchId: string;
    batch: BatchDto | undefined;
    batchUnits: UnitDto[];
}

export const BatchAccordion: React.FC<BatchAccordionProps> = ({
    batchId,
    batch,
    batchUnits,
}) => {
    const queryClient = useQueryClient();
    const { positions } = useBatchPositions(batchId);
    const { getPriceBySymbol } = useMarkets();
    const [isPositionsModalOpen, setIsPositionsModalOpen] = React.useState(false);
    const [selectedSymbol, setSelectedSymbol] = React.useState<string | undefined>();

    const { orders } = useBatchOrders(batchId);

    const unitColumns = [
        { name: 'SYMBOL', uid: 'symbol' },
        { name: 'SIZE', uid: 'size' },
        { name: 'STATUS', uid: 'status' },
        { name: 'POSITIONS', uid: 'positions' },
        { name: 'CREATED', uid: 'created_at' },
        { name: 'ACTIONS', uid: 'actions' }
    ];

    const closeUnitMutation = useMutation({
        mutationFn: async (unitId: string) => {
            await DefaultService.unitDeleteApiBackpackUnitsUnitIdDelete({ unitId });
        }
    });

    const handleCloseUnit = (unitId: string) => {
        closeUnitMutation.mutateAsync(unitId).then(() => {
            queryClient.invalidateQueries({ queryKey: ['active-units'] });
        });
    };

    const handleViewPositions = (symbol?: string) => {
        setSelectedSymbol(symbol);
        setIsPositionsModalOpen(true);
    };

    const handleClosePositionsModal = () => {
        setIsPositionsModalOpen(false);
        setSelectedSymbol(undefined);
    };

    const renderUnitCell = (unit: UnitDto, columnKey: React.Key, positions: Record<string, PositionDto[]>) => {
        const unitPositions = Object.values(positions).flat().filter(position => position.symbol === unit.symbol);
        const price = getPriceBySymbol(unit.symbol);
        const sizeNum = parseFloat(unit.size);
        const priceNum = price ? parseFloat(price) : 0;
        const totalValue = sizeNum * priceNum;

        switch (columnKey) {
            case 'symbol':
                return (
                    <Chip 
                        color="primary" 
                        variant="flat" 
                        size="sm"
                        className="bg-blue-500/10 text-blue-300 border border-blue-500/20"
                    >
                        {unit.symbol}
                    </Chip>
                );
            case 'size':
                return (
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-200 font-medium">{unit.size}</span>
                        {price && (
                            <span className="text-xs text-gray-400">
                                ${totalValue.toLocaleString('en-US', { 
                                    minimumFractionDigits: 2, 
                                    maximumFractionDigits: 2 
                                })}
                            </span>
                        )}
                    </div>
                );
            case 'positions':
                return (
                    <div className="flex items-center gap-2">
                        <span className="text-gray-200 font-medium">{unitPositions.length}</span>
                        {unitPositions.length > -1 && (
                            <Button
                                size="sm"
                                variant="flat"
                                color="primary"
                                className="bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20"
                                onPress={() => handleViewPositions(unit.symbol)}
                            >
                                View
                            </Button>
                        )}
                    </div>
                );
            case 'status':
                return (
                    <Badge
                        color={unit.start_processing_at ? 'success' : 'warning'}
                        variant="flat"
                        size="md"
                        className={unit.start_processing_at 
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        }
                    >
                        {unit.start_processing_at ? 'Active' : 'Pending'}
                    </Badge>
                );
            case 'created_at':
                return (
                    <span className="text-gray-400 text-sm">
                        {unit.created_at ? formatDateShort(unit.created_at) : 'N/A'}
                    </span>
                );
            case 'actions':
                return (
                    <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        className="bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20"
                        onPress={() => handleCloseUnit(unit.id)}
                        isDisabled={!unit.batch_id}
                        isLoading={closeUnitMutation.isPending}
                    >
                        Close unit
                    </Button>
                );
            default:
                return null;
        }
    };

    return (
        <div className="px-2 pb-4">
            <div className="overflow-x-auto rounded-lg border border-gray-700/30">
                <Table
                    aria-label={`Units in batch ${batch?.name}`}
                    classNames={{
                        wrapper: "min-h-[200px]",
                        th: "bg-gray-800/50 text-gray-300 border-b border-gray-700/50 px-4 py-3 font-semibold text-sm",
                        td: "border-b border-gray-700/30 px-4 py-3",
                        tr: "hover:bg-gray-800/30 transition-colors duration-200",
                        table: "min-w-full"
                    }}
                    key={Object.values(positions).flat().length}
                >
                    <TableHeader columns={unitColumns}>
                        {(column) => (
                            <TableColumn key={column.uid} className="text-left">
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody items={batchUnits}>
                        {(unit) => (
                            <TableRow key={unit.id}>
                                {(columnKey) => (
                                    <TableCell>{renderUnitCell(unit, columnKey, positions)}</TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <PositionsModal
                isOpen={isPositionsModalOpen}
                onClose={handleClosePositionsModal}
                positions={Object.values(positions).flat()}
                orders={Object.values(orders ?? {}).flat()}
                symbol={selectedSymbol}
                unitId={batchUnits.find(unit => unit.symbol === selectedSymbol)?.id}
            />
        </div>
    );
};
