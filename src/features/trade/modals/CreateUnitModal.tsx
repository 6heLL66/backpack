import { useState } from 'react';
import type { UnitCreateRequestDto } from '../../../api/models/UnitCreateRequestDto';
import { DefaultService, type IntegrationAccountDto, type MarketDto } from '../../../api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { useMarkets } from '../queries';

interface CreateUnitModalProps {
    isOpen: boolean;
    onClose: () => void;
    batchId: string;
    accounts: IntegrationAccountDto[];
    markets: MarketDto[];
}

export const CreateUnitModal = ({ isOpen, onClose, batchId, accounts, markets }: CreateUnitModalProps) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<Omit<UnitCreateRequestDto, 'batch_id'>>({
        symbol: '',
        size: '',
        timedelta: 0
    });

    const { getPriceBySymbol, getQuantityDecimalsBySymbol } = useMarkets();

    const batchAccounts = accounts.filter(account => account.batch_id === batchId);

    const createUnitMutation = useMutation({
        mutationFn: async (data: Omit<UnitCreateRequestDto, 'batch_id'>) => {
            return await DefaultService.unitCreateApiBackpackUnitsPost({ 
                requestBody: {
                    ...data,
                    batch_id: batchId,
                    timedelta: data.timedelta * 60,
                    size: (+data.size / +getPriceBySymbol(data.symbol)!).toFixed(getQuantityDecimalsBySymbol(data.symbol))
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['active-units'] });
            onClose();
            setFormData({
                symbol: '',
                size: '',
                timedelta: 0,
            });
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'timedelta' ? parseInt(value) || 0 : value
        }));
    };

    const handleClose = () => {
        setFormData({
            symbol: '',
            size: '',
            timedelta: 0,
        });
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
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 bg-clip-text text-transparent">
                                Create New Unit
                            </h2>
                            <p className="text-gray-400 text-base mt-1">
                                Create a new trading unit for this batch
                            </p>
                        </div>
                    </div>
                </ModalHeader>
                <Divider className="bg-[#292f46]" />
                <ModalBody>
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    Trading Symbol
                                </label>
                                <Select
                                    placeholder="Select trading symbol"
                                    selectedKeys={formData.symbol ? [formData.symbol] : []}
                                    onSelectionChange={(keys) => {
                                        const selectedKey = Array.from(keys)[0];
                                        if (typeof selectedKey === 'string') {
                                            setFormData(prev => ({
                                                ...prev,
                                                symbol: selectedKey
                                            }));
                                        }
                                    }}
                                    renderValue={() => {
                                        return (
                                            <span className="text-blue-400 font-mono text-sm">
                                                {formData.symbol}
                                            </span>
                                        );
                                    }}
                                    variant="bordered"
                                    classNames={{
                                        trigger: "bg-[#1a1a2e] border-[#292f46] hover:border-[#3a3a5a] focus-within:border-green-500 h-12 transition-all duration-300",
                                        listbox: "bg-[#1a1a2e] border-[#292f46]",
                                        popoverContent: "bg-[#1a1a2e] border-[#292f46]",
                                    }}
                                    required
                                >
                                    {markets.map((market) => (
                                        <SelectItem 
                                            key={market.symbol} 
                                            className="text-gray-100 hover:bg-[#2a2a3a] transition-colors duration-200"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                    </svg>
                                                </div>
                                                <span className="font-mono">{market.symbol}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    Position Size $
                                </label>
                                <Input
                                    type="number"
                                    name="size"
                                    value={formData.size.toString()}
                                    onChange={handleInputChange}
                                    placeholder="0.0"
                                    variant="bordered"
                                    classNames={{
                                        input: "text-gray-100 text-lg font-medium",
                                        inputWrapper: "bg-[#1a1a2e] border-[#292f46] hover:border-[#3a3a5a] focus-within:border-green-500 h-12 transition-all duration-300",
                                    }}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                Time Delta (mins)
                            </label>
                            <Input
                                type="text"
                                name="timedelta"
                                value={formData.timedelta.toString() ?? ''}
                                onChange={handleInputChange}
                                placeholder="60"
                                variant="bordered"
                                classNames={{
                                    input: "text-gray-100 text-lg font-medium",
                                    inputWrapper: "bg-[#1a1a2e] border-[#292f46] hover:border-[#3a3a5a] focus-within:border-green-500 h-12 transition-all duration-300",
                                }}
                                required
                            />
                            <p className="text-gray-500 text-xs">Time delay before executing the trade</p>
                        </div>

                        {batchAccounts.length === 0 && (
                            <div className="p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-yellow-400 font-medium">No accounts available</p>
                                        <p className="text-yellow-500 text-sm">No accounts are associated with this batch. Please add accounts to the batch first.</p>
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
                            if (formData.symbol && formData.size && formData.timedelta >= 0) {
                                createUnitMutation.mutateAsync(formData);
                            }
                        }}
                        className="flex-1 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 hover:from-green-600 hover:via-emerald-700 hover:to-teal-700 text-white font-semibold h-12 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        isLoading={createUnitMutation.isPending}
                        isDisabled={!formData.symbol || !formData.size || formData.timedelta < 0 || batchAccounts.length === 0}
                        startContent={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        }
                    >
                        Create Unit
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
