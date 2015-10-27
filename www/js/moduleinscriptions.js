angular.module('moduleinscriptions', ['autocomplete','uiGmapgoogle-maps','ngCordova'])


//=================================
//=================================    Insriptions
//=================================
.controller('inscription1Ctrl',function($ionicHistory,$scope,$state,$http,$ionicPopup,xmlParser,docteurInscription,appAuthentification,formatString)
{

  $scope.dr = docteurInscription;
  $scope.appauth = appAuthentification;
  $scope.specialites = [];
  $scope.specialites_id = [];
  $scope.lastNames = [];
  $scope.firstNames = [];
  $scope.civilites = ["Dr","Mr","Mme","Mlle"];

  $scope.updatespecialite=function(typed)
  {
    if ($scope.appauth.sessionId == "")
    {

      $http({
          method  : 'POST',
          url     : 'http://ns389914.ovh.net:8080/tolk/api/aman',
          data    : "<fr.protogen.connector.model.AmanToken><username>administration</username><password>1234</password><nom></nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId></sessionId><status></status><id>0</id><beanId>0</beanId></fr.protogen.connector.model.AmanToken>",
          headers: {"Content-Type": 'text/xml'}
         })
          .success(function(data)
          {
             $datajson=xmlParser.xml_str2json(data);
             $scope.appauth.sessionId = $datajson['fr.protogen.connector.model.AmanToken'].sessionId;
             $scope.getSpecialitiesFromServer(typed);

          })
          .error(function(data) //
          {
            console.log(data);
            console.log("erreur");

          });

    }
    else
    {
      $scope.getSpecialitiesFromServer(typed);
    }
  };

  $scope.getSpecialitiesFromServer = function(typed)
  {
    var requestSpecialite = "";
    if ($scope.dr.requestSpecialite != "")
    {
      requestSpecialite = "<fr.protogen.connector.model.SearchClause>" +
                  "<field>libelle</field>" +
                  "<clause></clause>" +
                  "<gt>"+ typed +"</gt>" +
                  "<lt></lt>" +
                  "<type>TEXT</type>" +
                  "</fr.protogen.connector.model.SearchClause>";

    }
    $requestdata = "<fr.protogen.connector.model.DataModel><entity>user_specialite</entity><dataMap/><rows/><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>" + $scope.appauth.sessionId + "</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses>"+requestSpecialite+"</clauses><page>1</page><pages>100</pages><nbpages>100</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>";

    $http({
          method  : 'POST',
          url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
          data    : $requestdata,
          headers: {"Content-Type": 'text/xml'}
         })
          .success(function(data)
          {

            datajson=formatString.formatServerResult(data);
            //console.log(jsonText);
            if (datajson.dataModel.status != "FAILURE")
            {
              $scope.setSpecialities(datajson.dataModel.rows.dataRow);
            }
            else
            {
              $scope.erreur = "Probleme serveur";
              console.log("Probleme serveur");
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
      for (var j = 0; j < rows[i].dataRow.dataEntry.length ; j++)
      {
        if (rows[i].dataRow.dataEntry[j].attributeReference == "libelle")
        {
          indexofSpecialite = j;
          continue;
        }
        if (rows[i].dataRow.dataEntry[j].attributeReference == "pk_user_specialite")
        {
          indexofSpecialiteID = j;
          continue;
        }
      }
      if (indexofSpecialite != -1 && indexofSpecialiteID != -1)
      {
          var tempSpecialite = "";
          tempSpecialite = rows[i].dataRow.dataEntry[indexofSpecialite].value;
          //tempSpecialite = tempSpecialite.replace("<![CDATA[", "").replace("]]>", "");

          var tempSpecialiteID = "";
          tempSpecialiteID = rows[i].dataRow.dataEntry[indexofSpecialiteID].value;
          //tempSpecialiteID = tempSpecialiteID.replace("<![CDATA[", "").replace("]]>", "");


            if ($scope.specialites.indexOf(tempSpecialite) < 0  && $scope.specialites.length < 7)
            {
              console.log("specialite :" + tempSpecialite + "    specialiteID :"+ tempSpecialiteID);
              $scope.specialites.push(tempSpecialite);
              $scope.specialites_id[tempSpecialite] = tempSpecialiteID;
            }
      }

    };

  };

  $scope.updateNomPrenom = function(typed)
  {
    console.log("Session: "+$scope.appauth.sessionId);
    if ($scope.appauth.sessionId == "")
    {

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
             console.log($scope.appauth.sessionId);
             $scope.getNomPrenomFromServer(typed);

          })
          .error(function(data) //
          {
            console.log(data);
             console.log("erreur");
          });

    }
    else
    {
      $scope.getNomPrenomFromServer(typed);
    }
  };

  $scope.getNomPrenomFromServer = function(typed)
  {
    var requestPrenom = "";
    var requestNom = "";
    var requestSpecialitee = "";
    if ($scope.dr.specialite != "" && $scope.specialites_id[$scope.dr.specialite] != null && $scope.specialites_id[$scope.dr.specialite] != "")
    {
      requestSpecialitee = "<fr.protogen.connector.model.SearchClause>" +
                  "<field>fk_user_specialite</field>" +
                  "<clause></clause>" +
                  "<gt>"+$scope.specialites_id[$scope.dr.specialite]+"</gt>" +
                  "<lt>"+$scope.specialites_id[$scope.dr.specialite]+"</lt>" +
                  "<type>fk_user_specialite</type>" +
                  "</fr.protogen.connector.model.SearchClause>";

    }

    if ($scope.dr.prenom != "")
    {
      requestPrenom = "<fr.protogen.connector.model.SearchClause>" +
                  "<field>prenom</field>" +
                  "<clause></clause>" +
                  "<gt>"+$scope.dr.prenom+"</gt>" +
                  "<lt></lt>" +
                  "<type>TEXT</type>" +
                  "</fr.protogen.connector.model.SearchClause>";

    }
    if ($scope.dr.nom != "")
    {
      requestNom = "<fr.protogen.connector.model.SearchClause>" +
                  "<field>nom</field>" +
                  "<clause></clause>" +
                  "<gt>"+$scope.dr.nom+"</gt>" +
                  "<lt></lt>" +
                  "<type>TEXT</type>" +
                  "</fr.protogen.connector.model.SearchClause>";

    }

    $requestdata = "<fr.protogen.connector.model.DataModel><entity>user_praticien</entity><dataMap/><rows/><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>" + $scope.appauth.sessionId + "</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation>"+
    "<clauses>"+ requestSpecialitee + requestPrenom + requestNom +"</clauses><page>1</page><pages>10</pages><nbpages>100</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>";
    console.log($requestdata);
    $http({
          method  : 'POST',
          url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
          data    : $requestdata,
          headers: {"Content-Type": 'text/xml'}
         })
          .success(function(data)
          {

            datajson=formatString.formatServerResult(data);
            if (datajson.dataModel.status != "FAILURE")
            {
                console.log(datajson);
                $scope.setNomEtPrenom(datajson.dataModel.rows.dataRow);
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

  $scope.setNomEtPrenom = function(rows)
  {
    // console.log(rows['0']['dataRow']['']);
      console.log(JSON.stringify(rows));

      $scope.firstNames.length = 0;
      $scope.lastNames.length = 0;

      console.log("rows lenght : "+ rows);

       if (rows == null) return;
      rows = [].concat( rows );
      console.log("rows lenght : "+ rows.length);
      for(var i=0; i<rows.length; i++)
      {
        console.log("rows lenght : "+ rows.length);
          for (var j = 0; j < rows[i].dataRow.dataEntry.length ; j++)
          {
            console.log("dataRow lenght : "+ rows[i].dataRow.dataEntry.length);
              if (rows[i].dataRow.dataEntry[j].attributeReference == "prenom")
              {
                  var tempPrenom = "";
                  tempPrenom = rows[i].dataRow.dataEntry[j].value;

                  if ($scope.firstNames.indexOf(tempPrenom) < 0 && $scope.firstNames.length < 10)
                  {
                      $scope.firstNames.push(tempPrenom);
                  }
              }

              if (rows[i].dataRow.dataEntry[j].attributeReference == "nom")
              {
                  var tempNom = "";
                  tempNom = rows[i].dataRow.dataEntry[j].value;


                  if ($scope.lastNames.indexOf(tempNom) < 0 && $scope.lastNames.length < 10)
                  {
                      $scope.lastNames.push(tempNom);
                  }
              }
          }
      };
      console.log("firstNames");
      console.log($scope.firstNames);
      console.log("lastNames");
      console.log($scope.lastNames);


  };

  $scope.goBack = function()
  {
    $ionicHistory.goBack();
  };

  $scope.inscription2 = function()
  {
    if ($scope.appauth.sessionId == "")
    {
      $state.go('accueil');
      return;
    }
    if ($scope.dr.prenom == "" || $scope.dr.nom == "" || $scope.dr.civilite == "" || $scope.dr.specialite == "")
    {
      var alertPopup = $ionicPopup.alert(
      {
        title: 'Tolk',
        template: "Vous devez remplir tous les champs!"
      });
      return
    }

    var requestPrenom = "";
    var requestNom = "";
    var requestSpecialitee = "";

    if (($scope.specialites_id[$scope.dr.specialite] == null) || ($scope.specialites_id[$scope.dr.specialite] == ""))
    {
      var alertPopup = $ionicPopup.alert(
      {
        title: 'Tolk',
        template: "La spécialité selectionnée n'existe pas."
      });
       alert("Spécialité n'existe pas");
       return;
    }

    requestSpecialitee = "<fr.protogen.connector.model.SearchClause>" +
                  "<field>fk_user_specialite</field>" +
                  "<clause></clause>" +
                  "<gt>"+$scope.specialites_id[$scope.dr.specialite]+"</gt>" +
                  "<lt>"+$scope.specialites_id[$scope.dr.specialite]+"</lt>" +
                  "<type>fk_user_specialite</type>" +
                  "</fr.protogen.connector.model.SearchClause>";
    $scope.dr.specialite_id = $scope.specialites_id[$scope.dr.specialite];


    requestPrenom = "<fr.protogen.connector.model.SearchClause>" +
                  "<field>prenom</field>" +
                  "<clause></clause>" +
                  "<gt>"+$scope.dr.prenom+"</gt>" +
                  "<lt></lt>" +
                  "<type>TEXT</type>" +
                  "</fr.protogen.connector.model.SearchClause>";
    requestNom = "<fr.protogen.connector.model.SearchClause>" +
                  "<field>nom</field>" +
                  "<clause></clause>" +
                  "<gt>"+$scope.dr.nom+"</gt>" +
                  "<lt></lt>" +
                  "<type>TEXT</type>" +
                  "</fr.protogen.connector.model.SearchClause>";

    $requestdata = "<fr.protogen.connector.model.DataModel><entity>user_praticien</entity><dataMap/><rows/><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>" + $scope.appauth.sessionId + "</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation>"+
    "<clauses>"+ requestSpecialitee + requestPrenom + requestNom +"</clauses><page>1</page><pages>10</pages><nbpages>100</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>";

    console.log($requestdata);

    $http({
          method  : 'POST',
          url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
          data    : $requestdata,
          headers: {"Content-Type": 'text/xml'}
         })
          .success(function(data)
          {

            datajson=formatString.formatServerResult(data);
            if (datajson.dataModel.status != "FAILURE")
            {
                console.log(datajson);
                $scope.setPraticienId(datajson.dataModel.rows.dataRow);
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

  $scope.setPraticienId = function(rows)
  {
      console.log(JSON.stringify(rows));

      $scope.firstNames.length = 0;
      $scope.lastNames.length = 0;

      console.log("rows lenght : "+ rows);

      if (rows == null)
      {   

        var alertPopup = $ionicPopup.alert(
        {
          title: 'Tolk',
          template: "Ce praticien n'existe pas!"
        });
        // $state.go('inscription2'); 
        return; 
      };

      rows = [].concat( rows );
      if (rows.length > 1) return;

      console.log("rows lenght : "+ rows.length);
      for (var j = 0; j < rows[0].dataRow.dataEntry.length ; j++)
      {
        console.log("dataRow lenght : "+ rows[0].dataRow.dataEntry.length);
        if (rows[0].dataRow.dataEntry[j].attributeReference == "pk_user_praticien")
        {

          $scope.dr.praticien_id = rows[0].dataRow.dataEntry[j].value;
        }
      }
      console.log("praticien_id: ");
      console.log($scope.dr.praticien_id);

      $state.go('inscription2');

  };

  $scope.accueil = function()
  {
    $state.go('accueil');
  };
})


//=========================================
//========================================= Inscription Controller 2
//=========================================
.controller('inscription2Ctrl',function($ionicHistory,$scope,$state,$http,$ionicPopup,$cordovaGeolocation,xmlParser,docteurInscription,appAuthentification,formatString)
{

  $scope.dr = docteurInscription;
  $scope.appauth = appAuthentification;
  $scope.cps = [];
  $scope.cps_id = [];
  $scope.villes = [];
  $scope.villes_id = [];
  $scope.adresses = [];
  $scope.adresses_id = [];
   $scope.adresses_num = "";

  $scope.buttonValiderDisabled = true;



  $scope.goBack = function() {
    $ionicHistory.goBack();
  };
  $scope.accueil = function()
  {
    $state.go('accueil');
  };

  $scope.inscription3 = function()
  {
    $scope.dr.adresse_id ="";
    console.log("adress : " + $scope.dr.adresse + "    adress is: " + $scope.adresses_id[$scope.dr.adresse]);


    if ($scope.dr.cp == "")
    {
        var alertPopup = $ionicPopup.alert(
        {
          title: 'Tolk',
          template: "Vous devez entrer un code postal."
        });
        // $state.go('inscription2'); 
        return; 
    }

    if ($scope.dr.ville == "")
    {
        var alertPopup = $ionicPopup.alert(
        {
          title: 'Tolk',
          template: "Vous devez choisir une ville."
        });
        // $state.go('inscription2'); 
        return; 
    }

    if ($scope.dr.adresse_num == "")
    {
        var alertPopup = $ionicPopup.alert(
        {
          title: 'Tolk',
          template: "Vous devez entrer le numéro de l'adresse."
        });
        // $state.go('inscription2'); 
        return; 
    }

    if ($scope.dr.adresse == "")
    {
        var alertPopup = $ionicPopup.alert(
        {
          title: 'Tolk',
          template: "Vous n'avez pas saisi votre adresse."
        });
        // $state.go('inscription2'); 
        return; 
    }


    requestCP = "<fr.protogen.connector.model.SearchClause>" +
                  "<field>cp</field>" +
                  "<clause></clause>" +
                  "<gt>"+$scope.dr.cp+"</gt>" +
                  "<lt>"+$scope.dr.cp+"</lt>" +
                  "<type>TEXT</type>" +
                  "</fr.protogen.connector.model.SearchClause>";
    requestVille = "<fr.protogen.connector.model.SearchClause>" +
                  "<field>district</field>" +
                  "<clause></clause>" +
                  "<gt>"+$scope.dr.ville+"</gt>" +
                  "<lt>"+$scope.dr.ville+"</lt>" +
                  "<type>TEXT</type>" +
                  "</fr.protogen.connector.model.SearchClause>";
    requestAdresse = "<fr.protogen.connector.model.SearchClause>" +
                  "<field>adresse</field>" +
                  "<clause></clause>" +
                  "<gt>"+$scope.dr.adresse+"</gt>" +
                  "<lt>"+$scope.dr.adresse+"</lt>" +
                  "<type>TEXT</type>" +
                  "</fr.protogen.connector.model.SearchClause>";
    requestAdresse_num = "<fr.protogen.connector.model.SearchClause>" +
                  "<field>num</field>" +
                  "<clause></clause>" +
                  "<gt>"+$scope.dr.adresse_num+"</gt>" +
                  "<lt>"+$scope.dr.adresse_num+"</lt>" +
                  "<type>TEXT</type>" +
                  "</fr.protogen.connector.model.SearchClause>";

    $requestdata = "<fr.protogen.connector.model.DataModel><entity>user_adresse</entity><dataMap/><rows/><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>" + $scope.appauth.sessionId + "</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses>"+
    requestCP + requestVille + requestAdresse + requestAdresse_num +"</clauses><page>1</page><pages>20</pages><nbpages>100</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>";
    console.log("request full adresse: " + $requestdata);
    $http(
    {
        method  : 'POST',
        url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
        data    : $requestdata,
        headers: {"Content-Type": 'text/xml'}
    })
    .success(function(data)
    {
        datajson=formatString.formatServerResult(data);
        if (datajson.dataModel.status != "FAILURE")
        {
            console.log(datajson.dataModel.rows.dataRow);

            rows = [].concat( datajson.dataModel.rows.dataRow.dataRow);
            
            if (rows.length == 1) 
            {
              adresse = datajson.dataModel.rows.dataRow.dataRow.dataEntry;

              for (var i = 0; i < adresse.length; i++) 
              {
                if (adresse[i].attributeReference == "pk_user_adresse")
                {
                  $scope.dr.adresse_id = adresse[i].value;
                  break;
                }
              };
              if ($scope.dr.adresse_id != "") 
              {
                $state.go('inscription3');
              }
            }
            else
            {
              var alertPopup = $ionicPopup.alert(
              {
                title: 'Tolk',
                template: "Adresse saisie n'est pas correcte."
              });
            }

        }
        else
        {
          var alertPopup = $ionicPopup.alert(
          {
            title: 'Tolk',
            template: "Probleme serveur."
          });
        }

    })
    .error(function(data) //
    {
        console.log("erreur");
    });

    $scope.dr.adresse_id = $scope.adresses_id[$scope.dr.adresse];
    
  };

  $scope.updateCPs = function(typed)
  {
    if ($scope.appauth.sessionId == '')
    {
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
             console.log($scope.appauth.sessionId);
             $scope.getCPsFromServer();

          })
          .error(function(data) //
          {
            console.log(data);
             console.log("erreur");
          });

    }
    else
    {
      $scope.getCPsFromServer();
    }
  };

  $scope.getCPsFromServer = function()
  {
    var requestCP = "";
    var requestAdresse = "";
    var requestVille= "";

    if ($scope.dr.cp != "")
    {
      requestCP = "<fr.protogen.connector.model.SearchClause>" +
                  "<field>libelle</field>" +
                  "<clause></clause>" +
                  "<gt>"+$scope.dr.cp+"</gt>" +
                  "<lt></lt>" +
                  "<type>TEXT</type>" +
                  "</fr.protogen.connector.model.SearchClause>";

    }
    /*
    if ($scope.dr.ville != "")
    {
      requestVille = "<fr.protogen.connector.model.SearchClause>" +
                  "<field>district</field>" +
                  "<clause></clause>" +
                  "<gt>"+$scope.dr.ville+"</gt>" +
                  "<lt></lt>" +
                  "<type>TEXT</type>" +
                  "</fr.protogen.connector.model.SearchClause>";

    }

    if ($scope.dr.adresse != "")
    {
      requestAdresse = "<fr.protogen.connector.model.SearchClause>" +
                  "<field>adresse</field>" +
                  "<clause></clause>" +
                  "<gt>"+$scope.dr.adresse+"</gt>" +
                  "<lt></lt>" +
                  "<type>TEXT</type>" +
                  "</fr.protogen.connector.model.SearchClause>";

    }
*/
    $requestdata = "<fr.protogen.connector.model.DataModel><entity>user_code_postal</entity><dataMap/><rows/><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>" + $scope.appauth.sessionId + "</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses>"+
     requestCP +"</clauses><page>1</page><pages>20</pages><nbpages>100</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>";
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
              $scope.setCPS(datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow']);
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

  $scope.setCPS = function(rows)
  {
    // console.log(rows['0']['dataRow']['']);
    console.log(JSON.stringify(rows));

    $scope.cps.length = 0;
    console.log("rows lenght : "+ rows);

    if (rows == null) return;

    rows = [].concat( rows );
    console.log("rows lenght : "+ rows.length);

    for(var i=0; i<rows.length; i++)
    {
      var indexofcp = -1;
      var indexofcpID = -1;
      for (var j = 0; j < rows[i].dataRow['fr.protogen.connector.model.DataEntry'].length ; j++)
      {
        if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "libelle")
        {
          indexofcp = j;
          continue;
        }
        if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "pk_user_code_postal")
        {
          indexofcpID = j;
          continue;
        }
      }
      if (indexofcp != -1 && indexofcpID != -1)
      {
          var tempCP = "";
          tempCP = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][indexofcp].value;
          tempCP = tempCP.replace("<![CDATA[", "").replace("]]>", "");

          var tempCPID = "";
          tempCPID = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][indexofcpID].value;
          tempCPID = tempCPID.replace("<![CDATA[", "").replace("]]>", "");


            if ($scope.cps.indexOf(tempCP) < 0  && $scope.cps.length < 7)
            {
              console.log("cp :" + tempCP + "    cpid :"+ tempCPID);
              $scope.cps.push(tempCP);
              $scope.cps_id[tempCP] = tempCPID;
            }
      }

    };


  };

  $scope.updateVilles = function(typed)
  {
    if ($scope.appauth.sessionId == '')
    {
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
             $scope.getVillesFromServer(typed);

          })
          .error(function(data) //
          {
            console.log(data);
             console.log("erreur");
          });

    }
    else
    {
      $scope.getVillesFromServer(typed);
    }
  };

  $scope.getVillesFromServer = function(typed)
  {
    var requestVille= "";

    if ($scope.dr.ville != "")
    {
      requestVille = "<fr.protogen.connector.model.SearchClause>" +
                  "<field>libelle</field>" +
                  "<clause></clause>" +
                  "<gt>"+typed+"</gt>" +
                  "<lt></lt>" +
                  "<type>TEXT</type>" +
                  "</fr.protogen.connector.model.SearchClause>";

    }
    /*
    if ($scope.dr.ville != "")
    {
      requestVille = "<fr.protogen.connector.model.SearchClause>" +
                  "<field>district</field>" +
                  "<clause></clause>" +
                  "<gt>"+$scope.dr.ville+"</gt>" +
                  "<lt></lt>" +
                  "<type>TEXT</type>" +
                  "</fr.protogen.connector.model.SearchClause>";

    }

    if ($scope.dr.adresse != "")
    {
      requestAdresse = "<fr.protogen.connector.model.SearchClause>" +
                  "<field>adresse</field>" +
                  "<clause></clause>" +
                  "<gt>"+$scope.dr.adresse+"</gt>" +
                  "<lt></lt>" +
                  "<type>TEXT</type>" +
                  "</fr.protogen.connector.model.SearchClause>";

    }
*/
    $requestdata = "<fr.protogen.connector.model.DataModel><entity>user_ville</entity><dataMap/><rows/><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>" + $scope.appauth.sessionId + "</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses>"+
     requestVille +"</clauses><page>1</page><pages>20</pages><nbpages>100</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>";
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
              console.log(datajson);
              $scope.setVilles(datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow']);
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

  $scope.setVilles = function(rows)
  {
    // console.log(rows['0']['dataRow']['']);
    console.log(JSON.stringify(rows));

    $scope.villes.length = 0;

    console.log("rows lenght : "+ rows);

    if (rows == null) return;

    rows = [].concat( rows );
    console.log("rows lenght : "+ rows.length);

    for(var i=0; i<rows.length; i++)
    {
      var indexofville = -1;
      var indexofvilleID = -1;
      for (var j = 0; j < rows[i].dataRow['fr.protogen.connector.model.DataEntry'].length ; j++)
      {
        if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "libelle")
        {
          indexofville = j;
          continue;
        }
        if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "pk_user_ville")
        {
          indexofvilleID = j;
          continue;
        }
      }
      if (indexofville != -1 && indexofvilleID != -1)
      {
          var tempVille = "";
          tempVille = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][indexofville].value;
          tempVille = tempVille.replace("<![CDATA[", "").replace("]]>", "");

          var tempVilleID = "";
          tempVilleID = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][indexofvilleID].value;
          tempVilleID = tempVilleID.replace("<![CDATA[", "").replace("]]>", "");


            if ($scope.villes.indexOf(tempVille) < 0  && $scope.villes.length < 7)
            {
              console.log("ville :" + tempVille + "    villeid :"+ tempVilleID);
              $scope.villes.push(tempVille);
              $scope.villes_id[tempVille] = tempVilleID;
            }
      }

    };


  };

  $scope.updateAdresses = function(typed)
  {
    console.log("Session: "+$scope.appauth.sessionId);
    if ($scope.appauth.sessionId == "")
    {

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
             console.log($scope.appauth.sessionId);
             $scope.getAdressesFromServer(typed);

          })
          .error(function(data) //
          {
            console.log(data);
             console.log("erreur");
          });

    }
    else
    {
      $scope.getAdressesFromServer(typed);
    }
  };

  $scope.getAdressesFromServer = function(typed)
  {
    var requestCP = "";
    var requestAdresse = "";
    var requestVille= "";

    if ($scope.dr.cp != "")
    {
      requestCP = "<fr.protogen.connector.model.SearchClause>" +
                  "<field>fk_user_code_postal</field>" +
                  "<clause></clause>" +
                  "<gt>"+$scope.cps_id[$scope.dr.cp]+"</gt>" +
                  "<lt>"+$scope.cps_id[$scope.dr.cp]+"</lt>" +
                  "<type>TEXT</type>" +
                  "</fr.protogen.connector.model.SearchClause>";

    }

    if ($scope.dr.ville != "")
    {
      requestVille = "<fr.protogen.connector.model.SearchClause>" +
                  "<field>district</field>" +
                  "<clause></clause>" +
                  "<gt>"+$scope.dr.ville+"</gt>" +
                  "<lt></lt>" +
                  "<type>TEXT</type>" +
                  "</fr.protogen.connector.model.SearchClause>";

    }

    if ($scope.dr.adresse != "")
    {
      requestAdresse = "<fr.protogen.connector.model.SearchClause>" +
                  "<field>adresse</field>" +
                  "<clause></clause>" +
                  "<gt>"+typed+"</gt>" +
                  "<lt></lt>" +
                  "<type>TEXT</type>" +
                  "</fr.protogen.connector.model.SearchClause>";

    }

    $requestdata = "<fr.protogen.connector.model.DataModel><entity>user_adresse</entity><dataMap/><rows/><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>" + $scope.appauth.sessionId + "</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses>"+
     requestCP + requestVille + requestAdresse+"</clauses><page>1</page><pages>20</pages><nbpages>100</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>";
    console.log("request adresse");
    console.log($requestdata);
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
              console.log(datajson);
              $scope.setAdresses(datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow']);
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

  $scope.setAdresses = function(rows)
  {
    // console.log(rows['0']['dataRow']['']);
    console.log(JSON.stringify(rows));

    $scope.adresses.length = 0;

    console.log("rows lenght : "+ rows);

    if (rows == null) return;

    rows = [].concat( rows );
    console.log("rows lenght : "+ rows.length);

    for(var i=0; i<rows.length; i++)
    {
      var indexofAd = -1;
      var indexofAdID = -1;

      for (var j = 0; j < rows[i].dataRow['fr.protogen.connector.model.DataEntry'].length ; j++)
      {
        if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "adresse")
        {
          indexofAd = j;
          continue;
        }
        if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "pk_user_adresse")
        {
          indexofAdID = j;
          continue;
        }

        if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "adresse")
        {
          var tempAdress = "";
          tempAdress = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
          tempAdress = tempAdress.replace("<![CDATA[", "").replace("]]>", "");

           console.log(tempAdress);

            if ($scope.adresses.indexOf(tempAdress) < 0 && $scope.adresses.length < 7)
            {
              $scope.adresses.push(tempAdress);
              console.log("adresses :" + tempAdress);
            }


        }
      }

      if (indexofAd != -1 && indexofAdID != -1)
      {
          var tempAdress = "";
          tempAdress = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][indexofAd].value;
          tempAdress = tempAdress.replace("<![CDATA[", "").replace("]]>", "");

          var tempAdressID = "";
          tempAdressID = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][indexofAdID].value;
          tempAdressID = tempAdressID.replace("<![CDATA[", "").replace("]]>", "");


            if ($scope.adresses.indexOf(tempAdress) < 0  && $scope.adresses.length < 7)
            {
              console.log("adresse :" + tempAdress + "    adresseid :"+ tempAdressID);
              $scope.adresses.push(tempAdress);
              $scope.adresses_id[tempAdress] = tempAdressID;
            }
      }


    };


  };

  $scope.showMap = function()
  {
      if ($scope.dr.cp == '' || $scope.dr.ville == '' || $scope.dr.adresse == '')// || $scope.dr.adresseCmp == '')
      {
          $scope.showMessageErrorAllFieldRequiered = true;
      }
      else
      {
          $state.go('inscription_map');
      }
  };



    // document.addEventListener("deviceready", onDeviceReady, false);

    $scope.aa= function () {
        /*
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
        });
         */
        var posOptions = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        };
        $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            var lat  = position.coords.latitude;
            var longi = position.coords.longitude;

            var myLatlng = new google.maps.LatLng(lat, longi);

            var mapOptions = {
                center: myLatlng,
                zoom: 16,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            // var map = new google.maps.Map(document.getElementById("map"), mapOptions);

            // $scope.map = map;
            $scope.map = { center: { latitude: lat, longitude: longi }, zoom: 16 };
            // $ionicLoading.hide();

        }, function(err) {
            // $ionicLoading.hide();
            console.log(err);
        });
    };
    $scope.aa();

})

