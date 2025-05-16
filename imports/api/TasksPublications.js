import { Meteor } from "meteor/meteor";
import { TasksCollection } from "./TasksCollection";

Meteor.publish("tasks", function () {
  return TasksCollection.find({
    $or: [
      { isPrivate: { $ne: true } },        
      { userId: this.userId }                
    ]
  }, {
    fields: {
      text: 1,
      description: 1,
      userId: 1,
      createdAt: 1,
      status: 1,
      isPrivate: 1,
    }
  });

});