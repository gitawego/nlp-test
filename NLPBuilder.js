const { Language } = require('node-nlp');
const { NlpManager } = require('node-nlp');

class NLPBuilder {
  constructor(config) {
    this.config = config;
    this.manager = new NlpManager(this.config);
    this.language = new Language();
  }
  addSlots(slots, manager = this.manager) {
    for (const slot of slots) {
      this.addSlot(slot, manager);
    }
  }

  addSlot(slot, manager = this.manager) {
    for (const entityName of Object.keys(slot.entities)) {
      const entityConfig = slot.entities[entityName];
      const entity = manager.addTrimEntity(entityName);
      for (const item of entityConfig) {
        entity[item[0]](...item[1]);
      }
    }

    for (const slotInfo of slot.slots) {
      manager.slotManager.addSlot(slot.intent, ...slotInfo);
    }
    for (const doc of slot.documents) {
      manager.addDocument(...doc, slot.intent);
    }
  }

  addEntities(entities, manager = this.manager) {
    for (const entity of entities) {
      if (entity.method in this) {
        this[entity.method](entity, manager);
      } else {
        manager[entity.method](entity.arguments);
      }
    }
  }

  addTrimEntity(entity, manager = this.manager) {
    const trimedEntity = manager.addTrimEntity(entity.name);
    for (const condition of entity.conditions) {
      trimedEntity[condition[0]](...condition[1]);
    }
  }

  addDocuments(entities, manager = this.manager) {
    for (const entity of entities) {
      manager.addDocument(entity.lang, entity.text, entity.intent);
    }
  }
  addAnswers(entities,manager = this.manager){
    for (const entity of entities) {
      manager.addAnswer(entity.lang, entity.intent, entity.text);
    }
  }
  train(){
    return this.manager.train();
  }
  guessLang(message){
    const guess = this.language.guessBest(message,this.config.languages);
    console.log('guess',guess);
    return guess;
  }
  process(message,lang){
    if(!lang){
      lang = this.guessLang(message).alpha2;
    }
    return this.manager.process(lang,message);
  }

}

exports.NLPBuilder = NLPBuilder;
