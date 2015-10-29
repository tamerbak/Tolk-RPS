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

//=========================================
//=========================================   First connection 1
//=========================================

.controller('first_connexion_1Ctrl',function($scope,$state,$http,$ionicHistory,xmlParser,appAuthentification,docteurAuthentification)
{
  $scope.appauth = appAuthentification;
  $scope.doctauth = docteurAuthentification;
  $scope.accueil = function()
  {
    $ionicHistory.goBack(-2);
  };
  $scope.goBack = function()
  {
    $ionicHistory.goBack();
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
    $scope.message = "";
    $scope.message2 = "";

    if($scope.mdp1 == "" || $scope.mdp2 == "" ||  $scope.mdp1 == null || $scope.mdp2 == null)
    {
      $scope.message2 = "";
    }
    else if ($scope.mdp1 == $scope.mdp2) 
    {
        $scope.message = "";
        $scope.message2 = "";
    }
    else
    {
      $scope.message2 = "mots de passes : non identiques !";
    }

  };

   $scope.btnUpdatePasswordPressed = function()
  {
    if($scope.mdp1 == null || $scope.mdp2 == null || $scope.mdp1 == "" || $scope.mdp2 == "" || $scope.mdp1 != $scope.mdp2)
    {
      return ;
    }
    else
    {
       $scope.updatePassword($scope.mdp1);
    };

  };

  $scope.updatePassword = function(mdp)
  {
      if ($scope.appauth.sessionId == "") { $state.goBack(-10); return; };
      if ($scope.doctauth.id_compte == ""){ $state.goBack(-10); return; };

      /*
                              */

      requestUpdatePassword = "<fr.protogen.connector.model.DataModel>" +
                        "<entity>user_compte</entity>" +
                        "<dataMap/>" +
                        "<rows>" +
                          "<fr.protogen.connector.model.DataRow>" +
                            "<dataRow>" +
                              "<fr.protogen.connector.model.DataEntry>" +
                                "<label>&lt;![CDATA[ID Compte]]&gt;</label>" +
                                "<attributeReference>pk_user_compte</attributeReference>" +
                                "<type>PK</type>" +
                                "<value>"+ $scope.doctauth.id_compte +"</value>" +
                              "</fr.protogen.connector.model.DataEntry>" +
                              
                              "<fr.protogen.connector.model.DataEntry>" +
                                "<label>&lt;![CDATA[Premiere connexion]]&gt;</label>" +
                                "<attributeReference>premiere_connexion</attributeReference>" +
                                "<type>TEXT</type>" +
                                "<value>&lt;![CDATA[NON]]&gt;</value>" +
                              "</fr.protogen.connector.model.DataEntry>" +

                              "<fr.protogen.connector.model.DataEntry>" +
                                "<label>&lt;![CDATA[Mot de passe]]&gt;</label>" +
                                "<attributeReference>mot_de_passe</attributeReference>" +
                                "<type>TEXT</type>" +
                                "<value>&lt;![CDATA["+ mdp +"]]&gt;</value>" +
                              "</fr.protogen.connector.model.DataEntry>" +

                              

                            "</dataRow>" +
                          "</fr.protogen.connector.model.DataRow>" +
                        "</rows>" +
                        "<token>" +
                          "<username></username>" +
                          "<password></password>" +
                          "<nom>Jakjoud Abdeslam</nom>" +
                          "<appId>FRZ48GAR4561FGD456T4E</appId>" +
                          "<sessionId>" + $scope.appauth.sessionId + "</sessionId>" +
                          "<status>SUCCES</status>" +
                          "<id>206</id>" +
                          "<beanId>0</beanId>" +
                        "</token>" +
                        "<expired></expired>" +
                        "<unrecognized></unrecognized>" +
                        "<status></status>" +
                        "<operation>UPDATE</operation>" +
                        "<clauses/>" +
                        "<page>1</page>" +
                        "<pages>5</pages>" +
                        "<nbpages>0</nbpages>" +
                        "<iddriver>0</iddriver>" +
                        "<ignoreList></ignoreList>" +
                      "</fr.protogen.connector.model.DataModel>";

      console.log("request update password " + mdp + "for account " + $scope.doctauth.id_compte );
      console.log(requestUpdatePassword);

      $http({
          method  : 'POST',
          url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
          data    : requestUpdatePassword,
          headers: {"Content-Type": 'text/xml'}
         })
          .success(function(data)
          {

            datajson=xmlParser.xml_str2json(data);
            if (datajson['fr.protogen.connector.model.DataModel'].status != "FAILURE")
            {
              console.log("result update password");
              console.log(datajson);
              $state.go('first_connexion_2');

            }
            else
            {
              $scope.erreur = "Probleme serveur";
            }

          })
          .error(function(data) //
          {
            console.log(data);
             console.log("erreur");
          });


  };
})

//=========================================
//=========================================   First connection 2
//=========================================


.controller('first_connexion_2Ctrl',function($scope,$state,$ionicHistory,docteurAuthentification)
{
  $scope.doctauth = docteurAuthentification;

  $scope.accueil = function()
  {
    $ionicHistory.goBack(-3);
  };
  $scope.goBack = function()
  {
    $ionicHistory.goBack();
  };
  $scope.menu_general = function()
  {
    $state.go('menu_general');
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

;












