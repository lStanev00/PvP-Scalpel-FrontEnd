export default async function uploadBlobToSignedUrl(file: File, signedUrl: string) {
    const response = await fetch(signedUrl, {
        method: "PUT",
        headers: {
            "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(`Upload failed: ${response.status} ${errorText}`);
    }

    return true;
}