var app;

require(["dojo/dom",
              "dojo/_base/array",
              "esri/Color",
              "esri/map",
              "esri/graphic",
              "esri/graphicsUtils",
              "esri/tasks/Geoprocessor",
              "esri/tasks/FeatureSet",
              "esri/tasks/LinearUnit",
              "esri/symbols/SimpleMarkerSymbol",
              "esri/symbols/SimpleLineSymbol",
              "esri/symbols/SimpleFillSymbol"
              ],
        function(dom, array,Color, Map, Graphic, graphicsUtils, Geoprocessor, FeatureSet, LinearUnit, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol){

          var map, gp;
          var featureSet = new FeatureSet();
          var features_volume;

          /*Initialize map, GP*/

            map = new Map("mapDiv", {
              basemap: "streets",
              center: [110.60, 31.50],
              zoom: 9
            });

            var rasterLayer = new esri.layers.ArcGISDynamicMapServiceLayer("http://geoserver.byu.edu/arcgis/rest/services/SherryJake/HydroProspectorDEMfile/MapServer");
            map.addLayer(rasterLayer);

            gp = new Geoprocessor("http://geoserver.byu.edu/arcgis/rest/services/SherryJake/HPVolumeScript/GPServer/HydroProspector");
            gp.setOutputSpatialReference({
              wkid: 102100
            });
            map.on("click", addDamPoint);

          function addDamPoint(evt) {
            map.graphics.clear();
            var pointSymbol = new SimpleMarkerSymbol();

            pointSymbol.setSize(14);
            pointSymbol.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1));
            pointSymbol.setColor(new Color([0, 255, 0, 0.25]));

            var graphic = new Graphic(evt.mapPoint, pointSymbol);
            map.graphics.add(graphic);

            if(map.getZoom() < 14){
              map.setZoom(14);
            }

            var features = [];
            features.push(graphic);
            featureSet.features = features;
          }

          function run_service(){
            //var dam_ele = document.getElementById("dam_ele").value;
            var dam_h = document.getElementById("dam_h").value;

            var params = {
              "Point": featureSet,
              "dam_h": dam_h
            };

            gp.submitJob(params, completeCallback, statusCallback);
          }

          function statusCallback(jobInfo) {
            console.log(jobInfo.jobStatus);
            if (jobInfo.jobStatus === "esriJobSubmitted") {
              $("#volstatus").html("<h7 style='color:blue'><b>Job submitted...</b></h7>");
            } else if (jobInfo.jobStatus === "esriJobExecuting") {
                $("#volstatus").html("<h7 style='color:red;'><b>Calculating...</b></h7>");
            } else if (jobInfo.jobStatus === "esriJobSucceeded") {
                $("#volstatus").html("<h7 style='color:green;'><b>Succeed!</b></h7>");
            }
          }

          function completeCallback(jobInfo) {
            console.log("getting data");
            gp.getResultData(jobInfo.jobId, "watershed_poly", displayWatershed);
            gp.getResultData(jobInfo.jobId, "Lake_poly", displayLake);
            gp.getResultData(jobInfo.jobId, "lake_volume_txt", displayVolume);
          }

          function displayWatershed(result, messages) {
            var simpleLineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                    new dojo.Color([0,0,205]), 3);
            var features = result.value.features;
            for (var f=0, fl=features.length; f<fl; f++) {
              var feature = features[f];
              feature.setSymbol(simpleLineSymbol);
              map.graphics.add(feature);
            }
          }

          function displayLake(result, messages) {
            var polySymbol = new SimpleFillSymbol();
            polySymbol.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0, 0.5]), 1));
            polySymbol.setColor(new Color([0, 245, 255, 0.7]));
            var features = result.value.features;
            for (var f = 0, fl = features.length; f < fl; f++) {
              var feature = features[f];
              feature.setSymbol(polySymbol);
              map.graphics.add(feature);
            }
            map.setExtent(graphicsUtils.graphicsExtent(map.graphics.graphics), true);
          }

          function displayVolume(result, messages) {
            features_volume = result.value.features;
            var volume = features_volume[0].attributes.Volume;
            console.log(volume);
            volume_km = parseFloat(volume)/1233.48;

            $("#volume").html("<p style='color:black;'><b>Reservoir Volume (acre-ft):</p>" + volume_km )

          }
          //adds public functions to variable app
          app = {run_service: run_service};
    });
