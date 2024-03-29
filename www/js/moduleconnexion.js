angular.module('moduleconnexion',['fileServices'])
//=========================================
//=========================================   connexion
//=========================================
.controller('connexionCtrl',function($scope,$state,$http,$ionicHistory,$cordovaDialogs,
                                     formatString,xmlParser,appAuthentification,
                                     docteurAuthentification, UploadFile, localStorageService)
{
  $scope.appauth = appAuthentification;
  $scope.doctauth = docteurAuthentification;

//$scope.params.tel="003311111111";
 $scope.params = {};
 $scope.params.tel = "";
 $scope.params.mdp = "";
 $scope.params.rememberPwd = true;

    /**
     * Init des infos de l'utilisateur depuis le localStorage
     */
    var user_infos = localStorageService.get("user_infos");
    if(user_infos && user_infos.rememberPwd) {
            $scope.params.tel = user_infos.user_tel;
            $scope.params.mdp = user_infos.user_pwd;
            $scope.params.rememberPwd = user_infos.rememberPwd;
    }

    $scope.$watch('params.tel', function(newValue, oldValue) {
        var user_infos = localStorageService.get("user_infos");
        if(user_infos && (newValue == user_infos.user_tel)) {
            $scope.params.mdp = user_infos.user_pwd;
        }
        else {
            $scope.params.mdp = "";
        }
    });

 $scope.accueil = function()
  {
    $ionicHistory.goBack();
  };

  $scope.reinitialisermdp = function()
  {
    $state.go('reinitialisermdp');
    //alert("vous pouvez réinitialiser votre mot de passe en activant le lien dans le message envoyé à votre adresse.");
  }

  $scope.goBack = function()
  {
    $ionicHistory.goBack();
  };


  $scope.first_connexion_1 = function()
  {
    $state.go('first_connexion_1/:praticien_id');
  };

  $scope.textchanged = function()
  {
    $scope.msg = "";
  };

  			$scope.getCorrespondantsFromServer = function(id_compte){
				var requestCorrespondants = "";
				// console.log("id compte"+$scope.doctauth.id_compte);
				if (id_compte != "" ){
				  requestCorrespondants = "<fr.protogen.connector.model.SearchClause>" +
					"<field>fk_user_compte</field>" +
					"<clause>"+id_compte+"</clause>" +
					"<gt>"+id_compte+"</gt>" +
					"<lt>"+id_compte+"</lt>" +
					"<type>TEXT</type>" +
					"</fr.protogen.connector.model.SearchClause>";
				  console.log(requestCorrespondants);

				}
				else
					$state.go('accueil');
				
				$requestdata = "<fr.protogen.connector.model.DataModel><entity>user_correspondance</entity><dataMap/><rows/><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>" + $scope.appauth.sessionId + "</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses>"+requestCorrespondants+"</clauses><page>1</page><pages>100</pages><nbpages>100</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>";
				$http({
				  method  : 'POST',
				  url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
				  data    : $requestdata,
				  headers: {"Content-Type": 'text/xml'}
				})
				  .success(function(data){

					datajson=xmlParser.xml_str2json(data);
					if(datajson['fr.protogen.connector.model.DataModel'].status !== "FAILURE"){
						console.log("corresp : "+data);
						
														resp = formatString.formatServerResult(data);
														// DONNEES ONT ETE CHARGES
														console.log("les corresp ont été bien chargé");
														if(typeof resp.dataModel === 'undefined' || typeof resp.dataModel.rows === 'undefined')
															return;
														
														villeObjects = resp.dataModel.rows.dataRow;
											
														// GET comptes
														docteurAuthentification.corresps= [];
														ville = {}; 

														villesList = [].concat(villeObjects);
														for (var i = 0; i < villesList.length; i++) {
															object = villesList[i].dataRow.dataEntry;

															// PARCOURIR LIST PROPERTIES
															//ville[object[1].attributeReference] = object[1].value;
															//ville[object[2].attributeReference] = object[2].value;
															docteurAuthentification.corresps.push(Number(object[2].value));
															
															/**if(typeof object[1]['list'] !== 'undefined'){
																if(typeof object[1]['list']['dataCouple'] !== 'undefined'){
																	ville['specialite'] = object[1]['list']['dataCouple']['label'];
																}else
																	ville['specialite']="";	
															}else
																ville['specialite']="";
															
															
															ville[object[3].attributeReference] = object[3].value;
															ville[object[13].attributeReference] = object[13].value;
															if(typeof object[13]['list'] !== 'undefined'){
																if(typeof object[13]['list']['dataCouple'] !== 'undefined'){
																	ville['nom'] = object[13]['list']['dataCouple']['label'];
																}else
																	ville['nom']="";	
															}else
																ville['nom']="";
															

															if (ville)
																docteurAuthentification.correspondants.push(ville);
															ville = {}***/
														}

														console.log("correspondants.length : "+ docteurAuthentification.corresps.length);
														// PUT IN SESSION
														console.log("correspondants : "+JSON.stringify(docteurAuthentification.corresps));
					}
					else{
					  $scope.erreur = "Probleme serveur";
					}
				  })
				  .error(function(data){
					console.log(data);
					console.log("erreur");
				  });
			  };
			  
  $scope.seconnecter = function(){
      localStorageService.set('user_actualites', []);
	  function el(id){
		var elem = document.getElementById(id);
		if(typeof elem !== 'undefined' && elem !== null){
			return elem;
		}
	 } // Get elem by ID
				
      if($scope.params.tel == "")
      {
          $cordovaDialogs.alert("Veuillez saisir votre identifiant (votre numéro de tel");
          return;
      }

      if($scope.params.mdp == "")
      {
          $cordovaDialogs.alert("Veuillez saisir votre mot de passe");
          return;
      }

      if ($scope.appauth.sessionId == null || $scope.appauth.sessionId == "")
      {
        $ionicHistory.goBack(-1);
      }
      else
      {
          console.log("<fr.protogen.connector.model.DataModel><entity>user_compte</entity><dataMap/><rows /><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>"+ $scope.appauth.sessionId +"</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses><fr.protogen.connector.model.SearchClause><field>tel</field><clause></clause><gt>"+$scope.params.tel+"</gt><lt>"+$scope.params.tel+"</lt><type>TEXT</type></fr.protogen.connector.model.SearchClause><fr.protogen.connector.model.SearchClause><field>mot_de_passe</field><clause></clause><gt>"+$scope.params.mdp+"</gt><lt>"+$scope.params.mdp+"</lt><type>TEXT</type></fr.protogen.connector.model.SearchClause></clauses><page>1</page><pages>5</pages><nbpages>5</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>");
          $http
          ({
              method  : 'POST',
              url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
              data    : "<fr.protogen.connector.model.DataModel><entity>user_compte</entity><dataMap/><rows /><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>"+ $scope.appauth.sessionId +"</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses><fr.protogen.connector.model.SearchClause><field>tel</field><clause></clause><gt>"+$scope.params.tel+"</gt><lt>"+$scope.params.tel+"</lt><type>TEXT</type></fr.protogen.connector.model.SearchClause><fr.protogen.connector.model.SearchClause><field>mot_de_passe</field><clause></clause><gt>"+$scope.params.mdp+"</gt><lt>"+$scope.params.mdp+"</lt><type>TEXT</type></fr.protogen.connector.model.SearchClause></clauses><page>1</page><pages>5</pages><nbpages>5</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>",
              headers : {"Content-Type": 'text/xml'}
          })
          .success(function(data)
          {

             datajson=xmlParser.xml_str2json(data);
             console.log(datajson);
             if(datajson['fr.protogen.connector.model.DataModel']['rows'] != "") {

                 //Si l'utilisateur a choisit de retenir son mot de passe
                 if($scope.params.rememberPwd) {
                     var user_infos = {
                         rememberPwd : $scope.params.rememberPwd,
                         user_tel: $scope.params.tel,
                         user_pwd: $scope.params.mdp
                     }
                     localStorageService.set('user_infos', user_infos);
                 }
                 else {
                     localStorageService.remove('user_infos');
                 }

              var rows = datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow'];
              rows = [].concat( rows );
              console.log("rows lenght : "+ rows.length);
              for(var i=0; i<rows.length; i++)
              {

                 for (var j = 0; j < rows[i].dataRow['fr.protogen.connector.model.DataEntry'].length ; j++)
                  {

                    //ID Compte
                    if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "pk_user_compte")
                    {
                      $scope.id_compte = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                      $scope.id_compte = $scope.id_compte.replace("<![CDATA[", "").replace("]]>", "");
                      console.log("Compte: "+$scope.id_compte);
                      $scope.doctauth.id_compte = $scope.id_compte;

                        //Stocker l'id de l'utilisateur
                        localStorageService.set('user_id', $scope.id_compte);

					  // RECUPERATION IMAGE PROFILE
					  $scope.doctauth.imageP='';
					  if($scope.id_compte){
                          //FIXEME
						  /*UploadFile.downloadFile('user_compte', Number($scope.id_compte))
						  .then(
							function(resp){
								console.log('data : '+resp.data);
								datajson=formatString.formatServerResult(resp.data);
								// RECUPERATION IMAGE
								//console.log("datajson : "+JSON.stringify(datajson.streamedFile.stream));
								var stream=datajson.streamedFile.stream;
								if(stream){
									console.log("stream : "+stream);
									docteurAuthentification.imageP=stream;
									// UPDATE BACK-GROUND IMAGE
									el('Mbody').style.backgroundImage='url("'+stream+'")';
									//el('Mbody').classList.add("effet_bright_dyn");
									//el.classList.add("effet_bright");
									el('Mbody').className+=" effet_bright";
									
								}
								
							},
							function(err){
								console.log("une erreur est survenue lors telechargement d'image");
							}
						  )*/
						  
						  // GET ALL CORRESPONADANCE
						  $scope.getCorrespondantsFromServer(Number($scope.id_compte));
					  }
			  
                    }

                    //Telephone
                    if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "tel")
                     {
                       $scope.telephone = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                       $scope.tele = $scope.telephone.replace("<![CDATA[", "").replace("]]>", "");
                        console.log("Telephone: "+$scope.tele);
						$scope.doctauth.telephone = $scope.tele;
                      }
                      //Horaire
                    if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "horaire")
                     {
                       $scope.horaire_consult = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                       $scope.horaire = $scope.horaire_consult.replace("<![CDATA[", "").replace("]]>", "");
                       console.log("horaire: "+$scope.horaire);
                       $scope.doctauth.horaire = $scope.horaire;
                      }
                     //Expertise
                    if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "expertise")
                     {
                       $scope.expertise1 = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                       $scope.expertise = $scope.expertise1.replace("<![CDATA[", "").replace("]]>", "");
                       console.log("expertise: "+$scope.expertise);
                      $scope.doctauth.expertise = $scope.expertise;
                      }
                      //Id_praticien
                    if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "fk_user_praticien")
                     {
                       $scope.fk_user_praticien = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                       $scope.id_praticien = $scope.fk_user_praticien.replace("<![CDATA[", "").replace("]]>", "");
                       console.log("Id_praticien: " + $scope.id_praticien);
                       $scope.doctauth.id_prat = $scope.id_praticien;
                      }
                      //Id_adresse
                    if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "fk_user_adresse")
                     {
                       $scope.fk_user_adresse = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                       $scope.id_adresse = $scope.fk_user_adresse.replace("<![CDATA[", "").replace("]]>", "");
                       console.log("Id_adresse: " + $scope.id_adresse);
                       $scope.doctauth.id_adresse = $scope.id_adresse;
                      }
                      //Id_specialite
                    if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "fk_user_specialite")
                     {
                       $scope.fk_user_specialite = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                       $scope.id_specialite = $scope.fk_user_specialite.replace("<![CDATA[", "").replace("]]>", "");
                       console.log("Id_specialite: " + $scope.id_specialite);
                       $scope.doctauth.id_specialite = $scope.id_specialite;
                      }
                      //Mot de passe
                    if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "mot_de_passe")
                     {
                       $scope.mot_de_passe = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                       $scope.mot_de_passe = $scope.mot_de_passe.replace("<![CDATA[", "").replace("]]>", "");
                       console.log("Mot de passe: " + $scope.mot_de_passe);
                       $scope.doctauth.mot_de_passe = $scope.mot_de_passe;
                      }
                      //premiere connexion
                    if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "premiere_connexion")
                     {
                       $scope.first_connect = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                       $scope.first_connect = $scope.first_connect.replace("<![CDATA[", "").replace("]]>", "");
                        console.log("1ere connexion: "+$scope.first_connect);
                        $scope.doctauth.first_connect = $scope.first_connect;
                      }
                  };
              };
			  
             console.log(datajson);
             if($scope.doctauth.id_prat != null) $scope.praticienbyId();

             if($scope.doctauth.id_specialite != null) $scope.specialitebyId();

             if($scope.doctauth.id_adresse != null) $scope.adressebyId();
                    if($scope.doctauth.first_connect == "Oui"){$state.go('first_connexion_1/:praticien_id')}
                    else {$state.go('menu_general')};
           }else
           {
            $scope.msg="tel et/ou mot de passe incorrecte!";

           };
          })
          .error(function(data) //
          {
            console.log(data);

             console.log("erreur");
          });

    };
  };



