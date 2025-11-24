import snscrape.modules.twitter as sntwitter
import json

def scrape_user(username, limit=500):
    tweets = []

    for i, tweet in enumerate(sntwitter.TwitterUserScraper(username).get_items()):
        if i >= limit:
            break
        tweets.append({
            "date": tweet.date.isoformat(),
            "id": tweet.id,
            "content": tweet.content,
            "url": tweet.url
        })

    # save to file
    filename = f"{username}_tweets.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(tweets, f, indent=2, ensure_ascii=False)

    print(f"✅ Saved {len(tweets)} tweets to {filename}")

if __name__ == "__main__":
    scrape_user("tiinyhost", 500)
    scrape_user("_baretto", 500)
