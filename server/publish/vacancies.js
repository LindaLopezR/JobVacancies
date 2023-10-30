import { VacanciesCollection } from '/imports/api/vacancies';

Meteor.publish({

  allVacancies() {
    return VacanciesCollection.find();
  },

  vacancyById(vacancyId) {
    return VacanciesCollection.find({ _id: vacancyId });
  }

});
