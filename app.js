var Thing = {
	'name' : '',
	'description' : '',
	'properties' : ''
};

var Location = {
	'name' : '',
	'description' : '',
	'encodingType' : '',
	'location' : {
		'type' : 'Point',
		'coordinates' : []
	}
};

var Datastream = {
	'name' : '',
	'description' : '',
	'unitOfMeasurement' : '',
	'observationType' : '',
	'observedArea' : '',
	'phenomenonTime' : '',
	'resultTime' : ''
};

var Observation = {
	'name' : '',
	'phenomenonTime' : '',
	'result' : '',
	'resultTime' : '',
	'resultQuality' : '',
	'validTime' : '',
	'parameters' : ''
};

var Sensor = {
	'name' : '',
	'description' : '',
	'encodingType' : '',
	'metadata' : ''
};

var ObservedProperty = {
	'name' : '',
	'definition' : '',
	'description' : ''
};

var FeatureOfInterest = {
	'name' : '',
	'description' : '',
	'encodingType' : '',
	'feature' : {
		'type' : 'Point',
		'coordinates' : []
	}
};

var ObsPropURL;
var ProcessURL;
var observations = [];

var urlBase = "http://5.189.139.50:8080/SensorThingsServer%2D1.0%5FBRGM/v1.0/";
var urlDatastreams = urlBase + "Datastreams";
var urlMultiDatastreams = urlBase + "MultiDatastreams";
var urlFeaturesOfInterest = urlBase + "FeaturesOfInterest";
var urlHistoricalLocations = urlBase + "HistoricalLocations";
var urlLocations = urlBase + "Locations";
var urlObservations = urlBase + "Observations";
var urlObservedProperties = urlBase + "ObservedProperties";
var urlSensors = urlBase + "Sensors";
var urlThings = urlBase + "Things";

function uriLink(str, uri) {
	var val = "<a href=\"" + uri + "\">" + str + "</a>";
	return val;
}

console.log("Accessing " + urlBase);

// get base URIs
$.ajax({
	url : urlBase,
	headers : {},
	method : 'GET',
	contentType : "application/json; charset=utf-8"
}).then(function (data, status, xhr) {
	console.log(xhr.getAllResponseHeaders());
	var info;
	var outStr;
	console.log("status " + status);
	console.log("Location " + xhr.getResponseHeader('location'));
	console.log("got [" + data + "]");
	var value = data.value;
	info = document.getElementById('Overview');
	for (var i = 0; i < value.length; i++) {
		info.innerHTML += " <br>" + uriLink(value[i].name, value[i].url);
	}
	$(document).ajaxStop(function () {
		// 0 === $.active
		console.log("ajaxStop, num active: " + $.active);
	});
});

$.ajax({
	url : urlSensors,
	headers : {},
	method : 'GET',
	contentType : "application/json; charset=utf-8"
}).then(function (data, status, xhr) {
	console.log(xhr.getAllResponseHeaders());
	var info;
	var outStr;
	console.log("status " + status);
	console.log("Location " + xhr.getResponseHeader('location'));
	console.log("got [" + data + "]");
	var value = data.value;
	info = document.getElementById('Process');
	//info.innerHTML += " <br>" + JSON.stringify(data);

	for (var i = 0; i < value.length; i++) {
		info.innerHTML += " <br>" + uriLink(value[i].name, value[i]['@iot.selfLink']);
	}

	$(document).ajaxStop(function () {
		// 0 === $.active
		console.log("ajaxStop, num active: " + $.active);
	});
});

var image = new ol.style.Circle({
		radius : 5,
		fill : null,
		stroke : new ol.style.Stroke({
			color : 'red',
			width : 1
		})
	});

var styles = {
	'Point' : new ol.style.Style({
		image : image,
		text: new ol.style.Text({
			text: '',
			scale: 1.3,
			fill: new ol.style.Fill({
			  color: '#000000'
			})
		})
	}),
	'LineString' : new ol.style.Style({
		stroke : new ol.style.Stroke({
			color : 'green',
			width : 1
		})
	}),
	'MultiLineString' : new ol.style.Style({
		stroke : new ol.style.Stroke({
			color : 'green',
			width : 1
		})
	}),
	'MultiPoint' : new ol.style.Style({
		image : image
	}),
	'MultiPolygon' : new ol.style.Style({
		stroke : new ol.style.Stroke({
			color : 'yellow',
			width : 1
		}),
		fill : new ol.style.Fill({
			color : 'rgba(255, 255, 0, 0.1)'
		})
	}),
	'Polygon' : new ol.style.Style({
		stroke : new ol.style.Stroke({
			color : 'blue',
			lineDash : [4],
			width : 3
		}),
		fill : new ol.style.Fill({
			color : 'rgba(0, 0, 255, 0.1)'
		})
	}),
	'GeometryCollection' : new ol.style.Style({
		stroke : new ol.style.Stroke({
			color : 'magenta',
			width : 2
		}),
		fill : new ol.style.Fill({
			color : 'magenta'
		}),
		image : new ol.style.Circle({
			radius : 10,
			fill : null,
			stroke : new ol.style.Stroke({
				color : 'magenta'
			})
		})
	}),
	'Circle' : new ol.style.Style({
		stroke : new ol.style.Stroke({
			color : 'red',
			width : 2
		}),
		fill : new ol.style.Fill({
			color : 'rgba(255,0,0,0.2)'
		})
	})
};

