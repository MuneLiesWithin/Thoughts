const express = require('express');
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')
const db = require('./db/connection')
const router = require('./routes/thoughtsRoutes');
const authRouter = require('./routes/authRoutes')
const ThoughtsController = require('./controllers/ThoughtsController');

const app = express()

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.urlencoded({extended: true}))
app.use(express.json())

//session middleware
app.use(session({
    name: 'session',
    secret: 'nosso_secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
        logFn: function() {},
        path: require('path').join(require('os').tmpdir(), 'sessions')
    }),
    cookie: {
        secure: false,
        maxAge: 360000,
        httpOnly: true
    }
}))

app.use(flash())

app.use(express.static('public'))

//set session to res
app.use((req, res, next) => {
    if(req.session.userid){
        res.locals.session = req.session
    }
    next()
})


app.use('/thoughts', router)
app.use('/', authRouter)
app.get('/', ThoughtsController.showThoughts)

db.sync()
.then(
    app.listen(3000, () => {
        console.log('Conexão estabelecida com sucesso!'
        )}))
.catch((err) => console.log(err))