var natural = require('natural');
var classifier = new natural.BayesClassifier();

classifier.addDocument('hi', 'greeting');
classifier.addDocument('hello', 'greeting');
classifier.train();
console.log(classifier.classify('hello!'));

const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en','fr'] });
manager.addDocument('en', 'hi', 'greetings.hello');
manager.addDocument('en', 'hello', 'greetings.hello');
manager.addDocument('fr', 'bonjour', 'greetings.hello');
manager.addAnswer('en', 'greetings.hello', 'Hey there!');
manager.addAnswer('en', 'greetings.hello', 'Greetings!');
manager.addAnswer('fr', 'greetings.hello', 'salut');

(async() => {
  await manager.train();
  manager.save();
  const response = await manager.process('en', 'hello');
  console.log(response);
})();
