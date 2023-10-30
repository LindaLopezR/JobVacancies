import { DDP } from 'meteor/ddp-client';
import { VacanciesCollection } from '/imports/api/vacancies';

const URL_COMMUNICATION = process.env.NOTIFICATIONS_SERVER || 'http://notifications.goandsee.co';
const HOSTNAME = process.env.HOSTNAME || 'http://localhost:3000';

let instance = null;

class CommunicationServer {

  constructor() {

    if(!instance){
      instance = this;
    }

    this.ddpClient = DDP.connect(URL_COMMUNICATION);

    return instance;
  }

  notifyNewMessage(data) {
    const vacancyName = VacanciesCollection.findOne({ _id: data.vacancy }).name;
    const user = Meteor.users.findOne({ _id: data.candidate });

    this.ddpClient.call('sendNotifyNewMessage', vacancyName, user, HOSTNAME);
  }
};

export const Communication = new CommunicationServer();
