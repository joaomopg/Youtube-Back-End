import mysql from 'mysql'
import { config } from 'dotenv';
config();

const pool = mysql.createPool({
    "user": "root",
    "password": "jos23mar22",
    "database": "api-yt-project",
    "host": "localhost",
    "port": 3306
})

export { pool };