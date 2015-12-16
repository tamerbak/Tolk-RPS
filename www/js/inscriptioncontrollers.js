angular.module('inscriptioncontrollers', ['autocomplete', 'fileServices'])


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
.controller('menu_generalCtrl',function($scope,$rootScope,$state,$http,xmlParser,appAuthentification,docteurAuthentification,localStorageService, $cordovaDialogs)
{
    /**
     * checkNewInvitations
     */
    var checkNewInvitations = function() {

        var userId = localStorageService.get("user_id");

        var query = "select pk_user_praticien, nom, prenom " +
            "from user_praticien " +
            "where pk_user_praticien " +
            "in (select fk_user_praticien from user_correspondance " +
                    "where fk_user_compte=" + userId + " " +
                    "and confirmee='Non' " +
                    "and dirty='N');";

        $http({
            method  : 'POST',
            url     : 'http://ns389914.ovh.net:8080/tolk/api/sql',
            data    : query,
            headers: {"Content-Type": 'text/plain'}
        })
        .success(function(data){
            console.log("checkNewInvitations > success : ", data);
            angular.forEach(data.data, function(value, key) {

                console.log(key + ': ', value);

                var message  = value.nom + " " + value.prenom + " vous a envoyé une demande de correspondance!";
                $cordovaDialogs.confirm(message, 'Invitation', ['Accepter','Refuser'])
                    .then(function(buttonIndex) {
                        // no button = 0, 'Accepter' = 1, 'Refuser' = 2

                        if(buttonIndex != 0) {

                            var query = "";

                            if (buttonIndex == 1) {
                                query = "update user_correspondance " +
                                    "set confirmee='Oui' " +
                                    "where fk_user_compte=" + userId + " " +
                                    "and fk_user_praticien=" + value.pk_user_praticien;
                            }
                            else {
                                query = "delete from user_correspondance " +
                                    "where fk_user_compte=" + userId + " " +
                                    "and fk_user_praticien=" + value.pk_user_praticien;
                            }

                            $http({
                                method: 'POST',
                                url: 'http://ns389914.ovh.net:8080/tolk/api/sql',
                                data: query,
                                headers: {"Content-Type": 'text/plain'}
                            })
                            .success(function (data) {
                             console.log("$cordovaDialogs > checkNewInvitations > success : ", data);
                            })
                            .error(function (data) {
                                console.log("$cordovaDialogs > checkNewInvitations > error : ", data);
                            });
                        }
                    });
            });
        })
        .error(function(data){
            console.log("checkNewInvitations > error : ", data);
        });
    };
    checkNewInvitations();

  $scope.appauth = appAuthentification;
  $scope.doctauth = docteurAuthentification;

    $scope.mesactualites = function(){

        console.log($scope.doctauth.id_compte);
        console.log($scope.doctauth.id_prat);
        var ss = "select nom, prenom, message from  user_praticien up, user_actualites ua where " +
            "ua.fk_user_praticien = "+ $scope.doctauth.id_prat +" " +
            "and ua.fk_user_praticien=up.pk_user_praticien " +
            "UNION " +
            "select nom, prenom, message from user_praticien up, user_actualites ua " +
            "where ua.fk_user_praticien=up.pk_user_praticien " +
            "and  ua.fk_user_praticien in (select fk_user_praticien from user_correspondance uc where uc.fk_user_compte = "+ $scope.doctauth.id_compte +") ";
        $http({
            method  : 'POST',
            url     : 'http://ns389914.ovh.net:8080/tolk/api/sql',
            data    : ss,
            headers: {"Content-Type": 'text/plain'}
        }) .success(function(data)
            {
                $scope.actualites = data.data;
                console.log($scope.actualites);
                localStorageService.set('user_actualites', $scope.actualites);
            })
            .error(function(data)
            {
                console.log(data);
                $scope.messageerreur = "Une erreur s'est produite, veuillez resseyer SVP."
            });
        $state.go('actualites');
    };

  $scope.mescorrespondants = function()
  {
       $state.go('mescorrespondants');
  };
  
	$scope.loadAllComptes= function(){
		$state.go('mescontacts');
		console.log("Je suis dans loadAllComptes() - Menu General");
		//$rootScope.$broadcast('load-list-comptes', {params: {'fk':"ff"}});
	}

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

	.controller('first_connexion_3Ctrl',function($scope,$state,appAuthentification,docteurAuthentification){
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
		
		// MODIFIER PAR OMAR - 04-11-2015
		.controller('profileCtrl',function($scope,$state,docteurAuthentification,appAuthentification, UploadFile){

            $scope.user = {};
            $scope.user.expertise = 'Ici, nous vous invitons à parler de vos diplômes, expertises et toutes informations liées à votre identité professionnelle.';
            $scope.saveExpertise = function(){
                alert($scope.user.expertise);
            };

            $scope.appauth = appAuthentification;
			$scope.doctauth = docteurAuthentification;
			$scope.formData={};

			$scope.formData.imageProfile="img/docteur.png";
			
			$scope.profile = function(){
				$state.go('profile');
			}
			
			$scope.$on("$ionicView.beforeEnter", function(scopes, states){
				console.log("je suis ds $ionicView.beforeEnter");
				$scope.init();
			});
			
			$scope.init=function(){
				// INITIALISATION 
				//$scope.formData.imageProfile=docteurAuthentification.imageP;
				$scope.imgPr =docteurAuthentification.imageP;
				if($scope.imgPr.length > 0)
					$scope.formData.imageProfile=$scope.imgPr;
			}
			
			$scope.loadImage=function(img){
			
				console.log("files.length : "+img.files.length);
				console.log("files[0] : "+img.files[0]);
				
				function el(id){
					var elem = document.getElementById(id);
					if(typeof elem !== 'undefined' && elem !== null){
						return elem;
					}
				} // Get elem by ID
				
				if(img.files && img.files[0]){
				
					var FR= new FileReader();
					FR.onload = function(e){
						// RECUPERE FILE-NAME
						$scope.formData.imageName=img.files[0].name;
						// RECUPERE ENCODAGE-64
						$scope.formData.imageEncode=e.target.result;
						console.log("image : "+$scope.formData.imageEncode);
						console.log("id_compte : "+$scope.doctauth.id_compte)
						$scope.doctauth.imageP=$scope.formData.imageEncode;
						
						// PERSIST IN BD
						UploadFile.uploadFile("user_compte", $scope.formData.imageEncode, $scope.doctauth.id_compte)
							.then(
								function(resp){
									
									// UPDATE IMAGE
									el('imgP').src=$scope.formData.imageEncode;
									var elem=el('Mbody');
									elem.style.backgroundImage='url("'+$scope.formData.imageEncode+'")';
									//el('Mbody').className+="effet_bright";
									
									// SET EN SERVICE
									docteurAuthentification.imageP=$scope.formData.imageEncode;
								},
								function(err){
									console.log("une erreur est survenue lors d'Upload Image");
								}
							);
					};       
					FR.readAsDataURL(img.files[0]);
					//$scope.$apply(function(){});
				}
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












