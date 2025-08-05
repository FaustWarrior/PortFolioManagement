const { getPool } = require('../config/database');
const bcrypt = require('bcryptjs');

// In-memory fallback
let memoryUsers = [];

async function createUser(username, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const pool = getPool();

  if (pool) {
    try {
      const [result] = await pool.execute(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );
      return { id: result.insertId, username, email };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('User already exists');
      }
      throw error;
    }
  } else {
    // Memory fallback
    if (memoryUsers.find(u => u.email === email)) {
      throw new Error('User already exists');
    }
    const user = { id: Date.now(), username, email, password: hashedPassword };
    memoryUsers.push(user);
    return { id: user.id, username, email };
  }
}

async function findUserByEmail(email) {
  const pool = getPool();

  if (pool) {
    try {
      const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
      return users[0] || null;
    } catch (error) {
      return memoryUsers.find(u => u.email === email) || null;
    }
  } else {
    return memoryUsers.find(u => u.email === email) || null;
  }
}

async function validatePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

module.exports = { createUser, findUserByEmail, validatePassword };