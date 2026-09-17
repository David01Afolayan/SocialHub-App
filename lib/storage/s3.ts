import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"

function getStorageConfig() {
  const required = ["S3_BUCKET", "S3_PUBLIC_URL", "S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY"] as const
  const missing = required.filter((name) => !process.env[name])
  if (missing.length > 0) {
    throw new Error(`Missing storage configuration: ${missing.join(", ")}`)
  }
  return {
    bucket: process.env.S3_BUCKET!,
    publicUrl: process.env.S3_PUBLIC_URL!.replace(/\/$/, ""),
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  }
}

function getClient() {
  const config = getStorageConfig()
  return { client: new S3Client({
    region: process.env.S3_REGION || "auto",
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: Boolean(process.env.S3_ENDPOINT),
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  }), config }
}

export async function uploadObject(key: string, body: Buffer, contentType: string) {
  const { client, config } = getClient()
  await client.send(new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  }))
  return `${config.publicUrl}/${key}`
}

export async function deleteObject(key: string) {
  const { client, config } = getClient()
  await client.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key }))
}
