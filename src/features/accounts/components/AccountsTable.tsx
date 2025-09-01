import React, { useState } from 'react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    User
} from '@heroui/react';
import type { IntegrationAccountDto } from '../../../api/models/IntegrationAccountDto';
import { formatDate } from '../../../utils';

interface AccountsTableProps {
    accounts: IntegrationAccountDto[];
    onEdit?: (account: IntegrationAccountDto) => void;
    onDelete?: (accountId: string) => void;
    isLoading?: boolean;
}

export const AccountsTable: React.FC<AccountsTableProps> = ({
    accounts,
    onEdit,
    onDelete,
    isLoading = false
}) => {


    const columns = [
        { name: 'ACCOUNT', uid: 'account' },
        { name: 'API KEY', uid: 'api_key' },
        { name: 'PROXY', uid: 'proxy' },
        { name: 'CREATED', uid: 'created_at' },
        { name: 'ACTIONS', uid: 'actions' }
    ];

    const renderCell = (account: IntegrationAccountDto, columnKey: React.Key) => {
        switch (columnKey) {
            case 'account':
                return (
                    <User
                        name={`Account ${account.id.slice(0, 8)}`}
                        description={`ID: ${account.id}`}
                        avatarProps={{
                            src: `https://api.dicebear.com/7.x/identicon/svg?seed=${account.id}`,
                            className: 'w-10 h-10'
                        }}
                        classNames={{
                            name: 'text-white font-semibold',
                            description: 'text-gray-400 text-sm'
                        }}
                    />
                );
            case 'api_key':
                return (
                    <div className="flex flex-col">
                        <span className="text-gray-300 font-mono text-sm cursor-pointer">
                            <Chip color="primary" variant="flat" onClick={() => navigator.clipboard.writeText(account.api_key)} size="sm">{account.api_key.slice(0, 4)}...{account.api_key.slice(-4)}</Chip>
                        </span>
                    </div>
                );
            case 'proxy':
                return (
                    <div className="flex flex-col">
                        <span className="text-gray-300 font-mono text-sm cursor-pointer">{account.proxy || 'No proxy'}</span>
                    </div>
                );
            case 'created_at':
                return (
                    <div className="flex flex-col">
                        <span className="text-gray-300">{formatDate(account.created_at)}</span>
                    </div>
                );
            case 'actions':
                return (
                    <div className="flex items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    className="text-gray-400 hover:text-gray-300 hover:bg-gray-400/10"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Account actions">
                                <DropdownItem
                                    key="edit"
                                    startContent={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    }
                                    onPress={() => onEdit?.(account)}
                                >
                                    Edit Account
                                </DropdownItem>
                                <DropdownItem
                                    key="delete"
                                    className="text-danger"
                                    color="danger"
                                    startContent={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    }
                                    onPress={() => onDelete?.(account.id)}
                                >
                                    Delete Account
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
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

    if (!accounts || accounts.length === 0) {
        return (
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-8 border border-gray-600/50 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <p className="text-gray-300 text-lg font-medium">No accounts yet</p>
                <p className="text-gray-500 mt-2">Create your first integration account to get started</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl border border-gray-700/50 overflow-hidden">
                <Table
                    aria-label="Accounts table"
                    classNames={{
                        wrapper: "min-h-[400px]",
                        th: "bg-gray-800/50 text-gray-300 border-b border-gray-700/50 px-6 py-4",
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
                    <TableBody items={accounts} emptyContent="No accounts found">
                        {(account) => (
                            <TableRow key={account.id}>
                                {(columnKey) => (
                                    <TableCell>{renderCell(account, columnKey)}</TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
