import { Meteor } from 'meteor/meteor';
import { TasksCollection } from './TasksCollection';

Meteor.publish("tasks.filteredWithSearch", function (showCompleted, searchText, page = 1) {
  if (!this.userId) return this.ready();

  const regex = new RegExp(searchText, 'i');
  const filter = {
    $or: [
      { userId: this.userId },
      { isPrivate: { $ne: true } }
    ],
    text: regex
  };

  if (!showCompleted) {
    filter.status = { $in: ["Cadastrada", "Em Andamento"] };
  }

  const limit = 4;
  const skip = (page - 1) * limit;

  return TasksCollection.find(filter, {
    sort: { createdAt: -1 },
    skip,
    limit
  });
});
