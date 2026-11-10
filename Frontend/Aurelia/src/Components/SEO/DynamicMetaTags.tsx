import { useEffect } from "react";

interface DynamicMetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
}

export const DynamicMetaTags = ({
  title = "Aurelia - Thời Trang Cao Cấp | E-Commerce Thông Minh với AI",
  description = "Nền tảng thương mại điện tử thời trang cao cấp với AI đo số đo cơ thể, gợi ý size thông minh và hệ thống loyalty points.",
  keywords = "thời trang, e-commerce, AI đo số đo, gợi ý size, loyalty points, fashion",
  image = "/aurelia_logo_svg.svg",
  url = window.location.href,
  type = "website",
}: DynamicMetaTagsProps) => {
  useEffect(() => {
    document.title = title;
    const updateMetaTag = (name: string, content: string, attribute: string = "name") => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };
    updateMetaTag("title", title);
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);
    updateMetaTag("og:title", title, "property");
    updateMetaTag("og:description", description, "property");
    updateMetaTag("og:image", image, "property");
    updateMetaTag("og:url", url, "property");
    updateMetaTag("og:type", type, "property");

    updateMetaTag("twitter:title", title, "property");
    updateMetaTag("twitter:description", description, "property");
    updateMetaTag("twitter:image", image, "property");
    updateMetaTag("twitter:card", "summary_large_image", "property");

    let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);
  }, [title, description, keywords, image, url, type]);

  return null;
};

