'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { 
  QuestionMarkCircleIcon, 
  TruckIcon, 
  CreditCardIcon, 
  ArrowPathIcon,
  WrenchScrewdriverIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

interface HelpPageProps {
  params: { locale: string };
}

const faqItems = [
  {
    question: 'MyPilot 设备支持哪些车型？',
    answer: '我们支持超过200+车型，包括丰田、本田、大众、特斯拉、宝马、奔驰等21个主流品牌。您可以在"支持车型"页面查看完整列表。',
  },
  {
    question: '安装 MyPilot 需要专业技术吗？',
    answer: 'MyPilot 采用即插即用设计，大多数用户可以在30分钟内完成安装。我们提供详细的安装视频教程和图文指南。如需专业安装，可联系我们的授权安装点。',
  },
  {
    question: '设备的质保期是多久？',
    answer: '所有 MyPilot 硬件产品享受2年质保服务。质保期内，因产品质量问题导致的故障，我们提供免费维修或更换服务。',
  },
  {
    question: '如何获取软件更新？',
    answer: 'MyPilot 支持 OTA（空中升级）功能，当有新版本发布时，设备会自动提示更新。您也可以在设置中手动检查更新。',
  },
  {
    question: '退换货政策是什么？',
    answer: '我们提供7天无理由退换货服务。产品需保持原包装完好，未经使用或安装。详情请查看退换货政策页面。',
  },
  {
    question: '国际配送需要多长时间？',
    answer: '国际配送通常需要7-15个工作日，具体时间取决于目的地国家。我们提供实时物流追踪服务。',
  },
];

const helpCategories = [
  {
    icon: WrenchScrewdriverIcon,
    title: '安装指南',
    description: '详细的安装步骤和视频教程',
    href: '#installation',
    color: 'neon-cyan',
  },
  {
    icon: TruckIcon,
    title: '配送信息',
    description: '配送范围、时间和费用说明',
    href: '/shipping',
    color: 'neon-purple',
  },
  {
    icon: ArrowPathIcon,
    title: '退换货政策',
    description: '7天无理由退换货服务',
    href: '/legal/returns',
    color: 'neon-pink',
  },
  {
    icon: CreditCardIcon,
    title: '支付方式',
    description: '支持多种安全支付方式',
    href: '#payment',
    color: 'neon-cyan',
  },
];

export default function HelpPage({ params: { locale } }: HelpPageProps) {
  const t = useTranslations();

  return (
    <main className="min-h-screen gradient-bg py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-2xl mb-6 border border-neon-cyan/30">
            <QuestionMarkCircleIcon className="w-10 h-10 text-neon-cyan" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text-neon">帮助中心</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            找到您需要的答案，或联系我们的客服团队获取帮助
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {helpCategories.map((category) => (
            <Link
              key={category.title}
              href={`/${locale}${category.href}`}
              className="glass-holo rounded-2xl p-6 border border-neon-blue/20 card-hover group"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 bg-${category.color}/20 rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                <category.icon className={`w-6 h-6 text-${category.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{category.title}</h3>
              <p className="text-gray-400 text-sm">{category.description}</p>
            </Link>
          ))}
        </div>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <BookOpenIcon className="w-8 h-8 text-neon-cyan" />
            <h2 className="text-3xl font-bold text-white">常见问题</h2>
          </div>
          
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <details
                key={index}
                className="glass-holo rounded-xl border border-neon-blue/20 group"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="text-lg font-medium text-white pr-4">{item.question}</span>
                  <span className="text-neon-cyan text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-6 pb-6 text-gray-400 border-t border-neon-blue/10 pt-4">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="glass-holo rounded-3xl p-8 md:p-12 border border-neon-blue/20">
          <div className="text-center mb-8">
            <ChatBubbleLeftRightIcon className="w-12 h-12 text-neon-purple mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">还有其他问题？</h2>
            <p className="text-gray-400">我们的客服团队随时为您提供帮助</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href={`/${locale}/contact`}
              className="flex items-center gap-4 p-6 bg-neon-cyan/10 rounded-xl border border-neon-cyan/30 hover:bg-neon-cyan/20 transition-all group"
            >
              <div className="w-12 h-12 bg-neon-cyan/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-neon-cyan" />
              </div>
              <div>
                <h3 className="text-white font-semibold">在线咨询</h3>
                <p className="text-gray-400 text-sm">发送消息给我们</p>
              </div>
            </Link>
            
            <a
              href="mailto:support@mypilot.com"
              className="flex items-center gap-4 p-6 bg-neon-purple/10 rounded-xl border border-neon-purple/30 hover:bg-neon-purple/20 transition-all group"
            >
              <div className="w-12 h-12 bg-neon-purple/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <PhoneIcon className="w-6 h-6 text-neon-purple" />
              </div>
              <div>
                <h3 className="text-white font-semibold">邮件支持</h3>
                <p className="text-gray-400 text-sm">support@mypilot.com</p>
              </div>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
