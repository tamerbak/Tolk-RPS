angular.module('inscriptioncontrollers', ['autocomplete'])


//========================================= 
//=========================================   Presentations
//========================================= 

.controller('presentationCtrl',function($scope,$state)
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

})
//========================================= 
//=========================================   Menu general
//========================================= 
.controller('menu_generalCtrl',function($scope,$state,$http,xmlParser,appAuthentification,docteurAuthentification)
{
  $scope.appauth = appAuthentification;
  $scope.doctauth = docteurAuthentification;
$scope.tel="003311111111";
$scope.mdp="1234";

 
  $scope.seconnecter = function(){
  if($scope.tel == null || $scope.mdp == null){
      alert("Vous devez remplir tous les champs");
  }else{
    $state.go('menu_general');
     if ($scope.appauth.sessionId != null)
    {
      
      $http({
          method  : 'POST',
          url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
          data    : "<fr.protogen.connector.model.DataModel><entity>user_compte</entity><dataMap/><rows /><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>"+ $scope.appauth.sessionId +"</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses><fr.protogen.connector.model.SearchClause><field>tel</field><clause>"+$scope.tel+"</clause><gt></gt><lt></lt><type>TEXT</type></fr.protogen.connector.model.SearchClause><fr.protogen.connector.model.SearchClause><field>mot_de_passe</field><clause></clause><gt>"+$scope.mdp+"</gt><lt></lt><type>TEXT</type></fr.protogen.connector.model.SearchClause></clauses><page>1</page><pages>5</pages><nbpages>5</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>",
          headers: {"Content-Type": 'text/xml'}
         })
          .success(function(data) 
          {
             datajson=xmlParser.xml_str2json(data);
             //Telephone
             $scope.telephone = datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow']['dataRow']['fr.protogen.connector.model.DataEntry'][6]['value'];
             $scope.tele = $scope.telephone.replace("<![CDATA[", "").replace("]]>", "");
             console.log("Telephone: "+$scope.tele);
             
             //Id_praticien
             $scope.fk_user_praticien = datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow']['dataRow']['fr.protogen.connector.model.DataEntry'][1]['value'];
             $scope.id_praticien = $scope.fk_user_praticien.replace("<![CDATA[", "").replace("]]>", "");
             console.log("Id_praticien: " + $scope.id_praticien);
             $scope.doctauth.id_prat = $scope.id_praticien;
             

             //Id_adresse
             $scope.fk_user_adresse = datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow']['dataRow']['fr.protogen.connector.model.DataEntry'][2]['value'];
             $scope.id_adresse = $scope.fk_user_adresse.replace("<![CDATA[", "").replace("]]>", "");
             console.log("Id_adresse: " + $scope.id_adresse);

             //Id_specialite
             $scope.fk_user_specialite = datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow']['dataRow']['fr.protogen.connector.model.DataEntry'][3]['value'];
             $scope.id_specialite = $scope.fk_user_specialite.replace("<![CDATA[", "").replace("]]>", "");
             console.log("Id_specialite: " + $scope.id_specialite);

             console.log(datajson);
             if($scope.doctauth.id_prat != null) $scope.praticienbyId();
          })
          .error(function(data) //
          {
            console.log(data);

             console.log("erreur");
          });
          
    };
  }
  };




  $scope.praticienbyId=function(){
    var req= "<fr.protogen.connector.model.DataModel><entity>user_praticien</entity><dataMap/><rows /><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>"+ $scope.appauth.sessionId +"</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses><fr.protogen.connector.model.SearchClause><field>pk_user_praticien</field><clause>"+$scope.doctauth.id_prat+"</clause><gt></gt><lt></lt><type>PK</type></fr.protogen.connector.model.SearchClause></clauses><page>1</page><pages>5</pages><nbpages>5</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>";
    console.log(req);
    console.log("=====>"+$scope.doctauth.id_prat);
    $http({
          method  : 'POST',
          url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
          data    : "<fr.protogen.connector.model.DataModel><entity>user_praticien</entity><dataMap/><rows /><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>"+ $scope.appauth.sessionId +"</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses><fr.protogen.connector.model.SearchClause><field>pk_user_praticien</field><clause></clause><gt>"+$scope.doctauth.id_prat+"</gt><lt>"+$scope.doctauth.id_prat+"</lt><type>PK</type></fr.protogen.connector.model.SearchClause></clauses><page>1</page><pages>5</pages><nbpages>5</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>",
          headers: {"Content-Type": 'text/xml'}
         })
         .success(function(data) 
          {
             datajson=xmlParser.xml_str2json(data);
             console.log("========praticiens=======");
             console.log(datajson);
             //Nom
             $scope.nom = datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow']['dataRow']['fr.protogen.connector.model.DataEntry'][1]['value'];
             $scope.nom_p = $scope.nom.replace("<![CDATA[", "").replace("]]>", "");
             console.log("Nom: "+$scope.nom_p);
             $scope.doctauth.nom = $scope.nom_p;
             //Prenom
             $scope.prenom = datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow']['dataRow']['fr.protogen.connector.model.DataEntry'][2]['value'];
             $scope.prenom_p = $scope.prenom.replace("<![CDATA[", "").replace("]]>", "");
             console.log("Prenom: "+$scope.prenom_p);
             $scope.doctauth.prenom = $scope.prenom_p;
          })
          .error(function(data) //
          {
            console.log(data);

             console.log("erreur");
          });

  };
})

