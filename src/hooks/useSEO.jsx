import { useEffect } from "react";

export function useSEO({
    title,
    description,
    canonical,
    ogTitle,
    ogDescription,
    ogType,
    ogUrl,
    ogImage,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
    jsonLD,
}) {
    useEffect(() => {
        const setMeta = (selector, attrName, value) => {
            if (!value) return;
            let el = document.querySelector(selector);
            if (!el) {
                el = document.createElement("meta");
                el.setAttribute(attrName, selector.match(/"(.*?)"/)[1]);
                document.head.appendChild(el);
            }
            el.content = value;
        };

        if (title) document.title = title;

        // Standard Meta
        setMeta('meta[name="description"]', "name", description);

        // Open Graph
        setMeta('meta[property="og:title"]', "property", ogTitle);
        setMeta('meta[property="og:description"]', "property", ogDescription);
        setMeta('meta[property="og:type"]', "property", ogType);
        setMeta('meta[property="og:url"]', "property", ogUrl);
        setMeta('meta[property="og:image"]', "property", ogImage);

        // Twitter
        setMeta('meta[name="twitter:card"]', "name", twitterCard);
        setMeta('meta[name="twitter:title"]', "name", twitterTitle);
        setMeta('meta[name="twitter:description"]', "name", twitterDescription);
        setMeta('meta[name="twitter:image"]', "name", twitterImage);

        // Canonical URL
        if (canonical) {
            let link = document.querySelector('link[rel="canonical"]');
            if (!link) {
                link = document.createElement("link");
                link.rel = "canonical";
                document.head.appendChild(link);
            }
            link.href = canonical;
        }

        // JSON-LD structured data
        if (jsonLD) {
            let script = document.querySelector(
                'script[type="application/ld+json"]'
            );
            if (!script) {
                script = document.createElement("script");
                script.type = "application/ld+json";
                document.head.appendChild(script);
            }
            script.textContent = JSON.stringify(jsonLD);
        }
    }, [
        title,
        description,
        canonical,
        ogTitle,
        ogDescription,
        ogType,
        ogUrl,
        ogImage,
        twitterCard,
        twitterTitle,
        twitterDescription,
        twitterImage,
        jsonLD,
    ]);
}
