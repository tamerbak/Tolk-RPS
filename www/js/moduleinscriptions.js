angular.module('moduleinscriptions', ['autocomplete','ngCordova','uiGmapgoogle-maps'])


//=================================
//=================================    Insriptions
//=================================
.controller('inscription1Ctrl',function($ionicHistory,$scope,$state,$http,popup,$ionicPopup,xmlParser,docteurInscription,appAuthentification,formatString)
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
    console.log("inscription2 function");
    if ($scope.appauth.sessionId == "")
    {
      $state.go('accueil');
      return;
    }
    if ($scope.dr.specialite == "")
    {
      popup.showpopup("Veuillez saisir votre specialité");
      return;
    }

    if ($scope.dr.nom == "")
    {
      popup.showpopup("Veuillez saisir votre nom");
      return;
    }

    if ($scope.dr.prenom == "")
    {
      popup.showpopup("Veuillez saisir votre prénom");
      return;
    }

    if ($scope.dr.civilite == "")
    {
      popup.showpopup("Veuillez saisir votre civilité");
      return;
    }

    var requestPrenom = "";
    var requestNom = "";
    var requestSpecialitee = "";
/*
    if (($scope.specialites_id[$scope.dr.specialite] == null) || ($scope.specialites_id[$scope.dr.specialite] == ""))
    {
      popup.showpopup("La spécialité selectionnée n'existe pas.");
      return;
    }
    */
    if (($scope.specialites_id[$scope.dr.specialite] == null) || ($scope.specialites_id[$scope.dr.specialite] == ""))
    {
      // popup.showpopup("La spécialité selectionnée n'existe pas.");
      //return;
      requestSpecialitee = "";
      $scope.dr.specialite_id = "";

    }
    else
    {
      requestSpecialitee = "<fr.protogen.connector.model.SearchClause>" +
                  "<field>fk_user_specialite</field>" +
                  "<clause></clause>" +
                  "<gt>"+$scope.specialites_id[$scope.dr.specialite]+"</gt>" +
                  "<lt>"+$scope.specialites_id[$scope.dr.specialite]+"</lt>" +
                  "<type>fk_user_specialite</type>" +
                  "</fr.protogen.connector.model.SearchClause>";
      $scope.dr.specialite_id = $scope.specialites_id[$scope.dr.specialite];
    }

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
                console.log("inscription2 http success success");
                console.log(datajson);
                $scope.setPraticienId(datajson.dataModel.rows.dataRow);
            }
            else
            {
                console.log("inscription2 http success FAILURE");
                $scope.erreur = "Probleme serveur";
            }

          })
          .error(function(data) //
          {
            console.log("inscription2 http error");
            console.log(data);
             console.log("erreur");
          });



  };

  $scope.setPraticienId = function(rows)
  {
    console.log("setPraticienId function");
      console.log(JSON.stringify(rows));

      $scope.firstNames.length = 0;
      $scope.lastNames.length = 0;

      console.log("rows lenght : "+ rows);

      if (rows == null)
      {   

        // popup.showpopup("Ce praticien n'existe pas!");
         $scope.dr.praticien_id = "";
         $state.go('inscription2'); 
        return; 
      }
      else
      {
        rows = [].concat( rows );
        // if (rows.length > 1) return;

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

        $scope.compte_existant_verification($scope.dr.praticien_id);
      }

  };

  $scope.compte_existant_verification = function(praticien_id)
  {
        //verification de l'email
    $scope.message_de_verification = "Vérification du compte";
    requestcompteverification = "<fr.protogen.connector.model.SearchClause>" +
                            "<field>fk_user_praticien</field>" +
                            "<clause></clause>"  +
                            "<gt>"+praticien_id+"</gt>" +
                            "<lt>"+praticien_id+"</lt>" +
                            "<type>fk_user_praticien</type>"  +
                            "</fr.protogen.connector.model.SearchClause>";

    $requestdatacompte = "<fr.protogen.connector.model.DataModel><entity>user_compte</entity><dataMap/><rows/><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>" + $scope.appauth.sessionId + "</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation>"+
    "<clauses>"+ requestcompteverification +"</clauses><page>1</page><pages>10</pages><nbpages>100</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>";

    $http(
    {
        method  : 'POST',
        url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
        data    :  $requestdatacompte,
        headers: {"Content-Type": 'text/xml'}
    })
    .success(function(data)
    {
      $scope.message_de_verification = "";
      datajson=formatString.formatServerResult(data);
      console.log("answer"+datajson);
        if (datajson.dataModel.status != "FAILURE")
        {
          console.log(datajson);
          if (datajson.dataModel.rows != "") 
          {
             popup.showpopup("Ce praticien a déjà un compte, si vous avez oublié vos identifiants, allez sur la page connexion et choisissez mot de passe oublié.");
             return;
          }
          else
          {
              $state.go('inscription2');
          }
        }
        else
        {
            popup.showpopup("Probleme de connexion");
            return;
        }

    })
    .error(function(data) //
    {
      $scope.message_de_verification = "";
        popup.showpopup("Probleme de connexion, vérifier cotre connexion et réessayer");
        return;
    });

  };



  $scope.accueil = function()
  {
    $state.go('accueil');
  };
})


