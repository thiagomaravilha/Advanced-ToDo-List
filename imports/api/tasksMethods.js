import { Meteor } from "meteor/meteor";
import { TasksCollection } from "./TasksCollection";

Meteor.methods({
  "tasks.insert"(doc) {
    return TasksCollection.insertAsync({
      ...doc,
      userId: this.userId,
    });
  },

  "tasks.toggleChecked"({ _id, isChecked }) {
    return TasksCollection.updateAsync(_id, {
      $set: { isChecked: !isChecked },
    });
  },

  "tasks.delete"({ _id }) {
    return TasksCollection.removeAsync(_id);
  },

  "tasks.update"({ _id, name, description, status }) {
  return TasksCollection.updateAsync(_id, {
    $set: { text: name, description, status },
  });
},

});