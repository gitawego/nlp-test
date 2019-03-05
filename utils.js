exports.addSlots = function addSlots(manager, slots) {
  for (const slot of slots) {
    Object.keys(slot.entities).forEach((entityName) => {
      const entityConfig = slot.entities[entityName];
      const entity = manager.addTrimEntity(entityName);
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
    entity[condition[0]](condition.slice(1));
  }
}
