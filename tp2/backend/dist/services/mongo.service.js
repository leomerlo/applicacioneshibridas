import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();
const mongoString = process.env.MONGODB_USER ? `${process.env.MONGODB_SERVER}${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URI}` : `${process.env.MONGODB_SERVER}${process.env.MONGODB_URI}`;
console.log(mongoString);
export const client = new MongoClient(mongoString, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
export const db = client.db("foodGenie");
