npm run build
aws s3 sync dist s3://oquevccome.win/ --delete
