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

          /*Initialize map, GP*/

            map = new Map("mapDiv", {
              basemap: "streets",
              center: [110.60, 31.50],
              zoom: 9
            });

            var rasterLayer = new esri.layers.ArcGISDynamicMapServiceLayer("http://geoserver.byu.edu/arcgis/rest/services/SherryJake/HydroProspectorDEMfile/MapServer");
            map.addLayer(rasterLayer);

            gp = new Geoprocessor("http://geoserver.byu.edu/arcgis/rest/services/SherryJake/HydroProspectorScript/GPServer/HydroProspector");
            gp.setOutputSpatialReference({
              wkid: 102100
            });
            map.on("click", computeViewShed);

          function computeViewShed(evt) {
            map.graphics.clear();
            var pointSymbol = new SimpleMarkerSymbol();
            pointSymbol.setSize(14);
            pointSymbol.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1));
            pointSymbol.setColor(new Color([0, 255, 0, 0.25]));

            var graphic = new Graphic(evt.mapPoint, pointSymbol);
            map.graphics.add(graphic);

            var features = [];
            features.push(graphic);
            var featureSet = new FeatureSet();
            featureSet.features = features;


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
            }
            function completeCallback(jobInfo) {
              console.log("getting data");
              gp.getResultData(jobInfo.jobId, "watershed_poly", displayWatershed);
              gp.getResultData(jobInfo.jobId, "Lake_poly", displayLake);
            }

            function displayWatershed(result, messages) {
              var simpleLineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                      new dojo.Color([0,0,205]), 1);
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
    });
