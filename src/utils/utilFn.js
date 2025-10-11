import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DB_PATH = path.join(__dirname, '../../database/db.json')

export async function readData() {
  const data = await readFile(DB_PATH, 'utf-8')
  return JSON.parse(data)
}

export async function writeData(data) {
  await writeFile(DB_PATH, JSON.stringify(data, null, 2))
}

export function getISTLocalizedTime() {
  const now = new Date()

  const options = {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour12: true, // Use 12-hour clock with AM/PM
  }
  
  return now.toLocaleString('en-IN', options)
}