//========================================= 
//=========================================   Inscriptions
//========================================= 

.controller('inscription1Ctrl',function($scope,$state,$http,xmlParser,docteurInscription,appGlobalData)
{
  
  $scope.dr = docteurInscription;
  $scope.agd = appGlobalData;
  $scope.specialities = [];

  $scope.buttonSpecialiteeDisabled = true;

    $scope.selectedSpecialitee=function()
    {
        $scope.specia = $scope.dr.specialite;
        console.log($scope.dr.specialite);
        $scope.buttonSpecialiteeDisabled = ($scope.dr.specialite != "") ?  false : true;
    };

    $scope.inscription2 = function()
    {
      $state.go('inscription2');
    };


  function getSpecialities()
  {
    console.log("getting the session");
    if ($scope.sessionId == null)
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
             $scope.sessionId = datajson['fr.protogen.connector.model.AmanToken'].sessionId;
             console.log($scope.sessionId);
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
    $requestdata = "<fr.protogen.connector.model.DataModel><entity>user_specialite</entity><dataMap/><rows/><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>" + $scope.sessionId + "</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses></clauses><page>1</page><pages>100</pages><nbpages>100</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>";

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
              $scope.setSpecialities(datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow']);
            }
            else
            {
              $scope.erreur = "Probleme serveur";
            }
             

             // $scope.sessionId = datajson['fr.protogen.connector.model.AmanToken'].sessionId;
             // console.log($scope.sessionId);
             // $scope.getSpecialitiesFromServer();

          })
          .error(function(data) //
          {
            console.log(data);
             console.log("erreur");
          });
  };

  $scope.setSpecialities = function(rows)
  {
    // console.log(rows['0']['dataRow']['']);
    console.log(JSON.stringify(rows));

    
    for(var i=0; i<rows.length; i++)
    {

      var a = {specialiteID:"",specialiteLibelle:""};
      // console.log(rows);
      a.specialiteID = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][1].value;
      a.specialiteID = a.specialiteID.replace("<![CDATA[", "").replace("]]>", "");

      a.specialiteLibelle = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][0].value;
      a.specialiteLibelle = a.specialiteLibelle.replace("<![CDATA[", "").replace("]]>", "");

      console.log(a);
      $scope.specialities.push(a);
    };

  };

  getSpecialities();

})


.controller('inscription2Ctrl',function($scope,$state,xmlParser,docteurInscription)
{
  $scope.dr = docteurInscription;

  $scope.buttonValiderDisabled = true;
  

  $scope.validValue = function()
  {
    if ($scope.dr.prenom != "" && $scope.dr.nom != "" && $scope.dr.titre != "") $scope.buttonValiderDisabled = false;
    else $scope.buttonValiderDisabled = true;
  };


  $scope.inscription3 = function()
  {
    $state.go('inscription3');
  };
  
})

