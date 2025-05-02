import { Meteor } from 'meteor/meteor';
import { TasksCollection } from "/imports/api/TasksCollection";
import { Accounts } from 'meteor/accounts-base';

import "../imports/api/TasksPublications"; 
import "../imports/api/tasksMethods";



const insertTask = (taskText) => TasksCollection.insertAsync({ text: taskText });


const SEED_USERNAME = 'thiago';
const SEED_PASSWORD = 'password';


Meteor.startup(async () => {
  if (!(await Accounts.findUserByUsername(SEED_USERNAME))) {
    await Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }

  if ((await TasksCollection.find().countAsync()) === 0) {
    [
      "First Task",
      "Second Task",
      "Third Task",
      "Fourth Task",
      "Fifth Task",
      "Sixth Task",
      "Seventh Task",
    ].forEach(insertTask);
  }


});