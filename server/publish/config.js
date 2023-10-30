Meteor.methods({ 
  isUrl(url) {
    if (url.indexOf('http') > -1) { return true; }
    return false;
  }
});