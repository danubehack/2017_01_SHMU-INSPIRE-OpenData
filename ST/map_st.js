var map,
view;
var thingList = {};
var sensorList = {};
var propList = {};
var Thing = {
	'name': '',
	'description': '',
	'properties': ''
};

var Location = {
	'name': '',
	'description': '',
	'encodingType': '',
	'location': {
		'type': 'Point',
		'coordinates': []
	}
};

var Datastream = {
	'name': '',
	'description': '',
	'unitOfMeasurement': '',
	'observationType': '',
	'observedArea': '',
	'phenomenonTime': '',
	'resultTime': ''
};

var Observation = {
	'name': '',
	'phenomenonTime': '',
	'result': '',
	'resultTime': '',
	'resultQuality': '',
	'validTime': '',
	'parameters': ''
};

var Sensor = {
	'name': '',
	'description': '',
	'encodingType': '',
	'metadata': ''
};

var ObservedProperty = {
	'name': '',
	'definition': '',
	'description': ''
};

var FeatureOfInterest = {
	'name': '',
	'description': '',
	'encodingType': '',
	'feature': {
		'type': 'Point',
		'coordinates': []
	}
};

var ObsPropURL;
var ProcessURL;
var observations = [];

//var urlBase = "http://5.189.139.50:8080/SensorThingsServer-1.0_BRGM/v1.0/";
//var urlBase = "http://5.189.139.50:8080/SensorThingsServer-1.0_SKMETEO/v1.0/";
var urlBase = "http://5.189.139.50:8080/SensorThingsServer-1.0/v1.0/";


var urlDatastreams = urlBase + "Datastreams";
var urlMultiDatastreams = urlBase + "MultiDatastreams";
var urlFeaturesOfInterest = urlBase + "FeaturesOfInterest";
var urlHistoricalLocations = urlBase + "HistoricalLocations";
var urlLocations = urlBase + "Locations";
var urlObservations = urlBase + "Observations";
var urlObsProps = urlBase + "ObservedProperties";
var urlSensors = urlBase + "Sensors";
var urlThings = urlBase + "Things";
var urlThingLocation = urlBase + "Things?$expand=Locations";

/********************************/
/* function uriLink             */
/********************************/
function uriLink(str, uri) {
	var val = "<a href=\"" + uri + "\">" + str + "</a>";
	return val;
}




console.log("Accessing " + urlBase);

// get base URIs
var image = new ol.style.Circle({
		radius: 5,
		fill: null,
		stroke: new ol.style.Stroke({
			color: 'red',
			width: 1
		})
	});



