var limit;
function plotFromAPI(property,dataURL){
	dataTotal = 0;
	xData = [];
	yData = [];
	if(dataURL){
		$('#myModal3 .modal-body').empty();
		$('#myModal3 .modal-title').empty();
		//$('#myModal3 .modal-footer').empty(); 
		$.get(dataURL, function (res) {
			var data = res.value;
			var dataNext = res['@iot.nextLink'];
			dataTotal = res['@iot.count'];
			$('#myModal3 .modal-title').append(dataTotal + " observations for " + property);
			
			$.each(data, function (k, v) {
				console.log(k,v);
				xData.push(v['resultTime']);
				yData.push(v['result']); 
			})
		})
		.done(function(){
			//var limit = 1000;
			if (dataTotal > limit) {
				page = 0;
				pages = parseInt(dataTotal) / parseInt(limit);
				console.log("NUMBER OF LOOPS:" + pages);
				var urlNext = '';
				while (page <= pages) {
					$('#loaderImage').show();
					page = page + 1;
					console.log("PAGE:" + page);
					urlNext = dataURL + '?$skip=' + page*limit;
					$.get(urlNext, function (res) {
						var data = res.value;
						$.each(data, function (k, v) {
							console.log(k,v);
							xData.push(v['resultTime']);
							yData.push(v['result']); 
						})
					})
					.done(function(){
						var data = [{x: xData, y: yData, type: 'scatter'}];
						Plotly.newPlot('chartDiv', data);
						$("#myModal3").modal();
					})
				}
			}
		})
	}
}
