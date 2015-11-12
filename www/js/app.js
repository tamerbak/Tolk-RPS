// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'accueilcontrollers', 'inscriptioncontrollers', 'datacontrollers',
  'moduleinscriptions', 'moduleconnexion','modulecorrespondants',
  'mesContactsController', 'LocalStorageModule'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

      ionic.Platform.isFullScreen = true;
    });
  })

  .controller("MainController", ['$scope', function ($scope) {

    $scope.data = {
      "launched": "No"
    };

    $scope.reportAppLaunched = function () {
      console.log("App Launched Via Custom URL");

      $scope.$apply(function () {
        $scope.data.launched = "Yes";
      });
    }

  }])

  .factory('xmlParser', function () {
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
    }
  })

  .factory('docteurInscription', function () {

    docteurInscription = {};
    docteurInscription.specialite = '';
    docteurInscription.specialite_id = '';
    docteurInscription.civilite = '';
    docteurInscription.nom = '';
    docteurInscription.prenom = '';
    docteurInscription.praticien_id = '';
    docteurInscription.adresse_id = '';
    docteurInscription.cp = '';
    docteurInscription.ville = '';
    docteurInscription.adresse = '';
    docteurInscription.adresse_num = '';
    docteurInscription.tel = '';
    docteurInscription.email = '';

    return docteurInscription;
  })

  .factory('appAuthentification', function () {

    appAuthentification = {};
    appAuthentification.sessionId = '';
    return appAuthentification;
  })
  .factory('docteurAuthentification', function () {

    docteurAuthentification = {};
    docteurAuthentification.id_compte = '';
    docteurAuthentification.id_prat = '';
    docteurAuthentification.nom = '';
    docteurAuthentification.prenom = '';
    docteurAuthentification.horaire = '';
    docteurAuthentification.expertise = '';
    docteurAuthentification.id_specialite = '';
    docteurAuthentification.specialite_libelle = '';
    docteurAuthentification.id_adresse = '';
    docteurAuthentification.adresse = '';
    docteurAuthentification.num = '';
    docteurAuthentification.cp = '';
    docteurAuthentification.id_ville = '';
    docteurAuthentification.ville_Libelle = '';
    docteurAuthentification.id_categorie_pro = '';
    docteurAuthentification.categrie_pro_Libelle = '';
    docteurAuthentification.id_savoir_faire = '';
    docteurAuthentification.savoir_faire_Libelle = '';
    docteurAuthentification.id_type_savoir_faire = '';
    docteurAuthentification.type_savoir_faire_Libelle = '';
    docteurAuthentification.first_connect = '';
    docteurAuthentification.mot_de_passe = '';
    docteurAuthentification.correspondants = [];
	
	docteurAuthentification.expertise = '';
	docteurAuthentification.telephone = '';
	docteurAuthentification.imageP = '';
	docteurAuthentification.civilite = '';
	docteurAuthentification.corresps = [];
    return docteurAuthentification;
  })

  .factory('formatString', function(xmlParser)
  {
    return{
      formatServerResult: function (data)
      {
        var jsonResp = xmlParser.xml_str2json(data);
        var jsonText = JSON.stringify(jsonResp);
        jsonText = jsonText.replace(/fr.protogen.connector.model.StreamedFile/g, "streamedFile");
        jsonText = jsonText.replace(/fr.protogen.connector.model.DataModel/g, "dataModel");
        jsonText = jsonText.replace(/fr.protogen.connector.model.DataRow/g, "dataRow");
        jsonText = jsonText.replace(/fr.protogen.connector.model.DataEntry/g, "dataEntry");
        jsonText = jsonText.replace(/fr.protogen.connector.model.DataCouple/g, "dataCouple");
        jsonText = jsonText.replace( /<!\[CDATA\[/g, '').replace( /\]\]>/g, "");


        jsonText = JSON.parse(jsonText);
        return jsonText;
      }
    }
  })

  .service('popup', function($ionicPopup)
  {
    this.showpopup = function(message)
    {
        var alertPopup = $ionicPopup.alert(
        {
          title: '<img src="img/logo_TOLK_me_rouge_sur_transparent.svg" class="logo_popup">',
          template: message
        });
    }
  })


  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/index.html");

    $stateProvider
      .state('accueil',
      {
        name: 'accueil',
        url: '/',
        templateUrl: 'views/accueil.html'
      })
      .state('home',
      {
        name: 'home',
        url: '/',
        templateUrl: 'views/accueil.html'
      })
      .state('inscription1',
      {
        name: 'inscription1',
        url: '/inscription1',
        templateUrl: 'views/inscription1.html'
        //controller: 'inscription1Ctrl'

      })
      .state('inscription2',
      {
        name: 'inscription2',
        url: '/inscription2',
        templateUrl: 'views/inscription2.html'
      })
      .state('inscription_map',
      {
        name: 'inscription_map/:lat/:lng',
        url: '/inscription_map/:lat/:lng',
        templateUrl: 'views/inscription_map.html'
      })
      .state('inscription3',
      {
        name: 'inscription3',
        url: '/inscription3',
        templateUrl: 'views/inscription3.html'
      })
      .state('inscription4',
      {
        name: 'inscription4',
        url: '/inscription4',
        templateUrl: 'views/inscription4.html'
      })
      .state('condition_generale',
      {
        name: 'condition_generale',
        url: '/condition_generale',
        templateUrl: 'views/condition_generale.html'
      })
      .state('connexion',
      {
        name: 'connexion',
        url: '/connexion',
        templateUrl: 'views/connexion.html'
      })
      .state('menu_general',
      {
        name: 'menu_general',
        url: '/menu_general',
        templateUrl: 'views/menu_general.html'
      })
      .state('reinitialisermdp',
      {
        name: 'reinitialisermdp',
        url: '/reinitialisermdp',
        templateUrl: 'views/reinitialisermdp.html'
      })
      .state('mescorrespondants',
      {
        name: 'mescorrespondants',
        url: '/mescorrespondants',
        templateUrl: 'views/mescorrespondants.html'
      })
	  .state('mescontacts',
      {
        name: 'mescontacts',
        url: '/mescontacts',
        templateUrl: 'views/mescontacts.html'
      })
      .state('ajouterCorrespondant',
      {
        cache: false,
        name: 'ajouterCorrespondant',
        url: '/mescorrespondants/ajoutercorrespondant',
        templateUrl: 'views/ajoutercorrespondant.html'
      })
      .state('correspondant',
      {
        name: 'correspondant/:param1',
        url: '/correspondant/:param1',
        templateUrl: 'views/correspondant.html'
      })
      .state('messageconsultation',
      {
        cache: false,
        name: 'messageconsultation/:param1/:param2',
        url: '/messageconsultation/:param1/:param2',
        templateUrl: 'views/messageconsultation.html'
      })
      .state('messagecreation',
      {
        name: 'messagecreation/:param1',
        url: '/messagecreation/:param1',
        templateUrl: 'views/messagecreation.html'
      })
      .state('first_connexion_1/:praticien_id',
      {
        name: 'first_connexion_1',
        url: '/first_connexion_1/:praticien_id',
        templateUrl: 'views/first_connexion_1.html'
      })
      .state('first_connexion_2',
      {
        name: 'first_connexion_2',
        url: '/first_connexion_2',
        templateUrl: 'views/first_connexion_2.html'
      })
      .state('first_connexion_3',
      {
        name: 'first_connexion_3',
        url: '/first_connexion_3',
        templateUrl: 'views/first_connexion_3.html'
      })
      .state('profile',
      {
        name: 'profile',
        url: '/profile',
        templateUrl: 'views/profile.html'

      })
      .state('promo1',
      {
        name: 'promo1',
        url: '/promo1',
        templateUrl: 'views/promo1.html'
      })
      .state('previsualtion',
      {
        name: 'previsualtion',
        url: '/previsualtion',
        templateUrl: 'views/docteur.html'
      })
      .state('autresservices',
      {
        name: 'autresservices',
        url: '/autresservices',
        templateUrl: 'views/autres_services.html',
        controller: 'autresservicesCtrl'
      });

    $urlRouterProvider.otherwise('/');
  });

function handleOpenURL(url) {

  var body = document.getElementsByTagName("body")[0];
  var mainController = angular.element(body).scope();
  mainController.reportAppLaunched(url);

}





