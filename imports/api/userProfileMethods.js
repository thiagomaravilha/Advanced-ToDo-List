import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

Meteor.methods({
  async 'userProfile.get'() {
    if (!this.userId) throw new Meteor.Error('not-authorized');
    const user = await Meteor.users.findOneAsync(this.userId, { fields: { profile: 1, emails: 1 } });
    return {
      name: user?.profile?.name || '',
      email: user?.emails?.[0]?.address || '',
      birthdate: user?.profile?.birthdate || null,
      sex: user?.profile?.sex || '',
      company: user?.profile?.company || '',
      photo: user?.profile?.photo || '',
    };
  },
  async 'userProfile.update'(data) {
    check(data, {
      name: String,
      email: String,
      birthdate: Match.OneOf(null, String, Date),
      sex: String,
      company: String,
      photo: String,
    });
    if (!this.userId) throw new Meteor.Error('not-authorized');
    await Meteor.users.updateAsync(this.userId, {
      $set: {
        'profile.name': data.name,
        'profile.birthdate': data.birthdate,
        'profile.sex': data.sex,
        'profile.company': data.company,
        'profile.photo': data.photo,
      },
    });
    // Atualiza o email se mudou
    if (data.email) {
      await Meteor.users.updateAsync(this.userId, { $set: { 'emails.0.address': data.email } });
    }
  },
});