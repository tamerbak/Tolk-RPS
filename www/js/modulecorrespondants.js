angular.module('modulecorrespondants', ['autocomplete'])

//=========================================
//=========================================   Mes correspondants
//=========================================
.controller('mescorrespondantsCtrl',function($scope,$state,formatString,$stateParams,$http,$ionicHistory,$filter,xmlParser,appAuthentification,docteurAuthentification,localStorageService)
{
  $scope.appauth = appAuthentification;
  $scope.doctauth = docteurAuthentification;
  $scope.formData = {};

  $scope.goBack = function(){
    console.log('going back');
    $ionicHistory.goBack();

  };

  $scope.ajoutercorrespondant = function(){
    $state.go('ajouterCorrespondant');
  };

  $scope.correspondantDetail = function(correspondantName){
    console.log('before ' + correspondantName);
    $state.go("correspondant",  {'param1':correspondantName});
  };

  $scope.correspondants = [];

  var getCorrespondants = function() {
        var userId = localStorageService.get("user_id");

        var query = "select pk_user_praticien, libelle as specialite, nom, prenom " +
            "from user_praticien, user_specialite " +
            "where fk_user_specialite=pk_user_specialite " +
            "and pk_user_praticien " +
            "in (select fk_user_praticien from user_correspondance " +
            "where fk_user_compte=" + userId + " " +
            "and confirmee='Oui' " +
            "and dirty='N');";

        $http({
          method  : 'POST',
          url     : 'http://ns389914.ovh.net:8080/tolk/api/sql',
          data    : query,
          headers: {"Content-Type": 'text/plain'}
        })
        .success(function(data){
          console.log("getCorrespondants > success : ", data);

          if(data && data.data.length > 0) {
            $scope.formData.hasCorrespondants = true;
            $scope.correspondants = data.data;
          }
        })
        .error(function(data){
          console.log("getCorrespondants > error : ", data);
        });
  };

  getCorrespondants();

  $scope.getMessagesForCorrespondant = function(forPraticien){

    var requestMessages = "";
    forPraticien.messages=[];
    if ($scope.doctauth.id_compte != "")
    {
      /*requestMessages = "<fr.protogen.connector.model.SearchClause>" +
        "<field>fk_user_compte</field>" +
        "<clause>"+$scope.doctauth.id_compte+"</clause>" +
        "<gt>"+$scope.doctauth.id_compte+"</gt>" +
        "<lt>"+$scope.doctauth.id_compte+"</lt>" +
        "<type>TEXT</type>" +
        "</fr.protogen.connector.model.SearchClause>";*/

      requestMessages = "<fr.protogen.connector.model.SearchClause>" +
        "<field>fk_user_praticien</field>" +
        "<clause>"+forPraticien.id+"</clause>" +
        "<gt>"+forPraticien.id+"</gt>" +
        "<lt>"+forPraticien.id+"</lt>" +
        "<type>fk_user_praticien</type>" +
        "</fr.protogen.connector.model.SearchClause>";

    }
    else
    {
      //$state.go('home');
    }


    $requestdata = "<fr.protogen.connector.model.DataModel><entity>user_message</entity><dataMap/><rows/><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>" + $scope.appauth.sessionId + "</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses>"+requestMessages+"</clauses><page>100</page><pages>100</pages><nbpages>100</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>";
    $http({
      method  : 'POST',
      url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
      data    : $requestdata,
      headers: {"Content-Type": 'text/xml'}
    })
      .success(function(data)
      {

        datajson=xmlParser.xml_str2json(data);
        if (datajson['fr.protogen.connector.model.DataModel'].status != "FAILURE")
        {
          //$scope.setCorrespondants(datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow']);
          console.log("praticien"+ forPraticien.id + "name" +forPraticien.name);
          console.log(datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow']);
          rows = datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow'];

          if (rows == null)
          {
            return;
          }
          rows = [].concat( rows );
          console.log("rows lenght : "+ rows.length);

          for(var i=0; i<rows.length; i++) {
            console.log(JSON.stringify(rows[i].dataRow['fr.protogen.connector.model.DataEntry']));
            $message = {};
            for (var j = 0; j < rows[i].dataRow['fr.protogen.connector.model.DataEntry'].length; j++)
            {//message envoyer

              if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "lu")
              {
                $message.lu = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                $message.lu = $message.lu.replace("<![CDATA[", "").replace("]]>", "");
                continue;
              }

              if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "suppression_emetteur")
              {
                $message.suppression_emetteur = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                $message.suppression_emetteur = $message.suppression_emetteur.replace("<![CDATA[", "").replace("]]>", "");
                continue;
              }

              if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "suppression_destinataire")
              {
                $message.suppression_destinataire = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                $message.suppression_destinataire = $message.suppression_destinataire.replace("<![CDATA[", "").replace("]]>", "");
                continue;
              }

              if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "pk_user_message")
              {
                $message.pk_user_message = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                $message.pk_user_message = $message.pk_user_message.replace("<![CDATA[", "").replace("]]>", "");
                continue;
              }

              if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "fk_user_compte")
              {
                $message.fk_user_compte = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                $message.fk_user_compte = $message.fk_user_compte.replace("<![CDATA[", "").replace("]]>", "");
                continue;
              }

              if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "fk_user_praticien")
              {
                $message.fk_user_praticien = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                $message.fk_user_praticien = $message.fk_user_praticien.replace("<![CDATA[", "").replace("]]>", "");
                continue;
              }

              if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "object")
              {
                $message.object = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                $message.object = $message.object.replace("<![CDATA[", "").replace("]]>", "");
                continue;
              }

              if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "contenu")
              {
                $message.contenu = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                $message.contenu = $message.contenu.replace("<![CDATA[", "").replace("]]>", "");
                continue;
              }

              if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "date_d_envoi")
              {
                $message.date_d_envoi = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                $message.date_d_envoi = $message.date_d_envoi.replace("<![CDATA[", "").replace("]]>", "");
                continue;
              }

            }
            forPraticien.messages.push($message);
          }

          var orderBy = $filter('orderBy');
          forPraticien.messages = orderBy(forPraticien.messages, '-date_d_envoi', false);
          forPraticien.lastMessage = forPraticien.messages[0];
          console.log(forPraticien);
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
//=========================================  Ajouter un Correspondants
//=========================================
.controller('ajoutercorrespondantCtrl',function($scope,$http,$state,$stateParams,$ionicHistory,$filter,xmlParser,appAuthentification,docteurAuthentification)
{
    $scope.goBack = function()
    {
        $ionicHistory.goBack();
    };
    $scope.validValue = function()
    {
        var re = /^([a-zA-Z0-9])+([a-zA-Z0-9._%+-])+\@([a-zA-Z0-9_.-])+\.(([a-zA-Z]){2,6})$/;
        if (!re.test($scope.email) && $scope.email != "")
        {
            $scope.emailError = true;
            return;
        }
        else
        {
            $scope.emailError = false;
        }
    };
    
})
//=========================================
//=========================================  1 Correspondants details
//=========================================
.controller('correspondantCtrl',function($scope,$http,$state,$stateParams,$ionicHistory,$filter,xmlParser,appAuthentification,docteurAuthentification)
{
  $scope.goBack = function(){
    $ionicHistory.goBack();
  };


  $scope.appauth = appAuthentification;
  $scope.doctauth = docteurAuthentification;

  $scope.messages = [];
  $scope.messagesView = [];

  $scope.$praticienCorrespondant = {};

  $scope.messageEnvoyerMessage = "Envoyer un 1er message";

  console.log($stateParams.param1);
  $scope.idCorrespondant = $stateParams.param1;

  for(var i = 0; i < $scope.doctauth.correspondants.length; i++)
  {
    if($scope.idCorrespondant == $scope.doctauth.correspondants[i].id)
    {
      $scope.$praticienCorrespondant = $scope.doctauth.correspondants[i];
      break;
    }
  }

  if($scope.$praticienCorrespondant.messages && $scope.$praticienCorrespondant.messages.length > 0)
  {
    $scope.showList = true;
    $scope.showAucunMessage = false;
    for($i = 0; $i < $scope.$praticienCorrespondant.messages.length ; $i++)
    {
      $currentMessage = $scope.$praticienCorrespondant.messages[$i];
      messageTemp = {};
      messageTemp.id = $currentMessage.pk_user_message;
      messageTemp.icon = "";

      if($currentMessage.id_compte == $scope.doctauth.id_compte) messageTemp.icon = "ion-ios-upload-outline";
      else
      {
        if($currentMessage.lu == "Non") messageTemp.icon = "ion-ios-email";
        else
        {
           messageTemp.icon = "ion-ios-email-outline";
        }
      }

      //if($currentMessage.State == "echoue") messageTemp.icon = "ion-ios-upload-outline";

      messageTemp.objet = $currentMessage.object;

      messageTemp.datenvoie = $currentMessage.date_d_envoi;
      $scope.messagesView.push(messageTemp);
    }

    $scope.messageEnvoyerMessage = "Envoyer un nouveau message";
  }
  else
  {
    $scope.showList = false;
    $scope.showAucunMessage = true;
  };

  $scope.correspondantMessage = function(correspondantid,messageid)
  {
    console.log('before ' + messageid);
    $state.go("messageconsultation",  {'param1':correspondantid,'param2':messageid});
  };

  $scope.ecrireMessage = function()
  {
    $state.go("messagecreation",  {'param1':$scope.idCorrespondant});
  };


  $scope.getMessagesForCorrespondant = function(forPraticien)
  {

    var requestMessages = "";
    forPraticien.messages=[];
    if ($scope.doctauth.id_compte != "")
    {
      /*requestMessages = "<fr.protogen.connector.model.SearchClause>" +
       "<field>fk_user_compte</field>" +
       "<clause>"+$scope.doctauth.id_compte+"</clause>" +
       "<gt>"+$scope.doctauth.id_compte+"</gt>" +
       "<lt>"+$scope.doctauth.id_compte+"</lt>" +
       "<type>TEXT</type>" +
       "</fr.protogen.connector.model.SearchClause>";*/

      requestMessages = "<fr.protogen.connector.model.SearchClause>" +
        "<field>fk_user_praticien</field>" +
        "<clause>"+forPraticien.id+"</clause>" +
        "<gt>"+forPraticien.id+"</gt>" +
        "<lt>"+forPraticien.id+"</lt>" +
        "<type>fk_user_praticien</type>" +
        "</fr.protogen.connector.model.SearchClause>";

    }
    else
    {
      //$state.go('home');
    }


    $requestdata = "<fr.protogen.connector.model.DataModel><entity>user_message</entity><dataMap/><rows/><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>" + $scope.appauth.sessionId + "</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses>"+requestMessages+"</clauses><page>100</page><pages>100</pages><nbpages>100</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>";
    $http({
      method  : 'POST',
      url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
      data    : $requestdata,
      headers: {"Content-Type": 'text/xml'}
    })
      .success(function(data)
      {

        datajson=xmlParser.xml_str2json(data);
        if (datajson['fr.protogen.connector.model.DataModel'].status != "FAILURE")
        {
          //$scope.setCorrespondants(datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow']);
          console.log("praticien"+ forPraticien.id + "name" +forPraticien.name);
          console.log(datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow']);
          rows = datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow'];

          if (rows == null)
          {
            return;
          }
          rows = [].concat( rows );
          console.log("rows lenght : "+ rows.length);

          for(var i=0; i<rows.length; i++) {
            console.log(JSON.stringify(rows[i].dataRow['fr.protogen.connector.model.DataEntry']));
            $message = {};
            for (var j = 0; j < rows[i].dataRow['fr.protogen.connector.model.DataEntry'].length; j++)
            {//message envoyer

              if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "lu")
              {
                $message.lu = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                $message.lu = $message.lu.replace("<![CDATA[", "").replace("]]>", "");
                continue;
              }

              if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "suppression_emetteur")
              {
                $message.suppression_emetteur = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                $message.suppression_emetteur = $message.suppression_emetteur.replace("<![CDATA[", "").replace("]]>", "");
                continue;
              }

              if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "suppression_destinataire")
              {
                $message.suppression_destinataire = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                $message.suppression_destinataire = $message.suppression_destinataire.replace("<![CDATA[", "").replace("]]>", "");
                continue;
              }

              if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "pk_user_message")
              {
                $message.pk_user_message = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                $message.pk_user_message = $message.pk_user_message.replace("<![CDATA[", "").replace("]]>", "");
                continue;
              }

              if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "fk_user_compte")
              {
                $message.fk_user_compte = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                $message.fk_user_compte = $message.fk_user_compte.replace("<![CDATA[", "").replace("]]>", "");
                continue;
              }

              if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "fk_user_praticien")
              {
                $message.fk_user_praticien = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                $message.fk_user_praticien = $message.fk_user_praticien.replace("<![CDATA[", "").replace("]]>", "");
                continue;
              }

              if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "object")
              {
                $message.object = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                $message.object = $message.object.replace("<![CDATA[", "").replace("]]>", "");
                continue;
              }

              if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "contenu")
              {
                $message.contenu = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                $message.contenu = $message.contenu.replace("<![CDATA[", "").replace("]]>", "");
                continue;
              }

              if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "date_d_envoi")
              {
                $message.date_d_envoi = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                $message.date_d_envoi = $message.date_d_envoi.replace("<![CDATA[", "").replace("]]>", "");
                continue;
              }

            }
            forPraticien.messages.push($message);
          }

          var orderBy = $filter('orderBy');
          forPraticien.messages = orderBy(forPraticien.messages, '-date_d_envoi', true);
          forPraticien.lastMessage = forPraticien.messages[0];
          console.log(forPraticien);
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

  $scope.$on('$ionicView.enter', function()
  {
    console.log("called the renew");
    $scope.getMessagesForCorrespondant($scope.$praticienCorrespondant);
  });

})

  //=========================================
//=========================================   message creation
//=========================================
  .controller('nouveauMessageCtrl',function($scope,$http,$state,$stateParams,$ionicHistory,xmlParser,appAuthentification,docteurAuthentification)
  {
    $scope.goBack = function()
    {
      $ionicHistory.goBack();
    };

    $scope.appauth = appAuthentification;
    $scope.doctauth = docteurAuthentification;

    $scope.nouveauMessage = {};
    $scope.nouveauMessage.objet = "";
    $scope.nouveauMessage.contenu = "";

    $scope.$praticienCorrespondant = {};

    console.log($stateParams.param1);
    $scope.idCorrespondant = $stateParams.param1;

    for(var i = 0; i < $scope.doctauth.correspondants.length; i++)
    {
      if($scope.idCorrespondant == $scope.doctauth.correspondants[i].id)
      {
        $scope.$praticienCorrespondant = $scope.doctauth.correspondants[i];
        break;
      }
    }

    $scope.envoyerMessage = function()
    {

      if ($scope.nouveauMessage.objet == "" || $scope.nouveauMessage.contenu == "")
      {
        $scope.messageerreur = "Veuillez saisir tous les champs";
        return;
      }

      var requestMessages = "";

      requestMessages = "<fr.protogen.connector.model.DataModel>" +
        "<entity>user_message</entity>" +
        "<dataMap/>" +
        "<rows>" +
        "<fr.protogen.connector.model.DataRow>" +
        "<dataRow>" +

        "<fr.protogen.connector.model.DataEntry>" +
        "<label>&lt;![CDATA[fk_user_compte]]&gt;</label>" +
        "<attributeReference>fk_user_compte</attributeReference>" +
        "<type>fk_user_compte</type>" +
        "<value>"+ $scope.doctauth.id_compte+"</value>" +
        "</fr.protogen.connector.model.DataEntry>" +

        "<fr.protogen.connector.model.DataEntry>" +
        "<label>&lt;![CDATA[fk_user_praticien]]&gt;</label>" +
        "<attributeReference>fk_user_praticien</attributeReference>" +
        "<type>fk_user_praticien</type>" +
        "<value>"+ $scope.idCorrespondant+"</value>" +
        "</fr.protogen.connector.model.DataEntry>" +

        "<fr.protogen.connector.model.DataEntry>" +
        "<label>&lt;![CDATA[object]]&gt;</label>" +
        "<attributeReference>object</attributeReference>" +
        "<type>TEXT</type>" +
        "<value>&lt;![CDATA["+ $scope.nouveauMessage.objet +"]]&gt;</value>" +
        "</fr.protogen.connector.model.DataEntry>" +

        "<fr.protogen.connector.model.DataEntry>" +
        "<label>&lt;![CDATA[contenu]]&gt;</label>" +
        "<attributeReference>contenu</attributeReference>" +
        "<type>TEXT</type>" +
        "<value>&lt;![CDATA["+$scope.nouveauMessage.contenu+"]]&gt;</value>" +
        "</fr.protogen.connector.model.DataEntry>" +

        "<fr.protogen.connector.model.DataEntry>" +
        "<label>&lt;![CDATA[lu]]&gt;</label>" +
        "<attributeReference>lu</attributeReference>" +
        "<type>TEXT</type>" +
        "<value>&lt;![CDATA[Non]]&gt;</value>" +
        "</fr.protogen.connector.model.DataEntry>" +

        "<fr.protogen.connector.model.DataEntry>" +
        "<label>&lt;![CDATA[suppression_emetteur]]&gt;</label>" +
        "<attributeReference>suppression_emetteur</attributeReference>" +
        "<type>TEXT</type>" +
        "<value>&lt;![CDATA[Non]]&gt;</value>" +
        "</fr.protogen.connector.model.DataEntry>" +

        "<fr.protogen.connector.model.DataEntry>" +
        "<label>&lt;![CDATA[suppression_destinataire]]&gt;</label>" +
        "<attributeReference>suppression_destinataire</attributeReference>" +
        "<type>TEXT</type>" +
        "<value>&lt;![CDATA[Non]]&gt;</value>" +
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
        "<operation>PUT</operation>" +
        "<clauses/>" +
        "<page>1</page>" +
        "<pages>5</pages>" +
        "<nbpages>0</nbpages>" +
        "<iddriver>0</iddriver>" +
        "<ignoreList></ignoreList>" +
        "</fr.protogen.connector.model.DataModel>";



      $http({
        method  : 'POST',
        url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
        data    : requestMessages,
        headers: {"Content-Type": 'text/xml'}
      })
        .success(function(data)
        {
          console.log(data);
          $ionicHistory.goBack();
        })
        .error(function(data) //
        {
          console.log(data);
          $scope.messageerreur = "Une erreur s'est produite, veuillez resseyer SVP."
        });
    };

  })


  //=========================================
