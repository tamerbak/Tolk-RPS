var app = angular.module('datacontrollers', ['ionic']);

app.controller("specialitiesctrl", function($scope,xmlParser)
{

	$scope.specialities = [];

	specialite = [];
	specialite['dentiste']     = '<specialitee><id>1</id><name>dentiste</name></specialitee>';
    specialite['generaliste']  = '<specialitee><id>2</id><name>generaliste</name></specialitee>';
    specialite['cardiologue']  = '<specialitee><id>3</id><name>cardiologue</name></specialitee>';
    specialite['nutritiste']   = '<specialitee><id>4</id><name>nutritiste</name></specialitee>';
    specialite['dermatologue'] = '<specialitee><id>5</id><name>dermatologue</name></specialitee>';
    specialite['genicologue']  = '<specialitee><id>6</id><name>genicologue</name></specialitee>';


    specialitees  ="<specialitees>";
    specialitees  =specialitees + specialite['dentiste'];
    specialitees  =specialitees + specialite['generaliste'];
    specialitees  =specialitees + specialite['cardiologue'];
    specialitees  =specialitees + specialite['nutritiste'];
    specialitees  =specialitees + specialite['dermatologue'];
    specialitees  =specialitees + specialite['genicologue'];
    specialitees  =specialitees + "</specialitees>";

 	var jsonList = xmlParser.xml_str2json(specialitees);
	$scope.specialities = jsonList.specialitees.specialitee;

    
    
});
