
/*********************************/
/* function loadThings          */
/*********************************/	
function loadThings() {
	console.log("In loadThings " + urlThings);
	thingList = {};
	$.get(urlThingLocation, function (res) {
		var data = res.value;
		console.log("Accessed URL " + urlThings + " Got Things Result " + JSON.stringify(data));
		$.each(data, function (k, v) {
			var this_id = v['@iot.id'].toString();
			console.log("Things Result " + JSON.stringify(v));
			thingList[v['@iot.id']] = v;
		})
		showThings();
	})	
}/* END function loadThings       */	


/********************************/
/* function showThings         */
/********************************/
function showThings() {
	// showThingsSelect
	var info;
	//var opt = document.createElement("option");
	var thingLink;
	console.log("In showThings ");
	info = document.getElementById('Thing');
	info.innerHTML = '<b>Things <a id="demo" onclick="addThing()"> <img src="plus.png" alt="Add Thing"> </a></b><form id="showThingsForm">';
	$.each(thingList, function (k, v) {
		console.log("Things " + k + " " + v.name);
		//opt.value = k;
		thingLink = '<a id="demo" onclick="showThing(' + k + ')">Thing(' + k + "): " + v.name + "</a>"; 
		thingLink += '<a id="del_'+ k +'" onclick="removeThing('+ k +')"> <img src="minus.png" alt="Delete Thing"> </a>';
		//opt.text = thingLink;
		//document.getElementById("showThingsSelect").options.add(opt);
		info.innerHTML += '<br><input type="radio" name="thingRD" value="' + k + '">';
		info.innerHTML += thingLink; 
	})
	info.innerHTML += '</form>';
}


/********************************/
/* function showThing          */
/********************************/
function showThing(id) {
	
	$('.modal-body').empty();
	$('.modal-title').empty();	

	$('.modal-title').append("Thing Information id: " + id + "  name: " + thingList[id].name);	
  var thingInfo = "<b>ID:</b> "	+ id + "<br><b>Name:</b> " + thingList[id].name + "<br><b>Description:</b> " + thingList[id].description;
  thingInfo += "<br><b>Namespace:</b> " + thingList[id].properties.namespace;
  thingInfo += "<br><b>Media Monitored:</b> " + thingList[id].properties.mediamonitored;
  thingInfo += "<br><b>Measurement Regime:</b> " + thingList[id].properties.measurementregime;
  thingInfo += "<br><b>Mobile:</b> " + thingList[id].properties.mobile;
  thingInfo += "<br><b>Process Type:</b> " + thingList[id].properties.processtype;
  thingInfo += "<br><b>Result Nature:</b> " + thingList[id].properties.resultnature;
  thingInfo += "<br><b>Start Date:</b> " + thingList[id].properties.startdate;
  thingInfo += "<br><b>End Date:</b> " + thingList[id].properties.enddate;
  thingInfo += "<br><b>Location:</b> " + thingList[id].Locations[0].location.coordinates;
	thingInfo += '<br><b>Self Link:</b> <a href="' + thingList[id]['@iot.selfLink'] + '">' + thingList[id]['@iot.selfLink'] + '</a>';
	
	$('.modal-body').append(thingInfo);
	$("#myModal").modal();
}


/********************************/
/* function addThing           */
/********************************/
function addThing() {
	var info;

	$('.modal-body').empty();
	$('.modal-title').empty();	

	$('.modal-title').append("Create New Thing");	
  var thingInput = '<form id="addThingForm">';
	thingInput += 'Name: <input type="text" name="name" ><br>';
	thingInput += 'Description: <input type="text" name="description"><br>'; 
	thingInput += 'Namespace: <input type="text" name="namespace" value="data.datacove.eu"><br>'; 
	thingInput += 'Media Monitored: <input type="text" name="mediamonitored" value="water"><br>'; 
	thingInput += 'Measurement Regime: <input type="text" name="measurementregime" value="continuous"><br>'; 
	thingInput += 'Mobile: <select type="text" name="mobile" value="false"><option value="true">True</option><option value="false">False</option></select> <br>'; 
	thingInput += 'Process Type: <input type="text" name="processtype" value="inspire"><br>'; 
	thingInput += 'Result Nature: <input type="text" name="resultnature" value="primary"><br>'; 
	thingInput += 'Start Date: <input type="text" name="startdate" value="2017-01-01"><br>'; 
	thingInput += 'End Date: <input type="text" name="enddate" value="2018-01-01"><br>'; 
	thingInput += 'Location: <input type="text" name="location" value="[16.855658262,46.292579771]"><br>'; 
	thingInput += '</form><button onclick="setThing()">Add thing</button>';
	$('.modal-body').append(thingInput);
	$("#myModal").modal();

}

