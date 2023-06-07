/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
import { app } from 'electron'

const dep = app.isPackaged
  ? '../../app.asar/node_modules/better-sqlite3'
  : 'better-sqlite3'
const Database = require(dep)
const db = new Database(':memory:')

db.exec(
  'DROP TABLE IF EXISTS employees; '
    + 'CREATE TABLE IF NOT EXISTS employees (name TEXT, salary INTEGER)',
)

db.prepare('INSERT INTO employees VALUES (:n, :s)').run({
  n: 'James',
  s: 50000,
})

const r = db.prepare('SELECT * from employees').all()
console.log(r)
// [ { name: 'James', salary: 50000 } ]

db.close()
