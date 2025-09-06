const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
    try {
        const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

        const containerName = "club-events";
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Ensure container exists
        await containerClient.createIfNotExists();

        // Data from request
        const eventData = req.body; 
        const blobName = `${Date.now()}-${eventData.title}.json`;

        // Upload JSON data to Blob
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.upload(JSON.stringify(eventData), Buffer.byteLength(JSON.stringify(eventData)));

        context.res = {
            status: 200,
            body: { message: "Event uploaded successfully!", blobName }
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: { error: error.message }
        };
    }
};
