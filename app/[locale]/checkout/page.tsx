'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutForm from '@/components/CheckoutForm';
import PaymentForm from '@/components/PaymentForm';

// Mock data
const mockAddresses = [
  {
    id: '1',
    name: 'John Doe',
    phone: '+1 (555) 123-4567',
    line1: '123 Main Street',
    line2: 'Apt 4B',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94102',
    country: 'United States',
  },
  {
    id: '2',
    name: 'John Doe',
    phone: '+1 (555) 123-4567',
    line1: '456 Oak Avenue',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90001',
    country: 'United States',
  },
];

const mockShippingMethods = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: 'Delivery in 5-7 business days',
    price: 0,
    estimatedDays: 7,
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: 'Delivery in 2-3 business days',
    price: 25,
    estimatedDays: 3,
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    description: 'Next business day delivery',
    price: 50,
    estimatedDays: 1,
  },
];

const mockPaymentMethods = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    type: 'card' as const,
  },
  {
    id: 'paypal',
    name: 'PayPal',
    type: 'paypal' as const,
  },
  {
    id: 'alipay',
    name: 'Alipay',
    type: 'alipay' as const,
  },
];

const mockCartItems = [
  {
    id: '1',
    name: 'Comma 3X - Advanced Driver Assistance System',
    price: 1299.99,
    quantity: 1,
    image: '/products/comma-3x.jpg',
  },
  {
    id: '2',
    name: 'HD Camera Module - 1080p Wide Angle',
    price: 199.99,
    quantity: 2,
    image: '/products/camera.jpg',
  },
];

export default function CheckoutPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const router = useRouter();
  const [step, setStep] = useState<'checkout' | 'payment'>('checkout');
  const [checkoutData, setCheckoutData] = useState<{
    addressId: string;
    shippingMethodId: string;
    paymentMethodId: string;
  } | null>(null);

  const subtotal = mockCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckoutSubmit = async (data: {
    addressId: string;
    shippingMethodId: string;
    paymentMethodId: string;
  }) => {
    setCheckoutData(data);
    setStep('payment');
  };

  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Payment successful:', paymentId);
    // In production, create order and redirect to success page
    router.push(`/${locale}/order-confirmation?payment=${paymentId}`);
  };

  const handlePaymentError = (error: Error) => {
    console.error('Payment failed:', error);
    alert('Payment failed. Please try again.');
  };

  const selectedPaymentMethod = mockPaymentMethods.find(
    (m) => m.id === checkoutData?.paymentMethodId
  );

  const selectedShippingMethod = mockShippingMethods.find(
    (m) => m.id === checkoutData?.shippingMethodId
  );

  const shippingCost = selectedShippingMethod?.price || 0;
  const total = subtotal + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50">
      {step === 'checkout' ? (
        <CheckoutForm
          addresses={mockAddresses}
          shippingMethods={mockShippingMethods}
          paymentMethods={mockPaymentMethods}
          cartItems={mockCartItems}
          subtotal={subtotal}
          currency="USD"
          locale={locale}
          onSubmit={handleCheckoutSubmit}
          onAddAddress={() => {
            console.log('Add new address');
          }}
        />
      ) : (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <button
              onClick={() => setStep('checkout')}
              className="text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              ← Back to checkout
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
          </div>

          {selectedPaymentMethod && (
            <PaymentForm
              amount={total}
              currency="USD"
              locale={locale}
              paymentMethod={selectedPaymentMethod.type}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          )}
        </div>
      )}
    </div>
  );
}
