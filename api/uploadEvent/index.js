const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
    try {
        // ✅ Support both JSON body (Postman/curl) and query params (browser)
        const eventData = req.body && Object.keys(req.body).length > 0 
            ? req.body 
            : {
                title: req.query.title,
                date: req.query.date,
                description: req.query.description
            };

        if (!eventData || !eventData.title) {
            context.res = { status: 400, body: "Invalid event data. 'title' is required." };
            return;
        }

        const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
        if (!connectionString) {
            throw new Error("AZURE_STORAGE_CONNECTION_STRING is not configured.");
        }

        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerName = "club-events";
        const containerClient = blobServiceClient.getContainerClient(containerName);

        await containerClient.createIfNotExists();

        const blobName = `${Date.now()}-${eventData.title}.json`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const content = JSON.stringify(eventData);

        await blockBlobClient.upload(content, Buffer.byteLength(content));

        context.res = { status: 200, body: { message: "Event uploaded successfully!", blobName } };
    } catch (error) {
        context.res = { status: 500, body: { error: error.message } };
    }
};