//=========================================
//========================================= Inscription Controller 2
//=========================================
.controller('inscription2Ctrl',function($ionicHistory,$scope,$state,$http,popup,$ionicPopup,$cordovaGeolocation,xmlParser,docteurInscription,appAuthentification,formatString)
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

  $scope.focusOnNum = function()
  {
    console.log("num clicked");
    $scope.dr.adresse_num = "";
  }

  $scope.goBack = function() {
    $ionicHistory.goBack();
  };
  
  $scope.accueil = function()
  {
    $state.go('accueil');
  };
   
   $scope.addAdress=function(){

        requestAddAdress = "<fr.protogen.connector.model.DataModel>" +
            "<entity>user_adresse</entity>" +
            "<dataMap/>" +
            "<rows>" +
            "<fr.protogen.connector.model.DataRow>" +
            "<dataRow>" +

            "<fr.protogen.connector.model.DataEntry>" +
            "<label>&lt;![CDATA[Adresse]]&gt;</label>" +
            "<attributeReference>adresse</attributeReference>" +
            "<type>TEXT</type>" +
            "<value>"+$scope.dr.adresse+"</value>" +
            "</fr.protogen.connector.model.DataEntry>" +

            "<fr.protogen.connector.model.DataEntry>" +
            "<label>&lt;![CDATA[Num]]&gt;</label>" +
            "<attributeReference>num</attributeReference>" +
            "<type>TEXT</type>" +
            "<list/>" +
            "<value>"+ $scope.dr.adresse_num+"</value>"+
            "</fr.protogen.connector.model.DataEntry>" +

            "<fr.protogen.connector.model.DataEntry>" +
            "<label>&lt;![CDATA[Code postal]]&gt;</label>" +
            "<attributeReference>cp</attributeReference>" +
            "<type>TEXT</type>" +
            "<list/>" +
            "<value>"+ $scope.dr.cp+"</value>" +
            "</fr.protogen.connector.model.DataEntry>" +

            "<fr.protogen.connector.model.DataEntry>" +
            "<label>&lt;![CDATA[Ville]]&gt;</label>" +
            "<attributeReference>district</attributeReference>" +
            "<type>TEXT</type>" +
            "<list/>" +
            "<value>"+$scope.dr.ville+"</value>" +
            "</fr.protogen.connector.model.DataEntry>" +

            "<fr.protogen.connector.model.DataEntry>" +
            "<label>&lt;![CDATA[Présent dans la base de données]]&gt;</label>" +
            "<attributeReference>present_dans_la_base_de_donnees</attributeReference>" +
            "<type>TEXT</type>" +
            "<list/>" +
            "<value>Non</value>" +
            "</fr.protogen.connector.model.DataEntry>"+

            "<fr.protogen.connector.model.DataEntry>" +
            "<label>&lt;![CDATA[Validée]]&gt;</label>" +
            "<attributeReference>validee</attributeReference>" +
            "<type>TEXT</type>" +
            "<value>"+$scope.adresse_valide+"</value>" +
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
        console.log(requestAddAdress);
        $http({
            method  : 'POST',
            url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
            data    : requestAddAdress,
            headers: {"Content-Type": 'text/xml'}
        })
            .success(function(data)
            {
                datajson=formatString.formatServerResult(data);
                console.log(datajson);
                adresse = datajson.dataModel.status;

                console.log("adresse : "+ adresse);
                $scope.dr.adresse_id = datajson.dataModel.status;
                $state.go('inscription3');
            })
            .error(function(data) //
            {
                console.log(data);
                console.log("erreur http compte");
                popup.showpopup("Une erreur est survenue, veuillez réesseyer SVP");

            });
    };
    $scope.validerAdresse= function(){
        var address =$scope.dr.adresse_num +" "+$scope.dr.adresse+", "+$scope.dr.ville+", "+$scope.dr.cp; //ADDRESS, CITY, STATE ZIP
        $scope.queryResults = {};
        $scope.queryError = {};
        $scope.adresse_valide="";
        $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyBZVOSPh0Z4mv9jljJWzZNSug6upuec7Sg')
            .then(function(_results){
                try {
                    $scope.queryResults = _results.data.results;
                    var location = $scope.queryResults[0].geometry.location;
                    $scope.lat = location.lat;
                    $scope.lng = location.lng;
                    if ($scope.queryResults[0].geometry.location_type != "APPROXIMATE")
                        $scope.adresse_valide = "Oui";
                    else
                        $scope.adresse_valide = "Non";
                    console.log("$scope.adresse_valide 1: "+$scope.adresse_valide);
                    $scope.addAdress();

                }catch(err) {
                    $scope.adresse_valide = "Non";
                    console.log("$scope.adresse_valide : "+$scope.adresse_valide);
                    $scope.addAdress();
                }
            },
            function error(_error){
                console.log("address 2 : "+address);

                $scope.queryError = _error;
                $scope.adresse_valide="Non";
                $scope.addAdress();
            });
    }
  $scope.inscription3 = function()
  {
    $scope.dr.adresse_id ="";
    console.log("adress : " + $scope.dr.adresse + "    adress is: " + $scope.adresses_id[$scope.dr.adresse]);


    if ($scope.dr.cp == "")
    {

        popup.showpopup("Veuillez saisir votre code postal.");
        return; 
    }

    if ($scope.dr.ville == "")
    {
        popup.showpopup("Veuillez saisir votre ville.");
        return; 
    }

    if ($scope.dr.adresse == "")
    {
        popup.showpopup("Veuillez saisir votre adresse.");
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
            if (datajson.dataModel.rows == "") // si l adresse n'existe pas dans la base de données
            {
                //popup.showpopup("L'adresse saisie n'existe pas");

                // tester la validation par google map de l adresse
                $scope.validerAdresse();
                return;
            }

            rows = [].concat( datajson.dataModel.rows.dataRow.dataRow);
            
            // if (rows.length == 1) 
            // {
              adresse = rows[0].dataEntry;

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
            // }
            // else
            // {
            //   popup.showpopup("Adresse saisie n'est pas correcte.");
            // }

        }
        else
        {
          popup.showpopup("Probleme serveur.");
        }

    })
    .error(function(data) //
    {
        popup.showpopup("Probleme serveur.");
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
            datajson=formatString.formatServerResult(data);
            if (datajson.dataModel.status != "FAILURE")
            {
              console.log(datajson);
              $scope.setVilles(datajson.dataModel.rows.dataRow);
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
      for (var j = 0; j < rows[i].dataRow.dataEntry.length ; j++)
      {
        if (rows[i].dataRow.dataEntry[j].attributeReference == "libelle")
        {
          indexofville = j;
          continue;
        }
        if (rows[i].dataRow.dataEntry[j].attributeReference == "pk_user_ville")
        {
          indexofvilleID = j;
          continue;
        }
      }
      if (indexofville != -1 && indexofvilleID != -1)
      {
          var tempVille = "";
          tempVille = rows[i].dataRow.dataEntry[indexofville].value;

          var tempVilleID = "";
          tempVilleID = rows[i].dataRow.dataEntry[indexofvilleID].value;

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
          popup.showpopup("Veuillez saisir les champs requis");

      }
      else
      {
          //var address ="1334 Emerson St, NE Washington DC"; //ADDRESS, CITY, STATE ZIP
          var address =$scope.dr.adresse_num +" "+$scope.dr.adresse+", "+$scope.dr.ville+", "+$scope.dr.cp; //ADDRESS, CITY, STATE ZIP
          console.log(address);
          $scope.location = {};
          $scope.queryResults = {};
          $scope.queryError = {};

          $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' +
              address + '&key=AIzaSyBZVOSPh0Z4mv9jljJWzZNSug6upuec7Sg')
              .then(function(_results){
                  $scope.queryResults = _results.data.results;
                  var location = $scope.queryResults[0].geometry.location;
                  console.log("test : "+$scope.queryResults[0].geometry.location_type);
                  console.log(location);
                  $scope.lat=location.lat;
                  $scope.lng=location.lng;
                  if($scope.queryResults[0].geometry.location_type!="APPROXIMATE")
                    $state.go('inscription_map',  {'lat':$scope.lat,'lng':$scope.lng});
                  else
                      popup.showpopup("Google Map ne reconnait pas votre adresse. Veuillez confirmer que c'est bien votre adresse.");
              },
              function error(_error){
                  $scope.queryError = _error;
                  popup.showpopup("Google Map ne reconnait pas votre adresse. Veuillez confirmer que c'est bien votre adresse.");

              });
      }
  };



    // document.addEventListener("deviceready", onDeviceReady, false);



})
//=====================================
//===================================== Inscription Controller map
//=====================================
.controller('inscriptionMapCtrl',function($scope,$http,$state,$stateParams,$ionicHistory,$cordovaGeolocation)
    {
        $scope.mapInit= function () {

            $scope.map = { center: { latitude: $stateParams.lat, longitude: $stateParams.lng }, zoom: 16 };
        };
        $scope.goBack = function()
        {
            console.log('back');
            $ionicHistory.goBack();
        }
        $scope.mapInit();

})
//=====================================
//===================================== Inscription Controller 3
//=====================================
.controller('inscription3Ctrl',function($scope,$state,$http,$ionicHistory,formatString,$ionicPopover,popup,docteurInscription,appAuthentification)
{

  $scope.dr = docteurInscription;
  $scope.appauth = appAuthentification;


  $scope.goBack = function()
  {
    $ionicHistory.goBack();
  }

  $scope.accueil = function()
  {
    $ionicHistory.goBack(-3);
  }

  $scope.focusOntel = function()
  {
    console.log("num clicked");
    $scope.dr.tel = "";
  }

  $scope.focusOnemail = function()
  {
    console.log("num clicked");
    $scope.dr.email = "";
  }

  $scope.validValue = function()
  {
    var re = /^([a-zA-Z0-9])+([a-zA-Z0-9._%+-])+\@([a-zA-Z0-9_.-])+\.(([a-zA-Z]){2,6})$/;
    if (!re.test($scope.dr.email) && $scope.dr.email != "")
    {
        $scope.emailError = true;
        return;
    }
    else
    {
        $scope.emailError = false;
    }

  };

  var templateText ="Votre numéro de mobile est votre identifiant, il sera utilisé pour l'<b>activation de votre compte</b>. Un SMS vous sera envoyé pour garantir la sécurité maximum de vos données.<br/><br/>Votre numéro de mobile restera à usage interne de la société TOLK exclusivement dans le cadre du bon fonctionement de nos services."
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

    //TEL :
    $scope.$watch('dr.tel', function(){
        if ($scope.dr.tel){
            $scope.dr.tel = $scope.dr.tel.replace("-","").replace(".","").replace("+","").replace(" ","").
            replace("(","").replace(")","").replace("/","").replace(",","").
            replace("#","").replace("*","").replace(";","").replace("N","");
            if ($scope.dr.tel.length == 10){
                if ($scope.dr.tel.substring(0, 1) == '0'){
                    $scope.dr.tel = $scope.dr.tel.substring(1,10);
                } else {
                    $scope.dr.tel = $scope.dr.tel.substring(0,9);
                }
            } else if ($scope.dr.tel.length > 10) {
                $scope.dr.tel = $scope.dr.tel.substring(0,9);
            } else if ($scope.dr.tel.length == 9){
                $scope.phoneError = false;
            } else {
                $scope.phoneError = true;
            }
        }


    });

  $scope.inscription4 = function()
  {
    tel = $scope.adresse_indicatif + $scope.dr.tel;
    email = $scope.dr.email;

    var re = /^([a-zA-Z0-9])+([a-zA-Z0-9._%+-])+\@([a-zA-Z0-9_.-])+\.(([a-zA-Z]){2,6})$/;

    if ($scope.dr.tel == "")
    {
        popup.showpopup("Veuillez saisir votre numéro de téléphone.");
        return; 
    }

    if ($scope.dr.email == "")
    {
        popup.showpopup("Veuillez saisir votre email."); 
        return; 
    }

    if (!re.test($scope.dr.email))
    {
        popup.showpopup("Cette adresse est invalide.");
        return; 
    }

    if ($scope.checkbox != true)
    {
        popup.showpopup("Vous ne pouvez pas continuer sans accepter les conditions générales d'utilisation"); 
        return; 
    }

    //do the verification
    $scope.message_de_verification = "Vérification de numéro de tel ...";
    //verification d'unicité de numero de tel

    requesttelverification = "<fr.protogen.connector.model.SearchClause>" +
                            "<field>tel</field>" +
                            "<clause></clause>" +
                            "<gt>"+tel+"</gt>" +
                            "<lt>"+tel+"</lt>" +
                            "<type>TEXT</type>" +
                            "</fr.protogen.connector.model.SearchClause>";

    $requestdata = "<fr.protogen.connector.model.DataModel><entity>user_compte</entity><dataMap/><rows/><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>" + $scope.appauth.sessionId + "</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation>"+
    "<clauses>"+ requesttelverification +"</clauses><page>1</page><pages>10</pages><nbpages>100</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>";

    $http(
    {
        method  : 'POST',
        url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
        data    :  $requestdata,
        headers: {"Content-Type": 'text/xml'}
    })
    .success(function(data)
    {
      datajson=formatString.formatServerResult(data);

      $scope.message_de_verification = "";
        if (datajson.dataModel.status != "FAILURE")
        {
          console.log(datajson);
          if (datajson.dataModel.rows != "") 
          {
             popup.showpopup("Le numéro de telephone existe déjà");
             return;
          }
          else
          {
              $scope.emailExistenceVerification(email);
          }
        }
        else
        {
            popup.showpopup("Probleme de connexion");
            return;
        }

    })
    .error(function(data) //
    {
        $scope.message_de_verification = "Vérification de numéro de tel";
        popup.showpopup("Probleme de connexion, vérifier cotre connexion et réessayer");
        return;
    });

  };

  $scope.emailExistenceVerification = function(email)
  {
      //verification de l'email
    $scope.message_de_verification = "Vérification d'email";
    requestemailverification = "<fr.protogen.connector.model.SearchClause>" +
                            "<field>email</field>" +
                            "<clause></clause>"  +
                            "<gt>"+email+"</gt>" +
                            "<lt>"+email+"</lt>" +
                            "<type>TEXT</type>"  +
                            "</fr.protogen.connector.model.SearchClause>";

    $requestdataemail = "<fr.protogen.connector.model.DataModel><entity>user_compte</entity><dataMap/><rows/><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>" + $scope.appauth.sessionId + "</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation>"+
    "<clauses>"+ requestemailverification +"</clauses><page>1</page><pages>10</pages><nbpages>100</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>";

    $http(
    {
        method  : 'POST',
        url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
        data    :  $requestdataemail,
        headers: {"Content-Type": 'text/xml'}
    })
    .success(function(data)
    {
      $scope.message_de_verification = "";
      datajson=formatString.formatServerResult(data);
      console.log("answer"+datajson);
        if (datajson.dataModel.status != "FAILURE")
        {
          console.log(datajson);
          if (datajson.dataModel.rows != "") 
          {
             popup.showpopup("L'email saisi existe déjà");
             return;
          }
          else
          {
              $state.go('inscription4');
          }
        }
        else
        {
            popup.showpopup("Probleme de connexion");
            return;
        }

    })
    .error(function(data) //
    {
      $scope.message_de_verification = "";
        popup.showpopup("Probleme de connexion, vérifier cotre connexion et réessayer");
        return;
    });

    
  };


})

