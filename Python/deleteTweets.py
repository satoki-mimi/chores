import tweepy

CONSUMER_KEY = 'xxxxxx'
CONSUMER_SECRET = 'xxxxxx'
ACCESS_TOKEN = 'xxxxxx'
ACCESS_SECRET = 'xxxxxx'

auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_TOKEN, ACCESS_SECRET)
api = tweepy.API(auth)


def delete_tweets():
    tweets = api.user_timeline(user_id='xxxxxx', count=200)
    for tweet in tweets:
        if tweet.favorite_count <= 5:
            api.destroy_status(tweet.id)


delete_tweets()
