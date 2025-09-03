import { useParams } from "react-router";
import { useActiveUnits } from "../trade/queries";
import { DeletedUnitsTable } from "./components";
import { ViewUnitModal } from "./modals";
import { useState } from "react";
import type { UnitDto } from "../../api/models/UnitDto";

export const TradeHistory = () => {
    const { batchId } = useParams();
    const [selectedUnit, setSelectedUnit] = useState<UnitDto | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const unitsQuery = useActiveUnits();

    const handleViewUnit = (unit: UnitDto) => {
        setSelectedUnit(unit);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUnit(null);
    };

    if (unitsQuery.isLoading) {
        return (
            <div className="w-full space-y-6">
                <div className="animate-pulse">
                    <div className="h-24 bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-2xl mb-6"></div>
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="h-48 bg-gradient-to-br from-gray-800/50 to-gray-700/50 rounded-2xl mb-6"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl border border-gray-700/50 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">Trade History</h1>
                        {batchId && (
                            <p className="text-gray-400">Batch ID: <span className="font-mono text-blue-400">{batchId}</span></p>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg px-4 py-2 border border-blue-600/30">
                            <span className="text-blue-400 font-semibold">Active/Deleted Units</span>
                        </div>
                    </div>
                </div>
                
                <DeletedUnitsTable 
                    units={unitsQuery.data || []}
                    onView={handleViewUnit}
                    isLoading={unitsQuery.isLoading}
                />
            </div>

            <ViewUnitModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                unit={selectedUnit}
            />
        </div>
    );
};