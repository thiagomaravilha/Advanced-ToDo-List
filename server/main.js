import { Meteor } from 'meteor/meteor';
import { TasksCollection } from "/imports/api/TasksCollection";
import { Accounts } from 'meteor/accounts-base';

import "../imports/api/TasksPublications"; 
import "../imports/api/tasksMethods";

const SEED_USERNAME = 'thiago';
const SEED_PASSWORD = 'password';

// const insertTask = async (taskText, user) => {
//   await TasksCollection.insertAsync({
//     text: taskText,
//     userId: user._id, 
//     createdAt: new Date(), 
//   });
// };

Meteor.publish("users", function () {
  return Meteor.users.find({}, { fields: { username: 1 } });
});

Meteor.startup(async () => {
  console.log("Server starting...");

  if (!(await Accounts.findUserByUsername(SEED_USERNAME))) {
    await Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
    console.log(`User created: ${SEED_USERNAME}`);
  }

  // if ((await TasksCollection.find().countAsync()) === 0) {
  //   const user = await Accounts.findUserByUsername(SEED_USERNAME);
  //   [
  //     "First Task",
  //     "Second Task",
  //     "Third Task",
  //     "Fourth Task",
  //     "Fifth Task",
  //     "Sixth Task",
  //     "Seventh Task",
  //   ].forEach((taskText) => insertTask(taskText, user));
  //   console.log("Tasks inserted.");
  // } else {
  //   console.log("Tasks already exist.");
  // }
});