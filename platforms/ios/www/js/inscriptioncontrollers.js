angular.module('inscriptioncontrollers', ['autocomplete'])


//========================================= 
//=========================================   Presentations
//========================================= 

.controller('presentationCtrl',function($scope,$state,$ionicHistory)
{

  $scope.presentation1 = function()
  {
    $state.go('presentation1');
  };

  $scope.presentation2 = function()
  {
    $state.go('presentation2');
  };

  $scope.presentation3 = function()
  {
    $state.go('presentation3');
  };

  $scope.inscription1 = function()
  {
    $state.go('inscription1');
  };

  $scope.connexion = function()
  {
    $state.go('connexion');
  };
  $scope.backbutton = function()
  {
    console.log("backbutton");
    console.log($ionicHistory.backView());
  };
  
})

//========================================= 
//=========================================   Autres services
//========================================= 
.controller('autresservicesCtrl',function($scope,$state,$http,xmlParser,appAuthentification,docteurAuthentification)
{
  $scope.appauth = appAuthentification;
  $scope.doctauth = docteurAuthentification;
})
//========================================= 
//=========================================   Mes correspondants
//========================================= 
.controller('mescorrespondantsCtrl',function($scope,$state,$stateParams,$http,$ionicHistory,xmlParser,appAuthentification,docteurAuthentification)
{
  $scope.appauth = appAuthentification;
  $scope.doctauth = docteurAuthentification;

  $scope.correspondants = [
      {name: "Venkman", last_message:"Back off, man. I'm a scientist."},
      {name: "Egon", last_message:"We're gonna go full stream."},
      {name: "Ray", last_message: "Ugly little spud, isn't he?"},
      {name: "Winston", last_message: "That's a big Twinkie."},
      {name: "Tully", last_message: "Okay, who brought the dog?"}
   ];
  $scope.goBack = function() 
  {
    console.log('goining back');
    $ionicHistory.goBack();
  };

  $scope.correspondantDetail = function(correspondantName)
  {
    console.log('before ' + correspondantName);
    $state.go("correspondant",  {'param1':correspondantName});
  };

})

//========================================= 
//=========================================  1 Correspondants details
//========================================= 
.controller('correspondantCtrl',function($scope,$http,$state,$stateParams,$ionicHistory,xmlParser,appAuthentification,docteurAuthentification)
{
  $scope.appauth = appAuthentification;
  $scope.doctauth = docteurAuthentification;

  console.log($stateParams.param1);
  $scope.name = $stateParams.param1;

  $scope.goBack = function() 
  {
    console.log('goining back');
    $ionicHistory.goBack();
  };

})


//========================================= 
//=========================================   Menu general
//========================================= 
.controller('menu_generalCtrl',function($scope,$state,$http,xmlParser,appAuthentification,docteurAuthentification)
{
  $scope.appauth = appAuthentification;
  $scope.doctauth = docteurAuthentification;

  $scope.mescorrespondants = function()
  {
    $state.go('mescorrespondants');
  };

})

.controller('first_connexion_1Ctrl',function($scope,$state,appAuthentification,docteurAuthentification)
{
  $scope.appauth = appAuthentification;
  $scope.doctauth = docteurAuthentification;
  $scope.accueil = function()
  {
    $state.go('accueil');
  };
  $scope.notEmpty=function()
  {
    if($scope.mdp_sms == $scope.doctauth.mot_de_passe)
    {
       $scope.message = "";
       $scope.mdp1 = "";
       $scope.mdp2 = "";
    }else{
      $scope.message = "Code SMS incorrecte";
    };

  };
   $scope.identiques=function()
  {
    if($scope.mdp1 == $scope.mdp2 )
    {
      if($scope.mdp1 == "" || $scope.mdp2 == "" ||  $scope.mdp1 == null || $scope.mdp2 == null)
      {
         $scope.message2 = "Veuillez saisir votre nouveau mot de passe"
       }else{
          $scope.message2 = "mots de passes : identiques !"
       };
       
    }else{
      $scope.message2 = "mots de passes : non identiques !";
    };
  };
  $scope.first_connexion_1 = function()
  {
    $state.go('first_connexion_1');
  };
   $scope.to_first_connexion_2 = function()
  {
    if($scope.mdp_sms == null || $scope.mdp1 == null || $scope.mdp2 == null || $scope.mdp_sms == "" || $scope.mdp1 == "" || $scope.mdp2 == "")
    {
      $scope.message2 = "Erreur de saisie !";
    }else{
       $state.go('first_connexion_2');
    };
   
  };
})
.controller('first_connexion_2Ctrl',function($scope,$state){
  $scope.first_connexion_2 = function()
  {
       $state.go('first_connexion_2');
  };
  $scope.accueil = function()
  {
    $state.go('accueil');
  };
  $scope.profile = function()
  {
    $state.go('profile');
  };
})
.controller('first_connexion_3Ctrl',function($scope,$state,appAuthentification,docteurAuthentification)
{
  $scope.appauth = appAuthentification;
  $scope.doctauth = docteurAuthentification;
  $scope.first_connexion_3 = function()
  {
    $state.go('first_connexion_3');
  };

  $scope.accueil = function()
  {
    $state.go('accueil');
  };

})
.controller('profileCtrl',function($scope,$state,docteurAuthentification,appAuthentification){
    $scope.appauth = appAuthentification;
  $scope.doctauth = docteurAuthentification;
  $scope.profile = function()
  {
    $state.go('profile');
  }
})
.controller('promo1Ctrl',function($scope,$state){
  $scope.promo1 = function()
  {
    $state.go('promo1');
  }
})
.controller('previsualisationCtrl',function($scope,$state){
  $scope.previsualtions = function()
  {
    $state.go('previsualtion');
  };

})

.controller('tabsCtrl',function($scope,$state){
  $scope.tabs = function()
  {
    $state.go('tabs');
  };

})

.controller('testCtrl',function($scope,$state){
  console.log("test tabs");
})
;












