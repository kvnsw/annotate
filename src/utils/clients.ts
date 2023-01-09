import AWS from 'aws-sdk';

export const getS3Client = () => {
  if (!process.env.ANNOTATE_AWS_KEY_ID || !process.env.ANNOTATE_AWS_SECRET_ACCESS_KEY) {
    throw new Error(
      'Please define the AWS_KEY_ID & AWS_SECRET_ACCESS_KEY environment variables inside .env.local',
    );
  }

  return new AWS.S3({
    apiVersion: '2006-03-01',
    credentials: {
      accessKeyId: process.env.ANNOTATE_AWS_KEY_ID,
      secretAccessKey: process.env.ANNOTATE_AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.NEXT_PUBLIC_ANNOTATE_AWS_S3_BUCKET_REGION,
    signatureVersion: 'v4',
  });
};
