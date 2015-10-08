angular.module('accueilcontrollers', [])
.controller('accueilCtrl',function($scope,$state,$http,xmlParser,appAuthentification)
{

	$scope.appauth = appAuthentification;
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
             //console.log($scope.sessionId);
             $scope.appauth.sessionId  = $scope.sessionId;
             console.log($scope.appauth.sessionId);

          })
          .error(function(data) //
          {
            console.log(data);
             console.log("erreur");
          });
          
    };
  $scope.accueil = function()
  {
    $state.go('accueil');
  };

  $scope.presentation1 = function()
  {
    $state.go('presentation1');
  };
  
  $scope.connexion = function()
  {
    $state.go('connexion');
  };
})
