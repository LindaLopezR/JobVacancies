import { Meteor } from 'meteor/meteor';
import { NominationsCollection } from '/imports/api/nominations';
import { VacanciesCollection } from '/imports/api/vacancies';

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


  if (VacanciesCollection.find().count() === 0) {
    let test = [
      {
        name: 'Coordinador de Diseño Gráfico / TAF',
        description: '<p><a href="https://www.linkedin.com/jobs/view/3000766050/?" rel="noopener noreferrer" target="_blank">https://www.linkedin.com/jobs/view/3000766050/?</a>alternateChannel=search&amp;refId=%2Bu2tBSt3GCFdgQkemzB40A%3D%3D&amp;trackingId=JSJMfJJvBe%2BqxwJIKclyvw%3D%3D</p><p>Grupo Axo®&nbsp;desde 1994 es&nbsp;la referencia obligada, un aliado poderoso para sus socios y el recurso más certero para las firmas que confían en nosotros.</p><p>El futuro, aunque incierto para todos, nos encanta. Porque de algo estamos seguros: estaremos ahí: “Acercando a las mejores marcas con las personas a quienes apasionan, de formas que aún nadie ha imaginado. #ProudToBeAxo</p>',
        typeWork: '2',
        typeSite: '2',
        id: '0124',
      },
      {
        name: 'Productor Audio Visual - Prácticas Profesionales y de práctica',
        description: '<p>Hermont´s World&nbsp;somo una Empresa de Servicios Logísticos, Agencia Aduanal y Asesor en Comercio Exterior,</p><p><br></p><p>Si estas estudiando y quieres poner en practicas tus conocimientos y sobre todo generar experiencia laborar, te estamos buscando.</p><p><br></p><p>Actividades:</p><ul><li>Publicidad.</li><li>Desarrollo y Edición de contenido Audio Visual para redes sociales.</li><li>Apoyo al área de mercadotecnia Digital.</li></ul><p><br></p>',
        typeWork: '4',
        typeSite: '1',
        id: '045',
      }
    ];

    test.forEach(vacancy => {
      try {
        Meteor.call('newVacancy', vacancy);
      } catch(error) {
        console.log(error);
      }
    });
  }

  if (NominationsCollection.find().count() === 0 ) {
    const userId = Meteor.users.findOne({username: '50504'})._id;
    const job = VacanciesCollection.findOne({id: '0124'})._id;
    const testNomination = {
      candidate: userId,
      vacancy: job,
      enable : true,
      date : new Date(),
      status : 'PENDIENT',
    };

    NominationsCollection.insert(testNomination);
  }

});
