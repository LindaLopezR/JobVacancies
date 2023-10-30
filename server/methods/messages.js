import { MessagesCollection } from '/imports/api/messages';

Meteor.methods({

  newMessage(json) {
    json.enable = true;

    return MessagesCollection.insert(json);
  },

  editMessage(messageId, json) {
    return MessagesCollection.update({ _id: messageId }, { $set: json });
  },

  deleteMessage(messageId) {
    return MessagesCollection.update({ _id: messageId }, { $set: { enable: false } });
  },

});
