import pg from 'pg'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

// load server/.env no matter which directory the process was started from
dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) })

const config = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE
}

// hosted databases (e.g. Render) require SSL; local Postgres usually does not
const isLocal = !config.host || ['localhost', '127.0.0.1'].includes(config.host)
if (!isLocal) {
    config.ssl = { rejectUnauthorized: false }
}

export const pool = new pg.Pool(config)
