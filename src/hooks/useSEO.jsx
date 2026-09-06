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
    ogSiteName,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
    robots,
    suppressDescription = false,
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

        const descriptionSelectors = [
            'meta[name="description"]',
            'meta[property="og:description"]',
            'meta[name="twitter:description"]',
        ];
        const suppressedDescriptions = [];

        if (suppressDescription) {
            for (const selector of descriptionSelectors) {
                const meta = document.querySelector(selector);
                if (!meta) continue;

                suppressedDescriptions.push({
                    meta,
                    content: meta.getAttribute("content"),
                });
                meta.setAttribute("content", "");
            }
        } else {
            // Standard Meta
            setMeta('meta[name="description"]', "name", description);
        }

        // Open Graph
        setMeta('meta[property="og:title"]', "property", ogTitle);
        if (!suppressDescription) {
            setMeta('meta[property="og:description"]', "property", ogDescription);
        }
        setMeta('meta[property="og:type"]', "property", ogType);
        setMeta('meta[property="og:url"]', "property", ogUrl);
        setMeta('meta[property="og:image"]', "property", ogImage);
        setMeta('meta[property="og:site_name"]', "property", ogSiteName);

        // Twitter
        setMeta('meta[name="twitter:card"]', "name", twitterCard);
        setMeta('meta[name="twitter:title"]', "name", twitterTitle);
        if (!suppressDescription) {
            setMeta('meta[name="twitter:description"]', "name", twitterDescription);
        }
        setMeta('meta[name="twitter:image"]', "name", twitterImage);

        let restoreRobots;
        if (robots) {
            let robotsMeta = document.querySelector('meta[name="robots"]');
            const previousContent = robotsMeta?.getAttribute("content");
            const created = !robotsMeta;

            if (!robotsMeta) {
                robotsMeta = document.createElement("meta");
                robotsMeta.setAttribute("name", "robots");
                document.head.appendChild(robotsMeta);
            }

            robotsMeta.setAttribute("content", robots);
            restoreRobots = () => {
                if (created) {
                    robotsMeta.remove();
                } else if (previousContent === null) {
                    robotsMeta.removeAttribute("content");
                } else {
                    robotsMeta.setAttribute("content", previousContent);
                }
            };
        }

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

        return () => {
            restoreRobots?.();
            for (const { meta, content } of suppressedDescriptions) {
                if (content === null) {
                    meta.removeAttribute("content");
                } else {
                    meta.setAttribute("content", content);
                }
            }
        };
    }, [
        title,
        description,
        canonical,
        ogTitle,
        ogDescription,
        ogType,
        ogUrl,
        ogImage,
        ogSiteName,
        twitterCard,
        twitterTitle,
        twitterDescription,
        twitterImage,
        robots,
        suppressDescription,
        jsonLD,
    ]);
}
