'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tag, X, Loader2 } from 'lucide-react';
import { validatePromoCode } from '@/actions/promotions/validate-promo-code';

interface AppliedPromotion {
  id: string;
  code: string;
  name: string;
  discountType: string;
  discountValue: number;
  discountAmount: number;
}

interface CouponInputProps {
  propertyId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  subtotal: number;
  numberOfNights: number;
  currencySymbol: string;
  onApply: (promotion: AppliedPromotion) => void;
  onRemove: () => void;
  appliedPromotion: AppliedPromotion | null;
}

export default function CouponInput({
  propertyId,
  roomId,
  checkInDate,
  checkOutDate,
  subtotal,
  numberOfNights,
  currencySymbol,
  onApply,
  onRemove,
  appliedPromotion,
}: CouponInputProps) {
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = async () => {
    if (!code.trim()) {
      setError('Please enter a promo code');
      return;
    }

    setIsValidating(true);
    setError(null);

    const result = await validatePromoCode({
      code: code.trim(),
      propertyId,
      roomId,
      checkInDate,
      checkOutDate,
      subtotal,
      numberOfNights,
    });

    setIsValidating(false);

    if (result.success && result.promotion) {
      onApply(result.promotion);
      setCode('');
      setError(null);
    } else {
      setError(result.error || 'Invalid promo code');
    }
  };

  const handleRemove = () => {
    onRemove();
    setCode('');
    setError(null);
  };

  return (
    <div className="space-y-3">
      {!appliedPromotion ? (
        <>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${error ? 'text-red-400' : 'text-neutral-400'}`} />
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApply();
                  }
                }}
                placeholder="Enter promo code"
                className={`w-full pl-10 pr-3 py-2 border-2 rounded-lg font-body text-sm bg-neutral-800 text-white placeholder:text-neutral-500 focus:outline-none transition-colors ${
                  error 
                    ? 'border-red-500 focus:border-red-400' 
                    : 'border-neutral-600 focus:border-white'
                }`}
                disabled={isValidating}
              />
            </div>
            <Button
              type="button"
              onClick={handleApply}
              disabled={isValidating || !code.trim()}
              className="bg-white text-neutral-900 hover:bg-neutral-100 font-body text-sm px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                </>
              ) : (
                'Apply'
              )}
            </Button>
          </div>
          
          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-2.5">
              <p className="text-xs text-red-300 font-body">{error}</p>
            </div>
          )}
        </>
      ) : (
        <div className="bg-green-900/30 border border-green-700 rounded-lg p-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Tag className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-body font-semibold text-xs text-green-400 block">
                  {appliedPromotion.code}
                </span>
                <p className="text-xs text-white font-medium">
                  -{currencySymbol}{appliedPromotion.discountAmount.toLocaleString()}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="text-neutral-400 hover:text-white transition-colors flex-shrink-0"
              title="Remove promo code"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
