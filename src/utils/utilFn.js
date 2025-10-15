// import { readFile, writeFile } from 'fs/promises'
// import path from 'path'
// import { fileURLToPath } from 'url'
import User from '../model/userModel.js'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// const DB_PATH = path.join(__dirname, '../../database/db.json')

// export async function readData() {
//   const data = await readFile(DB_PATH, 'utf-8')
//   return JSON.parse(data)
// }

// export async function writeData(data) {
//   await writeFile(DB_PATH, JSON.stringify(data, null, 2))
// }

export async function getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }