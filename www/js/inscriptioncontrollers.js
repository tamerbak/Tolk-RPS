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

  };
  $scope.doSomething = function()
  {
      console.log('I WAS CLICKED');
      $ionicHistory.goBack();
  };

  $scope.addSomething = function()
  {
      console.log('YOU WANNA ADD SOMEONE');
  };

  $scope.correspondantDetail = function(correspondantName)
  {
    console.log('before ' + correspondantName);
    $state.go("correspondant",  {'param1':correspondantName});
  };

  $scope.getCorrespondants = function()
  {

    if ($scope.appauth.sessionId == "")
    {
      //console.log('called'+ $scope.appauth.sessionId);
      //$state.go('home');
      $http({
        method  : 'POST',
        url     : 'http://ns389914.ovh.net:8080/tolk/api/aman',
        data    : "<fr.protogen.connector.model.AmanToken><username>administration</username><password>1234</password><nom></nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId></sessionId><status></status><id>0</id><beanId>0</beanId></fr.protogen.connector.model.AmanToken>",
        headers: {"Content-Type": 'text/xml'}
      })
        .success(function(data)
        {
          datajson=xmlParser.xml_str2json(data);
          $scope.appauth.sessionId = datajson['fr.protogen.connector.model.AmanToken'].sessionId;
          $scope.getSpecialitiesFromServer();

        })
        .error(function(data) //
        {
          console.log(data);
          console.log("erreur");
        });


    }
    else
    {
      $scope.getSpecialitiesFromServer();
    }
  };

  $scope.getSpecialitiesFromServer = function()
  {
    var requestSpecialite = "";
    /*if ($scope.dr.requestSpecialite != "")
    {
      requestSpecialite = "<fr.protogen.connector.model.SearchClause>" +
        "<field></field>" +
        "<clause></clause>" +
        "<gt>"+  +"</gt>" +
        "<lt></lt>" +
        "<type>TEXT</type>" +
        "</fr.protogen.connector.model.SearchClause>";

    }
    */
    $requestdata = "<fr.protogen.connector.model.DataModel><entity>user_correspondance</entity><dataMap/><rows/><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>" + $scope.appauth.sessionId + "</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses>"+requestSpecialite+"</clauses><page>1</page><pages>100</pages><nbpages>100</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>";
    $http({
      method  : 'POST',
      url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
      data    : $requestdata,
      headers: {"Content-Type": 'text/xml'}
    })
      .success(function(data)
      {

        datajson=xmlParser.xml_str2json(data);
        console.log(datajson);
        if (datajson['fr.protogen.connector.model.DataModel'].status != "FAILURE")
        {
          $scope.setSpecialities(datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow']);
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

  $scope.setSpecialities = function(rows)
  {
    console.log(JSON.stringify(rows));

    $scope.specialites.length = 0;
    console.log("rows lenght : "+ rows);

    if (rows == null) return;

    rows = [].concat( rows );
    console.log("rows lenght : "+ rows.length);

    for(var i=0; i<rows.length; i++)
    {
      var indexofSpecialite = -1;
      var indexofSpecialiteID = -1;
      for (var j = 0; j < rows[i].dataRow['fr.protogen.connector.model.DataEntry'].length ; j++)
      {
        if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "libelle")
        {
          indexofSpecialite = j;
          continue;
        }
        if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "pk_user_specialite")
        {
          indexofSpecialiteID = j;
          continue;
        }
      }
      if (indexofSpecialite != -1 && indexofSpecialiteID != -1)
      {
        var tempSpecialite = "";
        tempSpecialite = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][indexofSpecialite].value;
        tempSpecialite = tempSpecialite.replace("<![CDATA[", "").replace("]]>", "");

        var tempSpecialiteID = "";
        tempSpecialiteID = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][indexofSpecialiteID].value;
        tempSpecialiteID = tempSpecialiteID.replace("<![CDATA[", "").replace("]]>", "");


        if ($scope.specialites.indexOf(tempSpecialite) < 0  && $scope.specialites.length < 7)
        {
          console.log("cp :" + tempSpecialite + "    cpid :"+ tempSpecialiteID);
          $scope.specialites.push(tempSpecialite);
          $scope.specialites_id[tempSpecialite] = tempSpecialiteID;
        }
      }

    };

  };
  $scope.getCorrespondants();



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












