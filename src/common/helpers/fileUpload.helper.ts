// This is used for getting user input.
const AWS_REGION = process.env.AWS_REGION;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadFile({ key, body }) {
  try {
    // Put an object into an Amazon S3 bucket.
    await s3Client.send(
      new PutObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: `users/${key}`,
        Body: body,
      }),
    );

    return `https://d3ezi03spn2dw7.cloudfront.net/users/${key}`;
  } catch (error) {
    console.log(error);
    console.log('error....');
  }
}