// ======> Praticien By Id
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

             var rows = datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow'];
              rows = [].concat( rows );
              console.log("rows lenght : "+ rows.length);
              for(var i=0; i<rows.length; i++)
              {

                 for (var j = 0; j < rows[i].dataRow['fr.protogen.connector.model.DataEntry'].length ; j++)
                  {

                    //Nom
                    if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "nom")
                     {
                       $scope.nom = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                       $scope.nom_p = $scope.nom.replace("<![CDATA[", "").replace("]]>", "");
                       console.log("Nom: "+$scope.nom_p);
                       $scope.doctauth.nom = $scope.nom_p;
                      }
                    //Prenom
                    if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "prenom")
                     {
                       $scope.prenom = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                       $scope.prenom_p = $scope.prenom.replace("<![CDATA[", "").replace("]]>", "");
                       console.log("Prenom: "+$scope.prenom_p);
                       $scope.doctauth.prenom = $scope.prenom_p;
                      }
                    //Id_categorie_pro
                    if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "fk_user_categorie_professionnelle")
                     {
                       $scope.fk_user_categorie_professionnelle = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                       $scope.id_categorie_pro = $scope.fk_user_categorie_professionnelle.replace("<![CDATA[", "").replace("]]>", "");
                       console.log("id_categorie_pro: " + $scope.id_categorie_pro);
                       $scope.doctauth.id_categorie_pro = $scope.id_categorie_pro;
                       if($scope.doctauth.id_categorie_pro != null) $scope.categorieprobyId();
                      }
                     //Id_savoir_faire
                    if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "fk_user_savoir_faire")
                     {
                       $scope.fk_user_savoir_faire = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                       $scope.id_savoir_faire = $scope.fk_user_savoir_faire.replace("<![CDATA[", "").replace("]]>", "");
                       console.log("id_savoir_faire: " + $scope.id_savoir_faire);
                       $scope.doctauth.id_savoir_faire = $scope.id_savoir_faire;
                       if($scope.doctauth.id_savoir_faire != null) $scope.savoirfairebyId();
                      }
                  };
              };

          })
          .error(function(data) //
          {
            console.log(data);

             console.log("erreur");
          });

  };
  // ======> Specialite By Id
  $scope.specialitebyId=function(){
    console.log("id specialitie function=====>"+$scope.doctauth.id_specialite);
    $requestdata = "<fr.protogen.connector.model.DataModel><entity>user_specialite</entity><dataMap/><rows/><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>" + $scope.appauth.sessionId + "</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses><fr.protogen.connector.model.SearchClause><field>pk_user_specialite</field><clause></clause><gt>"+$scope.doctauth.id_specialite+"</gt><lt>"+$scope.doctauth.id_specialite+"</lt><type>PK</type></fr.protogen.connector.model.SearchClause></clauses><page>1</page><pages>5</pages><nbpages>5</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>";

    $http({
          method  : 'POST',
          url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
          data    : $requestdata,
          headers: {"Content-Type": 'text/xml'}
         })
          .success(function(data)
          {

             datajson=xmlParser.xml_str2json(data);
             console.log("========Specialite=======");
             console.log(datajson);

             var rows = datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow'];
              rows = [].concat( rows );
              console.log("rows lenght : "+ rows.length);
              for(var i=0; i<rows.length; i++)
              {

                 for (var j = 0; j < rows[i].dataRow['fr.protogen.connector.model.DataEntry'].length ; j++)
                  {

                    //Specialité
                    if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "libelle")
                     {
                       $scope.specialite_Libelle_1 = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                       $scope.specialite_Libelle = $scope.specialite_Libelle_1.replace("<![CDATA[", "").replace("]]>", "");
                       console.log("specialiteLibelle: "+$scope.specialite_Libelle);
                      $scope.doctauth.specialite_Libelle = $scope.specialite_Libelle;
                      }
                  };
              };

          })
          .error(function(data) //
          {
            console.log(data);
             console.log("erreur");
          });
  };
  // ======> Adresse By Id
  $scope.adressebyId=function(){
    console.log("id adresse function=====>"+$scope.doctauth.id_adresse);
    $requestdata = "<fr.protogen.connector.model.DataModel><entity>user_adresse</entity><dataMap/><rows/><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>" + $scope.appauth.sessionId + "</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses><fr.protogen.connector.model.SearchClause><field>pk_user_adresse</field><clause></clause><gt>"+$scope.doctauth.id_adresse+"</gt><lt>"+$scope.doctauth.id_adresse+"</lt><type>PK</type></fr.protogen.connector.model.SearchClause></clauses><page>1</page><pages>5</pages><nbpages>5</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>";

    $http({
          method  : 'POST',
          url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
          data    : $requestdata,
          headers: {"Content-Type": 'text/xml'}
         })
          .success(function(data)
          {

             datajson=xmlParser.xml_str2json(data);
             console.log("========Adresse=======");
             console.log(datajson);

              var rows = datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow'];
              rows = [].concat( rows );
              console.log("rows lenght : "+ rows.length);
              for(var i=0; i<rows.length; i++)
              {

                 for (var j = 0; j < rows[i].dataRow['fr.protogen.connector.model.DataEntry'].length ; j++)
                  {

                    //Adresse
                    if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "adresse")
                     {
                       $scope.adresse1 = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                       $scope.adresse = $scope.adresse1.replace("<![CDATA[", "").replace("]]>", "");
                       console.log("Adresse: "+$scope.adresse);
                       $scope.doctauth.adresse = $scope.adresse;
                      }
                    //num
                    if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "num")
                     {
                       $scope.num1 = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                       $scope.num = $scope.num1.replace("<![CDATA[", "").replace("]]>", "");
                       console.log("Num: "+$scope.num);
                       $scope.doctauth.num = $scope.num;
                      }
                    //cp
                    if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "cp")
                     {
                       $scope.cp1 = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                       $scope.cp = $scope.cp1.replace("<![CDATA[", "").replace("]]>", "");
                       console.log("CP: "+$scope.cp);
                       $scope.doctauth.cp = $scope.cp;
                      }
                    //id_ville
                    if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "fk_user_ville")
                     {
                       $scope.id_ville1 = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                       $scope.id_ville = $scope.id_ville1.replace("<![CDATA[", "").replace("]]>", "");
                       console.log("Id Ville: "+$scope.id_ville);
                       $scope.doctauth.id_ville = $scope.id_ville;

                       if($scope.doctauth.id_ville != null) $scope.villebyId();
                      }
                  };
              };

          })
          .error(function(data) //
          {
            console.log(data);
             console.log("erreur");
          });
  };
  // ======> Ville By Id : Appel dans la fonction adressebyId()
  $scope.villebyId=function(){
    console.log("id ville function=====>"+$scope.doctauth.id_ville);
    $requestdata = "<fr.protogen.connector.model.DataModel><entity>user_ville</entity><dataMap/><rows/><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>" + $scope.appauth.sessionId + "</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses><fr.protogen.connector.model.SearchClause><field>pk_user_ville</field><clause></clause><gt>"+$scope.doctauth.id_ville+"</gt><lt>"+$scope.doctauth.id_ville+"</lt><type>PK</type></fr.protogen.connector.model.SearchClause></clauses><page>1</page><pages>5</pages><nbpages>5</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>";

    //FIXEME
    /*$http({
          method  : 'POST',
          url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
          data    : $requestdata,
          headers: {"Content-Type": 'text/xml'}
         })
          .success(function(data)
          {

             datajson=xmlParser.xml_str2json(data);
             console.log("========Ville=======");
             console.log(datajson);

             var rows = datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow'];
              rows = [].concat( rows );
              console.log("rows lenght : "+ rows.length);
              for(var i=0; i<rows.length; i++)
              {

                 for (var j = 0; j < rows[i].dataRow['fr.protogen.connector.model.DataEntry'].length ; j++)
                  {

                    //Ville
                    if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "libelle")
                     {
                       $scope.ville_Libelle_1 = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                       $scope.ville_Libelle = $scope.ville_Libelle_1.replace("<![CDATA[", "").replace("]]>", "");
                       console.log("ville Libelle: "+$scope.ville_Libelle);
                       $scope.doctauth.ville_Libelle = $scope.ville_Libelle;
                      }
                  };
              };


          })
          .error(function(data) //
          {
            console.log(data);
             console.log("erreur");
          });*/
  };
  // ======> Categorie professionnelle By Id : Appel dans la fonction praticienbyId()
  $scope.categorieprobyId=function(){
    console.log("id categorie professionnelle function=====>"+$scope.doctauth.id_categorie_pro);
    $requestdata = "<fr.protogen.connector.model.DataModel><entity>user_categorie_professionnelle</entity><dataMap/><rows/><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>" + $scope.appauth.sessionId + "</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses><fr.protogen.connector.model.SearchClause><field>pk_user_categorie_professionnelle</field><clause></clause><gt>"+$scope.doctauth.id_categorie_pro+"</gt><lt>"+$scope.doctauth.id_categorie_pro+"</lt><type>PK</type></fr.protogen.connector.model.SearchClause></clauses><page>1</page><pages>5</pages><nbpages>5</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>";

      //FIXEME
    /*$http({
          method  : 'POST',
          url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
          data    : $requestdata,
          headers: {"Content-Type": 'text/xml'}
         })
          .success(function(data)
          {

             datajson=xmlParser.xml_str2json(data);
             console.log("========Categorie professionnelle =======");
             console.log(datajson);

             var rows = datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow'];
              rows = [].concat( rows );
              console.log("rows lenght : "+ rows.length);
              for(var i=0; i<rows.length; i++)
              {

                 for (var j = 0; j < rows[i].dataRow['fr.protogen.connector.model.DataEntry'].length ; j++)
                  {

                    //Libelle categorie professionnel
                    if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "libelle")
                     {
                       $scope.categrie_pro_Libelle_1 = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                       $scope.categrie_pro_Libelle = $scope.categrie_pro_Libelle_1.replace("<![CDATA[", "").replace("]]>", "");
                       console.log("Categorie pro Libelle: "+$scope.categrie_pro_Libelle);
                       $scope.doctauth.categrie_pro_Libelle = $scope.categrie_pro_Libelle;
                      }
                  };
              };


          })
          .error(function(data) //
          {
            console.log(data);
             console.log("erreur");
          });*/
  };
  // ======> Savoir faire By Id : Appel dans la fonction praticienbyId()
  $scope.savoirfairebyId=function(){
    console.log("id savoir faire function=====>"+$scope.doctauth.id_savoir_faire);
    $requestdata = "<fr.protogen.connector.model.DataModel><entity>user_savoir_faire</entity><dataMap/><rows/><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>" + $scope.appauth.sessionId + "</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses><fr.protogen.connector.model.SearchClause><field>pk_user_savoir_faire</field><clause></clause><gt>"+$scope.doctauth.id_savoir_faire+"</gt><lt>"+$scope.doctauth.id_savoir_faire+"</lt><type>PK</type></fr.protogen.connector.model.SearchClause></clauses><page>1</page><pages>5</pages><nbpages>5</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>";

    $http({
          method  : 'POST',
          url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
          data    : $requestdata,
          headers: {"Content-Type": 'text/xml'}
         })
          .success(function(data)
          {

             datajson=xmlParser.xml_str2json(data);
             console.log("========Savoir faire =======");
             console.log(datajson);

             var rows = datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow'];
              rows = [].concat( rows );
              console.log("rows lenght : "+ rows.length);
              for(var i=0; i<rows.length; i++)
              {

                 for (var j = 0; j < rows[i].dataRow['fr.protogen.connector.model.DataEntry'].length ; j++)
                  {

                    //Libelle savoir faire
                    if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "libelle")
                     {
                       $scope.savoir_faire_Libelle_1 = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                       $scope.savoir_faire_Libelle = $scope.savoir_faire_Libelle_1.replace("<![CDATA[", "").replace("]]>", "");
                       console.log("Savoir faire Libelle: "+$scope.savoir_faire_Libelle);
                       $scope.doctauth.savoir_faire_Libelle = $scope.savoir_faire_Libelle;
                      }
                    //Id_Type_savoir_faire
                    if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "fk_user_type_savoir_faire")
                     {
                       $scope.fk_user_type_savoir_faire = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                       $scope.id_type_savoir_faire = $scope.fk_user_type_savoir_faire.replace("<![CDATA[", "").replace("]]>", "");
                       console.log("id_type_savoir_faire: " + $scope.id_type_savoir_faire);
                       $scope.doctauth.id_type_savoir_faire = $scope.id_type_savoir_faire;
                       if($scope.doctauth.id_type_savoir_faire != null) $scope.typesavoirfairebyId();
                      }
                  };
              };


          })
          .error(function(data) //
          {
            console.log(data);
             console.log("erreur");
          });
  };
  // ======> Type savoir faire By Id : Appel dans la fonction savoirfairebyId()
  $scope.typesavoirfairebyId=function(){
    console.log("id savoir faire function=====>"+$scope.doctauth.id_type_savoir_faire);
    $requestdata = "<fr.protogen.connector.model.DataModel><entity>user_type_savoir_faire</entity><dataMap/><rows/><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>" + $scope.appauth.sessionId + "</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses><fr.protogen.connector.model.SearchClause><field>pk_user_type_savoir_faire</field><clause></clause><gt>"+$scope.doctauth.id_type_savoir_faire+"</gt><lt>"+$scope.doctauth.id_type_savoir_faire+"</lt><type>PK</type></fr.protogen.connector.model.SearchClause></clauses><page>1</page><pages>5</pages><nbpages>5</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>";

      //FIXEME
    /*$http({
          method  : 'POST',
          url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
          data    : $requestdata,
          headers: {"Content-Type": 'text/xml'}
         })
          .success(function(data)
          {

             datajson=xmlParser.xml_str2json(data);
             console.log("========Type Savoir faire =======");
             console.log(datajson);


             var rows = datajson['fr.protogen.connector.model.DataModel']['rows']['fr.protogen.connector.model.DataRow'];
              rows = [].concat( rows );
              console.log("rows lenght : "+ rows.length);
              for(var i=0; i<rows.length; i++)
              {

                  for (var j = 0; j < rows[i].dataRow['fr.protogen.connector.model.DataEntry'].length ; j++)
                  {

                    //Libelle type savoir faire
                    if (rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].attributeReference == "libelle")
                    {
                          $scope.type_savoir_faire_Libelle_1 = rows[i].dataRow['fr.protogen.connector.model.DataEntry'][j].value;
                          $scope.type_savoir_faire_Libelle = $scope.type_savoir_faire_Libelle_1.replace("<![CDATA[", "").replace("]]>", "");
                          console.log("Type savoir faire Libelle: "+$scope.type_savoir_faire_Libelle);
                          $scope.doctauth.type_savoir_faire_Libelle = $scope.type_savoir_faire_Libelle;

                    }
                  };
              };


          })
          .error(function(data) //
          {
            console.log(data);
             console.log("erreur");
          });*/
  };
})