//===================================== Inscription Controller 3

.controller('inscription3Ctrl',function($scope,$state,$http,xmlParser,docteurInscription)
{
  $scope.dr = docteurInscription;
  $scope.cps = [];
  $scope.districts = [];
  $scope.adresses = [];

  $scope.updateAdresses = function(typed)
  {
    console.log("getting the session");
    if ($scope.sessionId == null)
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
             $scope.sessionId = datajson['fr.protogen.connector.model.AmanToken'].sessionId;
             console.log($scope.sessionId);
             $scope.getAdressesFromServer();

          })
          .error(function(data) //
          {
            console.log(data);
             console.log("erreur");
          });
          
    }
    else
    {
      $scope.getAdressesFromServer();
    }
  };

  $scope.getAdressesFromServer = function()
  {
    var requestCP = "";
    var requestDistrict = "";
    var requestAdresse = "";

    if ($scope.dr.cp != "")
    {
      requestCP = "<fr.protogen.connector.model.SearchClause>" +
                  "<field>cp</field>" +
                  "<clause></clause>" +
                  "<gt>"+$scope.dr.cp+"</gt>" +
                  "<lt></lt>" +
                  "<type>TEXT</type>" +
                  "</fr.protogen.connector.model.SearchClause>";

    }

    if ($scope.dr.district != "")
    {
      requestDistrict = "<fr.protogen.connector.model.SearchClause>" +
                  "<field>district</field>" +
                  "<clause></clause>" +
                  "<gt>"+$scope.dr.district+"</gt>" +
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


    $requestdata = "<fr.protogen.connector.model.DataModel><entity>user_adresse</entity><dataMap/><rows/><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>" + $scope.sessionId + "</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses>"+ requestCP + requestDistrict + requestAdresse +"</clauses><page>1</page><pages>10</pages><nbpages>100</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>";
    
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
             

             // $scope.sessionId = datajson['fr.protogen.connector.model.AmanToken'].sessionId;
             // console.log($scope.sessionId);
             // $scope.getSpecialitiesFromServer();

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

    
    for(var i=0; i<rows.length; i++)
    {
      for (var j = 0; j < rows[i].dataRow['fr.protogen.connector.model.DataEntry'].length ; j++) 
      {
        if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "cp") 
        {
          var tempCP = "";
          tempCP = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
          tempCP = tempCP.replace("<![CDATA[", "").replace("]]>", "");

          console.log(tempCP);

            if ($scope.cps.indexOf(tempCP) < 0) 
            {
              $scope.cps.push(tempCP);
            }
        
          
        }
      }

      
    };
    

  };
  /*

  $scope.movies = ["Lord of the Rings",
                   "Drive",
                   "Science of Sleep",
                   "Back to the Future",
                        "Oldboy"];
                        */

        // gives another movie array on change
  $scope.updateMovies = function(typed)
  {
     /*       // MovieRetriever could be some service returning a promise
      $scope.newmovies = MovieRetriever.getmovies(typed);
      $scope.newmovies.then(function(data){
      $scope.movies = data;
      
    });*/
  }

  $scope.inscription4 = function()
  {
    $state.go('inscription4');
  };
  
})
.controller('inscription4Ctrl',function($scope,$state){
  
  $scope.inscription5 = function()
  {
    $state.go('inscription5');
  };

})
.controller('inscription5Ctrl',function($scope,$state){
  
  $scope.connexion = function()
  {
    $state.go('connexion');
  };

  $scope.accueil = function()
  {
    $state.go('accueil');
  };

})
/* Connexion */
.controller('connexionCtrl',function($scope,$state){
  
})
.controller('first_connexion_1Ctrl',function($scope,$state)
{
  $scope.first_connexion_1 = function()
  {
    $state.go('first_connexion_1');
  };
})
.controller('first_connexion_2Ctrl',function($scope,$state){
  $scope.first_connexion_2 = function()
  {
    $state.go('first_connexion_2');
  };
})
.controller('first_connexion_3Ctrl',function($scope,$state){
  $scope.first_connexion_3 = function()
  {
    $state.go('first_connexion_3');
  };
})
.controller('profileCtrl',function($scope,$state){
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