/********************************/
/* function removeThing           */
/********************************/
function removeThing(id) {
	var info;

	$('.modal-body').empty();
	$('.modal-title').empty();	

	$('.modal-title').append("Delete Thing");	
	
  var thingInfo = "<b>ID:</b> "	+ id + "<br><b>Name:</b> " + thingList[id].name + "<br><b>Description:</b> " + thingList[id].description;
  thingInfo += "<br><b>Namespace:</b> " + thingList[id].properties.namespace;
  thingInfo += "<br><b>Media Monitored:</b> " + thingList[id].properties.mediamonitored;
  thingInfo += "<br><b>Measurement Regime:</b> " + thingList[id].properties.measurementregime;
  thingInfo += "<br><b>Mobile:</b> " + thingList[id].properties.mobile;
  thingInfo += "<br><b>Process Type:</b> " + thingList[id].properties.processtype;
  thingInfo += "<br><b>Result Nature:</b> " + thingList[id].properties.resultnature;
  thingInfo += "<br><b>Start Date:</b> " + thingList[id].properties.startdate;
  thingInfo += "<br><b>End Date:</b> " + thingList[id].properties.enddate;
  //thingInfo += "<br><b>Location:</b> " + thingList[id].Locations.location.coordinates;
	thingInfo += '<br><button onclick="delThing('+ id +')">Delete thing</button>';
	$('.modal-body').append(thingInfo);
	$("#myModal").modal();

}

/********************************/
/* function delThing           */
/********************************/
function delThing(id) {
	var delUrl = urlThings + "(" + id + ")";
	console.log("Deleting Thing " + id + " at URL " + delUrl);
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
			loadThings();
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
/* function setThing           */
/********************************/
function setThing() {
	var jsonData = {
    "name" : "",
    "description" : "",
    "properties" : {},
		"Locations": [{
			"name": "",
			"description": "",
			"encodingType": "application/vnd.geo+json",
			"location": {
				"type": "Point",
				"coordinates": [16.855658262,46.292579771]
			}
		}]
  };
	var x = document.getElementById("addThingForm");
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
			case "namespace":
				jsonData.properties.namespace = x.elements[i].value;
				break;
			case "mediamonitored":
				jsonData.properties.mediamonitored = x.elements[i].value;
				break;
			case "measurementregime":
				jsonData.properties.measurementregime = x.elements[i].value;
				break;
			case "mobile":
				jsonData.properties.mobile = x.elements[i].value;
				break;
			case "processtype":
				jsonData.properties.processtype = x.elements[i].value;
				break;
			case "resultnature":
				jsonData.properties.resultnature = x.elements[i].value;
				break;
			case "startdate":
				jsonData.properties.startdate = x.elements[i].value;
				break;
			case "enddate":
				jsonData.properties.enddate = x.elements[i].value;
				break;
			case "location":
				jsonData.Locations[0].location.coordinates = JSON.parse(x.elements[i].value);
				break;
			default:
		}
	}		
	
	
	//alert(JSON.stringify(jsonData));
	jsonDataStr = JSON.stringify(jsonData);
	
	console.log("Posting thing data to " + urlThings);
	console.log("Post data " + JSON.stringify(jsonData));
	
	$.ajax({
		url: urlThings,
		type: "POST",
		data: jsonDataStr,
		contentType: "application/json; charset=utf-8",
		success: function(data, status, xhr){
			var info;
			var outStr;
			console.log("status " + status);
			console.log("Location " + xhr.getResponseHeader('location'));
			console.log("got [" + data + "]");
			loadThings();
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
	
} /* END function setThing           */





