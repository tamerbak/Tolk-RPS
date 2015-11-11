/**
 * Created by Omar on 16/10/2015.
 */

angular.module('fileServices', [])

  .service('UploadFile', function ($http) {
	  
	  this.uploadFile=function(table, contenu, employeurID){
		  
		var soapMessage=
			'<fr.protogen.connector.model.StreamedFile>'+
				'<identifiant>'+Number(employeurID)+'</identifiant>'+
				'<fileName>image_'+employeurID+'</fileName>'+
				'<table>'+table+'</table>'+
				'<operation>PUT</operation>'+
				'<stream>'+contenu+'</stream>'+
			'</fr.protogen.connector.model.StreamedFile>';
			
		return $http({
			method: 'POST',
			url: 'http://ns389914.ovh.net:8080/tolk/api/fss',
			headers: {
				"Content-Type": "text/xml"
			},
			data: soapMessage
		});
	  }
	  
	  
	  this.downloadFile=function(table, employeurID){
		  
		var soapMessage=
			'<fr.protogen.connector.model.StreamedFile>'+
				'<identifiant>'+employeurID+'</identifiant>'+
				'<fileName></fileName>'+
				'<table>'+table+'</table>'+
				'<operation>GET</operation>'+
				'<stream></stream>'+
			'</fr.protogen.connector.model.StreamedFile>';
			
		return $http({
			method: 'POST',
			url: 'http://ns389914.ovh.net:8080/tolk/api/fss',
			headers: {
				"Content-Type": "text/xml"
			},
			data: soapMessage
		});
	  }
  })
