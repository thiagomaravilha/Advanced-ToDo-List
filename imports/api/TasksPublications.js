import { Meteor } from 'meteor/meteor';
import { TasksCollection } from './TasksCollection';

Meteor.publish("tasks.filtered", function (showCompleted) {
  if (!this.userId) {
    return this.ready();
  }

  const filter = showCompleted
    ? {}
    : { status: { $in: ["Cadastrada", "Em Andamento"] } };

  return TasksCollection.find(
    {
      userId: this.userId,
      ...filter
    },
    {
      sort: { createdAt: -1 }
    }
  );
});
