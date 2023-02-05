import tweepy

CONSUMER_KEY = 'xxxxxx'
CONSUMER_SECRET = 'xxxxxx'
ACCESS_TOKEN = 'xxxxxx'
ACCESS_SECRET = 'xxxxxx'

auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_TOKEN, ACCESS_SECRET)
api = tweepy.API(auth)

def cancel_like():
    favorites = api.get_favorites(user_id='xxxxxx',count=20)
    for favorite in favorites:
        try:
            api.destroy_favorite(favorite.id)
        except Exception:
            pass

for i in range(100):
    cancel_like()
