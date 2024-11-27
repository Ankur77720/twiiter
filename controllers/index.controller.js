module.exports.likeTweet = async (req, res, next) => {

    const tweet = await tweetModel.findById(req.params.id)

    if (tweet.likes.includes(req.user._id)) {

        tweet.likes.splice(tweet.likes.indexOf(req.user._id), 1)

    }
    else {
        tweet.likes.push(req.user._id)
    }

    await tweet.save()

    res.redirect('/feed')

}

