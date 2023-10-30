import { PointsCollection } from '/imports/api/points';

Meteor.methods({

  searchEmployee(filters) {
    const roles = Meteor.roleAssignment.find({ 'role._id': 'user' }).fetch();
    const allPoints = PointsCollection.find().fetch();
    const idsUsers = roles.map(item => item.user._id);

    let query = {
      _id: { $in: idsUsers },
      'profile.enable': true,
    };

    let results = Meteor.users.find(query, {sort: { 'profile.name': 1 }}).map(user => {
      const pointsEntry = allPoints.find(item => item.user == user._id);
      let points = pointsEntry ? pointsEntry.points : 0;
      points = Number(points);
      user.profile.points = points;
      return user;
    });

    if (filters.employee) {
      const lower = filters.employee.toLocaleLowerCase();
      results = results.filter(item => item.username.toLowerCase().includes(lower));
    }

    if (filters.userName) {
      const lower = filters.userName.toLocaleLowerCase();
      results = results.filter(item => item.profile.name.toLowerCase().includes(lower));
    }

    return results;
  },

  newUser(json) {

    const nameUser = json.lastName 
      ? `${json.name.trim()} ${json.lastName.trim()}`
      : json.name;

    const lastUser = json.lastName 
      ? json.lastName.trim()
      : '';

    if (!json.numberEmployee.toString()) {
      throw new Meteor.Error('Employee-Number', 'Un usuario no puede quedarse sin número de empleado');
    }

    let profile = {
      name : nameUser,
      lastName : lastUser,
      image : json.img,
      enable: true,
      numberEmployee: json.numberEmployee,
      shift: parseInt(json.shift)
    };

    let user = {
      username : json.username.trim(),
      password: json.numberEmployee.toString(),
      profile : profile,
    };

    let userAlready = Meteor.users.findOne({ username: json.username.trim() });

    if (userAlready) {
      throw new Meteor.Error('Employee-Number', 'El número de empleado ya existe, por favor elija otro');
    }

    const newUserCreate = Accounts.createUser(user);
    Roles.addUsersToRoles(newUserCreate, [ 'user' ]);
    return true;
  },

  batchNewUser(json) {
    json.forEach(data => {
      try {
        Meteor.call('newUser', data);
      } catch(error) {
        console.log(error);
      }
    });
  },

  editUser(json) {
    let oldUser = Meteor.users.findOne({ username: json.username });

    if (!json.img) {
      json.img = oldUser.profile.image;
    }

    let prof = Object.assign({}, oldUser.profile);
    prof.name = nameUser;
    prof.lastName = "";
    prof.image = json.img;
    prof.enable = true;

    return Meteor.users.update({ _id: oldUser._id }, {$set:{ profile: prof }});
  },

  confirmUserPassword(data) {
    const user = Meteor.users.findOne({ _id: data.userId });

    if (!user) {
      throw new Meteor.Error('invalid-token', 'Token o link inválido');
    }

    Accounts.setPassword(data.userId, data.password);
    return true;
	},

  setNewPassword(data) {
    Accounts.setPassword(data.userId, data.newPassword);
		return true;
  },

  deleteEmployees(userId) {
    // console.log(userId)
    Meteor.users.update( { _id: userId }, { $set: { 'profile.enable': false} } );
    return true;
  },

  batchDeleteEmployees(json) {
    json.forEach(data => {
      try {
        Meteor.call('deleteEmployees', data);
      } catch(error) {
        console.log(error);
      }
    });
  },

  reactiveEmployee(user) {
    const shift = user.Turno ? parseInt(user.Turno) : '';
    Meteor.users.update( { _id: user.owner }, { 
      $set: { 
        'profile.enable': true,
        'profile.shift': shift
      }
    });
    return true;
  },

  batchReactiveEmployee(json) {
    json.forEach(data => {
      try {
        Meteor.call('reactiveEmployee', data);
      } catch(error) {
        console.log(error);
      }
    });
  },

  previewEmployees(rows) {
    if (!rows || rows.length == 0) {
      throw new Meteor.Error('invalid-file', 'Formato inválido');
    }

    const neededColumns = [
      'Oracle ID',
      'Full Name',
      'Turno'
    ];

    const rowToTest = rows[0];
    const keys = Object.keys(rowToTest);

    Object.keys(keys).forEach(item => keys[item] = keys[item].trim());

    // Validar que tenga todas las keys minimas
    let validFile = true;
    let columnsMissing = [];
    neededColumns.forEach(neededColumn => {
      if (!keys.includes(neededColumn)) {
        validFile = false;
        console.log('No tiene => ', neededColumn);
        columnsMissing.push(neededColumn)
      }
    });

    const columnsNeed = !columnsMissing.length ? null : `Columnas faltantes: ${columnsMissing}`;

    if (!validFile) {
      throw new Meteor.Error('invalid-file', `Archivo no válido, columnas no válidas. ${columnsNeed}`);
    }

    let update = [];
    const data = rows.map(row => {
      const userData = Meteor.users.find({
        username: row['Oracle ID'].toString(),
      });
      row.alreadyExist = userData.count() > 0;
      if (userData.count() > 0) {
        const user = userData.fetch();
        row.owner = user[0]._id;
        row.activeUser = user[0].profile.enable;

        if (
          !user[0].profile.shift || 
          user[0].profile.shift !== row['Turno'] || 
          (user[0].activeUser && row.alreadyExist)
        ) {
          update.push(row);
        }
      }
      return row;
    });

    const roles = Meteor.roleAssignment.find({ 'role._id': 'user' }).fetch();
    const idUser = roles.map(item => item.user._id);
    let query = {
      _id: { $in: idUser },
      'profile.enable': true,
    };
    const allUsers = Meteor.users.find(query).fetch();
    let idsUsers = allUsers.map(user => user.username);

    let usersNotFind = [];
    let dataUsersNotFind = [];
  
    const idsUsersData = data.map(i => i['Oracle ID'].toString())
    idsUsers.map(i => !idsUsersData.includes(i) && usersNotFind.push(i));

    usersNotFind.map(i => allUsers.find(user => user.username == i && dataUsersNotFind.push(user)));

    return {
      data: data.filter(user => !user.alreadyExist),
      dataUpdate: update,
      dataEliminate: dataUsersNotFind,
      countToEliminate: usersNotFind.length,
      countTotal: data.length,
      countToImport: data.filter(user => !user.alreadyExist).length,
      countAlreadyExists: data.filter(user => user.alreadyExist).length,
    };
  },

});
