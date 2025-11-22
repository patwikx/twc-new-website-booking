'use client';

import { useState, useEffect } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface AvailableFee {
  id: string;
  name: string;
  description: string | null;
  feeType: string;
  amount: number;
  isPercentage: boolean;
  isPerNight: boolean;
  isPerGuest: boolean;
  isOptional: boolean;
}

interface SelectedFee {
  id: string;
  name: string;
  amount: number;
}

interface AddOnsSelectorProps {
  availableFees: AvailableFee[];
  numberOfNights: number;
  numberOfGuests: number;
  subtotal: number;
  currencySymbol: string;
  onFeesChange: (fees: SelectedFee[]) => void;
}

export default function AddOnsSelector({
  availableFees,
  numberOfNights,
  numberOfGuests,
  subtotal,
  currencySymbol,
  onFeesChange,
}: AddOnsSelectorProps) {
  const [selectedFees, setSelectedFees] = useState<Set<string>>(new Set());
  const [isOpen, setIsOpen] = useState(false);

  const calculateFeeAmount = (fee: AvailableFee): number => {
    let amount = fee.amount;

    if (fee.isPercentage) {
      amount = subtotal * (fee.amount / 100);
    }

    if (fee.isPerNight) {
      amount = amount * numberOfNights;
    }

    if (fee.isPerGuest) {
      amount = amount * numberOfGuests;
    }

    return Math.round(amount * 100) / 100;
  };

  const toggleFee = (feeId: string, checked: boolean) => {
    const newSelected = new Set(selectedFees);
    if (checked) {
      newSelected.add(feeId);
    } else {
      newSelected.delete(feeId);
    }
    setSelectedFees(newSelected);
  };

  useEffect(() => {
    const fees: SelectedFee[] = availableFees
      .filter((fee) => selectedFees.has(fee.id) || !fee.isOptional)
      .map((fee) => ({
        id: fee.id,
        name: fee.name,
        amount: calculateFeeAmount(fee),
      }));

    onFeesChange(fees);
  }, [selectedFees, availableFees, numberOfNights, numberOfGuests, subtotal]);

  if (availableFees.length === 0) {
    return null;
  }

  const optionalFees = availableFees.filter((fee) => fee.isOptional);
  const mandatoryFees = availableFees.filter((fee) => !fee.isOptional);

  return (
    <div className="space-y-3">
      {/* Mandatory Fees */}
      {mandatoryFees.length > 0 && (
        <div>
          <h3 className="text-xs font-body font-semibold text-neutral-400 mb-2 uppercase tracking-wider">
            Included Fees
          </h3>
          <div className="space-y-2">
            {mandatoryFees.map((fee) => {
              const amount = calculateFeeAmount(fee);
              return (
                <div
                  key={fee.id}
                  className="bg-neutral-800 border border-neutral-700 rounded-lg p-2.5"
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-body font-medium text-sm text-white">
                          {fee.name}
                        </span>
                        <span className="text-xs px-1.5 py-0.5 bg-neutral-700 text-neutral-300 rounded">
                          Required
                        </span>
                      </div>
                      {fee.description && (
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {fee.description}
                        </p>
                      )}
                    </div>
                    <span className="font-body font-semibold text-sm text-white whitespace-nowrap">
                      {currencySymbol}
                      {amount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Optional Add-ons */}
      {optionalFees.length > 0 && (
        <div>
          <h3 className="text-xs font-body font-semibold text-white mb-2 uppercase tracking-wider">
            Optional Add-ons
          </h3>

          {/* Add More Button / Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full bg-neutral-800 border-2 border-dashed border-neutral-600 hover:border-neutral-500 rounded-lg p-2.5 transition-colors flex items-center justify-center gap-2 text-neutral-300 hover:text-white"
            >
              <Plus className="w-4 h-4" />
              <span className="font-body text-sm font-medium">
                {selectedFees.size > 0
                  ? `${selectedFees.size} add-on${selectedFees.size > 1 ? 's' : ''} selected`
                  : 'Add optional services'}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-20 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-800">
                  {optionalFees.map((fee) => {
                    const amount = calculateFeeAmount(fee);
                    const isChecked = selectedFees.has(fee.id);

                    return (
                      <label
                        key={fee.id}
                        className="flex items-start gap-3 p-3 hover:bg-neutral-700 transition-colors border-b border-neutral-700 last:border-b-0 cursor-pointer"
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={(checked) =>
                            toggleFee(fee.id, checked as boolean)
                          }
                          className="mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white"
                        />
                        <div className="flex-1 flex justify-between items-start gap-3">
                          <div className="flex-1">
                            <span className="font-body font-medium text-sm text-white block">
                              {fee.name}
                            </span>
                            {fee.description && (
                              <p className="text-xs text-neutral-400 mt-0.5">
                                {fee.description}
                              </p>
                            )}
                          </div>
                          <span className="font-body font-semibold text-sm text-white whitespace-nowrap">
                            +{currencySymbol}
                            {amount.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
