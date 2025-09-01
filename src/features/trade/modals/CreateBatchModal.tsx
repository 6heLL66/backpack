import { useState } from 'react';
import type { BatchCreateRequestDto } from '../../../api/models/BatchCreateRequestDto';
import { AccountService, type BatchDto, type IntegrationAccountDto } from '../../../api';
import { useMutation } from '@tanstack/react-query';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Divider,
    Select,
    SelectItem
} from '@heroui/react';

interface CreateBatchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    data?: BatchDto;
    accounts: IntegrationAccountDto[];
}

export const CreateBatchModal = ({ isOpen, onClose, data, accounts, onSuccess }: CreateBatchModalProps) => {
    const [formData, setFormData] = useState<BatchCreateRequestDto>({
        name: data?.name ?? ''
    }); 
    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

    const createBatchMutation = useMutation({
        mutationFn: async (data: BatchCreateRequestDto) => {
            const batch = await AccountService.batchCreateApiBackpackBatchesPost({ requestBody: data });

            const promises = accounts.map(account => {
                return AccountService.accountUpdateApiBackpackAccountsAccountIdPatch({ accountId: account.id, requestBody: { batch_id: batch.id } });
            });
            await Promise.all(promises);

            return batch;
        },
        onSuccess: () => {
            onSuccess();
        }
    })

    const updateBatchMutation = useMutation({
        mutationFn: (data: BatchCreateRequestDto & { id: string }) => {
            return AccountService.batchUpdateApiBackpackBatchesBatchIdPatch({ batchId: data.id, requestBody: data });
        },
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAccountSelection = (keys: any) => {
        const selectedKeys = Array.from(keys) as string[];
        setSelectedAccounts(selectedKeys);
    };

    const handleClose = () => {
        setFormData({ name: '' });
        setSelectedAccounts([]);
        onClose();
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={handleClose}
            size="2xl"
            classNames={{
                backdrop: "bg-gradient-to-t from-zinc-900/90 backdrop-blur-sm",
                base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] shadow-2xl",
                header: "border-b-[1px] border-[#292f46]",
                body: "py-8",
                closeButton: "hover:bg-white/5 active:bg-white/10",
            }}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
                                {data ? 'Update Batch' : 'Create New Batch'}
                            </h2>
                            <p className="text-gray-400 text-base mt-1">
                                {data ? 'Update your existing batch configuration' : 'Create a new batch for organizing your trading operations'}
                            </p>
                        </div>
                    </div>
                </ModalHeader>
                <Divider className="bg-[#292f46]" />
                <ModalBody>
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                Batch Name
                            </label>
                            <Input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter a descriptive batch name"
                                variant="bordered"
                                classNames={{
                                    input: "text-gray-100 text-lg font-medium",
                                    inputWrapper: "bg-[#1a1a2e] border-[#292f46] hover:border-[#3a3a5a] focus-within:border-blue-500 h-12 transition-all duration-300",
                                }}
                                required
                            />
                            <p className="text-gray-500 text-xs">Choose a name that helps identify this batch's purpose</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                Select Integration Accounts
                            </label>
                            <Select
                                placeholder="Choose accounts to include in this batch"
                                selectionMode="multiple"
                                selectedKeys={selectedAccounts}
                                onSelectionChange={handleAccountSelection}
                                renderValue={(items) => {
                                    const accountIds = Array.from(items).map(item => item.key).join(', ');
                                    return (
                                        <span className="text-blue-400 font-mono text-sm">
                                            {accountIds}
                                        </span>
                                    );
                                }}
                                variant="bordered"
                                classNames={{
                                    trigger: "bg-[#1a1a2e] border-[#292f46] hover:border-[#3a3a5a] focus-within:border-blue-500 h-12 transition-all duration-300",
                                    listbox: "bg-[#1a1a2e] border-[#292f46]",
                                    popoverContent: "bg-[#1a1a2e] border-[#292f46]",
                                }}
                            >
                                {accounts.filter(account => !account.batch_id).map((account) => (
                                    <SelectItem 
                                        key={account.id} 
                                        className="text-gray-100 hover:bg-[#2a2a3a] transition-colors duration-200"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-mono text-sm">{account.id}</span>
                                                <span className="text-gray-500 text-xs">
                                                    {account.api_key ? `API: ${account.api_key.slice(0, 12)}...` : 'No API key'}
                                                </span>
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </Select>
                            <p className="text-gray-500 text-xs">Select the accounts you want to organize under this batch</p>
                        </div>

                        {selectedAccounts.length > 0 && (
                            <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-blue-400 font-medium">Accounts selected</p>
                                        <p className="text-blue-500 text-sm">Ready to {data ? 'update' : 'create'} batch with {selectedAccounts.length} account(s)</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {accounts.length === 0 && (
                            <div className="p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-yellow-400 font-medium">No accounts available</p>
                                        <p className="text-yellow-500 text-sm">You need to create integration accounts first before creating a batch.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ModalBody>
                <Divider className="bg-[#292f46]" />
                <ModalFooter className="gap-4">
                    <Button
                        variant="flat"
                        onPress={handleClose}
                        className="flex-1 bg-[#2a2a3a] text-gray-300 hover:bg-[#3a3a4a] border-[#292f46] h-12 font-medium transition-all duration-300"
                    >
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        onPress={() => {
                            if (data) {
                                updateBatchMutation.mutateAsync({...formData, id: data.id}).then(() => {
                                    onClose();
                                    setFormData({ name: '' });
                                    setSelectedAccounts([]);
                                });

                                return;
                            }
                            if (formData.name) {
                                createBatchMutation.mutateAsync(formData).then(() => {
                                    onClose();
                                    setFormData({ name: '' });
                                    setSelectedAccounts([]);
                                });
                            }
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 hover:from-blue-600 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold h-12 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        isLoading={createBatchMutation.isPending || updateBatchMutation.isPending}
                        isDisabled={!formData.name || accounts.length === 0}
                        startContent={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        }
                    >
                        {data ? 'Update Batch' : 'Create Batch'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
