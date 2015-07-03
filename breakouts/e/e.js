C = {

  _sequence_id: 0,

  _components: {},

  _removeMultiple: function(components, id, names){
    var empty = {}
    names.forEach(function(name){
      delete (components[name] || empty)[id]
    })
    return id
  },

  _replaceComponent: function(components, id, component, name){

      //create category
      var category = components[name] = components[name] || {}

      //store data on category
      category[id] = component

      return id
  },

  _create: function(components, id, new_components){

    Object.keys(new_components)
      .forEach(function(name){
        C._replaceComponent(components, id, new_components[name], name)
      })
    return id;
  },

  //Call a visitor function whenever an entity has an component
  _entity_each: function(components, visitor, entity){
    Object

      .keys(components)

      .reduce(function(results, name){
        var category = components[name]

        if(category){
          visitor( category, name, entity )
        }
      })
    return entity
  },

  //Build an object of every component associated with an entity id.
  _entity: function(components, target, entity){

    C._entity_each(components, function(component, name){
      target[name] = component
    }, entity)

    return target;
  },

  category: function(category){
    return C._components[category]
  },

  component: function(entity, category){
    return C._components[category] && C._components[category][entity]
  },

  add: function(id, new_components){
    return C._create(C._components, id, new_components)
  },

  addComponent: function(name, component, entity){
    return C._replaceComponent(C._components, entity, component, name);
  },

  create: function(new_components){
    return C._create(C._components, ++C._sequence_id, new_components)
  },

  remove: function(id, name){
    var array = []
    var names = arguments.length == 2 ?
      array.concat(name) : array.slice.call(arguments)
    return C._removeMultiple(C._components, id, names)
  },

  removeEntity: function(id){
    return C._entity_each(C._components, function(component, name){
      delete C._components[name]
    })
  },

  entity: function(entity){
    return C._entity(C._components, {}, entity)
  }
}


//Usage:
//
// C.create({
//   Position: { x:0, y:0},
//   Velocity: { x:0, y:0}
// })

// C.create({
//   Position: { x:0, y:0},
//   Velocity: { x:0, y:0}
// })

// C.category("Position")

// C.entity(1)

// C.add(1, {
//   Acceleration: { x:0, y:0 },
//   Position: { x: 0, y:0 },
//   Health: { value: 4 },
//   Ammo: { value: 5 }
// })

// C.addComponent("Damage", { value: 4 }, 1)


// C.component(1, "Damage")

// ["Damage", "Position", "Velocity"].map(C.component.bind(null,1))