const express = require('express')
const cors = require('cors')
const {Pool} = require('pg')
require('dotenv').config()

const PORT = process.env.PORT || 3333

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, 
    },
});
  

const app = express()

app.use(express.json())
app.use(cors())


app.get('/', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM curriculos')
        return res.status(200).send(rows)
    }
    catch(err){
        return res.status(400).send(err)
    }
})

app.get('/curriculos/:id', async (req, res) => {
    const { id } = req.params
    try {
        const Allcurriculos = await pool.query('SELECT * FROM curriculos WHERE id = ($1)', [id])
        return res.status(200).send(Allcurriculos.rows)
    }
    catch(err){
        return res.status(400).send(err)
    }
})

app.post('/curriculos', async (req, res) => {
    const {nome, email, telefone, formacao, experiencia} = req.body
    let nomePessoa = ''
    try {
        nomePessoa = await pool.query('SELECT * FROM curriculos WHERE nome = ($1)', [nome])
        if (!nomePessoa.rows[0]) {
            nomePessoa = await pool.query('INSERT INTO curriculos (nome, email, telefone, formacao, experiencia) VALUES ($1, $2, $3, $4, $5) RETURNING *', [nome, email, telefone, formacao, experiencia])
        }
      
       return res.status(200).send(newCurriculo.rows)
    }
    catch(err){
        return res.status(400).send(err)
    }
})

app.put('/curriculos/:id', async (req, res) =>{
    const { id } = req.params
    const data = req.body
    try {
       const updateCurriculo = await pool.query('UPDATE curriculos SET nome = ($1), email = ($2), telefone = ($3), formacao = ($4), experiencia = ($5) WHERE id = ($6) RETURNING *', [data.nome, data.email, data.telefone, data.formacao, data.experiencia, id])
       return res.status(200).send(updateCurriculo.rows)
    }
    catch(err){
        return res.status(400).send(err)
    }
})

app.delete('/curriculos/:id', async (req, res) => {
    const { id } = req.params
    try {
        const deletedCurriculo = await pool.query('DELETE FROM curriculos WHERE id = ($1) RETURNING *', [id])
        return res.status(200).send({
            message: 'Curriculo successfully deleted',
            deletedCurriculo: deletedCurriculo.rows
        })
     }
     catch(err){
         return res.status(400).send(err)
     }
})



app.listen(PORT, () => console.log(`Server running on port ${PORT}`))