var geojsonObject = {
	'type': 'FeatureCollection',
	'crs': {
		'type': 'name',
		'properties': {
			'name': 'EPSG:4326'
		}
	},
	'features': []
};
/*******************************/
/* $.ajax                      */
/*******************************/
$.ajax({
	url: urlThingLocation,
	headers: {},
	method: 'GET',
	contentType: "application/json; charset=utf-8"
}).then(function (data, status, xhr) {
	console.log(xhr.getAllResponseHeaders());
	var info;
	var outStr;
	console.log("status " + status);
	console.log("Location " + xhr.getResponseHeader('location'));
	console.log("got [" + data + "]");
	var value = data.value;
	var total = data['@iot.count'];
	info = document.getElementById('Location');
	//info.innerHTML += " <br>" + JSON.stringify(data);
	var locationFeature = {};
	for (var i = 0; i < value.length; i++) {
		//info.innerHTML += " <br>" + uriLink(value[i].name, value[i]['@iot.selfLink']);
		//info.innerHTML += " Coords: " + value[i].location.coordinates;
		console.log("feature " + i + " name: " + value[i].name + " locations name: " + value[i].Locations[0].name);
		geojsonObject.features[i] = {
			'type': 'Feature',
			'geometry': {
				'type': 'Point',
				'coordinates': ol.proj.transform([value[i].Locations[0].location.coordinates[0], value[i].Locations[0].location.coordinates[1]], 'EPSG:4326', 'EPSG:3857')
			},
			"properties": {
				"name": value[i].name,
				"bla": "bla",
				"iotid": value[i]['@iot.id'].toString(),
				"id": value[i]['@iot.id']
			}
		}
		thingList[value[i]['@iot.id']] = value[i];
	}
	
	/*********************************/
	/* If more than 20, page through */
	/*********************************/
	var limit = 20;
	if (total > 20) {
		page = 0;
		pages = parseInt(total) / parseInt(limit);
		console.log("NUMBER OF LOOPS:" + pages);
		var urlNext = '';
		while (page <= pages) {
			$('#loaderImage').show();
			page = page + 1;
			console.log("PAGE:" + page);
			urlNext = urlThingLocation + '?$skip=' + page * 20;
			$.get(urlNext, function (res) {
				var data = res.value;
				console.log("Got Result " + page);
				$.each(data, function (k, v) {
					var this_id = v['@iot.id'].toString();
					
					console.log("Result " + JSON.stringify(v));
					
					newFeature = {
						'type': 'Feature',
						'geometry': {
							'type': 'Point',
							'coordinates': ol.proj.transform([v.Locations[0].location.coordinates[0], v.Locations[0].location.coordinates[1]], 'EPSG:4326', 'EPSG:3857')
						},
						"properties": {
							"name": v.name,
							"bla": "bla",
							"iotid": "XX",
							"id": v['@iot.id']
						}
					}
					console.log(newFeature);
					vectorSource.addFeature(newFeature);
					thingList[v['@iot.id']] = v;
				})
				vectorSource.refresh();
			})
		}
	} /* END If more than 20, page through */
	

	
	loadObsProps();
	loadSensors();
	loadThings();
	loadDatastreams();
	
	//info.innerHTML += " <br>" + JSON.stringify(geojsonObject);
	console.log(JSON.stringify(geojsonObject));
	var vectorSource = new ol.source.Vector({
			features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
		});

	//vectorSource.addFeature(new ol.Feature(new ol.geom.Circle([5e6, 7e6], 1e6)));

	var vectorLayer = new ol.layer.Vector({
			source: vectorSource,
			style: computeFeatureStyle
		});

	view = new ol.View({
			projection: 'EPSG:3857',
			center: ol.proj.transform([16.85565,46.29257], 'EPSG:4326', 'EPSG:3857'),
			zoom: 7
		});
	map = new ol.Map({
			layers: [
				new ol.layer.Tile({
					source: new ol.source.OSM()
				}),
				vectorLayer
			],
			target: 'map',
			controls: ol.control.defaults({
				attributionOptions: {
					collapsible: false
				}
			}),
			view: view
		});

	var select_interaction = new ol.interaction.Select();
	/********************************/
	/* Display station upon click   */
	/********************************/
	select_interaction.getFeatures().on("add", function (e) {
		$('.modal-body').empty();
		$('.modal-title').empty();
		var selectedFeature = e.element; //the feature selected
		//alert(e.element);
		console.log("SELECTED ELEMENT: ", selectedFeature);
		var featureID = selectedFeature.P.id;
		var locationName = selectedFeature.P.name;
		var featureGeom = selectedFeature.getGeometry().getCoordinates();
		var lat = 45.566444711;
		var lon = 6.245431548;
		map.getView().setCenter(featureGeom)
		map.getView().setZoom(18);
		//map.getView().setCenter(ol.proj.transform(featureGeom, 'EPSG:4326', 'EPSG:3857'))
		console.log("SELECTED FEATURE GEOM: ", featureGeom);
		console.log("SELECTED ELEMENT IDECKO: ", featureID);
		$('.modal-title').append("Location ID: " + featureID + " Location name: " + locationName);
		var modalContent = '';
		modalContent += '<table><tr><th>Name</th><th>URL</th></tr>';
		//modalContent += '<tr><td>Observations</td><td><a href="'+urlObservations+'('+featureID+')" target="_blank">'+urlObservations+'('+featureID+'</a></td></tr>';
		modalContent += '<tr><td>Datastreams:&nbsp;</td><td><a href="' + urlThings + '(' + featureID + ')/Datastreams" target="_blank">' + urlThings + '(' + featureID + ')/Datastreams</a></td></tr>';
		var urlObservations = urlThings + '(' + featureID + ')/Datastreams';
		console.log(urlObservations);
		$.get(urlObservations, function (res) {
			var data = res.value;
			$.each(data, function (k, v) {
				observation = '<tr><td>Observation:&nbsp;</td><td><a href="' + urlBase + 'v1.0/' + v['Observations@iot.navigationLink'] + '" target="_blank">' + urlBase  + v['Observations@iot.navigationLink'].substr(3) + '</a></td></tr>';
				//modalContent += '<tr><td>Observation</td><td><a href="'+k+'">Data</a></td></tr>';
				$('.modal-body').append(observation);
			})
		})
		modalContent += '</table>';
		$('.modal-body').append(modalContent);
		$("#myModal").modal();
	}); /* END Display station upon click   */

	map.addInteraction(select_interaction);
	map.on('postrender', function (event) {
		var ficre = vectorSource.getFeatures();
	});

	$(document).ajaxStop(function () {
		// 0 === $.active
		console.log("ajaxStop, num active: " + $.active);

	});
	
	/*********************************/
	/* Add all locations to select   */
	/*********************************/
	// VYHUDRUJ SELECT MENU
/*	$.each(value, function (k, v) {
		$('#locationSelect').append('<option id="' + v['@iot.id'] + '" value="' + v.Locations[0].location.coordinates + '">(' + (k + 1) + ') ' + v.name + '</option>');
	});
	var limit = 20;
	if (total > 20) {
		page = 0;
		pages = parseInt(total) / parseInt(limit);
		console.log("NUMBER OF LOOPS:" + pages);
		var urlNext = '';
		while (page <= pages) {
			$('#loaderImage').show();
			page = page + 1;
			console.log("PAGE:" + page);
			urlNext = urlLocations + '?$skip=' + page * 20;
			$.get(urlNext, function (res) {
				var data = res.value;
				$.each(data, function (k, v) {
					var vec = page * 20;
					console.log("VEC: " + vec);
					//select += ('<option value="'+v.id+'">'+v.title+' ('+v.type+')</option>');
					$('#locationSelect').append('<option id="' + v['@iot.id'] + '" value="' + v.location.coordinates + '">(' + (page * 20 + k) + ') ' + v.name + '</option>');
				})
			})
		}
	}  Add all locations to select   */
});  /* END $.ajax function  */

