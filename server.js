const express = require('express');
const Pool = require('pg').Pool;
require('dotenv').config();
const cors = require('cors');
const app = express();
const {
  USER,
  HOST,
  DATABASE,
  PASSWORD,
  PORT,
  PORT_DB,
  USER_CLOUD,
  HOST_CLOUD,
  DATABASE_CLOUD,
  PASSWORD_CLOUD,
} = process.env;
const port = PORT || process.env.PORT;
// use cloud db
// const pool = new Pool({
//   user: USER_CLOUD,
//   host: HOST_CLOUD,
//   database: DATABASE_CLOUD,
//   password: PASSWORD_CLOUD,
//   port: PORT_DB,
//   ssl: true,
// });
const pool = new Pool({
  user: USER,
  host: HOST,
  database: DATABASE,
  password: PASSWORD,
  port: 5432,
});
pool
  .connect()
  .then((conn) => {
    console.log('Connect Postgres successfully');
  })
  .catch((err) => {
    console.log('Connect Postgres failed');
    console.log(err);
  });
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.get('/', async (req, res) => {
  try {
    const rs = await pool.query('SELECT * FROM comments');
    return res.status(200).json(rs.rows);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

app.post('/', async (req, res) => {
  try {
    const { name, content } = req.body;
    const query = 'INSERT INTO comments(name, content) VALUES($1, $2) RETURNING *';
    const values = [name, content];
    if (!name || !content) {
      return res.status(400).json({
        message: 'Name and content are required',
      });
    }
    const rs = await pool.query(query, values);
    return res.status(201).json(rs.rows[0]);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

app.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = {
      name: 'fetch-comment',
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };
    const rs = await pool.query(query);
    if (!rs.rows.length) {
      return res.status(404).json({
        message: 'Comment not found',
      });
    }
    return res.status(200).json(rs.rows[0]);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

app.listen(port, () => {
  console.log(`Server listen on http://localhost:${port}`);
});
