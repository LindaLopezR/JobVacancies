import { NominationsCollection } from '/imports/api/nominations';
import { VacanciesCollection } from '/imports/api/vacancies';

Meteor.methods({

  endpointLogin(json){
    console.log(json);
    let response = {};

    try {

      if (ApiPassword.validate({username: json.username, password: json.password})) {
        response.success = true;
        response.message = 'Login success';

        let user = Meteor.users.findOne({username:json.username});

        if (!user) {
          console.log('User doesnt exist');
          response.success = false;
          response.message = 'Este usuario no existe';
          return response;
        }

        if (!user.profile.enable) {
          console.log('User deleted');
          response.success = false;
          response.message = 'Este usuario no existe';
          return response;
        }

        delete user.services;
        response.user = user;

        if(!json.os || !json.pushToken){
          console.log('Login without push');
          return response;
        }

        //Eliminar ese pushToken de todos lados
        let query = {
          os: json.os,
          token : json.pushToken,
          product : json.product
        };

        Meteor.users.update({'profile.pushTokens' : query}, { $pull:{
            'profile.pushTokens': query
          }
        });

        Meteor.users.update({ username:json.username }, { $push: {
          'profile.pushTokens': query
        }});

      } else {
        response.success = false;
        response.message = 'Wrong data';
      }
    } catch (exc) {
      console.log('Exception: ' + exc);
      response.success = false;
      response.message = 'User doesnt exist';
    }

    return response;
  },

  endpointVacancies() {
    return VacanciesCollection.find({ enable: true }).fetch();
  },

  endpointGetNominations(userId) {
    return NominationsCollection.find({ 
      candidate: userId,
    }).fetch();
  }

});
