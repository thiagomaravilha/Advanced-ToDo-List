import { Meteor } from "meteor/meteor";
import { TasksCollection } from "./TasksCollection";

Meteor.methods({

  "tasks.insert": async function (doc) {
    if (!this.userId) {
      throw new Meteor.Error("not-authorized", "Você precisa estar autenticado para criar uma tarefa.");
    }

    return TasksCollection.insertAsync({
      ...doc,
      userId: this.userId,
      status: "Cadastrada",
      createdAt: new Date(),
    });
  },

  "tasks.toggleChecked": async function ({ _id, isChecked }) {
    if (!this.userId) throw new Meteor.Error("not-authorized");

    const task = await TasksCollection.findOneAsync({ _id });
    if (!task) throw new Meteor.Error("task-not-found");
    if (task.userId !== this.userId) throw new Meteor.Error("not-authorized");

    return TasksCollection.updateAsync(_id, {
      $set: { isChecked: !isChecked },
    });
  },

  "tasks.delete": async function ({ _id }) {
    if (!this.userId) throw new Meteor.Error("not-authorized");

    const task = await TasksCollection.findOneAsync({ _id });
    if (!task) throw new Meteor.Error("task-not-found");
    if (task.userId !== this.userId) throw new Meteor.Error("not-authorized");

    return TasksCollection.removeAsync(_id);
  },

  "tasks.update": async function ({ _id, name, description, status }) {
    if (!this.userId) throw new Meteor.Error("not-authorized");

    const task = await TasksCollection.findOneAsync({ _id });
    if (!task) throw new Meteor.Error("task-not-found");
    if (task.userId !== this.userId) throw new Meteor.Error("not-authorized");

    return TasksCollection.updateAsync(_id, {
      $set: {
        text: name || task.text,
        description: description || task.description,
        status: status || task.status,
        updatedAt: new Date(),
      },
    });
  },

  async "tasks.getCount"(showCompleted, searchText) {
    if (!this.userId) throw new Meteor.Error("not-authorized");

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

    return TasksCollection.find(filter).count();
  },

  async "tasks.getStats"() {
    if (!this.userId) throw new Meteor.Error("not-authorized");

    const tasks = await TasksCollection.find({
      $or: [
        { userId: this.userId },
        { isPrivate: { $ne: true } }
      ]
    }).fetch();

    const total = tasks.length;
    const concluidas = tasks.filter(t => t.status === "Concluída").length;
    const pendentes = tasks.filter(t =>
      t.status === "Cadastrada" || t.status === "Em Andamento"
    ).length;

    return { total, concluidas, pendentes };
  }

});
