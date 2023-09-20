import mysql from "mysql2";

const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  })
  .promise();

export async function getAllUsers() {
  const [rows] = await pool.query("select * from Users");
  return rows;
}

export async function getUser(id) {
  // Prepared statement syntax (?) to prevent SQL injection attacks
  const [rows] = await pool.query(
    `
    SELECT * 
    FROM Users
    WHERE id = ?
    `,
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
}

export async function createUser(user) {
  const [result] = await pool.query(
    `
    INSERT INTO Users (username, email, age)
    VALUES (?, ?, ?)
    `,
    [user.username, user.email, user.age]
  );
  return getAllUsers();
}

export async function updateUser(id, user) {
  const data = await getUser(id);
  const [result] = await pool.query(
    `
    UPDATE Users
    SET username=?, email=?, age=?
    WHERE id = ?
    `,
    [
      user.username ? user.username : data.username,
      user.email ? user.email : data.email,
      user.age ? user.age : data.age,
      id,
    ]
  );
  return getAllUsers();
}

export async function deleteUser(id) {
  const [result] = await pool.query(
    `
    DELETE FROM Users
    WHERE id = ?
    `,
    [id]
  );
  return getAllUsers();
}
