
	var app = angular.module('mesContactsController', []);

	app.controller("mesContactsCtrl", function($scope, appAuthentification, $http, xmlParser, formatString, docteurAuthentification){ 
		
			$scope.appauth = appAuthentification;
			$scope.doctauth = docteurAuthentification;
			$scope.comptes=[];
			
			$scope.initComptes=function(){
				console.log("je suis dans initComptes()");
				// LOAD LIST COMPTES
				$requestdata = "<fr.protogen.connector.model.DataModel><entity>user_compte</entity><dataMap/><rows/><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>" + $scope.appauth.sessionId + "</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses/><page>1</page><pages>0</pages><nbpages>0</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>";
				$http({
				  method  : 'POST',
				  url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
				  data    : $requestdata,
				  headers: {"Content-Type": 'text/xml'}
				})
				  .success(function(response){
					  console.log("succes : All comptes");
					  // datajson=formatString.formatServerResult(resp);
					  // console.log("data : "+ JSON.stringify(datajson));
														console.log("response : "+ response);
														resp = formatString.formatServerResult(response);
														//console.log("resp : "+ JSON.stringify(resp));
														// DONNEES ONT ETE CHARGES
														console.log("les villes ont été bien chargé");
														if(typeof resp.dataModel === 'undefined' || typeof resp.dataModel.rows === 'undefined')
															return;
														
														villeObjects = resp.dataModel.rows.dataRow;
											
														// GET comptes
														$scope.comptes= [];
														ville = {}; 

														villesList = [].concat(villeObjects);
														for (var i = 0; i < villesList.length; i++) {
															object = villesList[i].dataRow.dataEntry;

															// PARCOURIR LIST PROPERTIES
															ville[object[0].attributeReference] = object[0].value;
															ville[object[1].attributeReference] = object[1].value;
															if(typeof object[1]['list'] !== 'undefined'){
																if(typeof object[1]['list']['dataCouple'] !== 'undefined'){
																	ville['specialite'] = object[1]['list']['dataCouple']['label'];
																}else
																	ville['specialite']="";	
															}else
																ville['specialite']="";
															// ville[object[2].attributeReference] = object[2].value;
															// ville[object[3].attributeReference] = object[3].value;
															// ville[object[4].attributeReference] = object[4].value;
															// ville[object[5].attributeReference] = object[5].value;
															// ville[object[6].attributeReference] = object[6].value;
															// ville[object[7].attributeReference] = object[7].value;
															// ville[object[8].attributeReference] = object[8].value;
															// ville[object[9].attributeReference] = object[9].value;
															// ville[object[10].attributeReference] = object[10].value;
															ville[object[11].attributeReference] = object[11].value;
															ville[object[12].attributeReference] = object[12].value;
															ville[object[13].attributeReference] = object[13].value;
															if(typeof object[13]['list'] !== 'undefined'){
																if(typeof object[13]['list']['dataCouple'] !== 'undefined'){
																	ville['nom'] = object[13]['list']['dataCouple']['label'];
																}else
																	ville['nom']="";	
															}else
																ville['nom']="";
															

															if (ville)
																$scope.comptes.push(ville);
															ville = {}
														}

														console.log("comptes.length : "+ $scope.comptes.length);
														// PUT IN SESSION
														console.log("comptes : "+JSON.stringify($scope.comptes));
				  })
				  .error(function(data){
					console.log(data);
					console.log("erreur");
				  });
			}
			
			$scope.$on("$ionicView.beforeEnter", function(scopes, states){
				console.log("Je suis dans $ionicView.beforeEnter()");
				initComptes();
			});
		  
			$scope.inviteCompte=function(compte){
				console.log("compte : "+ JSON.stringify($scope.doctauth));
				console.log("praticien : "+ JSON.stringify(compte));
				// PERSIST IN CORRESPONDANCE
				$http({
					  method  : 'POST',
					  url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
					  // data    : "<fr.protogen.connector.model.DataModel><entity>user_correspondance</entity><dataMap/><rows/><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>"+ $scope.appauth.sessionId +"</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses/><page>1</page><pages>5</pages><nbpages>5</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>",
					  data    : "<fr.protogen.connector.model.DataModel><entity>user_correspondance</entity><dataMap/><rows><fr.protogen.connector.model.DataRow><dataRow><fr.protogen.connector.model.DataEntry><label>&lt;![CDATA[Compte]]&gt;</label><attributeReference>fk_user_compte</attributeReference><type>fk_user_compte</type><list/><value>"+Number($scope.doctauth.id_compte)+"</value></fr.protogen.connector.model.DataEntry><fr.protogen.connector.model.DataEntry><label>&lt;![CDATA[Correspondant]]&gt;</label><attributeReference>fk_user_praticien</attributeReference><type>fk_user_praticien</type><value>"+Number(compte.fk_user_praticien)+"</value></fr.protogen.connector.model.DataEntry></dataRow></fr.protogen.connector.model.DataRow></rows><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>"+ $scope.appauth.sessionId +"</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>PUT</operation><clauses/><page>1</page><pages>5</pages><nbpages>5</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>",
					  headers : {"Content-Type": 'text/xml'}
				})
				.success(function(data){
					console.log("data : "+data);
				})
				.error(function(err){
					console.log("erreur correspondance ");
				});
			}
			
		  $scope.$on('load-list-comptes', function(event, args){
			  // LOAD ALL COMPTES
			  console.log("Je suis dans load-list-comptes()");
			  $scope.initComptes();
		  });
	});
