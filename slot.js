const slots = require('./data/slots.json');
const { NlpManager } = require('node-nlp');
const { addSlots } = require('./utils');
const threshold = 0.7;
const nlpManager = new NlpManager({ languages: ['en'] });


async function train(manager) {
  addSlots(manager, slots);
  await manager.train();
}

async function main() {
  await train(nlpManager);
  const result = await nlpManager.process(`how do I create account for postgres ?`);
  console.log(result);
}

main();
