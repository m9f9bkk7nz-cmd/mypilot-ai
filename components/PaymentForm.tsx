'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CreditCardIcon, LockClosedIcon } from '@heroicons/react/24/outline';

interface PaymentFormProps {
  amount: number;
  currency: string;
  locale: string;
  paymentMethod: 'card' | 'paypal' | 'alipay';
  onSuccess: (paymentId: string) => void;
  onError: (error: Error) => void;
}

export default function PaymentForm({
  amount,
  currency,
  locale,
  paymentMethod,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const t = useTranslations('checkout');
  const tCommon = useTranslations('common');

  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ');
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardNumber(value);
      if (errors.cardNumber) {
        setErrors({ ...errors, cardNumber: '' });
      }
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setExpiryDate(value);
      if (errors.expiryDate) {
        setErrors({ ...errors, expiryDate: '' });
      }
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setCvv(value);
      if (errors.cvv) {
        setErrors({ ...errors, cvv: '' });
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }

    if (cardNumber.length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    if (expiryDate.length !== 4) {
      newErrors.expiryDate = 'Expiry date must be MM/YY format';
    } else {
      const month = parseInt(expiryDate.slice(0, 2));
      if (month < 1 || month > 12) {
        newErrors.expiryDate = 'Invalid month';
      }
    }

    if (cvv.length < 3) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'card' && !validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real implementation, this would call Stripe/PayPal/Alipay APIs
      const mockPaymentId = `pay_${Date.now()}`;
      onSuccess(mockPaymentId);
    } catch (error) {
      onError(error as Error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderCardForm = () => (
    <div className="space-y-4">
      {/* Card Number */}
      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Card Number
        </label>
        <div className="relative">
          <input
            type="text"
            id="cardNumber"
            value={formatCardNumber(cardNumber)}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.cardNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isProcessing}
          />
          <CreditCardIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        {errors.cardNumber && (
          <p className="text-sm text-red-600 mt-1">{errors.cardNumber}</p>
        )}
      </div>

      {/* Cardholder Name */}
      <div>
        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
          Cardholder Name
        </label>
        <input
          type="text"
          id="cardName"
          value={cardName}
          onChange={(e) => {
            setCardName(e.target.value);
            if (errors.cardName) {
              setErrors({ ...errors, cardName: '' });
            }
          }}
          placeholder="John Doe"
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.cardName ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isProcessing}
        />
        {errors.cardName && (
          <p className="text-sm text-red-600 mt-1">{errors.cardName}</p>
        )}
      </div>

      {/* Expiry and CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date
          </label>
          <input
            type="text"
            id="expiryDate"
            value={formatExpiryDate(expiryDate)}
            onChange={handleExpiryChange}
            placeholder="MM/YY"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.expiryDate ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isProcessing}
          />
          {errors.expiryDate && (
            <p className="text-sm text-red-600 mt-1">{errors.expiryDate}</p>
          )}
        </div>

        <div>
          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
            CVV
          </label>
          <input
            type="text"
            id="cvv"
            value={cvv}
            onChange={handleCvvChange}
            placeholder="123"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.cvv ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isProcessing}
          />
          {errors.cvv && (
            <p className="text-sm text-red-600 mt-1">{errors.cvv}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderPayPalButton = () => (
    <div className="text-center py-8">
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isProcessing}
        className="inline-flex items-center justify-center px-8 py-3 bg-[#0070ba] text-white rounded-md font-medium hover:bg-[#005ea6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? (
          <span>Processing...</span>
        ) : (
          <>
            <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.633h8.78c2.857 0 4.812 1.284 5.12 3.376.203 1.391-.09 2.493-.872 3.277-.784.784-1.98 1.176-3.557 1.176h-2.254a.77.77 0 0 0-.76.633l-.57 3.603-.018.114a.641.641 0 0 1-.633.547H7.076z"/>
            </svg>
            Pay with PayPal
          </>
        )}
      </button>
      <p className="text-xs text-gray-500 mt-4">
        You will be redirected to PayPal to complete your payment
      </p>
    </div>
  );

  const renderAlipayButton = () => (
    <div className="text-center py-8">
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isProcessing}
        className="inline-flex items-center justify-center px-8 py-3 bg-[#1677ff] text-white rounded-md font-medium hover:bg-[#0958d9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? (
          <span>Processing...</span>
        ) : (
          <>
            <span className="text-xl mr-2">支</span>
            Pay with Alipay
          </>
        )}
      </button>
      <p className="text-xs text-gray-500 mt-4">
        You will be redirected to Alipay to complete your payment
      </p>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Payment Details</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <LockClosedIcon className="h-4 w-4" />
          <span>Secure Payment</span>
        </div>
      </div>

      {/* Amount */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Amount to pay</span>
          <span className="text-2xl font-bold text-gray-900">{formatPrice(amount)}</span>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit}>
        {paymentMethod === 'card' && renderCardForm()}
        {paymentMethod === 'paypal' && renderPayPalButton()}
        {paymentMethod === 'alipay' && renderAlipayButton()}

        {/* Submit Button for Card */}
        {paymentMethod === 'card' && (
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full mt-6 bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isProcessing ? t('processing') : `Pay ${formatPrice(amount)}`}
          </button>
        )}
      </form>

      {/* Security Notice */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Your payment information is encrypted and secure. We never store your card details.
        </p>
      </div>
    </div>
  );
}