.controller('inscription4Ctrl',function($scope,$state,$ionicHistory,$http,xmlParser,docteurInscription,appAuthentification)
{

  $scope.dr = docteurInscription;
  $scope.showRefresh = false;
  $scope.erreur_numero = "";
  // $scope.dr.civilite = "Dr";
  // $scope.dr.prenom = "Alexandre";
  // $scope.dr.nom = "Durand";
  $scope.appauth = appAuthentification;
  console.log("controller 4");


  $scope.accueil = function()
  {
    docteurInscription = {};
    $scope.dr.specialite = '';
    $scope.dr.specialite_id = '';
    $scope.dr.civilite = '';
    $scope.dr.nom = '';
    $scope.dr.prenom = '';
    $scope.dr.praticien_id = '';
    $scope.dr.adresse_id = '';
    $scope.dr.cp = '';
    $scope.dr.ville = '';
    $scope.dr.adresse = '';
    $scope.dr.adresse_num = '';
    $scope.dr.tel = '';
    $scope.dr.email = '';
    $state.go('accueil')
    // $ionicHistory.goBack(-4);
  };

  $scope.inscriptionenligne =function()
  {
    $scope.showRefresh = false;

    console.log("Session: "+$scope.appauth.sessionId);
    $scope.message_de_confirmation = "Veuillez patienter pendant la création de votre compte";
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
             $scope.inscrirelepraticien();

          })
          .error(function(data) //
          {
            console.log(data);
             console.log("erreur");
          });

    }
    else
    {
      $scope.inscrirelepraticien();
    }
  };

  $scope.absentpresent = "present a valider";

  $scope.inscrirelepraticien = function()
  {
    console.log("inscrirelepraticien");
/*
     = "DR";
     = "aaaaa";
    = "aaaaaaa";
     = "nvSpec";

*/
console.log($scope.dr.civilite);
console.log($scope.dr.nom);
  console.log($scope.dr.prenom);
    console.log($scope.dr.specialite);

    var datarequestpraticien="";
    datarequestpraticien = $scope.dr.civilite+';'+$scope.dr.nom+';'+$scope.dr.prenom+';'+$scope.dr.specialite;
    console.log(datarequestpraticien);

    if ($scope.dr.praticien_id == "")
    {
        $http(
        {
          method  : 'POST',
          url     : 'http://ns389914.ovh.net:8080/tolk/api/gde',
          data    : datarequestpraticien,
          headers: {"Content-Type": "text/plain"}
        })
        .success(function(data)
        {
            console.log("success http gde");
            
            if (data.status == "SUCCES") 
            {
              console.log("success status gde");
                $scope.dr.praticien_id = data.id;
                $scope.absentpresent = "absent a valider";
                $scope.sauvegarderlecompte();
            }
            else
            {
                console.log("success status gde");
                $scope.message_de_confirmation = "Une erreur est survenue, veuillez réesseyer SVP";
                $scope.showRefresh = true;
            }
            
        })
        .error(function(data) 
        {
             console.log("erreur http gde");
             $scope.message_de_confirmation = "Une erreur est survenue, veuillez réesseyer SVP";
             $scope.showRefresh = true;

        });
    }
    else
    {
        $scope.absentpresent = "present a valider";
        $scope.sauvegarderlecompte();
    }

  };

  $scope.sauvegarderlecompte = function()
  {
    console.log("sauvegarderlecompte");
    var requestInscription = "";
    var requestPraticien = "";
    
    $scope.message_de_confirmation = "Vous allez recevoir un SMS de connexion";

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

                              "<fr.protogen.connector.model.DataEntry>" +
                                  "<label>&lt;![CDATA[Praticien]]&gt;</label>" +
                                  "<attributeReference>fk_user_praticien</attributeReference>" +
                                  "<type>fk_user_praticien</type>" +
                                  "<list/>" +
                                  "<value>"+ $scope.dr.praticien_id+"</value>"+
                              "</fr.protogen.connector.model.DataEntry>" +

                              "<fr.protogen.connector.model.DataEntry>" +
                                  "<label>&lt;![CDATA[Adresse]]&gt;</label>" +
                                  "<attributeReference>fk_user_adresse</attributeReference>" +
                                  "<type>fk_user_adresse</type>" +
                                  "<list/>" +
                                  "<value>"+ $scope.dr.adresse_id+"</value>" +
                              "</fr.protogen.connector.model.DataEntry>" +

                              "<fr.protogen.connector.model.DataEntry>" +
                                  "<label>&lt;![CDATA[Lien]]&gt;</label>" +
                                  "<attributeReference>lien</attributeReference>" +
                                  "<type>TEXT</type>" +
                                  "<list/>" +
                                  "<value>"+ $scope.absentpresent+"</value>" +
                              "</fr.protogen.connector.model.DataEntry>" +

                              "<fr.protogen.connector.model.DataEntry>" +
                                  "<label>&lt;![CDATA[Activation]]&gt;</label>" +
                                  "<attributeReference>activation</attributeReference>" +
                                  "<type>TEXT</type>" +
                                  "<list/>" +
                                  "<value>Non</value>" +
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
              $scope.message_de_confirmation = "Vous allez recevoir un SMS de connexion";

              // $scope.setAdresses(datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow']);
            }
            else
            {
              console.log("erreur success compte");
              $scope.message_de_confirmation = "Une erreur est survenue, veuillez réesseyer SVP";
              $scope.showRefresh = true;
            }

          })
          .error(function(data) //
          {
             console.log(data);
             console.log("erreur http compte");
             $scope.message_de_confirmation = "Une erreur est survenue, veuillez réesseyer SVP";
             $scope.showRefresh = true;

          });

    };

        $scope.inscriptionenligne();
        /*
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
                              */


});