//=====================================
//===================================== Inscription Controller 3
//=====================================
.controller('inscription3Ctrl',function($scope,$state,$ionicHistory,$ionicPopover,docteurInscription,appAuthentification)
{
  $scope.goBack = function()
  {
    $ionicHistory.goBack();
  }
  $scope.dr = docteurInscription;
  $scope.appauth = appAuthentification;

  $scope.validValue = function()
  {
    var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
    if (!re.test($scope.dr.email))
    {
        $scope.buttonValiderDisabled = true;
        $scope.emailError = true;
        return;
    }
    else
    {
        $scope.emailError = false;
    }

    if ($scope.dr.tel != "" && $scope.dr.email != "" && $scope.checkbox == true)
    {
        $scope.buttonValiderDisabled = false;
    }
    else $scope.buttonValiderDisabled = true;
  };
  $scope.validValue();


  var templateText ="Votre numéro de mobile sera utilisé pour l'<b>activation de votre compte</b>. Un SMS vous sera envoyé pour garantir la sécurité maximum de vos données.<br/><br/>Votre numéro de mobile restera à usage interne de la société TOLK exclusivement dans le cadre du bon fonctionement de nos services."
  var template = '<ion-popover-view class="tooltip-num-usage"><ion-content class="padding">'+templateText+'</ion-content></ion-popover-view>';

  $scope.popover = $ionicPopover.fromTemplate(template, {scope: $scope});

   $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });

  $scope.condition_generale = function()
  {
    $state.go('condition_generale');
  };

  $scope.inscription4 = function()
  {
    $state.go('inscription4');
  };

})

