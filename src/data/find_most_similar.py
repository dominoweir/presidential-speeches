import json

speech_metadata = {}

all_ranked_topic_indices = open("Index_rankedsimi_onTopics.csv", "r+")
all_ranked_topic_scores = open("Value_rankedsimi_onTopics.csv", "r+")
all_ranked_word_indices = open("Index_rankedsimi_onwordusage.csv", "r+")
all_ranked_word_scores = open("Value_rankedsimi_onwordusage.csv", "r+")

with open('all_speeches.csv', 'r+') as f:
  column_names = f.readline()
  for line in f.readlines():
    values = line.split(',')
    ranked_topic_scores = all_ranked_topic_scores.readline().split(',')[1:11]
    ranked_topic_indices = all_ranked_topic_indices.readline().split(',')[1:11]
    ranked_word_scores = all_ranked_word_scores.readline().split(',')[1:11]
    ranked_word_indices = all_ranked_word_indices.readline().split(',')[1:11]
    top_10_similar_topic = {}
    top_10_similar_words = {}
    for i in range(0, 10):
        top_10_similar_topic[i + 1] = {
            "id": ranked_topic_indices[i],
            "score": ranked_topic_scores[i]
        }
        top_10_similar_words[i + 1] = {
            "id": ranked_word_indices[i],
            "score": ranked_word_scores[i]
        }
    speech_metadata[values[0]] = {
        "title": values[1],
        "date": values[2],
        "president": values[3],
        "party": values[4],
        "number": values[5].strip(),
        "most_similar_topics": top_10_similar_topic,
        "most_similar_words": top_10_similar_words
    }

with open('all_speeches.json', 'w+') as f:
  f.write(json.dumps(speech_metadata, indent=2))
