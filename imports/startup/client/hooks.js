import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { MessagesCollection } from '/imports/api/messages';
import { NominationsCollection } from '/imports/api/nominations';
import { VacanciesCollection } from '/imports/api/vacancies';

export const useAccount = () => useTracker(() => {

  const roleSubscription = Meteor.subscribe('rolesBySelfUser');

  const user = Meteor.user();
  const userId = Meteor.userId();
  const isLoggingIn = Meteor.loggingIn();
  const role = Roles.getRolesForUser(userId);

  return {
    user,
    role,
    userId,
    isLoggingIn,
    isLoggedIn: !!userId,
    loading: !roleSubscription.ready(),
  };
}, []);

export const useAllUsers = () => useTracker(() => {

  const usersSubscription = Meteor.subscribe('allUsers');
  const loading = !usersSubscription.ready();

  return {
    allUsers: Meteor.users.find().fetch(),
    loading,
  }
}, []);

export const useAllEmployees = () => useTracker(() => {

  const usersSubscription = Meteor.subscribe('allEmployees');
  const rolesSubscription = Meteor.subscribe('allRoles');
  const loading = !usersSubscription.ready() || !rolesSubscription.ready();

  const roles = Meteor.roleAssignment.find({ 'role._id': 'user' }).fetch();
  const idsUsers = roles.map(item => item.user._id);

  let query = {
    _id: { $in: idsUsers },
    'profile.enable': true,
  };

  return {
    allEmployees: Meteor.users.find(query).fetch(),
    loading,
  }
}, []);

export const useAllMessages = () => useTracker(() => {
  const messagesSubscription = Meteor.subscribe('allMessages');
  const loading = !messagesSubscription.ready();

  return {
    allMessages: MessagesCollection.find().fetch(),
    loading
  }
}, []);

export const useMessageById = (messageId) => useTracker(() => {
  const messageSubscription = Meteor.subscribe('messageById', messageId);
  const loading = !messageSubscription.ready();

  return {
    message: MessagesCollection.findOne({ _id: messageId }),
    loading
  }
}, [messageId]);

export const useAllVacancies = () => useTracker(() => {
  const vacanciesSubscription = Meteor.subscribe('allVacancies');
  const loading = !vacanciesSubscription.ready();

  return {
    allVacancies: VacanciesCollection.find().fetch(),
    loading
  }
}, []);

export const useVacancyById = (vacancyId) => useTracker(() => {
  const vacancySubscription = Meteor.subscribe('vacancyById', vacancyId);
  const loading = !vacancySubscription.ready();

  return {
    vacancy: VacanciesCollection.findOne({ _id: vacancyId }),
    loading
  }
}, [vacancyId]);

export const useAllNominations = () => useTracker(() => {
  const nominationsSubscription = Meteor.subscribe('allNominations');
  const vacanciesSubscription = Meteor.subscribe('allVacancies');
  const loading = !nominationsSubscription.ready() || !vacanciesSubscription.ready();

  return {
    allNominations: NominationsCollection.find().fetch(),
    allVacancies: VacanciesCollection.find().fetch(),
    loading
  }
}, []);

export const useNominationById = (nominationId) => useTracker(() => {
  const nominationSubscription = Meteor.subscribe('nominationById', nominationId);
  const loading = !nominationSubscription.ready();

  return {
    nomination: NominationsCollection.findOne({ _id: nominationId }),
    loading
  }
}, [nominationId]);

export const useNominationsByVacancy = (vacancyId) => useTracker(() => {
  const nominationSubscription = Meteor.subscribe('nominationByVacancy', vacancyId);
  const loading = !nominationSubscription.ready();

  return {
    nominations: NominationsCollection.find({ vacancy: vacancyId }).fetch(),
    loading
  }
}, [vacancyId]);
