import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import "../imports/api/TasksPublications";
import "../imports/api/tasksMethods";

import "/imports/api/userProfileMethods";
import "/imports/api/userProfilePublications";


Meteor.publish("users", function () {
  return Meteor.users.find({}, { fields: { username: 1 } });
});


Meteor.startup(() => {
  console.log("Servidor iniciado com sucesso.");
});
