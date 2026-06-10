const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  port:               process.env.DB_PORT     || 3306,
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  database:           process.env.DB_NAME     || 'gestao_frota',
  waitForConnections: true,
  connectionLimit:    10,
  connectTimeout:     5000,
})

pool.getConnection()
  .then(conn => {
    console.log('[DB] Conexão com MySQL estabelecida com sucesso.')
    conn.release()
  })
  .catch(err => {
    console.error('[DB] ERRO ao conectar no MySQL:', err.message)
    console.error('[DB] Verifique se o MySQL está rodando e as variáveis do .env estão corretas.')
  })

module.exports = pool
