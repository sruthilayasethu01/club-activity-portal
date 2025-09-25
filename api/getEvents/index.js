const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
    try {
        const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
        if (!connectionString) {
            throw new Error("AZURE_STORAGE_CONNECTION_STRING is not configured.");
        }

        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerName = "club-events";
        const containerClient = blobServiceClient.getContainerClient(containerName);
                let events = [];

        for await (const blob of containerClient.listBlobsFlat()) {
            const blobClient = containerClient.getBlobClient(blob.name);
            const downloadResponse = await blobClient.download();
            const content = await streamToString(downloadResponse.readableStreamBody);
            events.push(JSON.parse(content));
        }

        context.res = { status: 200, body: events };
    } catch (error) {
        context.res = { status: 500, body: { error: error.message } };
    }
};

async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => chunks.push(data.toString()));
        readableStream.on("end", () => resolve(chunks.join("")));
        readableStream.on("error", reject);
    });
}
