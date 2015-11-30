// creer par HODAIKY
'use strict';

var app = angular.module('actualitesController', ['ionic']);

app.controller("actualiteController", function($scope, docteurAuthentification, appAuthentification,$http, xmlParser)
{
    function js_yyyy_mm_dd_hh_mm_ss () {
        var now = new Date();
        var year = "" + now.getFullYear();
        var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
        var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
        var hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
        var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
        var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
        return year + "-" + month + "-" + day + " " + hour + "-" + minute + "-" + second;
    };

    $scope.appauth = appAuthentification;
    $scope.params = {};
    $scope.params.msg = "";
    $scope.doctauth = docteurAuthentification;
    $scope.formData={};

    $scope.formData.imageProfile="img/docteur.png";

    $scope.$on("$ionicView.beforeEnter", function(scopes, states){
        console.log("je suis ds $ionicView.beforeEnter");
        $scope.init();
    });

    $scope.init=function(){
        alert("alert");
        $scope.imgPr =docteurAuthentification.imageP;
        if($scope.imgPr.length > 0) {
            $scope.formData.imageProfile = $scope.imgPr;
        }

        //console.log($scope.doctauth.id_prat);
        //var ss = "select nom, prenom, message from  user_praticien up, user_actualites ua where " +
        //    "ua.fk_user_praticien = "+ $scope.doctauth.id_prat +" " +
        //    "and ua.fk_user_praticien=up.pk_user_praticien " +
        //    "UNION " +
        //    "select nom, prenom, message from user_praticien up, user_actualites ua " +
        //    "where ua.fk_user_praticien=up.pk_user_praticien " +
        //    "and  ua.fk_user_praticien in (select fk_user_praticien from user_correspondance uc where uc.fk_user_compte = "+ $scope.doctauth.id_compte +") ";
        //$http({
        //    method  : 'POST',
        //    url     : 'http://ns389914.ovh.net:8080/tolk/api/sql',
        //    data    : ss,
        //    headers: {"Content-Type": 'text/plain'}
        //}) .success(function(data)
        //    {
        //        $scope.actualites = data.data;
        //        console.log(data);
        //    })
        //    .error(function(data)
        //    {
        //        console.log(data);
        //        $scope.messageerreur = "Une erreur s'est produite, veuillez resseyer SVP."
        //    });
    };

    $scope.postuler = function(){



        //
        //
        //alert(js_yyyy_mm_dd_hh_mm_ss());
        //console.log($scope.params.msg);
        //console.log($scope.appauth.sessionId);
        //console.log($scope.doctauth.id_prat);
        //console.log($scope.doctauth.id_compte);
        //if($scope.params.msg == ""){
        //    $cordovaDialogs.alert("Veuillez écrire votre message.");
        //    return;
        //}else {

            //var query = "INSERT INTO user_actualites (fk_user_praticien, message, date_actualite) VALUES ( " + $scope.doctauth.id_prat + ", '" + $scope.params.msg + "', CURRENT_TIMESTAMP )";
            //
            //$http({
            //    method: 'POST',
            //    url: 'http://ns389914.ovh.net:8080/tolk/api/sql',
            //    data: query,
            //    headers: {"Content-Type": 'text/plain'}
            //}).success(function (data) {
            //        console.log(data);
            //        if (data.status == 'success') {
            //            $cordovaDialogs.alert('Votre message a été publier', 'Publication', 'Ok')
            //                .then(function () {
            //                    // callback success
            //                });
            //        }
            //    })
            //    .error(function (data) {
            //        console.log(data);
            //        $scope.messageerreur = "Une erreur s'est produite, veuillez resseyer SVP."
            //    });
            //    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //    //
            //    //
            //    //$http({
            //    //    method  : 'POST',
            //    //    url     : 'http://ns389914.ovh.net:8080/tolk/api/sql',
            //    //    data    : query,
            //    //    headers : {"Content-Type": 'text/plain'}
            //    //})
            //    //    .success(function(data){
            //    //        console.log("inviteCompte >  success : ", data);
            //    //
            //    //        if(data.status == 'success') {
            //    //            $cordovaDialogs.alert('Votre invitation a été envoyé', 'Invitation', 'Ok')
            //    //                .then(function() {
            //    //                    // callback success
            //    //                });
            //    //        }
            //    //    })
            //    //    .error(function(err){
            //    //        console.log("inviteCompte >  error : ", err);
            //    //    });
            //    //
            //    //2 -
            //    //var query = "select pk_user_praticien, libelle as specialite, nom, prenom " +
            //    //    "from user_praticien, user_specialite " +
            //    //    "where fk_user_specialite=pk_user_specialite " +
            //    //    "and pk_user_praticien " +
            //    //    "in (select fk_user_praticien from user_correspondance " +
            //    //    "where fk_user_compte=" + userId + " " +
            //    //    "and confirmee='Oui' " +
            //    //    "and dirty='N');";
            //    //
            //    //$http({
            //    //    method  : 'POST',
            //    //    url     : 'http://ns389914.ovh.net:8080/tolk/api/sql',
            //    //    data    : query,
            //    //    headers: {"Content-Type": 'text/plain'}
            //    //})
            //    //    .success(function(data){
            //    //        console.log("getCorrespondants > success : ", data);
            //    //
            //    //        if(data && data.data.length > 0) {
            //    //            $scope.formData.hasCorrespondants = true;
            //    //            $scope.correspondants = data.data;
            //    //        }
            //    //    })
            //    //    .error(function(data){
            //    //        console.log("getCorrespondants > error : ", data);
            //    //    });
            //
            //
            //
            //
            //}

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
                    console.log(data);
                })
                .error(function(data)
                {
                    console.log(data);
                    $scope.messageerreur = "Une erreur s'est produite, veuillez resseyer SVP."
                });


    };
});