import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // Agregar super usuario
  if (Meteor.users.find().count() === 0) {

    const adminId = Accounts.createUser({
      username: 'admin',
      password: 'Password1',
      profile: {
        name: 'Admin',
        lastName: '',
        image: '',
        enable: true,
      }
    });
  
    Roles.createRole('superadmin', { unlessExists: true });
    Roles.addUsersToRoles(adminId, [ 'superadmin' ]);

    console.log('Admin user created: ', adminId);

    const userExample = Accounts.createUser({
      username: '50504',
      password: '50504',
      profile: {
        name: 'Aaron De Jesus Lopez Lopez',
        lastName: '',
        image: '',
        enable: true,
        numberEmployee: 50504,
        shift: 1
      }
    });

    Roles.createRole('user', { unlessExists: true });
    Roles.addUsersToRoles(userExample, [ 'user' ]);

    console.log('User created: ', userExample);


  };

});
