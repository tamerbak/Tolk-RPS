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
.controller('mescorrespondantsCtrl',function($scope,$state,$stateParams,$http,$ionicHistory,$filter,xmlParser,appAuthentification,docteurAuthentification)
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
    console.log('going back');
    $ionicHistory.goBack();

  };
  $scope.doSomething = function()
  {
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
          $scope.getCorrespondantsFromServer();

        })
        .error(function(data) //
        {
          console.log(data);
          console.log("erreur");
        });

    }
    else
    {
      $scope.getCorrespondantsFromServer();
    }
  };

  $scope.getCorrespondantsFromServer = function()
  {
    var requestCorrespondants = "";
    if ($scope.doctauth.id_compte != "")
    {
      requestCorrespondants = "<fr.protogen.connector.model.SearchClause>" +
        "<field>fk_user_compte</field>" +
        "<clause>"+$scope.doctauth.id_compte+"</clause>" +
        "<gt>"+$scope.doctauth.id_compte+"</gt>" +
        "<lt>"+$scope.doctauth.id_compte+"</lt>" +
        "<type>TEXT</type>" +
        "</fr.protogen.connector.model.SearchClause>";
      console.log(requestCorrespondants);

    }
    else
    {
      //$state.go('home');
    }


    $requestdata = "<fr.protogen.connector.model.DataModel><entity>user_correspondance</entity><dataMap/><rows/><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>" + $scope.appauth.sessionId + "</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses>"+requestCorrespondants+"</clauses><page>1</page><pages>100</pages><nbpages>100</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>";
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
          $scope.setCorrespondants(datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow']);
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

  $scope.setCorrespondants = function(rows)
  {

    $scope.doctauth.correspondants.length = 0;

    if (rows == null)
    {
      $scope.showAucunCorrespondant = true;
      return;
    }
    $scope.showAucunCorrespondant = false;
    rows = [].concat( rows );
    console.log("rows lenght : "+ rows.length);

    for(var i=0; i<rows.length; i++)
    {
      for (var j = 0; j < rows[i].dataRow['fr.protogen.connector.model.DataEntry'].length ; j++)
      {
        if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "fk_user_praticien")
        {
          $id_praticien = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
          $id_praticien = $id_praticien.replace("<![CDATA[", "").replace("]]>", "");

          $tableau_praticien = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].list["fr.protogen.connector.model.DataCouple"];
          $tableau_praticien = [].concat( $tableau_praticien );

          for(var k = 0; k < $tableau_praticien.length ; k++)
          {
            if($id_praticien == $tableau_praticien[k].id)
            {
              $praticien = {};
              $praticien.id = $id_praticien;
              $praticien.name = $tableau_praticien[k].label;
              $scope.doctauth.correspondants.push($praticien);
              $scope.getMessagesForCorrespondant($praticien);
              break;
            }
          }

          //confirmee


        }
      }

    };

  };
  $scope.getCorrespondants();

  //messages

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
//=========================================  1 Correspondants details
//=========================================
.controller('correspondantCtrl',function($scope,$http,$state,$stateParams,$ionicHistory,$filter,xmlParser,appAuthentification,docteurAuthentification)
{
  $scope.goBack = function()
  {
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

  if($scope.$praticienCorrespondant.messages.length > 0)
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
  .controller('nouveaMessageCtrl',function($scope,$http,$state,$stateParams,$ionicHistory,xmlParser,appAuthentification,docteurAuthentification)
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

;












