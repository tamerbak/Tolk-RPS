
	var app = angular.module('mesContactsController', []);

	app.controller("mesContactsCtrl", function($scope, appAuthentification, $http, xmlParser){ 
		
			$scope.appauth = appAuthentification;
			
			$scope.initComptes=function(){
				// LOAD LIST COMPTES
				$requestdata = "<fr.protogen.connector.model.DataModel><entity>user_compte</entity><dataMap/><rows/><token><username/><password/><nom>Jakjoud Abdeslam</nom><appId>FRZ48GAR4561FGD456T4E</appId><sessionId>" + $scope.appauth.sessionId + "</sessionId><status>SUCCES</status><id>206</id><beanId>0</beanId></token><expired></expired><unrecognized></unrecognized><status></status><operation>GET</operation><clauses/><page>1</page><pages>100</pages><nbpages>100</nbpages><iddriver>0</iddriver><ignoreList></ignoreList></fr.protogen.connector.model.DataModel>";
				$http({
				  method  : 'POST',
				  url     : 'http://ns389914.ovh.net:8080/tolk/api/das',
				  data    : $requestdata,
				  headers: {"Content-Type": 'text/xml'}
				})
				  .success(function(data){
					  console.log("succes");
					  console.log("data : "+data);
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
		  
		  $scope.$on('load-list-comptes', function(event, args){
			  // LOAD ALL COMPTES
			  console.log("Je suis dans load-list-comptes()");
			  $scope.initComptes();
		  });
	});