//=========================================   message consultation
//=========================================
  .controller('messageCtrl',function($scope,$http,$state,$stateParams,$ionicHistory,xmlParser,appAuthentification,docteurAuthentification)
  {
    $scope.goBack = function()
    {
      $ionicHistory.goBack();
    };

    $scope.appauth = appAuthentification;
    $scope.doctauth = docteurAuthentification;

    $scope.messages = [];
    $scope.messagesView = [];
    $scope.message = {};
    $scope.messageView = {};

    $scope.nouveauMessage = {};
    $scope.nouveauMessage.objet = "";
    $scope.nouveauMessage.contenu = "";

    $scope.$praticienCorrespondant = {};

    $scope.messageEnvoyerMessage = "Envoyer un 1er message";

    console.log($stateParams.param1);
    $scope.idCorrespondant = $stateParams.param1;

    for(var i = 0; i < $scope.doctauth.correspondants.length; i++)
    {
      if($scope.idCorrespondant == $scope.doctauth.correspondants[i].id)
      {
        $scope.$praticienCorrespondant = $scope.doctauth.correspondants[i];
        break;
      }
    }

    if($scope.$praticienCorrespondant.messages.length > 0)
    {
      $scope.showList = true;
      $scope.showAucunMessage = false;

      for($i = 0; $i < $scope.$praticienCorrespondant.messages.length ; $i++)
      {
        $currentMessage = $scope.$praticienCorrespondant.messages[$i];
        console.log("selected msg id:" +$stateParams.param2 + "  current msg id: "+$currentMessage.pk_user_message );
        if ($currentMessage.pk_user_message == $stateParams.param2)
        {
          console.log("here");
          $scope.message = $currentMessage;
          break;
        }
      }

      console.log("id :"+$scope.message.pk_user_message);
      console.log("objet :"+$scope.message.object);
      console.log("contenu :"+$scope.message.contenu);console.log("datedenvoi :"+$scope.message.date_d_envoi);


      $scope.messageView.icon = "";
      $scope.messageView.objet = "";
      $scope.messageView.contenu = "";
      $scope.messageView.datenvoie = "";

      if($scope.message.id_compte == $scope.doctauth.id_compte) $scope.messageView.icon = "ion-ios-upload-outline";
      else
      {
        if($scope.message.lu == "Non") $scope.messageView.icon = "ion-ios-email";
        else
        {
          $scope.messageView.icon = "ion-ios-email-outline";
        }
      }
      console.log($scope.messageView);
      //if($currentMessage.State == "echoue") messageTemp.icon = "ion-ios-upload-outline";

      $scope.messageView.objet = $scope.message.object;
      $scope.messageView.contenu = $scope.message.contenu;


      $scope.messageView.datenvoie = $scope.message.date_d_envoi;

      $scope.messageEnvoyerMessage = "Envoyer un nouveau message";
    }
    else
    {
      $scope.showList = false;
      $scope.showAucunMessage = true;
    };

    $scope.correspondantMessage = function(correspondantid,messageid)
    {
      console.log('before ' + messageid);
      $state.go("messageconsultation",  {'param1':correspondantid,'param2':messageid});
    };


  })

;












