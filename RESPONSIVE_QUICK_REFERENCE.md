# Responsive Design Quick Reference

## Tailwind Breakpoints

```
Mobile:   < 640px   (default, no prefix)
sm:       ≥ 640px   (large phones landscape)
md:       ≥ 768px   (tablets)
lg:       ≥ 1024px  (laptops)
xl:       ≥ 1280px  (desktops)
2xl:      ≥ 1536px  (large displays)
```

## Common Patterns

### Layout

```tsx
// Mobile: stack, Desktop: side-by-side
<div className="flex flex-col md:flex-row">

// Mobile: 1 col, Tablet: 2 cols, Desktop: 4 cols
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

// Responsive container
<div className="container mx-auto px-4 md:px-6 lg:px-8">
```

### Visibility

```tsx
// Hide on mobile, show on desktop
<div className="hidden md:block">

// Show on mobile, hide on desktop
<div className="md:hidden">

// Show only on tablet
<div className="hidden md:block lg:hidden">
```

### Spacing

```tsx
// Responsive padding
<div className="p-4 md:p-6 lg:p-8">

// Responsive margin
<div className="mt-4 md:mt-6 lg:mt-8">

// Responsive gap
<div className="space-y-4 md:space-y-6 lg:space-y-8">
```

### Typography

```tsx
// Responsive text size
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Responsive line height
<p className="leading-relaxed md:leading-loose">

// Responsive text alignment
<p className="text-center md:text-left">
```

### Sizing

```tsx
// Responsive width
<div className="w-full md:w-1/2 lg:w-1/3">

// Responsive height
<div className="h-48 md:h-64 lg:h-80">

// Responsive max-width
<div className="max-w-full md:max-w-2xl lg:max-w-4xl">
```

## Touch Targets

### Minimum Sizes

```tsx
// Button (48x48px minimum)
<button className="p-3 min-h-[48px] min-w-[48px]">

// Icon button
<button className="p-2">
  <Icon className="h-6 w-6" />
</button>

// Link with padding
<a className="inline-block px-4 py-3">

// Form input
<input className="px-4 py-3 min-h-[48px]" />
```

## Mobile Menu Pattern

```tsx
// Mobile menu toggle
const [isOpen, setIsOpen] = useState(false);

// Toggle button
<button 
  onClick={() => setIsOpen(!isOpen)}
  className="md:hidden p-2"
>
  {isOpen ? <XIcon /> : <MenuIcon />}
</button>

// Mobile menu
{isOpen && (
  <div className="md:hidden">
    {/* Menu content */}
  </div>
)}

// Desktop menu
<nav className="hidden md:flex">
  {/* Menu content */}
</nav>
```

## Responsive Images

```tsx
// Next.js Image (recommended)
<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  className="w-full h-auto"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>

// Regular img with responsive sizing
<img 
  src="/image.jpg" 
  alt="Description"
  className="w-full h-auto object-cover"
/>
```

## Common Components

### Header

```tsx
// Sticky header
<header className="sticky top-0 z-50 bg-white shadow-md">
  <div className="container mx-auto px-4">
    {/* Desktop nav */}
    <nav className="hidden md:flex">
    
    {/* Mobile menu button */}
    <button className="md:hidden">
  </div>
</header>
```

### Footer

```tsx
<footer className="bg-gray-900 text-white">
  <div className="container mx-auto px-4 py-12">
    {/* Responsive grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Footer sections */}
    </div>
  </div>
</footer>
```

### Card Grid

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {items.map(item => (
    <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
      {/* Card content */}
    </div>
  ))}
</div>
```

## Testing Checklist

- [ ] Test on mobile (320px - 767px)
- [ ] Test on tablet (768px - 1023px)
- [ ] Test on desktop (1024px+)
- [ ] Check touch targets (min 44x44px)
- [ ] Verify no horizontal scroll
- [ ] Test mobile menu functionality
- [ ] Check image loading/sizing
- [ ] Verify text readability
- [ ] Test form inputs on mobile
- [ ] Check hover states (desktop)
- [ ] Check active states (mobile)

## Browser DevTools

### Chrome/Edge
```
F12 → Toggle device toolbar (Ctrl+Shift+M)
```

### Firefox
```
F12 → Responsive Design Mode (Ctrl+Shift+M)
```

### Safari
```
Develop → Enter Responsive Design Mode
```

## Common Mistakes to Avoid

❌ **Desktop-first approach**
```tsx
<div className="w-1/3 md:w-full">  // Wrong order
```

✅ **Mobile-first approach**
```tsx
<div className="w-full md:w-1/3">  // Correct order
```

❌ **Fixed widths**
```tsx
<div className="w-[1200px]">  // Breaks on mobile
```

✅ **Flexible widths**
```tsx
<div className="w-full max-w-7xl mx-auto">  // Responsive
```

❌ **Small touch targets**
```tsx
<button className="p-1">  // Too small
```

✅ **Adequate touch targets**
```tsx
<button className="p-3">  // Good size
```

❌ **Hidden content on mobile**
```tsx
<div className="hidden">  // Hidden everywhere
```

✅ **Conditionally hidden**
```tsx
<div className="hidden md:block">  // Hidden only on mobile
```

## Resources

- [Tailwind Docs](https://tailwindcss.com/docs/responsive-design)
- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Web.dev Responsive](https://web.dev/responsive-web-design-basics/)
