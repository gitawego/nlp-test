const slots = require('./data/slots.json');
const documents = require('./data/documents.json');
const answers = require('./data/answers.json')
const entities = require('./data/entities.json');
const { NlpManager } = require('node-nlp');
const { NLPBuilder } = require('./NLPBuilder');
const readline = require('readline');
const threshold = 0.7;

const nlpBuilder = new NLPBuilder({ languages: ['en', 'fr'] });

async function train() {
  nlpBuilder.addDocuments(documents);
  nlpBuilder.addAnswers(answers);
  //nlpBuilder.addSlots(slots);
  // nlpBuilder.addEntities(entities);
  await nlpBuilder.train();
  nlpBuilder.manager.save('./example.nlp');
}

async function answer(line){
  const result = await nlpBuilder.process(line.trim());
      console.log('result', result);
      const answer =
        result.score > threshold && result.answer
          ? result.answer
          : "Sorry, I don't understand";
      let sentiment = '';
      if (result.sentiment.score !== 0) {
        sentiment = `  ${result.sentiment.score > 0 ? ':)' : ':('}   (${
          result.sentiment.score
          })`;
      }
     return `${answer}${sentiment}`;
}

function say(message) {
  // eslint-disable-next-line no-console
  console.log(message);
}

(async () => {
  await train();
  say('Say something!');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });
  rl.on('line', async line => {
    if (line.toLowerCase() === 'quit') {
      rl.close();
      process.exit();
    } else {
      const resp = await answer(line);
      say(`bot> ${resp}`);
    }
  });
})();
