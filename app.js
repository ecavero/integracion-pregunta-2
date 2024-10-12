const express = require('express')
const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
const jwt = require('jsonwebtoken')
const app = express()

app.engine('html', mustacheExpress())
app.set('view engine', 'html')
app.set('views', __dirname + '/templates')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))


const usuarios = []

app.get('/', (req, res) => {
        res.sendFile(__dirname + '/public/login.html')
})

app.get('/registrar', (req, res) => {
        res.sendFile(__dirname + '/public/register.html')
})


app.post('/api/registrar', (req, res) => {
        console.log(req.body)
        const usuario = {username: req.body.nombreUsuario, password: req.body.clave}
        usuarios.push(usuario)
        res.set("HX-Trigger", "despuesDeRegistrar")
        res.render('result', req.body)
})

app.post('/api/loguear', (req, res) => {
        const usuario = {username: req.body.nombreUsuario, password: req.body.clave}
        const usuarioValido = usuarios.find((u) => u.username === usuario.username && u.password === usuario.password)
        if (usuarioValido) {
                const token = jwt.sign({username: usuarioValido.username}, "esteSecretoQueTienesConmigoNadieLoSabra", {expiresIn: '10s'})
                console.log(token)
                res.render('token', {token: token})
        } else {
                console.log(usuario)
                console.log(usuarioValido)
                res.render('no-token')
        }
})

const port = 8080
app.listen(port, () => {
        console.log(`Servidor iniciado en http://localhost:${port}`)
})
