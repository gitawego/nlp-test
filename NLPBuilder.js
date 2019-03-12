class NLPBuilder {
  constructor(manager) {
    this.manager = manager;
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
        console.log('entity', entity);
        this[entity.method](entity, manager);
      } else {
        manager[entity.method](entity.arguments);
      }
    }
  }

  addTrimEntity(entity, manager = this.manager) {
    console.log('add trim entity', entity);
    const trimedEntity = manager.addTrimEntity(entity.name);
    for (const condition of entity.conditions) {
      trimedEntity[condition[0]](...condition[1]);
    }
  }

  addDocuments(entities, manager = this.manager) {
    for (const entity of entities) {
      if (entity.type === 'document') {
        this.addDocument(entity, manager);
      }
      if (entity.type === 'answer') {
        this.addAnswer(entity, manager);
      }
    }
  }

  addDocument(entity, manager = this.manager) {
    manager.addDocument(entity.lang, entity.text, entity.intent);
  }

  addAnswer(entity, manager = this.manager) {
    manager.addAnswer(entity.lang, entity.intent, entity.text);
  }

}

exports.NLPBuilder = NLPBuilder;
