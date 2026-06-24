import { MediaUploadProvider } from "../components/MediaUpload/MediaUploadContext.js";
import MediaUploadMain from "../components/MediaUpload/MediaUploadMain.jsx";

export default function MediaUpload() {
    return (
        <MediaUploadProvider>
            <MediaUploadMain />
        </MediaUploadProvider>
    );
}