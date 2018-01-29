
/*********************************/
/* function loadSensors          */
/*********************************/	
function loadSensors() {
	console.log("In loadSensors " + urlSensors);
	sensorList = {};
	$.get(urlSensors, function (res) {
		var data = res.value;
		console.log("Accessed URL " + urlSensors + " Got Sensors Result " + JSON.stringify(data));
		$.each(data, function (k, v) {
			var this_id = v['@iot.id'].toString();
			console.log("Sensors Result " + JSON.stringify(v));
			sensorList[v['@iot.id']] = v;
		})
		showSensors();
	})	
}/* END function loadSensors       */	


/********************************/
/* function showSensors         */
/********************************/
function showSensors() {
	// showSensorsSelect
	var info;
	//var opt = document.createElement("option");
	var sensorLink;
	console.log("In showSensors ");
	info = document.getElementById('Sensor');
	info.innerHTML = '<b>Sensors <a id="demo" onclick="addSensor()"> <img src="plus.png" alt="Add Sensor"> </a></b><form id="showSensorsForm">';
	$.each(sensorList, function (k, v) {
		console.log("Sensors " + k + " " + v.name);
		//opt.value = k;
		sensorLink = '<a id="demo" onclick="showSensor(' + k + ')">Sensor(' + k + "): " + v.name + "</a>"; 
		sensorLink += '<a id="del_'+ k +'" onclick="removeSensor('+ k +')"> <img src="minus.png" alt="Delete Sensor"> </a>';
		//opt.text = sensorLink;
		//document.getElementById("showSensorsSelect").options.add(opt);
		info.innerHTML += '<br><input type="radio" name="sensorRD" value="' + k + '">';
		info.innerHTML += sensorLink; 
	})
	info.innerHTML += '</form>';
}


/********************************/
/* function showSensor          */
/********************************/
function showSensor(id) {
	
	$('.modal-body').empty();
	$('.modal-title').empty();	

	$('.modal-title').append("Sensor Information id: " + id + "  name: " + sensorList[id].name);	
  var sensorInfo = "<b>ID:</b> "	+ id + "<br><b>Name:</b> " + sensorList[id].name + "<br><b>Description:</b> " + sensorList[id].description;
  sensorInfo += "<br><b>Metadata:</b> " + sensorList[id].metadata + "<br><b>Namespace:</b> " + sensorList[id].properties.namespace;
  sensorInfo += "<br><b>Responsible Organization:</b> " + sensorList[id].properties.responsibleParty.organisationName;
	sensorInfo += "<br><b>Country:</b> " + sensorList[id].properties.responsibleParty.adminUnit;
	sensorInfo += '<br><b>Self Link:</b> <a href="' + sensorList[id]['@iot.selfLink'] + '">' + sensorList[id]['@iot.selfLink'] + '</a>';
	$('.modal-body').append(sensorInfo);
	$("#myModal").modal();
}


/********************************/
/* function addSensor           */
/********************************/
function addSensor() {
	var info;

	$('.modal-body').empty();
	$('.modal-title').empty();	

	$('.modal-title').append("Create New Sensor");	
  var sensorInput = '<form id="addSensorForm">';
	sensorInput += 'Name: <input type="text" name="name" ><br>';
	sensorInput += 'Description: <input type="text" name="description"><br>'; 
	sensorInput += 'Metadata Link: <input type="text" name="metadata"><br>'; 
	sensorInput += 'Namespace: <input type="text" name="namespace" value="data.datacove.eu"><br>'; 
	sensorInput += 'Responsible Organization: <input type="text" name="organisation"><br>'; 
	sensorInput += 'Responsible Organization Location: <input type="text" name="adminUnit"><br>'; 
	sensorInput += '</form><button onclick="setSensor()">Add sensor</button>';
	$('.modal-body').append(sensorInput);
	$("#myModal").modal();

}

