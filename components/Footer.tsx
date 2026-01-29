'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale }: FooterProps) {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-black/80 border-t border-neon-blue/20">
      {/* Animated background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-neon-blue/5 via-transparent to-transparent"></div>
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-neon-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-neon-purple/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="inline-flex items-center gap-3 mb-6 group">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="absolute inset-0 border border-neon-cyan/50 rounded-xl"></div>
                <span className="text-2xl font-bold text-neon-cyan">M</span>
              </div>
              <div>
                <span className="text-2xl font-bold gradient-text-neon">MyPilot</span>
                <span className="block text-[10px] text-neon-cyan/60 tracking-[0.2em] uppercase">Autonomous Driving</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              让您的爱车拥有 L2+ 级别自动驾驶能力。AI智能驾驶辅助，高清多角度摄像系统，即插即用。
            </p>
            {/* Social Media Links */}
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-neon-blue/20 text-gray-400 hover:text-neon-cyan hover:border-neon-cyan/50 hover:bg-neon-cyan/10 transition-all duration-300" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-neon-blue/20 text-gray-400 hover:text-neon-cyan hover:border-neon-cyan/50 hover:bg-neon-cyan/10 transition-all duration-300" aria-label="GitHub">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-neon-blue/20 text-gray-400 hover:text-neon-cyan hover:border-neon-cyan/50 hover:bg-neon-cyan/10 transition-all duration-300" aria-label="YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan"></span>
              {t('footer.company')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href={`/${locale}/about`} className="text-gray-400 text-sm hover:text-neon-cyan transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 h-px bg-neon-cyan group-hover:w-3 transition-all duration-300"></span>
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/vehicles`} className="text-gray-400 text-sm hover:text-neon-cyan transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 h-px bg-neon-cyan group-hover:w-3 transition-all duration-300"></span>
                  支持车型
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-gray-400 text-sm hover:text-neon-cyan transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 h-px bg-neon-cyan group-hover:w-3 transition-all duration-300"></span>
                  {t('footer.contactUs')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-purple"></span>
              {t('footer.support')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href={`/${locale}/help`} className="text-gray-400 text-sm hover:text-neon-purple transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 h-px bg-neon-purple group-hover:w-3 transition-all duration-300"></span>
                  {t('footer.helpCenter')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shipping`} className="text-gray-400 text-sm hover:text-neon-purple transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 h-px bg-neon-purple group-hover:w-3 transition-all duration-300"></span>
                  {t('footer.shipping')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/legal/returns`} className="text-gray-400 text-sm hover:text-neon-purple transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 h-px bg-neon-purple group-hover:w-3 transition-all duration-300"></span>
                  {t('footer.returns')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-pink"></span>
              {t('footer.legal')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href={`/${locale}/legal/privacy`} className="text-gray-400 text-sm hover:text-neon-pink transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 h-px bg-neon-pink group-hover:w-3 transition-all duration-300"></span>
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/legal/terms`} className="text-gray-400 text-sm hover:text-neon-pink transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 h-px bg-neon-pink group-hover:w-3 transition-all duration-300"></span>
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10 py-6 border-y border-neon-blue/10">
          <span className="text-gray-500 text-xs uppercase tracking-wider">Secure Payment</span>
          <div className="px-4 py-2 rounded-lg bg-white/5 border border-neon-blue/20 hover:border-neon-cyan/30 transition-colors">
            <span className="text-gray-400 text-xs font-medium">Stripe</span>
          </div>
          <div className="px-4 py-2 rounded-lg bg-white/5 border border-neon-blue/20 hover:border-neon-cyan/30 transition-colors">
            <span className="text-gray-400 text-xs font-medium">PayPal</span>
          </div>
          <div className="px-4 py-2 rounded-lg bg-white/5 border border-neon-blue/20 hover:border-neon-cyan/30 transition-colors">
            <span className="text-gray-400 text-xs font-medium">Alipay</span>
          </div>
          <div className="px-4 py-2 rounded-lg bg-white/5 border border-neon-blue/20 hover:border-neon-cyan/30 transition-colors">
            <span className="text-gray-400 text-xs font-medium">WeChat Pay</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} MyPilot. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href={`/${locale}/legal/privacy`} className="text-gray-500 hover:text-neon-cyan transition-colors">
              Privacy
            </Link>
            <Link href={`/${locale}/legal/terms`} className="text-gray-500 hover:text-neon-cyan transition-colors">
              Terms
            </Link>
            <span className="text-gray-600">|</span>
            <span className="text-gray-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></span>
              System Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
