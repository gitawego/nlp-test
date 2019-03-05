exports.addSlots = function addSlots(manager, slots) {
  for (const slot of slots) {
    exports.addSlot(manager, slot);
  }
}

exports.addSlot = function addSlot(manager, slot) {
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

exports.addEntities = function addEntities(manager, entities) {
  for (const entity of entities) {
    if (entity.method in exports) {
      exports[entity.method](manager, entity);
    } else {
      manager[entity.method](entity.arguments);
    }
  }
}

exports.addTrimEntity = function addTrimEntity(manager, entity) {
  const entity = manager.addTrimEntity(entity.name);
  for (const condition of entity.conditions) {
    entity[condition[0]](...condition[1]);
  }
}

exports.addDocuments = function addDocuments(manager, entities) {
  for (const entity of entities) {
    if (entity.type === 'document') {
      exports.addDocument(manager, entity);
    }
    if (entity.type === 'answer') {
      exports.addAnswer(manager, entity);
    }
  }
}

exports.addDocument = function addDocument(manager, entity) {
  manager.addDocument(entity.lang, entity.text, entity.intent);
}

exports.addAnswer = function addAnswer(manager, entity) {
  manager.addAnswer(entity.lang, entity.intent, entity.text);
}
