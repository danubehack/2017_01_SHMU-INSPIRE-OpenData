
var datastreamThing = -1;
var datastreamSensor = -1;
var datastreamObsProp = -1;

/*********************************/
/* function loadDatastreams          */
/*********************************/	
function loadDatastreams() {
	console.log("In loadDatastreams " + urlDatastreams);
	datastreamList = {};
	$.get(urlDatastreams, function (res) {
		var data = res.value;
		console.log("Accessed URL " + urlDatastreams + " Got Datastreams Result " + JSON.stringify(data));
		$.each(data, function (k, v) {
			var this_id = v['@iot.id'].toString();
			console.log("Datastreams Result " + JSON.stringify(v));
			datastreamList[v['@iot.id']] = v;
		})
		showDatastreams();
	})	
}/* END function loadDatastreams       */	


/********************************/
/* function showDatastreams         */
/********************************/
function showDatastreams() {
	// showDatastreamsSelect
	var info;
	//var opt = document.createElement("option");
	var datastreamLink;
	console.log("In showDatastreams ");
	info = document.getElementById('Datastream');
	info.innerHTML = '<b>Datastreams <a id="demo" onclick="addDatastream()"> <img src="plus.png" alt="Add Datastream"> </a></b><form id="showDatastreamsForm">';
	$.each(datastreamList, function (k, v) {
		console.log("Datastreams " + k + " " + v.name);
		//opt.value = k;
		datastreamLink = '<a id="demo" onclick="showDatastream(' + k + ')">Datastream(' + k + "): " + v.name + "</a>"; 
		datastreamLink += '<a id="del_'+ k +'" onclick="removeDatastream('+ k +')"> <img src="minus.png" alt="Delete Datastream"> </a>';
		//opt.text = datastreamLink;
		//document.getElementById("showDatastreamsSelect").options.add(opt);
		info.innerHTML += '<br><input type="radio" name="datastreamRD" value="' + k + '">';
		info.innerHTML += datastreamLink; 
	})
	info.innerHTML += '</form>';
}


/********************************/
/* function showDatastream          */
/********************************/
function showDatastream(id) {
	
	$('.modal-body').empty();
	$('.modal-title').empty();	

	$('.modal-title').append("Datastream Information id: " + id + "  name: " + datastreamList[id].name);	
  var datastreamInfo = "<b>ID:</b> "	+ id + "<br><b>Name:</b> " + datastreamList[id].name + "<br><b>Description:</b> " + datastreamList[id].description;
  datastreamInfo += "<br><b>Unit of Measure Name:</b> " + datastreamList[id].unitOfMeasurement.name;
  datastreamInfo += "<br><b>Unit of Measure Symbol:</b> " + datastreamList[id].unitOfMeasurement.symbol;
  datastreamInfo += "<br><b>Unit of Measure Definition:</b> " + datastreamList[id].unitOfMeasurement.definition;
  datastreamInfo += "<br><b>Phenomenon Time:</b> " + datastreamList[id].phenomenonTime;
	datastreamInfo += '<br><b>Self Link:</b> <a href="' + datastreamList[id]['@iot.selfLink'] + '">' + datastreamList[id]['@iot.selfLink'] + '</a>';

	$('.modal-body').append(datastreamInfo);
	$("#myModal").modal();
}

/********************************/
/* function getDatastreamLinks  */
/********************************/
function getDatastreamLinks() {
	var radios = document.getElementsByName('obsPropRD');
	for (var i = 0, length = radios.length; i < length; i++) {
		if (radios[i].checked) {
			datastreamObsProp = radios[i].value;
			break;
		}
	}
	if (datastreamObsProp < 0) {alert("No Observed Property selected");}
	radios = document.getElementsByName('sensorRD');
	for (var i = 0, length = radios.length; i < length; i++) {
		if (radios[i].checked) {
			datastreamSensor = radios[i].value;
			break;
		}
	}
	if (datastreamSensor < 0) {alert("No Sensor selected");}
	radios = document.getElementsByName('thingRD');
	for (var i = 0, length = radios.length; i < length; i++) {
		if (radios[i].checked) {
			datastreamThing = radios[i].value;
			break;
		}
	}
	if (datastreamThing < 0) {alert("No Thing selected");}
} /* END function getDatastreamLinks  */

/********************************/
/* function addDatastream           */
/********************************/

