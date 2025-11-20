import type { S3Handler } from 'aws-lambda';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';


const s3Client = new S3Client();
const IMAGES_PREFIX = 'originals'
const THUMBNAIL_PREFIX = 'thumbs'

export const handler: S3Handler = async (event) => {

    try {
        const bucketName = event.Records[0].s3.bucket.name
        const objectKeys = event.Records.map((record) => record.s3.object.key);

        for (const key of objectKeys) {
            if (key.startsWith(THUMBNAIL_PREFIX)) {
                continue;
            }

          
            // remove the prefix from the key
            const keyWithoutPrefix = key.replace(`${IMAGES_PREFIX}/`, '');

            const thumbnailKey = `${THUMBNAIL_PREFIX}/${keyWithoutPrefix}`;

            // Upload the thumbnail to S3
            const deleteObjectCommand = new DeleteObjectCommand({
                Bucket: bucketName,
                Key: thumbnailKey,
            });

            await s3Client.send(deleteObjectCommand)

            console.log(`Successfully deleted thumbnail for ${keyWithoutPrefix}`);

        }
    } catch (error) {
        console.error('Error processing image delete:', error);
    }
};