/********************************/
/* function removeSensor           */
/********************************/
function removeSensor(id) {
	var info;

	$('.modal-body').empty();
	$('.modal-title').empty();	

	$('.modal-title').append("Delete Sensor");	
	
  var sensorInfo = "<b>ID:</b> "	+ id + "<br><b>Name:</b> " + sensorList[id].name + "<br><b>Description:</b> " + sensorList[id].description;
  sensorInfo += "<br><b>Metadata:</b> " + sensorList[id].metadata + "<br><b>Namespace:</b> " + sensorList[id].properties.namespace;
  sensorInfo += "<br><b>Responsible Organization:</b> " + sensorList[id].properties.responsibleParty.organisationName;
	sensorInfo += "<br><b>Country:</b> " + sensorList[id].properties.responsibleParty.adminUnit;
	sensorInfo += '<br><button onclick="delSensor('+ id +')">Delete sensor</button>';
	$('.modal-body').append(sensorInfo);
	$("#myModal").modal();

}

/********************************/
/* function delSensor           */
/********************************/
function delSensor(id) {
	var delUrl = urlSensors + "(" + id + ")";
	console.log("Deleting Sensor " + id + " at URL " + delUrl);
	$.ajax({
		url: delUrl,
		type: "DELETE",
		contentType: "application/json; charset=utf-8",
		success: function(data, status, xhr){
			var info;
			var outStr;
			console.log("status " + status);
			console.log("Location " + xhr.getResponseHeader('location'));
			console.log("got [" + data + "]");
			$('.modal-body').append('<br>Deleted');
			loadSensors();
		},
		error: function(response, status){
				console.log("Error Response " + JSON.stringify(response, undefined, 5));
				console.log("Error Status " + status);
				info = document.getElementById('Error');
				info.innerHTML += " ERROR<br> " + JSON.stringify(response, undefined, 5) + "<br>status <br> " + status;
		}
	});	

}

/********************************/
/* function setSensor           */
/********************************/
function setSensor() {
	var jsonData = {
    "name" : "Mesure profondeur piézo",
    "description" : "Mesure de la profondeur piézométrique par sonde électronique",
    "encodingType" : "application/vnd.geo+json",
    "metadata" : "http://id.eaufrance.fr/met/403",
    "properties" : {
      "namespace" : "http://id.eaufrance.fr/met/",
      "type" : "INSPIRE",
      "responsibleParty" : {
        "organisationName" : "Agence de l'eau Rhin Meus",
        "language" : "fre",
        "adminUnit" : "France",
        "script" : "Latn"
      }
    }
  };
	var x = document.getElementById("addSensorForm");
	var text = "";
	var i;	
	for (i = 0; i < x.length ;i++) {
		switch (x.elements[i].name) {
			case "name":
				jsonData.name = x.elements[i].value;
				break;
			case "description":
				jsonData.description = x.elements[i].value;
				break;
			case "metadata":
				jsonData.metadata = x.elements[i].value;
				break;
			case "organisation":
				jsonData.properties.responsibleParty.organisationName = x.elements[i].value;
				break;
			case "namespace":
				jsonData.properties.namespace = x.elements[i].value;
				break;
			case "adminUnit":
				jsonData.properties.responsibleParty.adminUnit = x.elements[i].value;
				break;
			default:
		}
	}		
	//alert(JSON.stringify(jsonData));
	jsonDataStr = JSON.stringify(jsonData);
	
	console.log("Posting sensor data to " + urlSensors);
	console.log("Post data " + JSON.stringify(jsonData));
	
	$.ajax({
		url: urlSensors,
		type: "POST",
		data: jsonDataStr,
		contentType: "application/json; charset=utf-8",
		success: function(data, status, xhr){
			var info;
			var outStr;
			console.log("status " + status);
			console.log("Location " + xhr.getResponseHeader('location'));
			console.log("got [" + data + "]");
			loadSensors();
			ObservationURI = xhr.getResponseHeader('location')
		},
		error: function(response, status){
				console.log("Error Response " + JSON.stringify(response, undefined, 5));
				console.log("Error Status " + status);
				info = document.getElementById('Error');
				info.innerHTML += " ERROR<br> " + JSON.stringify(response, undefined, 5) + "<br>status <br> " + status;
		}
	});
/*			
*/
	
} /* END function setSensor           */





