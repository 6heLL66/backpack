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
    User
} from '@heroui/react';
import type { UnitDto } from '../../../api/models/UnitDto';
import { formatDate } from '../../../utils';

interface DeletedUnitsTableProps {
    units: UnitDto[];
    onView?: (unit: UnitDto) => void;
    isLoading?: boolean;
}

export const DeletedUnitsTable: React.FC<DeletedUnitsTableProps> = ({
    units,
    onView,
    isLoading = false
}) => {
    const columns = [
        { name: 'UNIT', uid: 'unit' },
        { name: 'SYMBOL', uid: 'symbol' },
        { name: 'SIZE', uid: 'size' },
        { name: 'BATCH', uid: 'batch' },
        { name: 'CREATED', uid: 'created_at' },
        { name: 'DELETED', uid: 'deleted_at' },
        { name: 'ACTIONS', uid: 'actions' }
    ];

    const renderCell = (unit: UnitDto, columnKey: React.Key) => {
        switch (columnKey) {
            case 'unit':
                return (
                    <User
                        name={`Unit ${unit.id.slice(0, 8)}`}
                        description={unit.email}
                        avatarProps={{
                            src: `https://api.dicebear.com/7.x/identicon/svg?seed=${unit.id}`,
                            className: 'w-10 h-10'
                        }}
                        classNames={{
                            name: 'text-white font-semibold',
                            description: 'text-gray-400 text-sm'
                        }}
                    />
                );
            case 'symbol':
                return (
                    <Chip 
                        color="primary" 
                        variant="flat" 
                        size="sm"
                        className="font-mono font-semibold"
                    >
                        {unit.symbol}
                    </Chip>
                );
            case 'size':
                return (
                    <div className="flex flex-col">
                        <span className="text-gray-300 font-semibold">{unit.size}</span>
                        <span className="text-gray-500 text-xs">Size</span>
                    </div>
                );
            case 'batch':
                return (
                    <div className="flex flex-col">
                        <span className="text-gray-300 font-mono text-sm">{unit.batch_id.slice(0, 8)}...</span>
                        <span className="text-gray-500 text-xs">Batch ID</span>
                    </div>
                );
            case 'created_at':
                return (
                    <div className="flex flex-col">
                        <span className="text-gray-300">{formatDate(unit.created_at)}</span>
                        <span className="text-gray-500 text-xs">Created</span>
                    </div>
                );
            case 'deleted_at':
                return (
                    <div className="flex flex-col">
                        <span className="text-gray-300">{unit.deleted_at ? formatDate(unit.deleted_at) : 'N/A'}</span>
                        <span className="text-gray-500 text-xs">{unit.deleted_at ? 'Deleted' : 'Still active'}</span>
                    </div>
                );
            case 'actions':
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            onPress={() => onView?.(unit)}
                            className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border-blue-600/30"
                            startContent={
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            }
                        >
                            View
                        </Button>
                    </div>
                );
            default:
                return null;
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

    if (!units || units.length === 0) {
        return (
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-8 border border-gray-600/50 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <p className="text-gray-300 text-lg font-medium">No deleted units found</p>
                <p className="text-gray-500 mt-2">Deleted units will appear here</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 px-6 py-4 border-b border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white">Deleted Units</h3>
                    <p className="text-gray-400 text-sm mt-1">View and manage your deleted trading units</p>
                </div>
                <Table
                    aria-label="Deleted units table"
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
                    <TableBody items={units} emptyContent="No deleted units found">
                        {(unit) => (
                            <TableRow key={unit.id}>
                                {(columnKey) => (
                                    <TableCell>{renderCell(unit, columnKey)}</TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
