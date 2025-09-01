import { useState } from 'react';
import type { IntegrationAccountCreateRequestDto } from '../../../api/models/IntegrationAccountCreateRequestDto';
import { AccountService, type IntegrationAccountDto } from '../../../api';
import { useMutation } from '@tanstack/react-query';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Divider
} from '@heroui/react';

interface CreateAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    data?: IntegrationAccountDto;
}

export const CreateAccountModal = ({ isOpen, onClose, data }: CreateAccountModalProps) => {
    const [formData, setFormData] = useState<IntegrationAccountCreateRequestDto>({
        api_key: data?.api_key ?? '',
        api_secret: data?.api_secret ?? '',
        proxy: data?.proxy ?? ''
    }); 

    const createAccountMutation = useMutation({
        mutationFn: (data: { api_key: string; api_secret: string }) => {
            return AccountService.accountCreateApiBackpackAccountsPost({ requestBody: data });
        }
    })

    const updateAccountMutation = useMutation({
        mutationFn: (data: IntegrationAccountCreateRequestDto & { id: string }) => {
            return AccountService.accountUpdateApiBackpackAccountsAccountIdPatch({ accountId: data.id, requestBody: data });
        }
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClose = () => {
        setFormData({ api_key: '', api_secret: '' });
        onClose();
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={handleClose}
            size="lg"
            classNames={{
                backdrop: "bg-gradient-to-t from-zinc-900/90 backdrop-blur-sm",
                base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c]",
                header: "border-b-[1px] border-[#292f46]",
                body: "py-6",
                closeButton: "hover:bg-white/5 active:bg-white/10",
            }}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                        Create New Account
                    </h2>
                    <p className="text-sm text-gray-400">
                        Connect your trading account with API credentials
                    </p>
                </ModalHeader>
                <Divider className="bg-[#292f46]" />
                <ModalBody>
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <Input
                                type="text"
                                label="API Key"
                                name="api_key"
                                value={formData.api_key}
                                onChange={handleInputChange}
                                placeholder="Enter your API key"
                                variant="bordered"
                                classNames={{
                                    label: "text-gray-300",
                                    input: "text-gray-100",
                                    inputWrapper: "bg-[#1a1a2e] border-[#292f46] hover:border-[#3a3a5a] focus-within:border-blue-500",
                                }}
                                required
                            />
                            
                            <Input
                                type="password"
                                label="API Secret"
                                name="api_secret"
                                value={formData.api_secret}
                                onChange={handleInputChange}
                                placeholder="Enter your API secret"
                                variant="bordered"
                                classNames={{
                                    label: "text-gray-300",
                                    input: "text-gray-100",
                                    inputWrapper: "bg-[#1a1a2e] border-[#292f46] hover:border-[#3a3a5a] focus-within:border-blue-500",
                                }}
                                required
                            />

                            <Input
                                type="text"
                                label="Proxy"
                                name="proxy"
                                value={formData.proxy ?? ''}
                                onChange={handleInputChange}
                                placeholder="host:port:username:password"
                                variant="bordered"
                                classNames={{
                                    label: "text-gray-300",
                                    input: "text-gray-100",
                                    inputWrapper: "bg-[#1a1a2e] border-[#292f46] hover:border-[#3a3a5a] focus-within:border-blue-500",
                                }}
                            />
                        </div>
                    </div>
                </ModalBody>
                <Divider className="bg-[#292f46]" />
                <ModalFooter className="gap-3">
                    <Button
                        variant="flat"
                        onPress={handleClose}
                        className="flex-1 bg-[#2a2a3a] text-gray-300 hover:bg-[#3a3a4a] border-[#292f46]"
                    >
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        onPress={() => {
                            if (data) {
                                updateAccountMutation.mutateAsync({...formData, id: data.id}).then(() => {
                                    onClose();
                                    setFormData({ api_key: '', api_secret: '' });
                                });

                                return;
                            }
                            if (formData.api_key && formData.api_secret) {
                                createAccountMutation.mutateAsync(formData).then(() => {
                                    onClose();
                                    setFormData({ api_key: '', api_secret: '' });
                                });
                            }
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium"
                        isLoading={createAccountMutation.isPending}
                    >
                        {data ? 'Update Account' : 'Create Account'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
