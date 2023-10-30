import { NominationsCollection } from '/imports/api/nominations';
import { MessagesCollection } from '/imports/api/messages';
import { VacanciesCollection } from '/imports/api/vacancies';

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
  },

  getNominationById(nominationId) {
    const nomination = NominationsCollection.findOne({ _id: nominationId });
    const messages = MessagesCollection.find({ enable: true }).fetch();
    const data = VacanciesCollection.findOne({ _id: nomination.vacancy });

    const user = Meteor.users.findOne({ _id: nomination.candidate });
    nomination.vacancyName = data.name;
    nomination.username = user ? user.profile.name : '--';
    nomination.historyMss = data && data.history
      ? data.history.filter(item => item.candidate == nomination.candidate)
      : [];

    return {
      nomination, 
      messages
    }
  },

  getNominations(filters) {
    let query = { enable: {$ne: false} };

    if (filters.candidate && filters.candidate !== 'all') {
      query.candidate = filters.candidate;
    }

    if (filters.vacancy && filters.vacancy !== 'all') {
      query.vacancy = filters.vacancy;
    }

    let results = NominationsCollection.find(query, {sort: { date: -1 }}).fetch();

    results = results.map(item => {
      const data = item;
      data.dateValid = new Date(item.date).setHours(0,0,0,0);
      return data;
    });

    if (filters.startDate) {
      results = results.filter(item => item.dateValid >= new Date(filters.startDate).setHours(0,0,0,0));
    }
  
    if (filters.finishDate) {
      results = results.filter(item => item.dateValid <= new Date(filters.finishDate).setHours(0,0,0,0));
    }

    if (filters.employee) {
      const users = Meteor.users.find({
        'profile.enable': true,
      }).fetch();
      const lower = filters.employee.toLocaleLowerCase();
      const usersFind = users.filter(item => item.username.toLowerCase().includes(lower));
      const userID = usersFind.map(user => user._id);
      results = results.filter(item => userID.includes(item.candidate));
    }

    return results;
  },

});