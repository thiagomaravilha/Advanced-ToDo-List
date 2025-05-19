import { Meteor } from 'meteor/meteor';

Meteor.publish('userProfile', function () {
  if (!this.userId) return this.ready();
  return Meteor.users.find({ _id: this.userId }, { fields: { profile: 1, emails: 1 } });
});