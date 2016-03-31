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
        function(dom, array, Color, Map, Graphic, graphicsUtils, Geoprocessor, FeatureSet, LinearUnit, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol){

          var map, gp;

          /*Initialize map, GP*/

            map = new Map("mapDiv", {
              basemap: "streets",
              center: [111.18, 31.15],
              zoom: 8
            });

            gp = new Geoprocessor("http://geoserver.byu.edu/arcgis/rest/services/SherryJake/HydroProspectorSJ/GPServer/Tools");
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
            

            var dam_ele = document.getElementById("dam_ele").value;
            var Expression = "myCalc( !Value!,"+ dam_ele +")";

            var params = {
              "Point": featureSet,
              "Expression": Expression
            };
            gp.execute(params, drawViewshed);
          }

          function drawViewshed(results, messages) {
            var polySymbol = new SimpleFillSymbol();
            polySymbol.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0, 0.5]), 1));
            polySymbol.setColor(new Color([255, 127, 0, 0.7]));
            var features = results[0].value.features;
            for (var f = 0, fl = features.length; f < fl; f++) {
              var feature = features[f];
              feature.setSymbol(polySymbol);
              map.graphics.add(feature);
            }
            map.setExtent(graphicsUtils.graphicsExtent(map.graphics.graphics), true);
          }
    });