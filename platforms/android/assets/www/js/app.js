// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','accueilcontrollers','inscriptioncontrollers','datacontrollers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.factory('xmlParser', function () 
{
  var x2js = new X2JS();
  return {
    xml2json: function (args) {
      return angular.bind(x2js, x2js.xml2json, args)();
    },
    xml_str2json: function (args) {
      return angular.bind(x2js, x2js.xml_str2json, args)();
    },
    json2xml_str: function (args) {
      return angular.bind(x2js, x2js.json2xml_str, args)();
    }
}})

.factory('docteurInscription', function() {
 
  docteurInscription = {};
  docteurInscription.specialite = '';
  docteurInscription.titre = '';  
  docteurInscription.nom = ''; 
  docteurInscription.prenom = '';
  docteurInscription.cp = '';
  docteurInscription.district = '';
  docteurInscription.adresse = '';

  return docteurInscription;
})

.factory('appGlobalData', function() {
 
  appGlobalData = {};
  appGlobalData.sessionID = '';
  return appGlobalData;
})

.factory('appAuthentification', function() {
 
  appAuthentification = {};
  appAuthentification.sessionId = '';
  return appAuthentification;
})
.factory('docteurAuthentification', function() {
 
  docteurAuthentification = {};
  docteurAuthentification.id_prat = '';
  docteurAuthentification.nom = '';
  docteurAuthentification.prenom = ''; 
  return docteurAuthentification;
})


.config(function($stateProvider,$urlRouterProvider){
  $urlRouterProvider.otherwise("/index.html");

  $stateProvider
  .state('accueil', 
  {
    name:'accueil',
    url: '/',
    templateUrl: 'views/accueil.html',
  })
  .state('presentation1', 
  {
    name:'presentation1',
    url: '/presentation1',
    templateUrl: 'views/presentation1.html',
  })
  .state('presentation2', 
  {
    name:'presentation2',
    url: '/presentation2',
    templateUrl: 'views/presentation2.html',
  })
  .state('presentation3', 
  {
    name:'presentation3',
    url: '/presentation3',
    templateUrl: 'views/presentation3.html',
  })
  .state('inscription1', 
  {
    name:'inscription1',
    url: '/inscription1',
    templateUrl: 'views/inscription1.html',
    // controller: 'inscription1Ctrl'

  })
  .state('inscription2', 
  {
    name:'inscription2',
    url: '/inscription2',
    templateUrl: 'views/inscription2.html',
    controller:'inscription2Ctrl',
    controller: 'inscription2Ctrl'
  })
  .state('inscription3', 
  {
    name:'inscription3',
    url: '/inscription3',
    templateUrl: 'views/inscription3.html',
    controller: 'inscription3Ctrl'
  })
  .state('inscription4', 
  {
    name:'inscription4',
    url: '/inscription4',
    templateUrl: 'views/inscription4.html',
    controller: 'inscription4Ctrl'
  })
  .state('inscription5', 
  {
    name:'inscription5',
    url: '/inscription5',
    templateUrl: 'views/inscription5.html',
    controller: 'inscription5Ctrl'
  })
  .state('connexion', 
  {
    name:'connexion',
    url: '/connexion',
    templateUrl: 'views/connexion.html',
    controller: 'connexionCtrl'
  })
  .state('menu_general', 
  {
    name:'menu_general',
    url: '/menu_general',
    templateUrl: 'views/menu_general.html',
    controller: 'menu_generalCtrl'
  })
  .state('first_connexion_1', 
  {
    name:'first_connexion_1',
    url: '/first_connexion_1',
    templateUrl: 'views/first_connexion_1.html',
    controller: 'first_connexion_1Ctrl'
  })
  .state('first_connexion_2', 
  {
    name:'first_connexion_2',
    url: '/first_connexion_2',
    templateUrl: 'views/first_connexion_2.html',
    controller: 'first_connexion_2Ctrl'
  })
  .state('first_connexion_3', 
  {
    name:'first_connexion_3',
    url: '/first_connexion_3',
    templateUrl: 'views/first_connexion_3.html',
    controller: 'first_connexion_3Ctrl'
  })
  .state('profile', 
  {
    name:'profile',
    url: '/profile',
    templateUrl: 'views/profile.html',
    controller: 'profileCtrl'

  })
  .state('promo1', 
  {
    name:'promo1',
    url: '/promo1',
    templateUrl: 'views/promo1.html',
    controller: 'promo1Ctrl'
  })
  .state('previsualtion', 
  {
    name:'previsualtion',
    url: '/previsualtion',
    templateUrl: 'views/docteur.html',
    controller: 'docteurCtrl'
  });
  
  $urlRouterProvider.otherwise('/');
})




    
