

/********************************/
/* function showProps           */
/********************************/
function showProps() {
	var info;
	info = document.getElementById('ObsProp');
	$.each(propList, function (k, v) {
		info.innerHTML += "<br>Property(" + k + "): " + v.name;
		//		info.innerHTML += "<br>Property(" + k + "): " + v.name + "<br>Definition: " + v.definition + "<br>Description: " + v.description;
	})
}