function addDatastream() {
	var info;
	getDatastreamLinks();
	$('.modal-body').empty();
	$('.modal-title').empty();	

	$('.modal-title').append("Create New Datastream");	
  var datastreamInput = '<form id="addDatastreamForm">';
	datastreamInput += 'Name: <input type="text" name="name" ><br>';
	datastreamInput += 'Description: <input type="text" name="description"><br>'; 
	datastreamInput += 'Unit of Measure Name: <input type="text" name="uomName"><br>'; 
	datastreamInput += 'Unit of Measure Symbol: <input type="text" name="uomSymbol"><br>'; 
	datastreamInput += 'Unit of Measure Definition: <input type="text" name="uomDefinition"><br>'; 
	datastreamInput += 'Phenomenon Time: <input type="text" name="phenomenonTime" value="2018-01-01"><br>'; 
	datastreamInput += 'Result Time: <input type="text" name="resultTime"><br>'; 
	datastreamInput += '<br>Thing ' + datastreamThing + " " + thingList[datastreamThing].name; 
	datastreamInput += '<br>Observed Property ' + datastreamObsProp + " " + obsPropList[datastreamObsProp].name; 
	datastreamInput += '<br>Sensor ' + datastreamSensor + " " + sensorList[datastreamSensor].name; 
	datastreamInput += '<br></form><button onclick="setDatastream()">Add datastream</button>';
	$('.modal-body').append(datastreamInput);
	$("#myModal").modal();

}

/********************************/
/* function removeDatastream           */
/********************************/
function removeDatastream(id) {
	var info;

	$('.modal-body').empty();
	$('.modal-title').empty();	

	$('.modal-title').append("Delete Datastream");	
	
  var datastreamInfo = "<b>ID:</b> "	+ id + "<br><b>Name:</b> " + datastreamList[id].name + "<br><b>Description:</b> " + datastreamList[id].description;
  datastreamInfo += "<br><b>Unit of Measure Name:</b> " + datastreamList[id].unitOfMeasurement.name;
  datastreamInfo += "<br><b>Unit of Measure Symbol:</b> " + datastreamList[id].unitOfMeasurement.symbol;
  datastreamInfo += "<br><b>Unit of Measure Definition:</b> " + datastreamList[id].unitOfMeasurement.definition;
  datastreamInfo += "<br><b>Phenomenon Time:</b> " + datastreamList[id].phenomenonTime;
	datastreamInfo += '<br><button onclick="delDatastream('+ id +')">Delete datastream</button>';
	$('.modal-body').append(datastreamInfo);
	$("#myModal").modal();

}

/********************************/
/* function delDatastream           */
/********************************/
function delDatastream(id) {
	var delUrl = urlDatastreams + "(" + id + ")";
	console.log("Deleting Datastream " + id + " at URL " + delUrl);
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
			loadDatastreams();
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
/* function setDatastream           */
/********************************/
function setDatastream() {
	var jsonData = {
  "name": "",
  "description": "",
  "observationType": "http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
  "unitOfMeasurement": {
    "name": "",
    "symbol": "",
    "definition": ""
  },
  "Thing":{'@iot.id':1},
  "ObservedProperty":{'@iot.id':1},
  "Sensor":{'@iot.id':1}
};
	var x = document.getElementById("addDatastreamForm");
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
			case "uomName":
				jsonData.unitOfMeasurement.name = x.elements[i].value;
				break;
			case "uomSymbol":
				jsonData.unitOfMeasurement.symbol = x.elements[i].value;
				break;
			case "uomDefinition":
				jsonData.unitOfMeasurement.definition = x.elements[i].value;
				break;
			default:
		}
	}
	alert(JSON.stringify(jsonData));
//	jsonData.Thing.'"@iot.id"' = datastreamThing;
	jsonData.Thing = JSON.parse('{"@iot.id":' + datastreamThing + '}');
	jsonData.ObservedProperty = JSON.parse('{"@iot.id":' + datastreamObsProp + '}');
	jsonData.Sensor = JSON.parse('{"@iot.id":' + datastreamSensor + '}');
	
	
	//alert(JSON.stringify(jsonData));
	jsonDataStr = JSON.stringify(jsonData);
	
	console.log("Posting datastream data to " + urlDatastreams);
	console.log("Post data " + JSON.stringify(jsonData));
	
	$.ajax({
		url: urlDatastreams,
		type: "POST",
		data: jsonDataStr,
		contentType: "application/json; charset=utf-8",
		success: function(data, status, xhr){
			var info;
			var outStr;
			console.log("status " + status);
			console.log("Location " + xhr.getResponseHeader('location'));
			console.log("got [" + data + "]");
			loadDatastreams();
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
	
} /* END function setDatastream           */





