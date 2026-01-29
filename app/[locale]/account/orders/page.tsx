import { getTranslations } from 'next-intl/server';
import OrderHistory from '@/components/OrderHistory';

// Mock data - In production, this would come from API/database
const mockOrders = [
  {
    id: '1',
    orderNumber: 'MP-2024-001',
    createdAt: '2024-01-15T10:30:00Z',
    status: 'DELIVERED' as const,
    total: 1299.99,
    currency: 'USD',
    itemCount: 2,
    trackingNumber: 'TRK123456789',
  },
  {
    id: '2',
    orderNumber: 'MP-2024-002',
    createdAt: '2024-01-20T14:45:00Z',
    status: 'SHIPPED' as const,
    total: 649.98,
    currency: 'USD',
    itemCount: 3,
    trackingNumber: 'TRK987654321',
  },
  {
    id: '3',
    orderNumber: 'MP-2024-003',
    createdAt: '2024-01-25T09:15:00Z',
    status: 'PROCESSING' as const,
    total: 899.99,
    currency: 'USD',
    itemCount: 1,
  },
  {
    id: '4',
    orderNumber: 'MP-2024-004',
    createdAt: '2024-01-10T16:20:00Z',
    status: 'PENDING' as const,
    total: 449.99,
    currency: 'USD',
    itemCount: 1,
  },
  {
    id: '5',
    orderNumber: 'MP-2023-125',
    createdAt: '2023-12-28T11:00:00Z',
    status: 'DELIVERED' as const,
    total: 1799.97,
    currency: 'USD',
    itemCount: 4,
    trackingNumber: 'TRK555666777',
  },
  {
    id: '6',
    orderNumber: 'MP-2023-120',
    createdAt: '2023-12-15T13:30:00Z',
    status: 'CANCELLED' as const,
    total: 299.99,
    currency: 'USD',
    itemCount: 1,
  },
];

export default async function OrderHistoryPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // In production, fetch orders from API
  // const session = await getServerSession();
  // const orders = await fetchUserOrders(session.user.id);

  return (
    <OrderHistory
      orders={mockOrders}
      locale={locale}
      currency="USD"
    />
  );
}
