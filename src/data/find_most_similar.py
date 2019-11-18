import json

speech_metadata = []
all_speeches = {}

all_topic_probabilities = json.load(open('topic_probability_nested_by_id.json'))
all_ranked_topic_indices = open("Index_rankedsimi_onTopics.csv", "r+")
all_ranked_topic_scores = open("Value_rankedsimi_onTopics.csv", "r+")
all_ranked_word_indices = open("Index_rankedsimi_onwordusage.csv", "r+")
all_ranked_word_scores = open("Value_rankedsimi_onwordusage.csv", "r+")

for speech in json.load(open('all_speeches.json')):
    all_speeches[speech['id']] = speech

with open('all_speeches.csv', 'r+') as f:
  column_names = f.readline()
  for line in f.readlines():
    values = line.split(',')
    ranked_topic_scores = all_ranked_topic_scores.readline().split(',')[1:11]
    ranked_topic_indices = all_ranked_topic_indices.readline().split(',')[1:11]
    ranked_word_scores = all_ranked_word_scores.readline().split(',')[2:12]
    ranked_word_indices = all_ranked_word_indices.readline().split(',')[2:12]
    topic_probabilities = all_topic_probabilities[values[0]]
    top_10_similar_topic = []
    top_10_similar_words = []
    for i in range(0, 10):
        top_10_similar_topic.append({
            "id": ranked_topic_indices[i],
            "title": all_speeches[ranked_topic_indices[i]]['title'],
            "president":  all_speeches[ranked_topic_indices[i]]['president'],
            "score": ranked_topic_scores[i][0:6],
            "rank": i + 1
        })
        top_10_similar_words.append({
            "id": ranked_word_indices[i],
            "title": all_speeches[ranked_word_indices[i]]['title'],
            "president":  all_speeches[ranked_word_indices[i]]['president'],
            "score": ranked_word_scores[i][0:6],
            "rank": i + 1
        })
    speech_metadata.append({
        "id": values[0],
        "title": values[1],
        "date": values[2],
        "president": values[3],
        "party": values[4],
        "number": values[5].strip(),
        "most_similar_topics": top_10_similar_topic,
        "most_similar_words": top_10_similar_words,
        "topic_probabilities": topic_probabilities
    })

with open('all_speeches.json', 'w+') as f:
  f.write(json.dumps(speech_metadata, indent=2))
