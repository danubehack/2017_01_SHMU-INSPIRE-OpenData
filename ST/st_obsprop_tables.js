
/*********************************/
/* function loadObsProps          */
/*********************************/	
function loadObsProps() {
	console.log("In loadObsProps " + urlObsProps);
	obsPropList = {};
	$.get(urlObsProps, function (res) {
		var data = res.value;
		console.log("Accessed URL " + urlObsProps + " Got ObsProps Result " + JSON.stringify(data));
		$.each(data, function (k, v) {
			var this_id = v['@iot.id'].toString();
			console.log("ObsProps Result " + JSON.stringify(v));
			obsPropList[v['@iot.id']] = v;
		})
		showObsProps();
	})	
}/* END function loadObsProps       */	


/********************************/
/* function showObsProps         */
/********************************/
function showObsProps() {
	// showObsPropsSelect
	var info;
	//var opt = document.createElement("option");
	var obsPropLink;
	console.log("In showObsProps ");
	info = document.getElementById('ObsProp');
	info.innerHTML = '<b>ObsProps <a id="demo" onclick="addObsProp()"> <img src="plus.png" alt="Add ObsProp"> </a></b><form id="showObsPropsForm">';
	$.each(obsPropList, function (k, v) {
		console.log("ObsProps " + k + " " + v.name);
		//opt.value = k;
		obsPropLink = '<a id="demo" onclick="showObsProp(' + k + ')">ObsProp(' + k + "): " + v.name + "</a>"; 
		obsPropLink += '<a id="del_'+ k +'" onclick="removeObsProp('+ k +')"> <img src="minus.png" alt="Delete ObsProp"> </a>';
		//opt.text = obsPropLink;
		//document.getElementById("showObsPropsSelect").options.add(opt);
		info.innerHTML += '<br><input type="radio" name="obsPropRD" value="' + k + '">';
		info.innerHTML += obsPropLink; 
	})
	info.innerHTML += '</form>';
}


/********************************/
/* function showObsProp          */
/********************************/
function showObsProp(id) {
	
	$('.modal-body').empty();
	$('.modal-title').empty();	

	$('.modal-title').append("ObsProp Information id: " + id + "  name: " + obsPropList[id].name);	
  var obsPropInfo = "<b>ID:</b> "	+ id + "<br><b>Name:</b> " + obsPropList[id].name;
	obsPropInfo += "<br><b>Description:</b> " + obsPropList[id].description;
  obsPropInfo += "<br><b>Definition:</b> " + obsPropList[id].definition;
  obsPropInfo += '<br><b>Self Link:</b> <a href="' + obsPropList[id]['@iot.selfLink'] + '">' + obsPropList[id]['@iot.selfLink'] + '</a>';
	$('.modal-body').append(obsPropInfo);
	$("#myModal").modal();
}


/********************************/
/* function addObsProp           */
/********************************/
function addObsProp() {
	var info;

	$('.modal-body').empty();
	$('.modal-title').empty();	

	$('.modal-title').append("Create New ObsProp");	
  var obsPropInput = '<form id="addObsPropForm">';
	obsPropInput += 'Name: <input type="text" name="name" ><br>';
	obsPropInput += 'Description: <input type="text" name="description"><br>'; 
	obsPropInput += 'Definition Link: <input type="text" name="definition"><br>'; 
	obsPropInput += '</form><button onclick="setObsProp()">Add obsProp</button>';
	$('.modal-body').append(obsPropInput);
	$("#myModal").modal();

}

/********************************/
/* function removeObsProp           */
/********************************/
function removeObsProp(id) {
	var info;

	$('.modal-body').empty();
	$('.modal-title').empty();	

	$('.modal-title').append("Delete ObsProp");	
	
  var obsPropInfo = "<b>ID:</b> "	+ id + "<br><b>Name:</b> " + obsPropList[id].name + "<br><b>Description:</b> " + obsPropList[id].description;
  obsPropInfo += "<br><b>Definition:</b> " + obsPropList[id].definition;
	
	obsPropInfo += '<br><button onclick="delObsProp('+ id +')">Delete Observed Property</button>';	
	
	$('.modal-body').append(obsPropInfo);
	$("#myModal").modal();

}

/********************************/
/* function delObsProp           */
/********************************/
function delObsProp(id) {
	var delUrl = urlObsProps + "(" + id + ")";
	console.log("Deleting ObsProp " + id + " at URL " + delUrl);
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
			loadObsProps();
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
/* function setObsProp           */
/********************************/
function setObsProp() {
	var jsonData = {
    "name" : "name",
    "description" : "description",
		"definition": "http://definition.org/"
  };
	var x = document.getElementById("addObsPropForm");
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
			case "definition":
				jsonData.definition = x.elements[i].value;
				break;
			default:
		}
	}		
	//alert(JSON.stringify(jsonData));
	jsonDataStr = JSON.stringify(jsonData);
	
	console.log("Posting obsProp data to " + urlObsProps);
	console.log("Post data " + JSON.stringify(jsonData));
	
	$.ajax({
		url: urlObsProps,
		type: "POST",
		data: jsonDataStr,
		contentType: "application/json; charset=utf-8",
		success: function(data, status, xhr){
			var info;
			var outStr;
			console.log("status " + status);
			console.log("Location " + xhr.getResponseHeader('location'));
			console.log("got [" + data + "]");
			loadObsProps();
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
	
} /* END function setObsProp           */





