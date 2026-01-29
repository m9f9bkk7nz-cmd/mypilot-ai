import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'neon-blue': '#00d4ff',
        'neon-purple': '#b537f2',
        'neon-pink': '#ff006e',
        'neon-cyan': '#00ffff',
        'cyber-dark': '#0a0014',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 15s ease infinite',
        'neon-pulse': 'neonPulse 2s ease-in-out infinite',
        'cyber-glow': 'cyberGlowRotate 3s linear infinite',
        'glitch': 'glitch 5s infinite',
        'holo-shine': 'holoShine 3s linear infinite',
        'grid-move': 'gridMove 20s linear infinite',
        'scanline': 'scanline 8s linear infinite',
        'glow-pulse': 'glowPulse 8s ease-in-out infinite',
        'gradient-text': 'gradientTextShift 3s linear infinite',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        shimmer: {
          '0%': {
            left: '-100%',
          },
          '100%': {
            left: '100%',
          },
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(0, 212, 255, 0.6)',
          },
        },
        gradientShift: {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },
        neonPulse: {
          '0%, 100%': {
            borderColor: 'rgba(0, 212, 255, 0.5)',
            boxShadow: '0 0 10px rgba(0, 212, 255, 0.5), inset 0 0 10px rgba(0, 212, 255, 0.2)',
          },
          '50%': {
            borderColor: 'rgba(181, 55, 242, 0.5)',
            boxShadow: '0 0 20px rgba(181, 55, 242, 0.6), inset 0 0 15px rgba(181, 55, 242, 0.3)',
          },
        },
        cyberGlowRotate: {
          '0%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
          '100%': {
            backgroundPosition: '0% 50%',
          },
        },
        glitch: {
          '0%, 90%, 100%': {
            transform: 'translate(0)',
          },
          '92%': {
            transform: 'translate(-2px, 2px)',
          },
          '94%': {
            transform: 'translate(2px, -2px)',
          },
          '96%': {
            transform: 'translate(-2px, -2px)',
          },
          '98%': {
            transform: 'translate(2px, 2px)',
          },
        },
        holoShine: {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
        gridMove: {
          '0%': {
            transform: 'translate(0, 0)',
          },
          '100%': {
            transform: 'translate(50px, 50px)',
          },
        },
        scanline: {
          '0%': {
            transform: 'translateY(0)',
          },
          '100%': {
            transform: 'translateY(100vh)',
          },
        },
        glowPulse: {
          '0%, 100%': {
            opacity: '0.5',
          },
          '50%': {
            opacity: '1',
          },
        },
        gradientTextShift: {
          '0%': {
            backgroundPosition: '0% center',
          },
          '100%': {
            backgroundPosition: '200% center',
          },
        },
      },
      animationDelay: {
        '2000': '2s',
        '4000': '4s',
      },
    },
  },
  plugins: [],
}
export default config
