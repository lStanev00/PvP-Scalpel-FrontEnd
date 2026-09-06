import { log } from "./logger.mjs";

export function createRenderPage({
    buildAssets,
    scriptSrc,
    assetBase,
    publicAssetBase,
    logoUrl,
    assetOrigin,
}) {
    return function renderPage(res, view, data = {}) {
        res.render(view, {
            appHtml: "",
            headExtra: buildAssets.headTags,
            bodyScripts: buildAssets.scriptTag,
            scriptSrc,
            assetBase,
            publicAssetBase,
            logoUrl,
            assetOrigin,
            ...data,
        });
        log("debug", "render.page", {
            id: res.req?.requestId,
            view,
        });
    };
}
