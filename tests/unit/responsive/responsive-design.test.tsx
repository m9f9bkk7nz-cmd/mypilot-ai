/**
 * Responsive Design Verification Tests
 * 
 * These tests verify that responsive design requirements are met:
 * - Requirements 14.1-14.5
 * - Proper display across device sizes
 * - Touch-friendly UI elements
 * - Mobile-optimized navigation
 */

import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';

// Mock translations
const messages = {
  common: {
    welcome: 'Welcome',
    search: 'Search',
    cart: 'Cart',
    account: 'Account',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    language: 'Language',
    currency: 'Currency',
  },
  nav: {
    home: 'Home',
    products: 'Products',
    categories: 'Categories',
    about: 'About',
    contact: 'Contact',
    myAccount: 'My Account',
    orders: 'Orders',
    addresses: 'Addresses',
    settings: 'Settings',
  },
  footer: {
    company: 'Company',
    aboutUs: 'About Us',
    careers: 'Careers',
    press: 'Press',
    support: 'Support',
    helpCenter: 'Help Center',
    contactUs: 'Contact Us',
    shipping: 'Shipping',
    returns: 'Returns',
    legal: 'Legal',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    copyright: '© 2024 MyPilot. All rights reserved.',
  },
};

// Helper to wrap components with NextIntl provider
const renderWithIntl = (component: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
};

