// creer par HODAIKY
'use strict';

var app = angular.module('actualitesController', ['ionic']);

app.controller("actualiteController", function($scope, $state, docteurAuthentification, appAuthentification,localStorageService,$http, $cordovaDialogs, xmlParser)
{
    //function js_yyyy_mm_dd_hh_mm_ss () {
    //    var now = new Date();
    //    var year = "" + now.getFullYear();
    //    var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    //    var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    //    var hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    //    var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    //    var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
    //    return year + "-" + month + "-" + day + " " + hour + "-" + minute + "-" + second;
    //};


    $scope.appauth = appAuthentification;
    $scope.params = {};
    $scope.params.msg = "";
    $scope.doctauth = docteurAuthentification;
    $scope.formData={};
    $scope.actualites = [];

    $scope.formData.imageProfile="img/docteur.png";

    $scope.$on("$ionicView.beforeEnter", function(scopes, states){
        console.log("je suis ds $ionicView.beforeEnter");
        $scope.actualites = localStorageService.get("user_actualites");
    });

    $scope.postuler = function(){

        console.log($scope.params.msg);
        console.log($scope.appauth.sessionId);
        console.log($scope.doctauth.id_prat);
        console.log($scope.doctauth.id_compte);

        if($scope.params.msg == ""){
            $cordovaDialogs.alert("Veuillez écrire votre message.");
            return;
        }else {

            var newMessage = $scope.params.msg;
            var nom = $scope.doctauth.nom;
            var prenom = $scope.doctauth.prenom;
            $scope.params.msg = "";

            var query = "INSERT INTO user_actualites (fk_user_praticien, message, date_actualite) VALUES ( " + $scope.doctauth.id_prat + ", '" + newMessage + "', CURRENT_TIMESTAMP )";
          //var query = "delete from user_actualites";
            $http({
                method: 'POST',
                url: 'http://ns389914.ovh.net:8080/tolk/api/sql',
                data: query,
                headers: {"Content-Type": 'text/plain'}
            }).success(function (data) {

                console.log(data);
                if (data.status == 'success'){
                    $cordovaDialogs.alert('Votre message a été publier', 'Publication', 'Ok')
                        .then(function () {
                            // callback success
                        });
                    console.log(nom);
                    console.log(prenom);
                    $scope.actualites.unshift({message : newMessage, nom: nom, prenom : prenom});
                    localStorageService.set('user_actualites', $scope.actualites);
                    $scope.params = {};
                    $scope.params.msg='';
                    nom = '';
                    prenom = '';
                    console.log($scope.actualites);

                }

                })
                .error(function (data) {
                    console.log(data);
                    $scope.messageerreur = "Une erreur s'est produite, veuillez resseyer SVP."
                });
            };



    };
    $scope.doRefresh =function() {
        $scope.actualites = localStorageService.get("user_actualites");
        $scope.$broadcast('scroll.refreshComplete');
    };
});