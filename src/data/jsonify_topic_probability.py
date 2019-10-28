import json

speech_topic_probabilities = []

with open('topic_probability_by_id.csv', 'r+') as f:
    topic_names = f.readline().split(',')[1:]
    for line in f.readlines():
        values = line.strip().split(',')
        obj = {}
        obj["id"] = values[0]
        scores = values[-20:]
        for i in range(0, len(topic_names)):
            obj[topic_names[i]] = float(scores[i])
        speech_topic_probabilities.append(obj)

with open('topic_probability_by_id.json', 'w+') as f:
    f.write(json.dumps(speech_topic_probabilities, indent=2))
