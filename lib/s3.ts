import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const BUCKET = process.env.AWS_S3_BUCKET!;
const AWS_REGION = process.env.AWS_REGION!;
// Support multiple naming conventions and ensure it's defined
const CLOUDFRONT_URL = process.env.AWS_CLOUDFRONT_URL || process.env.NEXT_PUBLIC_CLOUDFRONT_URL || process.env.CLOUDFRONT_URL;

// Construct base URL - prefer CloudFront, fallback to S3 direct URL
function getPublicUrl(key: string): string {
    if (CLOUDFRONT_URL) {
        // Ensure protocol
        const baseUrl = CLOUDFRONT_URL.startsWith("http") ? CLOUDFRONT_URL : `https://${CLOUDFRONT_URL}`;
        // Ensure no double slashes if env var has trailing slash
        const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
        return `${cleanBase}/${key}`;
    }
    // Fallback to S3 direct URL if CloudFront is not configured
    return `https://${BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
}

export async function uploadImage(
    file: Buffer,
    filename: string,
    contentType: string
): Promise<{ url: string; key: string }> {
    const key = `tires/${Date.now()}-${filename}`;

    await s3Client.send(
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: file,
            ContentType: contentType,
        })
    );

    const url = getPublicUrl(key);
    console.log("Uploaded image:", { key, url }); // Debug logging
    return { url, key };
}

export async function deleteImage(key: string): Promise<void> {
    await s3Client.send(
        new DeleteObjectCommand({
            Bucket: BUCKET,
            Key: key,
        })
    );
}

export async function getPresignedUploadUrl(
    filename: string,
    contentType: string
): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
    const key = `tires/${Date.now()}-${filename}`;

    const uploadUrl = await getSignedUrl(
        s3Client,
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            ContentType: contentType,
        }),
        { expiresIn: 3600 }
    );

    const publicUrl = getPublicUrl(key);
    return { uploadUrl, key, publicUrl };
}