var styleFunction = function (feature) {
	return styles[feature.getGeometry().getType()];
};


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
                        text: feature.get('name'),
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


var geojsonObject = {
	'type' : 'FeatureCollection',
	'crs' : {
		'type' : 'name',
		'properties' : {
			'name' : 'EPSG:4326'
		}
	},
	'features' : []
};

$.ajax({
	url : urlLocations,
	headers : {},
	method : 'GET',
	contentType : "application/json; charset=utf-8"
}).then(function (data, status, xhr) {
	console.log(xhr.getAllResponseHeaders());
	var info;
	var outStr;
	console.log("status " + status);
	console.log("Location " + xhr.getResponseHeader('location'));
	console.log("got [" + data + "]");
	var value = data.value;
	info = document.getElementById('Location');
	//info.innerHTML += " <br>" + JSON.stringify(data);
	var locationFeature = {};
	for (var i = 0; i < value.length; i++) {
		info.innerHTML += " <br>" + uriLink(value[i].name, value[i]['@iot.selfLink']);
		info.innerHTML += " Coords: " + value[i].location.coordinates;
		geojsonObject.features[i] = {
			'type' : 'Feature',
			'geometry' : {
				'type' : 'Point',
				'coordinates' : [value[i].location.coordinates[0], value[i].location.coordinates[1]]
			},
			"properties" : {
				"name" : value[i].name,
				"id" : value[i]['@iot.id']
			}
		}
	}
	//info.innerHTML += " <br>" + JSON.stringify(geojsonObject);
	var vectorSource = new ol.source.Vector({
			features : (new ol.format.GeoJSON()).readFeatures(geojsonObject)
		});

	//vectorSource.addFeature(new ol.Feature(new ol.geom.Circle([5e6, 7e6], 1e6)));

	var vectorLayer = new ol.layer.Vector({
			source : vectorSource,
			style : computeFeatureStyle
		});
	
	
	var view = new ol.View({
				projection : 'EPSG:4326',
				center : [4.855658262, 46.292579771],
				zoom : 8
			});
	var map = new ol.Map({
			layers : [
				new ol.layer.Tile({
					source : new ol.source.OSM()
				}),
				vectorLayer
			],
			target : 'map',
			controls : ol.control.defaults({
				attributionOptions : {
					collapsible : false
				}
			}),
			view : view
		});

	var select_interaction = new ol.interaction.Select();

	select_interaction.getFeatures().on("add", function (e) {
		$('.modal-body').empty();
		$('.modal-title').empty();		 
		var feature = e.element; //the feature selected
		
		var olFeature = vectorSource.getFeatures()[1];
        var point = /** @type {ol.geom.Point} */ (olFeature.getGeometry());
        var size = /** @type {ol.Size} */ (map.getSize());
        view.centerOn(point.getCoordinates());
		
		
		//alert(e.element);
		console.log("SELECTED ELEMENT: ",e.element);
		var featureID = e.element.P.id;
		var locationName = e.element.P.name;		
		console.log("SELECTED ELEMENT IDECKO: ",featureID);
		$('.modal-title').append("Location ID: "+featureID+" Location name: " +locationName);
		var modalContent = '';
		modalContent += '<table><tr><th>Name</th><th>URL</th></tr>';
		modalContent += '<tr><td>Observations</td><td><a href="'+urlObservations+'('+featureID+')" target="_blank">'+urlObservations+'('+featureID+'</a></td></tr>';
		modalContent += '</table>';
		$('.modal-body').append(modalContent); 
		$("#myModal").modal();
		 
	});

	map.addInteraction(select_interaction);
	
	$(document).ajaxStop(function () {
		// 0 === $.active
		console.log("ajaxStop, num active: " + $.active);

	});

});
