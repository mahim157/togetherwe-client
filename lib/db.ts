
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add MONGODB_URI to your .env.local file");
}

declare global {
  var mongoClient: MongoClient | undefined;
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

const mongoClient =
  global.mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  global.mongoClient = mongoClient;
}

const clientPromise =
  global.mongoClientPromise ?? mongoClient.connect();

if (process.env.NODE_ENV !== "production") {
  global.mongoClientPromise = clientPromise;
}

export { mongoClient, clientPromise };

export default clientPromise;
