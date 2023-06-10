export interface Profile {
  _id?: ObjectId,
  accountId: ObjectId,
  name: string,
  restrictions?: string,
  preferences?: string,
}