.controller('inscription4Ctrl',function($scope,$state,$http,xmlParser,docteurInscription,appAuthentification)
{

  $scope.dr = docteurInscription;
  // $scope.dr.civilite = "Dr";
  // $scope.dr.prenom = "Alexandre";
  // $scope.dr.nom = "Durand";
  $scope.appauth = appAuthentification;
  console.log("controller 4");

  $scope.connexion = function()
  {
    $state.go('connexion');
  };

  $scope.accueil = function()
  {
    $state.go('accueil');
  };

  $scope.inscriptionenligne =function()
  {

    console.log("Session: "+$scope.appauth.sessionId);
    if ($scope.appauth.sessionId == "")
    {

      $http({
          method  : 'POST',
          url     : 'http://ns389914.ovh.net:8080/tolk/api/aman',
          data    : "<fr.protogen.connector.model.AmanToken><username>administration</username><password>1234</password><nom></nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId></sessionId><status></status><id>0</id><beanId>0</beanId></fr.protogen.connector.model.AmanToken>",
          headers: {"Content-Type": 'text/xml'}
         })
          .success(function(data)
          {
             datajson=xmlParser.xml_str2json(data);
             $scope.appauth.sessionId= datajson['fr.protogen.connector.model.AmanToken'].sessionId;
             console.log($scope.appauth.sessionId);
             $scope.inscrireleclient();

          })
          .error(function(data) //
          {
            console.log(data);
             console.log("erreur");
          });

    }
    else
    {
      $scope.inscrireleclient();
    }
  };

  $scope.inscrireleclient = function()
  {
    var requestInscription = "";
    var requestPraticien = "";

    if ($scope.dr.praticien_id == "")
    {
      requestPraticien = "<fr.protogen.connector.model.DataEntry>" +
                                "<label>&lt;![CDATA[Praticien]]&gt;</label>" +
                                "<attributeReference>fk_user_praticien</attributeReference>" +
                                "<type>fk_user_praticien</type>" +
                                "<list/>" +
                                "<value>"+ $scope.dr.praticien_id+"</value>";
    }
    else
    {
        requestPraticien = "<fr.protogen.connector.model.DataEntry>" +
                                "<label>&lt;![CDATA[Praticien]]&gt;</label>" +
                                "<attributeReference>fk_user_praticien</attributeReference>" +
                                "<type>fk_user_praticien</type>" +
                                "<list/>" +
                                "<value>"+ $scope.dr.praticien_id+"</value>";
    }

      requestInscription = "<fr.protogen.connector.model.DataModel>" +
                        "<entity>user_compte</entity>" +
                        "<dataMap/>" +
                        "<rows>" +
                          "<fr.protogen.connector.model.DataRow>" +
                            "<dataRow>" +
                              "<fr.protogen.connector.model.DataEntry>" +
                                "<label>&lt;![CDATA[ID Compte]]&gt;</label>" +
                                "<attributeReference>pk_user_compte</attributeReference>" +
                                "<type>PK</type>" +
                                "<value></value>" +
                              "</fr.protogen.connector.model.DataEntry>" +

                              requestPraticien +

                              "</fr.protogen.connector.model.DataEntry>" +
                              "<fr.protogen.connector.model.DataEntry>" +
                                "<label>&lt;![CDATA[Adresse]]&gt;</label>" +
                                "<attributeReference>fk_user_adresse</attributeReference>" +
                                "<type>fk_user_adresse</type>" +
                                "<list/>" +
                                "<value>"+ $scope.dr.adresse_id+"</value>" +
                              "</fr.protogen.connector.model.DataEntry>" +
                              "<fr.protogen.connector.model.DataEntry>" +
                                "<label>&lt;![CDATA[Spécialité]]&gt;</label>" +
                                "<attributeReference>fk_user_specialite</attributeReference>" +
                                "<type>fk_user_specialite</type>" +
                                "<list/>" +
                                "<value>"+ $scope.dr.specialite_id+"</value>" +
                              "</fr.protogen.connector.model.DataEntry>" +

                              "<fr.protogen.connector.model.DataEntry>" +
                                "<label>&lt;![CDATA[Tél]]&gt;</label>" +
                                "<attributeReference>tel</attributeReference>" +
                                "<type>TEXT</type>" +
                                "<value>&lt;![CDATA["+$scope.dr.tel+"]]&gt;</value>" +
                              "</fr.protogen.connector.model.DataEntry>" +

                              "<fr.protogen.connector.model.DataEntry>" +
                                "<label>&lt;![CDATA[email]]&gt;</label>" +
                                "<attributeReference>email</attributeReference>" +
                                "<type>TEXT</type>" +
                                "<value>&lt;![CDATA["+$scope.dr.email+"]]&gt;</value>" +
                              "</fr.protogen.connector.model.DataEntry>" +

                              "<fr.protogen.connector.model.DataEntry>" +
                                "<label>&lt;![CDATA[lien]]&gt;</label>" +
                                "<attributeReference>lien</attributeReference>" +
                                "<type>TEXT</type>" +
                                "<value>&lt;![CDATA[/first_connexion_1]]&gt;</value>" +
                              "</fr.protogen.connector.model.DataEntry>" +

                              "<fr.protogen.connector.model.DataEntry>" +
                                "<label>&lt;![CDATA[Mot de passe]]&gt;</label>" +
                                "<attributeReference>mot_de_passe</attributeReference>" +
                                "<type>TEXT</type>" +
                                "<value>&lt;![CDATA[1234]]&gt;</value>" +
                              "</fr.protogen.connector.model.DataEntry>" +
                              "<fr.protogen.connector.model.DataEntry>" +
                                "<label>&lt;![CDATA[Horaire]]&gt;</label>" +
                                "<attributeReference>horaire</attributeReference>" +
                                "<type>TEXT</type>" +
                                "<value></value>" +
                              "</fr.protogen.connector.model.DataEntry>" +
                              "<fr.protogen.connector.model.DataEntry>" +
                                "<label>&lt;![CDATA[Expertise]]&gt;</label>" +
                                "<attributeReference>expertise</attributeReference>" +
                                "<type>TEXT</type>" +
                                "<value></value>" +
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

    console.log("requtte inscription");
    console.log(requestInscription);
    $http({
          method  : 'POST',
          url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
          data    : requestInscription,
          headers: {"Content-Type": 'text/xml'}
         })
          .success(function(data)
          {

            datajson=xmlParser.xml_str2json(data);
            if (datajson['fr.protogen.connector.model.DataModel'].status != "FAILURE")
            {
              console.log(datajson);
              // $scope.setAdresses(datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow']);
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


        }

        $scope.inscriptionenligne();


});