/********************************/
/* function zoomOn              */
/********************************/


function zoomOn(where) {
	console.log(where);
	var whereArray = where.split(",");
	console.log(whereArray);
	lon = whereArray[0];
	lat = whereArray[1];
	map.getView().setCenter(ol.proj.transform([parseFloat(lon), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857'));
	map.getView().setZoom(18);
}

/********************************/
/* Style Stuff                  */
/********************************/
var styles = {
	'Point': new ol.style.Style({
		image: image,
		text: new ol.style.Text({
			text: '',
			scale: 1.3,
			fill: new ol.style.Fill({
				color: '#000000'
			})
		})
	}),
	'LineString': new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'green',
			width: 1
		})
	}),
	'MultiLineString': new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'green',
			width: 1
		})
	}),
	'MultiPoint': new ol.style.Style({
		image: image
	}),
	'MultiPolygon': new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'yellow',
			width: 1
		}),
		fill: new ol.style.Fill({
			color: 'rgba(255, 255, 0, 0.1)'
		})
	}),
	'Polygon': new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'blue',
			lineDash: [4],
			width: 3
		}),
		fill: new ol.style.Fill({
			color: 'rgba(0, 0, 255, 0.1)'
		})
	}),
	'GeometryCollection': new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'magenta',
			width: 2
		}),
		fill: new ol.style.Fill({
			color: 'magenta'
		}),
		image: new ol.style.Circle({
			radius: 10,
			fill: null,
			stroke: new ol.style.Stroke({
				color: 'magenta'
			})
		})
	}),
	'Circle': new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'red',
			width: 2
		}),
		fill: new ol.style.Fill({
			color: 'rgba(255,0,0,0.2)'
		})
	})
};

var styleFunction = function (feature) {
	return styles[feature.getGeometry().getType()];
};
/********************************/
/* function computeFeatureStyle */
/********************************/
function computeFeatureStyle(feature) {
	return new ol.style.Style({
		image: new ol.style.Circle({
			radius: 20,
			fill: new ol.style.Fill({
				color: 'rgba(100,50,200,0.5)'
			}),
			stroke: new ol.style.Stroke({
				color: 'rgba(120,30,100,0.8)',
				width: 3
			})
		}),
		text: new ol.style.Text({
			font: '12px helvetica,sans-serif',
			text: feature.get('iotid'),
			rotation: 0,
			fill: new ol.style.Fill({
				color: '#000'
			}),
			stroke: new ol.style.Stroke({
				color: '#fff',
				width: 2
			})
		})
	});
}

