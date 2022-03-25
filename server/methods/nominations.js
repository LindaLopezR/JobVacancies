import { NominationsCollection } from '/imports/api/nominations';

Meteor.methods({

  newNomination(json) {
    json.enable = true;
    json.date = new Date();
    json.status = 'PENDIENT';

    return NominationsCollection.insert(json);
  },

});