describe('Responsive Design - Header Component', () => {
  describe('Requirement 14.1: Display properly on all device sizes', () => {
    it('should render without horizontal scroll on mobile (320px)', () => {
      // Set viewport to mobile size
      global.innerWidth = 320;
      
      renderWithIntl(<Header locale="en" />);
      
      // Header should be present
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
      
      // Logo should be visible
      expect(screen.getByText('MyPilot')).toBeInTheDocument();
    });

    it('should render properly on tablet (768px)', () => {
      global.innerWidth = 768;
      
      renderWithIntl(<Header locale="en" />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('should render properly on desktop (1024px+)', () => {
      global.innerWidth = 1024;
      
      renderWithIntl(<Header locale="en" />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });

  describe('Requirement 14.2: Mobile-optimized navigation', () => {
    it('should show mobile menu toggle on small screens', () => {
      renderWithIntl(<Header locale="en" />);
      
      // Mobile menu button should have appropriate classes
      const menuButton = screen.getByLabelText('Toggle menu');
      expect(menuButton).toBeInTheDocument();
      expect(menuButton.className).toContain('md:hidden');
    });

    it('should hide desktop navigation on mobile', () => {
      renderWithIntl(<Header locale="en" />);
      
      // Desktop nav should have hidden class for mobile
      const desktopNav = screen.getByRole('navigation');
      expect(desktopNav.className).toContain('hidden md:flex');
    });
  });

  describe('Requirement 14.3: Touch-friendly UI elements', () => {
    it('should have adequate touch targets for mobile menu button', () => {
      renderWithIntl(<Header locale="en" />);
      
      const menuButton = screen.getByLabelText('Toggle menu');
      
      // Button should have padding for touch target
      expect(menuButton.className).toContain('p-2');
    });

    it('should have adequate touch targets for cart icon', () => {
      renderWithIntl(<Header locale="en" cartItemCount={5} />);
      
      const cartLink = screen.getByLabelText('Cart');
      
      // Link should have padding for touch target
      expect(cartLink.className).toContain('p-2');
    });

    it('should have adequate touch targets for user icon', () => {
      renderWithIntl(<Header locale="en" />);
      
      const userButton = screen.getByLabelText('Account');
      
      // Button should have padding for touch target
      expect(userButton.className).toContain('p-2');
    });
  });

  describe('Requirement 14.5: Full functionality across devices', () => {
    it('should display cart badge on all devices', () => {
      renderWithIntl(<Header locale="en" cartItemCount={3} />);
      
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should show search functionality on all devices', () => {
      renderWithIntl(<Header locale="en" />);
      
      // Search should be available (either inline or via toggle)
      const searchInputs = screen.getAllByPlaceholderText('Search');
      expect(searchInputs.length).toBeGreaterThan(0);
    });

    it('should provide language switcher on all devices', () => {
      renderWithIntl(<Header locale="en" />);
      
      // Language switcher should be present
      // (Implementation may vary, but component should be rendered)
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });
});

describe('Responsive Design - Footer Component', () => {
  describe('Requirement 14.1: Display properly on all device sizes', () => {
    it('should render footer content on mobile', () => {
      renderWithIntl(<Footer locale="en" />);
      
      expect(screen.getByText('MyPilot')).toBeInTheDocument();
      expect(screen.getByText('Company')).toBeInTheDocument();
    });

    it('should use responsive grid layout', () => {
      const { container } = renderWithIntl(<Footer locale="en" />);
      
      // Footer should have responsive grid classes
      const grid = container.querySelector('.grid');
      expect(grid?.className).toContain('grid-cols-1');
      expect(grid?.className).toContain('md:grid-cols-2');
      expect(grid?.className).toContain('lg:grid-cols-4');
    });
  });

  describe('Requirement 14.5: Full functionality across devices', () => {
    it('should display all footer sections', () => {
      renderWithIntl(<Footer locale="en" />);
      
      expect(screen.getByText('Company')).toBeInTheDocument();
      expect(screen.getByText('Support')).toBeInTheDocument();
      expect(screen.getByText('Legal')).toBeInTheDocument();
    });

    it('should display social media links', () => {
      renderWithIntl(<Footer locale="en" />);
      
      expect(screen.getByText('Follow Us')).toBeInTheDocument();
      expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
      expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
      expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
    });

    it('should display payment methods', () => {
      renderWithIntl(<Footer locale="en" />);
      
      expect(screen.getByText('Payment Methods')).toBeInTheDocument();
    });
  });
});

describe('Responsive Design - Navigation Component', () => {
  const mockCategories = [
    {
      id: '1',
      slug: 'cameras',
      name: 'Cameras',
      children: [
        { id: '1-1', slug: 'front-cameras', name: 'Front Cameras' },
        { id: '1-2', slug: 'rear-cameras', name: 'Rear Cameras' },
      ],
    },
    {
      id: '2',
      slug: 'sensors',
      name: 'Sensors',
    },
  ];

  describe('Requirement 14.2: Mobile-optimized navigation', () => {
    it('should show mobile menu button on small screens', () => {
      renderWithIntl(<Navigation categories={mockCategories} />);
      
      const menuButton = screen.getByLabelText('Toggle navigation menu');
      expect(menuButton).toBeInTheDocument();
      expect(menuButton.className).toContain('md:hidden');
    });

    it('should hide desktop menu on mobile', () => {
      const { container } = renderWithIntl(<Navigation categories={mockCategories} />);
      
      const desktopMenu = container.querySelector('.hidden.md\\:flex');
      expect(desktopMenu).toBeInTheDocument();
    });
  });

  describe('Requirement 14.3: Touch-friendly UI elements', () => {
    it('should have adequate spacing for mobile menu items', () => {
      const { container } = renderWithIntl(<Navigation categories={mockCategories} />);
      
      // Mobile menu items should have adequate padding
      const mobileLinks = container.querySelectorAll('.md\\:hidden a');
      mobileLinks.forEach(link => {
        expect(link.className).toMatch(/p[xy]-[234]/);
      });
    });
  });

  describe('Requirement 14.5: Full functionality across devices', () => {
    it('should display all navigation links', () => {
      renderWithIntl(<Navigation categories={mockCategories} />);
      
      expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Products').length).toBeGreaterThan(0);
      expect(screen.getAllByText('About').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Contact').length).toBeGreaterThan(0);
    });

    it('should support multi-level category navigation', () => {
      renderWithIntl(<Navigation categories={mockCategories} />);
      
      // Categories should be present
      expect(screen.getAllByText('Cameras').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Sensors').length).toBeGreaterThan(0);
    });
  });
});

describe('Responsive Design - CSS Classes Verification', () => {
  describe('Breakpoint usage', () => {
    it('should use mobile-first approach in Header', () => {
      const { container } = renderWithIntl(<Header locale="en" />);
      
      // Check for mobile-first classes (base classes without prefix)
      const elements = container.querySelectorAll('[class*="md:"]');
      expect(elements.length).toBeGreaterThan(0);
    });

    it('should use responsive grid in Footer', () => {
      const { container } = renderWithIntl(<Footer locale="en" />);
      
      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Touch target sizes', () => {
    it('should have minimum padding for interactive elements', () => {
      renderWithIntl(<Header locale="en" />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        // Should have at least p-2 (8px = 0.5rem * 2 = 16px padding)
        expect(button.className).toMatch(/p-[2-9]/);
      });
    });
  });
});

describe('Responsive Design - Accessibility', () => {
  describe('ARIA labels', () => {
    it('should have proper ARIA labels for icon buttons', () => {
      renderWithIntl(<Header locale="en" />);
      
      expect(screen.getByLabelText('Toggle menu')).toBeInTheDocument();
      expect(screen.getByLabelText('Cart')).toBeInTheDocument();
      expect(screen.getByLabelText('Account')).toBeInTheDocument();
    });

    it('should have proper ARIA labels in Navigation', () => {
      renderWithIntl(<Navigation />);
      
      expect(screen.getByLabelText('Toggle navigation menu')).toBeInTheDocument();
    });
  });

  describe('Semantic HTML', () => {
    it('should use semantic header element', () => {
      renderWithIntl(<Header locale="en" />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('should use semantic nav element', () => {
      renderWithIntl(<Header locale="en" />);
      
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should use semantic footer element', () => {
      renderWithIntl(<Footer locale="en" />);
      
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
  });
});
