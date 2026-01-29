import { getTranslations } from 'next-intl/server';
import AccountDashboard from '@/components/AccountDashboard';

// Mock data - In production, this would come from API/database
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  image: undefined,
};

const mockOrders = [
  {
    id: '1',
    orderNumber: 'MP-2024-001',
    createdAt: '2024-01-15T10:30:00Z',
    status: 'DELIVERED' as const,
    total: 1299.99,
    currency: 'USD',
    itemCount: 2,
  },
  {
    id: '2',
    orderNumber: 'MP-2024-002',
    createdAt: '2024-01-20T14:45:00Z',
    status: 'SHIPPED' as const,
    total: 649.98,
    currency: 'USD',
    itemCount: 3,
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
];

const mockAddresses = [
  {
    id: '1',
    name: 'John Doe',
    line1: '123 Main Street',
    line2: 'Apt 4B',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94102',
    country: 'United States',
    isDefault: true,
  },
  {
    id: '2',
    name: 'John Doe',
    line1: '456 Oak Avenue',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90001',
    country: 'United States',
    isDefault: false,
  },
];

export default async function AccountPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // In production, fetch user data from session/API
  // const session = await getServerSession();
  // const user = await fetchUser(session.user.id);
  // const orders = await fetchUserOrders(session.user.id);
  // const addresses = await fetchUserAddresses(session.user.id);

  return (
    <AccountDashboard
      user={mockUser}
      orders={mockOrders}
      addresses={mockAddresses}
      locale={locale}
    />
  );
}
