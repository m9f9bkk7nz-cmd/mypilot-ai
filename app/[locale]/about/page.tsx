import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { CheckCircleIcon, ShieldCheckIcon, CpuChipIcon, CameraIcon } from '@heroicons/react/24/outline';

export default function AboutPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations('common');

  // 支持的车型列表
  const supportedBrands = [
    { name: 'Toyota', models: ['Camry', 'RAV4', 'Corolla', 'Prius', 'Highlander'] },
    { name: 'Honda', models: ['Accord', 'Civic', 'CR-V', 'Pilot', 'Odyssey'] },
    { name: 'Hyundai', models: ['Sonata', 'Elantra', 'Tucson', 'Santa Fe', 'Kona'] },
    { name: 'Kia', models: ['Optima', 'Forte', 'Sportage', 'Sorento', 'Niro'] },
    { name: 'Subaru', models: ['Outback', 'Forester', 'Crosstrek', 'Impreza', 'Legacy'] },
    { name: 'Volkswagen', models: ['Jetta', 'Passat', 'Tiguan', 'Atlas', 'Golf'] },
    { name: 'Nissan', models: ['Altima', 'Rogue', 'Sentra', 'Maxima', 'Murano'] },
    { name: 'Mazda', models: ['Mazda3', 'Mazda6', 'CX-5', 'CX-9', 'CX-30'] },
  ];

  // 核心功能
  const features = [
    {
      icon: ShieldCheckIcon,
      title: '自适应巡航控制 (ACC)',
      description: '自动保持与前车的安全距离，支持 0-160 km/h 全速域跟车，包括停车和起步',
      gradient: 'from-neon-blue to-neon-cyan',
    },
    {
      icon: CameraIcon,
      title: '车道保持辅助 (LKA)',
      description: '通过摄像头识别车道线，自动修正方向盘，保持车辆在车道中央行驶',
      gradient: 'from-neon-purple to-neon-pink',
    },
    {
      icon: CpuChipIcon,
      title: '自动变道辅助 (ALC)',
      description: '打转向灯后自动完成变道操作，智能判断周围车辆，确保安全变道',
      gradient: 'from-neon-cyan to-neon-blue',
    },
    {
      icon: CheckCircleIcon,
      title: '前向碰撞预警 (FCW)',
      description: '实时监测前方车辆和障碍物，提前预警潜在碰撞风险，必要时自动刹车',
      gradient: 'from-neon-pink to-neon-purple',
    },
  ];

  // 技术优势
  const advantages = [
    {
      title: '开源透明',
      description: '基于 OpenPilot 开源项目，代码完全透明，社区持续优化升级',
      icon: '🔓',
    },
    {
      title: '持续进化',
      description: '通过 OTA 在线升级，不断获得新功能和性能改进，无需更换硬件',
      icon: '🚀',
    },
    {
      title: '数据驱动',
      description: '利用深度学习和神经网络，从真实驾驶数据中学习，越用越智能',
      icon: '🧠',
    },
    {
      title: '成本优势',
      description: '相比原厂系统价格更亲民，性能更强大，支持更多车型',
      icon: '💰',
    },
  ];

  return (
    <main className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-neon-blue rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-neon-purple rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text-neon">OpenPilot 智能驾驶系统</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              让您的爱车拥有 L2+ 级别自动驾驶能力
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/products`}
                className="inline-block cyber-button bg-gradient-to-r from-neon-blue to-neon-purple text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg shadow-neon-blue/50 hover:shadow-neon-purple/50 hover:scale-105"
              >
                查看产品
              </Link>
              <a
                href="#supported-cars"
                className="inline-block glass-holo text-white px-8 py-4 rounded-full font-semibold hover:bg-neon-blue/10 transition-all duration-300 border border-neon-blue/30"
              >
                支持车型
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What is OpenPilot */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-holo rounded-3xl p-8 md:p-12 border border-neon-blue/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 via-neon-purple/5 to-neon-pink/5"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6">
                <span className="gradient-text-neon">什么是 OpenPilot？</span>
              </h2>
              <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                <p>
                  OpenPilot 是由 comma.ai 开发的开源自动驾驶系统，它可以为您的汽车添加先进的驾驶辅助功能。
                  通过安装我们的硬件设备，您的车辆将获得类似特斯拉 Autopilot 的自动驾驶能力。
                </p>
                <p>
                  系统使用摄像头、传感器和强大的 AI 处理器，实时分析道路状况，自动控制方向盘、油门和刹车，
                  让长途驾驶更轻松、更安全。
                </p>
                <p className="text-neon-cyan font-semibold">
                  ⚠️ 注意：OpenPilot 是驾驶辅助系统，驾驶员必须时刻保持注意力，随时准备接管车辆。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="gradient-text-neon">核心功能</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-holo rounded-2xl p-8 border border-neon-blue/20 card-hover group relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/0 to-neon-purple/0 group-hover:from-neon-blue/5 group-hover:to-neon-purple/5 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-full mb-4 shadow-lg shadow-neon-blue/30 group-hover:shadow-neon-purple/50 transition-all duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Advantages */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="gradient-text-neon">技术优势</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((advantage, index) => (
              <div
                key={advantage.title}
                className="glass-holo rounded-2xl p-6 text-center border border-neon-blue/20 card-hover group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-5xl mb-4 float">{advantage.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neon-cyan group-hover:to-neon-purple transition-all duration-300">
                  {advantage.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Cars */}
      <section id="supported-cars" className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              <span className="gradient-text-neon">支持车型</span>
            </h2>
            <p className="text-xl text-gray-300">
              支持 200+ 款车型，覆盖主流品牌
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportedBrands.map((brand, index) => (
              <div
                key={brand.name}
                className="glass-holo rounded-2xl p-6 border border-neon-blue/20 hover:border-neon-cyan/50 transition-all duration-300 group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-neon-cyan transition-colors">
                  {brand.name}
                </h3>
                <ul className="space-y-2">
                  {brand.models.map((model) => (
                    <li key={model} className="text-gray-400 text-sm flex items-center">
                      <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full mr-2"></span>
                      {model}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 mb-4">
              以上仅列出部分热门车型，更多支持车型请查看完整列表
            </p>
            <a
              href="https://github.com/commaai/openpilot/blob/master/docs/CARS.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-neon-cyan hover:text-neon-blue transition-colors font-medium"
            >
              查看完整车型列表 →
            </a>
          </div>
        </div>
      </section>

      {/* Performance Stats */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-holo rounded-3xl p-12 border border-neon-blue/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 via-neon-purple/5 to-neon-pink/5"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-center mb-12">
                <span className="gradient-text-neon">实际效果</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-5xl font-bold gradient-text-neon mb-2">200+</div>
                  <div className="text-gray-400">支持车型</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold gradient-text-neon mb-2">50M+</div>
                  <div className="text-gray-400">累计行驶里程 (公里)</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold gradient-text-neon mb-2">90%+</div>
                  <div className="text-gray-400">高速路段接管率</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="gradient-text-neon">工作原理</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-holo rounded-2xl p-8 border border-neon-blue/20 text-center">
              <div className="text-4xl mb-4">📷</div>
              <h3 className="text-xl font-semibold text-white mb-3">1. 视觉感知</h3>
              <p className="text-gray-400">
                高清摄像头实时捕捉道路信息，识别车道线、车辆、行人等
              </p>
            </div>
            <div className="glass-holo rounded-2xl p-8 border border-neon-blue/20 text-center">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold text-white mb-3">2. AI 决策</h3>
              <p className="text-gray-400">
                神经网络处理器分析数据，做出驾驶决策，规划行驶路径
              </p>
            </div>
            <div className="glass-holo rounded-2xl p-8 border border-neon-blue/20 text-center">
              <div className="text-4xl mb-4">🚗</div>
              <h3 className="text-xl font-semibold text-white mb-3">3. 精准控制</h3>
              <p className="text-gray-400">
                通过 CAN 总线控制车辆，实现方向、油门、刹车的精准操作
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-purple rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-glow-pulse"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-holo rounded-3xl p-12 border border-neon-blue/30 glow">
            <h2 className="text-4xl font-bold mb-4">
              <span className="gradient-text-neon">准备好升级您的爱车了吗？</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              立即选购 OpenPilot 硬件，开启智能驾驶新体验
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/products`}
                className="inline-block cyber-button bg-gradient-to-r from-neon-blue to-neon-purple text-white px-10 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg shadow-neon-blue/50 hover:shadow-neon-purple/50 hover:scale-105"
              >
                立即购买
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="inline-block glass-holo text-white px-10 py-4 rounded-full font-semibold hover:bg-neon-blue/10 transition-all duration-300 border border-neon-blue/30"
              >
                咨询客服
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
