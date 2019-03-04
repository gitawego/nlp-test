const slots = require('./data/slots.json');
const { NlpManager } = require('node-nlp');

const threshold = 0.7;
const nlpManager = new NlpManager({ languages: ['en'] });


async function train(manager) {
  for (const slot of slots) {
    Object.keys(slot.entity).forEach((entityName) => {
      const entityConfig = slot.entity[entityName];
      const entity = manager.addTrimEntity('entityName');
      Object.keys(entityConfig).forEach(methodName => {
        entity[methodName](...entityConfig[methodName]);
      });
    });
    for (const slotInfo of slot.slots) {
      manager.slotManager.addSlot(slot.intent, ...slotInfo);
    }
    for (const doc of slot.documents) {
      manager.addDocument(...doc, slot.intent);
    }
  }

  await manager.train();
}

async function main() {
  await train(nlpManager);
  const result = await nlpManager.process(`how to create account ?`);
  console.log(result);
}

main();