//=========================================
//=========================================   Réinitialisation du mot de passe
//=========================================
.controller('reinitialisermdpCtrl',function($scope,$state,$ionicHistory,$http,xmlParser,appAuthentification,formatString)
{
  $scope.appauth = appAuthentification;
  $scope.email = "";

    $scope.accueil = function()
  {
    $ionicHistory.goBack(-2);
  };

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
    }
    else
    {

        $scope.emailError = false;
    }

  };


  $scope.validationreinitialisermdp = function()
  {
    var re = /^([a-zA-Z0-9])+([a-zA-Z0-9._%+-])+\@([a-zA-Z0-9_.-])+\.(([a-zA-Z]){2,6})$/;

    if ($scope.email == "")
    {
        $cordovaDialogs.alert("Veuillez saisir votre email");
        return;
    }
    if (!re.test($scope.email))
    {
      $cordovaDialogs.alert("Veuillez saisir un email valid.");
        return;
    }

    if ($scope.appauth.sessionId != "")
    {
      console.log("<fr.protogen.connector.model.DataModel><entity>user_compte</entity><dataMap/><rows /><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>"+ $scope.appauth.sessionId +"</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses><fr.protogen.connector.model.SearchClause><field>email</field><clause></clause><gt>"+$scope.email+"</gt><lt>"+$scope.email+"</lt><type>TEXT</type></fr.protogen.connector.model.SearchClause></clauses><page>1</page><pages>5</pages><nbpages>5</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>");
      $http({
          method  : 'POST',
          url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
          data    : "<fr.protogen.connector.model.DataModel><entity>user_compte</entity><dataMap/><rows /><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>"+ $scope.appauth.sessionId +"</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses><fr.protogen.connector.model.SearchClause><field>email</field><clause></clause><gt>"+$scope.email+"</gt><lt>"+$scope.email+"</lt><type>TEXT</type></fr.protogen.connector.model.SearchClause></clauses><page>1</page><pages>5</pages><nbpages>5</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>",
          headers: {"Content-Type": 'text/xml'}
         })
          .success(function(data)
          {
            console.log("email form : "+$scope.email);

            datajson=formatString.formatServerResult(data);
            if(datajson.dataModel.rows != "")
            {
                var rows = datajson.dataModel.rows.dataRow;
                rows = [].concat( rows );
                console.log("rows lenght : "+ rows.length);

                for (var j = 0; j < rows[0].dataRow.dataEntry.length ; j++)
                {

                    if (rows[0].dataRow.dataEntry[j].attributeReference == "email")
                    {
                      emailTemp = rows[0].dataRow.dataEntry[j].value;
                      $scope.envoiereinitialisermdp(emailTemp);

                    }
                };
            }
            else
            {
                $scope.msg="Email introuvable!";
            };
          })
          .error(function(data) //
          {
            console.log(data);

             console.log("erreur recherche email");
          });

    };
  };
  /*

  URL : http://ns389914.vh.net/tolk/api/envoimail
Requête :
<fr.protogen.connector.model.MailModel><sendTo>jakjoud@gmail.com</sendTo><title>Test</title><content>Test</content><status></status></fr.protogen.connector.model.MailModel>

  */
  //Envoi Email
  $scope.envoiereinitialisermdp = function(email)
  {
    console.log("email fonction envoie: "+email);
    if ($scope.appauth.sessionId != "")
    {

      $http({
          method  : 'POST',
          url     : 'http://ns389914.ovh.net:8080/tolk/api/envoimail',
          data    : "<fr.protogen.connector.model.MailModel><sendTo>"+ email +"</sendTo><title>Reinitialisation mot de passe</title><content>Vous pouvez réinitialiser votre mot de passe en activant le lien : test</content><status></status></fr.protogen.connector.model.MailModel>",
          headers: {"Content-Type": 'text/xml'}
         })
          .success(function(data)
          {

             $scope.msg= "Message Envoyé avec succès !";

          })
          .error(function(data) //
          {
            console.log(data);
             $scope.msg= "Echec d'envoie !";
          });

    };
  };

})
;
