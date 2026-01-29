import Navigation, { Category } from '@/components/Navigation';

// Sample categories for demonstration
const sampleCategories: Category[] = [
  {
    id: '1',
    slug: 'cameras',
    name: 'Cameras',
    description: 'High-quality cameras for autonomous driving',
    children: [
      {
        id: '1-1',
        slug: 'front-cameras',
        name: 'Front Cameras',
        description: 'Forward-facing cameras'
      },
      {
        id: '1-2',
        slug: 'rear-cameras',
        name: 'Rear Cameras',
        description: 'Rear-view cameras'
      },
      {
        id: '1-3',
        slug: 'side-cameras',
        name: 'Side Cameras',
        description: 'Side-view cameras'
      }
    ]
  },
  {
    id: '2',
    slug: 'controllers',
    name: 'Controllers',
    description: 'Control units for autonomous systems',
    children: [
      {
        id: '2-1',
        slug: 'ecu',
        name: 'ECU Controllers',
        description: 'Electronic Control Units'
      },
      {
        id: '2-2',
        slug: 'steering',
        name: 'Steering Controllers',
        description: 'Steering control systems'
      },
      {
        id: '2-3',
        slug: 'brake',
        name: 'Brake Controllers',
        description: 'Brake control systems'
      }
    ]
  },
  {
    id: '3',
    slug: 'sensors',
    name: 'Sensors',
    description: 'Various sensors for autonomous driving',
    children: [
      {
        id: '3-1',
        slug: 'lidar',
        name: 'LiDAR Sensors',
        description: 'Light Detection and Ranging'
      },
      {
        id: '3-2',
        slug: 'radar',
        name: 'Radar Sensors',
        description: 'Radio Detection and Ranging'
      },
      {
        id: '3-3',
        slug: 'ultrasonic',
        name: 'Ultrasonic Sensors',
        description: 'Short-range detection'
      }
    ]
  },
  {
    id: '4',
    slug: 'displays',
    name: 'Displays',
    description: 'Display units and screens'
  },
  {
    id: '5',
    slug: 'accessories',
    name: 'Accessories',
    description: 'Additional accessories and parts',
    children: [
      {
        id: '5-1',
        slug: 'cables',
        name: 'Cables & Connectors',
        description: 'Connection cables and adapters'
      },
      {
        id: '5-2',
        slug: 'mounts',
        name: 'Mounting Hardware',
        description: 'Mounting brackets and hardware'
      }
    ]
  }
];

export default function NavigationDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Navigation Component */}
      <Navigation categories={sampleCategories} />
      
      {/* Demo Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Navigation Component Demo
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Features Demonstrated
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  ✅ Product Category Menu
                </h3>
                <p className="text-gray-600">
                  The navigation includes a hierarchical product category menu with 5 main categories.
                  Hover over &quot;Products&quot; on desktop to see the dropdown menu.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  ✅ Multi-level Menu Support
                </h3>
                <p className="text-gray-600">
                  Categories like &quot;Cameras&quot;, &quot;Controllers&quot;, &quot;Sensors&quot;, and &quot;Accessories&quot; have sub-categories.
                  On mobile, tap the chevron icon to expand/collapse sub-categories.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  ✅ Responsive Mobile Menu
                </h3>
                <p className="text-gray-600">
                  On mobile devices (or when you resize your browser to mobile width), 
                  a hamburger menu icon appears. Click it to open the mobile navigation menu.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  ✅ Internationalization
                </h3>
                <p className="text-gray-600">
                  Use the language switcher in the navigation to change languages. 
                  All navigation text is translated (en, zh-CN, zh-TW, ja, ko).
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-3">
              Sample Categories Structure
            </h2>
            <div className="text-sm text-blue-800 font-mono bg-white p-4 rounded overflow-x-auto">
              <pre>{`
1. Cameras
   ├── Front Cameras
   ├── Rear Cameras
   └── Side Cameras

2. Controllers
   ├── ECU Controllers
   ├── Steering Controllers
   └── Brake Controllers

3. Sensors
   ├── LiDAR Sensors
   ├── Radar Sensors
   └── Ultrasonic Sensors

4. Displays

5. Accessories
   ├── Cables & Connectors
   └── Mounting Hardware
              `}</pre>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Usage Instructions
            </h2>
            
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Desktop:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Hover over &quot;Products&quot; to see the category dropdown</li>
                  <li>Click on any category to navigate to that category page</li>
                  <li>Sub-categories are indented for visual hierarchy</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Mobile:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Tap the hamburger menu icon (☰) to open the menu</li>
                  <li>Tap on &quot;Products&quot; to see all categories</li>
                  <li>Tap the chevron (▼) next to categories to expand sub-categories</li>
                  <li>Tap any link to navigate (menu will auto-close)</li>
                  <li>Tap the X icon to close the menu</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
