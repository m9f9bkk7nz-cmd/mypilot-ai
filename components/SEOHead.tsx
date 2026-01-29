/**
 * SEO Head 组件
 * 用于在客户端组件中添加结构化数据
 */

interface SEOHeadProps {
  structuredData?: any;
}

export default function SEOHead({ structuredData }: SEOHeadProps) {
  if (!structuredData) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
