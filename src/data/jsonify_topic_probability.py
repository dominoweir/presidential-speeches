import json

speech_topic_probabilities = {}

with open('topic_probability_by_speech.csv', 'r+') as f:
  column_names = f.readline().split('-')
  for line in f.readlines():
    if line.startswith('"'):
      title = line.split('"')[1].split('-', maxsplit=3)[3]
      title = title.replace('*', '"')
      values = line.strip().split(',')[-20:]
      print(title)
      print(values)
      obj = {}
    else:
      values = line.split(',')
      title = values[0].split('-', maxsplit=3)[3]
      values = values[1:]
      obj = {}
      for i in range(1, len(column_names) - 1):
        if values[i] == '':
          obj[column_names[i]] = 0.0
        else:
          obj[column_names[i]] = float(values[i])
      speech_topic_probabilities[title] = obj

with open('topic_probability_by_speech.json', 'w+') as f:
  f.write(json.dumps(speech_topic_probabilities, indent=2))
