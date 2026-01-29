'use client';

import { useTranslations } from 'next-intl';
import { 
  TruckIcon, 
  GlobeAltIcon, 
  ClockIcon, 
  MapPinIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface ShippingPageProps {
  params: { locale: string };
}

const shippingMethods = [
  {
    name: '标准配送',
    time: '5-7 个工作日',
    price: '免费',
    description: '订单满 $50 免运费',
    icon: TruckIcon,
    color: 'neon-cyan',
  },
  {
    name: '快速配送',
    time: '2-3 个工作日',
    price: '$15',
    description: '优先处理和发货',
    icon: ClockIcon,
    color: 'neon-purple',
  },
  {
    name: '次日达',
    time: '1 个工作日',
    price: '$30',
    description: '工作日下午3点前下单',
    icon: MapPinIcon,
    color: 'neon-pink',
  },
];

const internationalZones = [
  {
    zone: '亚太地区',
    countries: '中国、日本、韩国、澳大利亚、新加坡、泰国等',
    time: '7-10 个工作日',
    price: '从 $25 起',
  },
  {
    zone: '欧洲',
    countries: '英国、德国、法国、意大利、西班牙等',
    time: '10-15 个工作日',
    price: '从 $35 起',
  },
  {
    zone: '北美',
    countries: '美国、加拿大、墨西哥',
    time: '5-10 个工作日',
    price: '从 $20 起',
  },
  {
    zone: '中东',
    countries: '阿联酋、沙特阿拉伯、卡塔尔等',
    time: '10-15 个工作日',
    price: '从 $40 起',
  },
];

const shippingFeatures = [
  '所有订单提供实时物流追踪',
  '安全包装，防震防摔',
  '签收确认服务',
  '配送异常主动通知',
  '支持指定配送时间',
  '无接触配送选项',
];

export default function ShippingPage({ params: { locale } }: ShippingPageProps) {
  const t = useTranslations();

  return (
    <main className="min-h-screen gradient-bg py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-2xl mb-6 border border-neon-cyan/30">
            <TruckIcon className="w-10 h-10 text-neon-cyan" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text-neon">配送信息</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            我们提供全球配送服务，确保您的 MyPilot 设备安全送达
          </p>
        </div>

        {/* Domestic Shipping */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <MapPinIcon className="w-8 h-8 text-neon-cyan" />
            <h2 className="text-3xl font-bold text-white">国内配送</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shippingMethods.map((method) => (
              <div
                key={method.name}
                className="glass-holo rounded-2xl p-6 border border-neon-blue/20 card-hover"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-${method.color}/20 rounded-xl mb-4`}>
                  <method.icon className={`w-7 h-7 text-${method.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{method.name}</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className={`text-2xl font-bold text-${method.color}`}>{method.price}</span>
                  <span className="text-gray-400">· {method.time}</span>
                </div>
                <p className="text-gray-400 text-sm">{method.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* International Shipping */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <GlobeAltIcon className="w-8 h-8 text-neon-purple" />
            <h2 className="text-3xl font-bold text-white">国际配送</h2>
          </div>
          
          <div className="glass-holo rounded-2xl border border-neon-blue/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neon-blue/20">
                    <th className="text-left p-4 text-neon-cyan font-semibold">配送区域</th>
                    <th className="text-left p-4 text-neon-cyan font-semibold">覆盖国家</th>
                    <th className="text-left p-4 text-neon-cyan font-semibold">预计时间</th>
                    <th className="text-left p-4 text-neon-cyan font-semibold">运费</th>
                  </tr>
                </thead>
                <tbody>
                  {internationalZones.map((zone, index) => (
                    <tr 
                      key={zone.zone}
                      className={`border-b border-neon-blue/10 hover:bg-neon-blue/5 transition-colors ${
                        index === internationalZones.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="p-4 text-white font-medium">{zone.zone}</td>
                      <td className="p-4 text-gray-400">{zone.countries}</td>
                      <td className="p-4 text-gray-300">{zone.time}</td>
                      <td className="p-4 text-neon-purple font-semibold">{zone.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-4 flex items-start gap-3 p-4 bg-neon-cyan/10 rounded-xl border border-neon-cyan/20">
            <InformationCircleIcon className="w-6 h-6 text-neon-cyan flex-shrink-0 mt-0.5" />
            <p className="text-gray-300 text-sm">
              国际配送可能需要支付目的地国家的进口关税和税费，这些费用由收件人承担。具体费用取决于当地海关政策。
            </p>
          </div>
        </section>

        {/* Shipping Features */}
        <section className="mb-16">
          <div className="glass-holo rounded-3xl p-8 md:p-12 border border-neon-blue/20">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">配送服务特点</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shippingFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
                  <CheckCircleIcon className="w-6 h-6 text-neon-cyan flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Order Tracking */}
        <section className="glass-holo rounded-3xl p-8 md:p-12 border border-neon-blue/20 text-center">
          <ClockIcon className="w-12 h-12 text-neon-purple mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">追踪您的订单</h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            订单发货后，您将收到包含追踪号的邮件通知。您可以随时在账户中查看订单状态和物流信息。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`/${locale}/account/orders`}
              className="inline-block cyber-button bg-gradient-to-r from-neon-cyan to-neon-purple text-white px-8 py-3 rounded-full font-semibold transition-all hover:scale-105"
            >
              查看我的订单
            </a>
            <a
              href={`/${locale}/contact`}
              className="inline-block glass-holo text-white px-8 py-3 rounded-full font-semibold border border-neon-blue/30 hover:bg-neon-blue/10 transition-all"
            >
              联系客服
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
