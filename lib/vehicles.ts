// OpenPilot 支持车型数据
// 基本都需要原车有ACC和车道辅助功能

export interface VehicleModel {
  name: string;
  nameZh?: string;
  years: string;
}

export interface VehicleBrand {
  brand: string;
  brandZh: string;
  count: number;
  models: VehicleModel[];
}

export const supportedVehicles: VehicleBrand[] = [
  {
    brand: 'BYD',
    brandZh: '比亚迪',
    count: 10,
    models: [
      { name: 'Han EV/DMi', nameZh: '汉EV/DMi', years: '2020-2025' },
      { name: 'Tang EV', nameZh: '唐EV', years: '2018-2025' },
      { name: 'Tang DMi/DMP', nameZh: '唐DMi/DMP', years: '2021-2025' },
      { name: 'Song EV', nameZh: '宋EV', years: '2019-2025' },
      { name: 'Song Plus EV/DMi', nameZh: '宋Plus EV/DMi', years: '2020-2025' },
      { name: 'Song Pro EV/DMi', nameZh: '宋Pro EV/DMi', years: '2020-2025' },
      { name: 'Qin EV/Plus DMi', nameZh: '秦EV/Plus DMi', years: '2019-2025' },
      { name: 'Qin L', nameZh: '秦L', years: '2024-2025' },
      { name: 'Yuan Plus/EV (Atto 3)', nameZh: '元Plus/EV', years: '2022-2025' },
      { name: 'Fangchengbao Bao 5', nameZh: '方程豹豹5', years: '2024-2025' },
    ],
  },
  {
    brand: 'Toyota',
    brandZh: '丰田',
    count: 45,
    models: [
      { name: 'Alphard', nameZh: '埃尔法', years: '2019-2021' },
      { name: 'Avalon', nameZh: '亚洲龙', years: '2016-2022' },
      { name: 'Avalon Hybrid', nameZh: '亚洲龙混动', years: '2019-2022' },
      { name: 'C-HR', years: '2017-2022' },
      { name: 'C-HR Hybrid', years: '2017-2022' },
      { name: 'Camry', nameZh: '凯美瑞', years: '2018-2024' },
      { name: 'Camry Hybrid', nameZh: '凯美瑞混动', years: '2018-2024' },
      { name: 'Corolla', nameZh: '卡罗拉', years: '2017-2023' },
      { name: 'Corolla Cross', nameZh: '卡罗拉Cross', years: '2020-2023' },
      { name: 'Corolla Hybrid', nameZh: '卡罗拉混动', years: '2020-2023' },
      { name: 'Highlander', nameZh: '汉兰达', years: '2017-2023' },
      { name: 'Highlander Hybrid', nameZh: '汉兰达混动', years: '2017-2023' },
      { name: 'Mirai', nameZh: '未来', years: '2021' },
      { name: 'Prius', nameZh: '普锐斯', years: '2016-2022' },
      { name: 'Prius Prime', years: '2017-2022' },
      { name: 'RAV4', nameZh: '荣放', years: '2016-2025' },
      { name: 'RAV4 Hybrid', nameZh: '荣放混动', years: '2016-2025' },
      { name: 'Sienna', nameZh: '赛纳', years: '2018-2020' },
    ],
  },
  {
    brand: 'Honda',
    brandZh: '本田',
    count: 21,
    models: [
      { name: 'Accord', nameZh: '雅阁', years: '2018-2022' },
      { name: 'Accord Hybrid', nameZh: '雅阁混动', years: '2018-2022' },
      { name: 'Civic', nameZh: '思域', years: '2016-2024' },
      { name: 'Civic Hatchback', nameZh: '思域两厢', years: '2017-2024' },
      { name: 'CR-V', years: '2015-2022' },
      { name: 'CR-V Hybrid', years: '2017-2021' },
      { name: 'Fit', nameZh: '飞度', years: '2018-2020' },
      { name: 'HR-V', years: '2019-2023' },
      { name: 'Insight', years: '2019-2022' },
      { name: 'Inspire', nameZh: '英仕派', years: '2018' },
      { name: 'Odyssey', nameZh: '奥德赛', years: '2018-2020' },
      { name: 'Passport', years: '2019-2023' },
      { name: 'Pilot', nameZh: '飞行员', years: '2016-2022' },
      { name: 'Ridgeline', nameZh: '山脊线', years: '2017-2025' },
    ],
  },
  {
    brand: 'Hyundai',
    brandZh: '现代',
    count: 43,
    models: [
      { name: 'Azera', nameZh: '雅尊', years: '2019-2022' },
      { name: 'Custin', years: '2023' },
      { name: 'Elantra', nameZh: '伊兰特', years: '2017-2023' },
      { name: 'Elantra Hybrid', nameZh: '伊兰特混动', years: '2021-2023' },
      { name: 'Ioniq 5', years: '2022-2024' },
      { name: 'Ioniq 6', years: '2023-2024' },
      { name: 'Ioniq Electric', years: '2019-2020' },
      { name: 'Ioniq Hybrid', years: '2017-2022' },
      { name: 'Kona', nameZh: '昂希诺', years: '2020' },
      { name: 'Kona Electric', years: '2018-2023' },
      { name: 'Palisade', nameZh: '帕里斯帝', years: '2020-2022' },
      { name: 'Santa Cruz', nameZh: '胜达', years: '2022-2024' },
      { name: 'Santa Fe', years: '2019-2023' },
      { name: 'Santa Fe Hybrid', years: '2022-2023' },
      { name: 'Sonata', nameZh: '索纳塔', years: '2018-2023' },
      { name: 'Sonata Hybrid', years: '2020-2023' },
      { name: 'Tucson', nameZh: '途胜', years: '2019-2024' },
      { name: 'Tucson Hybrid', years: '2022-2024' },
      { name: 'Veloster', nameZh: '飞思', years: '2019-2020' },
    ],
  },
  {
    brand: 'Kia',
    brandZh: '起亚',
    count: 38,
    models: [
      { name: 'Carnival', nameZh: '嘉华', years: '2022-2024' },
      { name: 'EV6', years: '2022-2024' },
      { name: 'Forte', nameZh: '福瑞迪', years: '2019-2023' },
      { name: 'K5', years: '2020-2024' },
      { name: 'K5 Hybrid', years: '2020-2022' },
      { name: 'K8 Hybrid', years: '2023' },
      { name: 'Niro EV', nameZh: '极睿EV', years: '2019-2023' },
      { name: 'Niro Hybrid', years: '2018-2023' },
      { name: 'Niro Plug-in Hybrid', years: '2018-2022' },
      { name: 'Optima', nameZh: '远舰', years: '2017-2020' },
      { name: 'Seltos', nameZh: '赛图斯', years: '2021' },
      { name: 'Sorento', nameZh: '索兰托', years: '2018-2023' },
      { name: 'Sorento Hybrid', years: '2023' },
      { name: 'Sportage', nameZh: '狮跑', years: '2023-2024' },
      { name: 'Sportage Hybrid', years: '2023' },
      { name: 'Stinger', nameZh: '斯汀格', years: '2018-2023' },
      { name: 'Telluride', years: '2020-2022' },
    ],
  },
  {
    brand: 'Volkswagen',
    brandZh: '大众',
    count: 36,
    models: [
      { name: 'Arteon', nameZh: '雅腾', years: '2018-2023' },
      { name: 'Atlas', nameZh: '途昂(北美)', years: '2018-2023' },
      { name: 'Atlas Cross Sport', years: '2021-2022' },
      { name: 'CC', years: '2018-2022' },
      { name: 'e-Golf', years: '2014-2020' },
      { name: 'Golf', nameZh: '高尔夫', years: '2015-2021' },
      { name: 'Golf GTI', years: '2015-2021' },
      { name: 'Golf R', years: '2015-2019' },
      { name: 'Jetta', nameZh: '捷达', years: '2018-2024' },
      { name: 'Jetta GLI', years: '2021-2024' },
      { name: 'Passat', nameZh: '帕萨特', years: '2015-2022' },
      { name: 'Polo', nameZh: '波罗', years: '2018-2023' },
      { name: 'T-Cross', nameZh: '途铠', years: '2021' },
      { name: 'T-Roc', nameZh: '探歌', years: '2021' },
      { name: 'Taos', nameZh: '途岳(海外)', years: '2022-2023' },
      { name: 'Teramont', nameZh: '途昂', years: '2018-2022' },
      { name: 'Tiguan', nameZh: '途观', years: '2018-2023' },
      { name: 'Touran', nameZh: '途安', years: '2016-2023' },
    ],
  },
  {
    brand: 'Lexus',
    brandZh: '雷克萨斯',
    count: 19,
    models: [
      { name: 'CT Hybrid', years: '2017-2018' },
      { name: 'ES', years: '2017-2024' },
      { name: 'ES Hybrid', years: '2017-2024' },
      { name: 'GS F', years: '2016' },
      { name: 'IS', years: '2017-2023' },
      { name: 'NX', years: '2018-2021' },
      { name: 'NX Hybrid', years: '2018-2021' },
      { name: 'RC', years: '2018-2020' },
      { name: 'RX', years: '2016-2022' },
      { name: 'RX Hybrid', years: '2016-2022' },
      { name: 'UX Hybrid', years: '2019-2023' },
    ],
  },
  {
    brand: 'Ford',
    brandZh: '福特',
    count: 15,
    models: [
      { name: 'Bronco Sport', nameZh: '烈马', years: '2021-2024' },
      { name: 'Escape', nameZh: '锐际', years: '2020-2022' },
      { name: 'Escape Hybrid', nameZh: '锐际混动', years: '2020-2022' },
      { name: 'Explorer', nameZh: '探险者', years: '2020-2024' },
      { name: 'Explorer Hybrid', nameZh: '探险者混动', years: '2020-2024' },
      { name: 'F-150', years: '2022-2023' },
      { name: 'F-150 Hybrid', years: '2022-2023' },
      { name: 'Focus', nameZh: '福克斯', years: '2018' },
      { name: 'Kuga', nameZh: '翼虎', years: '2020-2022' },
      { name: 'Maverick', nameZh: '独行侠', years: '2022-2024' },
      { name: 'Mustang Mach-E', nameZh: '野马Mach-E', years: '2021-2023' },
      { name: 'Ranger', nameZh: '游骑侠', years: '2024' },
    ],
  },
  {
    brand: 'Genesis',
    brandZh: '捷尼赛思',
    count: 10,
    models: [
      { name: 'G70', years: '2018-2023' },
      { name: 'G80', years: '2017-2019' },
      { name: 'G90', years: '2017-2020' },
      { name: 'GV60', years: '2023' },
      { name: 'GV70', years: '2022-2024' },
      { name: 'GV70 Electrified', years: '2022-2024' },
      { name: 'GV80', years: '2023-2024' },
    ],
  },
  {
    brand: 'Subaru',
    brandZh: '斯巴鲁',
    count: 10,
    models: [
      { name: 'Ascent', years: '2019-2021' },
      { name: 'Crosstrek', nameZh: '旭豹', years: '2018-2023' },
      { name: 'Forester', nameZh: '森林人', years: '2019-2021' },
      { name: 'Impreza', nameZh: '翼豹', years: '2017-2022' },
      { name: 'Legacy', nameZh: '力狮', years: '2020-2022' },
      { name: 'Outback', nameZh: '傲虎', years: '2020-2022' },
      { name: 'XV', years: '2018-2021' },
    ],
  },
  {
    brand: 'Nissan',
    brandZh: '日产',
    count: 4,
    models: [
      { name: 'Altima', nameZh: '天籁', years: '2019-2020' },
      { name: 'Leaf', nameZh: '聆风', years: '2018-2023' },
      { name: 'Rogue', nameZh: '奇骏', years: '2018-2020' },
      { name: 'X-Trail', nameZh: '奇骏', years: '2017' },
    ],
  },
  {
    brand: 'Mazda',
    brandZh: '马自达',
    count: 2,
    models: [
      { name: 'CX-5', years: '2022-2025' },
      { name: 'CX-9', years: '2021-2023' },
    ],
  },
  {
    brand: 'Acura',
    brandZh: '讴歌',
    count: 3,
    models: [
      { name: 'ILX', years: '2016-2019' },
      { name: 'RDX', years: '2016-2022' },
    ],
  },
  {
    brand: 'Audi',
    brandZh: '奥迪',
    count: 6,
    models: [
      { name: 'A3', years: '2014-2019' },
      { name: 'A3 Sportback e-tron', years: '2017-2018' },
      { name: 'Q2', years: '2018' },
      { name: 'Q3', years: '2019-2023' },
      { name: 'RS3', years: '2018' },
      { name: 'S3', years: '2015-2017' },
    ],
  },
  {
    brand: 'Chevrolet',
    brandZh: '雪佛兰',
    count: 5,
    models: [
      { name: 'Bolt EUV', years: '2022-2023' },
      { name: 'Bolt EV', years: '2022-2023' },
      { name: 'Equinox', nameZh: '探界者', years: '2019-2022' },
      { name: 'Silverado 1500', nameZh: '索罗德', years: '2020-2021' },
      { name: 'Trailblazer', nameZh: '开拓者', years: '2021-2022' },
    ],
  },
  {
    brand: 'Chrysler',
    brandZh: '克莱斯勒',
    count: 5,
    models: [
      { name: 'Pacifica', nameZh: '大捷龙', years: '2017-2024' },
      { name: 'Pacifica Hybrid', nameZh: '大捷龙混动', years: '2017-2024' },
    ],
  },
  {
    brand: 'Jeep',
    brandZh: '吉普',
    count: 2,
    models: [
      { name: 'Grand Cherokee', nameZh: '大切诺基', years: '2016-2021' },
    ],
  },
  {
    brand: 'Lincoln',
    brandZh: '林肯',
    count: 2,
    models: [
      { name: 'Aviator', nameZh: '飞行家', years: '2020-2023' },
      { name: 'Aviator Plug-in Hybrid', nameZh: '飞行家混动', years: '2020-2023' },
    ],
  },
  {
    brand: 'Skoda',
    brandZh: '斯柯达',
    count: 9,
    models: [
      { name: 'Fabia', nameZh: '晶锐', years: '2022-2023' },
      { name: 'Kamiq', nameZh: '柯米克', years: '2021-2023' },
      { name: 'Karoq', nameZh: '柯珞克', years: '2019-2023' },
      { name: 'Kodiaq', nameZh: '柯迪亚克', years: '2017-2023' },
      { name: 'Octavia', nameZh: '明锐', years: '2015-2019' },
      { name: 'Scala', nameZh: '昕锐', years: '2020-2023' },
      { name: 'Superb', nameZh: '速派', years: '2015-2022' },
    ],
  },
  {
    brand: 'BMW',
    brandZh: '宝马',
    count: 1,
    models: [
      { name: '5 Series', nameZh: '5系', years: '需要5AU' },
    ],
  },
  {
    brand: 'Changan',
    brandZh: '长安',
    count: 2,
    models: [
      { name: 'Oshan Z6/Z6 iDD', nameZh: '欧尚Z6/Z6 iDD', years: '2022-2024' },
      { name: 'Qiyuan A05', nameZh: '启源A05', years: '2023-2024' },
    ],
  },
];

// 获取所有品牌列表
export function getAllBrands(): string[] {
  return supportedVehicles.map(v => v.brand);
}

// 根据品牌获取车型
export function getModelsByBrand(brand: string): VehicleModel[] {
  const vehicle = supportedVehicles.find(v => v.brand === brand);
  return vehicle?.models || [];
}

// 获取总支持车型数量
export function getTotalVehicleCount(): number {
  return supportedVehicles.reduce((sum, brand) => sum + brand.models.length, 0);
}

// 搜索车型
export function searchVehicles(query: string): VehicleBrand[] {
  const lowerQuery = query.toLowerCase();
  return supportedVehicles
    .map(brand => ({
      ...brand,
      models: brand.models.filter(
        model =>
          model.name.toLowerCase().includes(lowerQuery) ||
          model.nameZh?.includes(query) ||
          brand.brand.toLowerCase().includes(lowerQuery) ||
          brand.brandZh.includes(query)
      ),
    }))
    .filter(brand => brand.models.length > 0);
}
