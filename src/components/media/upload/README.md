# Media Upload Developer Notes

The media upload feature is currently a browser-only packaging flow.

- `MediaUploadProvider` assembles reducer state, lifecycle hooks, and workflow actions.
- `useVideoPreparation` owns source preview object URLs and local chunk preparation.
- `useThumbnailCapture` owns thumbnail generation, stale request handling, and thumbnail object URL cleanup.
- `finishPackage()` validates the local package and stores `readyMedia`.

Backend integration should happen in provider actions or in helpers called by those actions. Keep `PvPScalpelVideoPlayer` presentational.

Important upload caveat: `UserContext.httpFetch` applies `Content-Type: application/json` by default. Do not upload `File`, `Blob`, or `FormData` through it without changing that behavior. Use a dedicated upload helper, presigned storage URLs, or binary/chunk endpoints.

Expected backend save flow:

1. Send metadata: title, description, duration, and character IDs.
2. Upload or register `selectedThumbnail.file`.
3. Upload or register ordered chunks from `preparedVideo.chunks`.
4. Store backend response URLs or IDs in `readyMedia`.
5. Preserve player inputs: `readyMedia.videoUrl`, `readyMedia.thumbnailUrl`, and `readyMedia.title`.
