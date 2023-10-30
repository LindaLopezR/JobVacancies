import { MessagesCollection } from '/imports/api/messages';

Meteor.publish({

  allMessages() {
    return MessagesCollection.find();
  },

  messageById(messageId) {
    return MessagesCollection.find({ _id: messageId });
  }

});
