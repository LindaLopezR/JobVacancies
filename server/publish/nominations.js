import { NominationsCollection } from '/imports/api/nominations';

Meteor.publish({

  allNominations() {
    return NominationsCollection.find();
  },

  nominationById(nominationId) {
    return NominationsCollection.find({ _id: nominationId });
  },

  nominationByVacancy(vacancyId) {
    return NominationsCollection.find({ vacancy: vacancyId });
  },

});
