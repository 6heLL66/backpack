import { useEffect, useState } from 'react';
import { CreateAccountModal } from './modals';
import { AccountsTable } from './components/AccountsTable';
import { AccountService } from '../../api';
import { useMutation } from '@tanstack/react-query';
import {
    Card,
    CardBody,
    Button,
    Divider
} from '@heroui/react';
import type { IntegrationAccountDto } from '../../api/models/IntegrationAccountDto';
import { useAccounts } from './queries';

export const Accounts = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<IntegrationAccountDto | null>(null);

    const { data: accounts = [], isLoading, refetch } = useAccounts();

    const deleteMutation = useMutation({
        mutationFn: (id: string) => AccountService.accountDeleteApiBackpackAccountsAccountIdDelete({accountId: id}), // TODO: Implement delete when API is available
        onSuccess: () => {
            refetch();
        }
    });

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAccount(null);
        refetch();
    };

    const handleEdit = (account: IntegrationAccountDto) => {
        setEditingAccount(account);
        openModal();
    };

    const handleDelete = (_: string) => {
        if (confirm('Are you sure you want to delete this account?')) {
            deleteMutation.mutate(_);
        }
    };

    useEffect(() => {
        if (accounts.length > 0) {
            AccountService.accountsUpdateLeveragesApiBackpackAccountsLeveragesPatch({ accountIds: accounts.map(account => account.id), requestBody: { leverage: 5 } }).then(() => {
                AccountService.accountsLeveragesApiBackpackAccountsLeveragesGet({ accountIds: accounts.map(account => account.id) });
            });
        }
    }, [accounts]);

    return (
        <>
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-indigo-500/50 hover:shadow-2xl transition-all duration-300">
                <CardBody className="p-6">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-3">
                                Accounts
                            </h1>
                            <p className="text-gray-400 text-lg">Manage your integration accounts</p>
                        </div>
                        <Button
                            color="primary"
                            onPress={openModal}
                            size="lg"
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-4 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                            startContent={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            }
                        >
                            Create Account
                        </Button>
                    </div>
                    
                    <Divider className="bg-gray-700 mb-6" />
                    
                    <AccountsTable
                        accounts={accounts}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isLoading={isLoading}
                    />
                </CardBody>
            </Card>

            {isModalOpen && <CreateAccountModal
                isOpen={isModalOpen}
                onClose={closeModal}
                data={editingAccount ?? undefined}
            />}
        </>
    );
};
