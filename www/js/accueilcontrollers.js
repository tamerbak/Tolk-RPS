angular.module('accueilcontrollers', [])
.controller('accueilCtrl',function($scope,$ionicHistory,$state,$http,xmlParser,appAuthentification,$ionicSlideBoxDelegate)
{
  $scope.page_bull_1 = "selected";
  $scope.$on('$ionicView.enter', function()
  {
      $ionicSlideBoxDelegate.start();
    
  });

  $scope.slideHasChanged = function($index)
  {
      switch($index) 
      {
        case 0:
        {
          $scope.page_bull_1 = "selected";
          $scope.page_bull_2 = "";
          $scope.page_bull_3 = "";
        }
        break;
        case 1:
        {
          $scope.page_bull_1 = "";
          $scope.page_bull_2 = "selected";
          $scope.page_bull_3 = "";
        }
          break;
        case 2: 
        {
          $scope.page_bull_1 = "";
          $scope.page_bull_2 = "";
          $scope.page_bull_3 = "selected";
        }
        break;
      };
  };

	$scope.appauth = appAuthentification;
  	if ($scope.appauth.sessionId == null || $scope.appauth.sessionId == "")
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
  $scope.inscription1 = function()
  {
    $state.go('inscription1');
  };
  $scope.goBack = function()
  {
    $ionicHistory.goBack();
  };
})
