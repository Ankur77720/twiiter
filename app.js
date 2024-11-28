const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()
const connect = require('./db/db')
connect()
const userModel = require('./models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const authMiddleware = require('./middleware/authMiddleware')
const tweetModel = require('./models/tweet.model')
const commentModel = require('./models/comment.model')

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.get('/', (req, res) => {
    res.send('hello world')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const newUser = await userModel.create({
        username: req.body.username,
        password: hashedPassword
    })

    const token = jwt.sign({
        username: newUser.username,
        id: newUser._id
    }, process.env.JWT_SECRET)

    res.cookie('token', token)

    res.redirect('/profile')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body

    const user = await userModel.findOne({ username })

    if (!user) {
        return res.redirect('/login')
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        return res.redirect('/login')
    }

    const token = jwt.sign({
        username: user.username,
        id: user._id
    }, process.env.JWT_SECRET)

    res.cookie('token', token)

    res.redirect('/profile')

})

app.get('/new-tweet', authMiddleware.authUser, (req, res, next) => {
    res.render('newtweet')
})


app.post('/newtweet', authMiddleware.authUser, async (req, res, next) => {

    const newTweet = await tweetModel.create({
        text: req.body.tweet,
        username: req.user.username
    })

    const loggedInUser = await userModel.findById(req.user._id)
    loggedInUser.tweets.push(newTweet._id)
    await loggedInUser.save()

    res.redirect('/profile')

})

app.get('/profile', authMiddleware.authUser, async (req, res, next) => {

    const loggedInUser = await userModel.findById(req.user._id).populate('tweets')

    res.render('profile', { user: loggedInUser })

})




app.get('/feed', authMiddleware.authUser, async (req, res, next) => {
    const tweets = await tweetModel.find().populate('comments')

    res.render('feed', { tweets })
})


app.get('/like-tweet/:id', authMiddleware.authUser, async (req, res, next) => {

    const tweet = await tweetModel.findById(req.params.id)

    if (tweet.likes.includes(req.user._id)) {

        tweet.likes.splice(tweet.likes.indexOf(req.user._id), 1)

    }
    else {
        tweet.likes.push(req.user._id)
    }

    await tweet.save()

    res.redirect('/feed')

})


app.post('/comment/:id', authMiddleware.authUser, async (req, res, next) => {

    const newComment = await commentModel.create({
        user: req.user._id,
        data: req.body.comment,
        tweet: req.params.id
    })

    const tweet = await tweetModel.findOne({ _id: req.params.id })
    tweet.comments.push(newComment._id)

    await tweet.save()



    res.redirect('/feed')

})

app.listen(3000, () => {
    console.log('server is running')
})