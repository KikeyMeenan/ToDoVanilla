import {
  Pool
} from 'pg';

const connectionString = process.env.DATABASE_URL ? process.env.DATABASE_URL : 'postgresql://postgres:xszRC7!v5LR@localhost:5432/todo'

export const newPool = () => {
  const pool = new Pool({
    connectionString
  });

  pool.connect(err => {
    if (err) {
      console.error('connection error', err.stack)
    }
  });

  return pool;
}