import { NominationsCollection } from '/imports/api/nominations';

Meteor.methods({

  newNomination(json) {
    json.enable = true;
    json.date = new Date();
    json.status = 'PENDIENT';

    return NominationsCollection.insert(json);
  },

  approvedNomination(json) {
    const query = {
      vacancy: json.vacancy,
      candidate: json.candidate
    }
    return NominationsCollection.update(query, {$set: { status: 'APPROVED' } });
  },

  disapproveNomination(json) {
    const query = {
      vacancy: json.vacancy,
      candidate: json.candidate
    }
    return NominationsCollection.update(query, {$set: { status: 'DISAPPROVE' } });
  },

  approvedBatch(json) {
    json.candidates.forEach(candidate => {
      try {
        const data = {
          candidate,
          vacancy: json.vacancy,
        }
        Meteor.call('approvedNomination', data);
      } catch(error) {
        console.log(error);
        throw new Meteor.Error('error', 'Ocurrió un error, inténtelo más tarde.');
      }
    });
    return true;
  },

  disapprovedBatch(json) {
    json.candidates.forEach(candidate => {
      try {
        const data = {
          candidate,
          vacancy: json.vacancy,
        }
        Meteor.call('disapproveNomination', data);
      } catch(error) {
        console.log(error);
        throw new Meteor.Error('error', 'Ocurrió un error, inténtelo más tarde.');
      }
    });
    return true;
  }

});