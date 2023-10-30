import { MessagesCollection } from '/imports/api/messages';
import { NominationsCollection } from '/imports/api/nominations';
import { VacanciesCollection } from '/imports/api/vacancies';
import { Communication } from '../ddp-communications';

Meteor.methods({

  newVacancy(json) {
    const userId = this.userId ?? Meteor.users.findOne({username: 'admin'})._id;
    console.log('USER ', userId)
    json.enable = true;
    json.user = userId;
		json.date = Date.now();
    json.status = 'ACTIVE';
    json.history = [];

    if (VacanciesCollection.findOne({ enable: true, name: json.name })) {
      throw new Meteor.Error('duplicate-name', 'El nombre de la vacante ya existe.');
    }

    if (VacanciesCollection.findOne({ enable: true, id: json.id })) {
      throw new Meteor.Error('duplicate-id', 'ID ya registrado.');
    }

    return VacanciesCollection.insert(json);
  },

  editVacancy(vacancyId, json) {
    const oldVacancy = VacanciesCollection.findOne({ _id: vacancyId });
    oldVacancy.description = json.description;
    oldVacancy.name = json.name;
    oldVacancy.typeSite = json.typeSite;
    oldVacancy.id = json.id;
    oldVacancy.typeWork = json.typeWork;
    oldVacancy.status = json.status;

    return VacanciesCollection.update({ _id: vacancyId }, { $set: oldVacancy });
  },

  deleteVacancy(vacancyId) {
    NominationsCollection.remove({ vacancy: vacancyId });
    return VacanciesCollection.remove({ _id: vacancyId });
  },

  getVacancyById(vacancyId) {
    const vacancy = VacanciesCollection.findOne({ _id: vacancyId });
    const nominations = NominationsCollection.find({ vacancy: vacancyId }).fetch();
    const allUsers = Meteor.users.find().fetch();
    const allMessages = MessagesCollection.find().fetch();

    return {
      vacancy,
      nominations,
      allUsers,
      allMessages,
      history: vacancy.history
    };
  },
  
  sendMessage(data) {
    const user = Meteor.users.findOne({ _id: data.candidate });
    data.date = Date.now();
    data.username = user ? user.profile.name : '--';

    VacanciesCollection.update({ _id: data.vacancy }, {
      $push: { 
        history: data
      },
    });

    Communication.notifyNewMessage(data);
    return true;
  },

  sendNewMessage(json) {
    json.candidates.forEach(candidate => {
      try {
        const data = {
          candidate,
          vacancy: json.vacancy,
          message: json.message
        }
        Meteor.call('sendMessage', data);
      } catch(error) {
        console.log(error);
        throw new Meteor.Error('error', 'Ocurrió un error, inténtelo más tarde.');
      }
    });
    return true;
  },

  sendApprovedNewMessage(data) {
    const nominations = NominationsCollection.find({ vacancy: data.vacancy }).fetch();
    const ids = nominations.map(item => item.candidate);
    const candidates = ids.filter(id => !data.candidates.includes(id));
    
    const usersApproved = {
      message: data.message,
      candidates: data.candidates,
      vacancy: data.vacancy
    }

    const usersDisapproved = {
      message: data.messagesDiscarded,
      candidates,
      vacancy: data.vacancy
    }

    // Enviar mensaje a elegido()
    Meteor.call('sendNewMessage', usersApproved);

    // Enviar mensaje a los descartados
    if (data.sendDiscarded) {
      Meteor.call('sendNewMessage', usersDisapproved);
    }

    // Cambiar status de nominación
    Meteor.call('approvedBatch', usersApproved);
    Meteor.call('disapprovedBatch', usersDisapproved);

    // Cerrar vacante
    if (data.closeVacancy == 'yes') {
      VacanciesCollection.update({ _id: data.vacancy }, {$set: { status: 'INACTIVE' } });
    }
    return true;
  }

});
