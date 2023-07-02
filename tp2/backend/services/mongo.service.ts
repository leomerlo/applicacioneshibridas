import { MongoClient, ServerApiVersion } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

export const client = new MongoClient(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URI}`, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})
export const db = client.db("foodGenie")
