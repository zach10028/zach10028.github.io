

window.onload = init;

function init(){
  // EPSG: 6623 for Quebec
  proj4.defs("EPSG:6623","+proj=aea +lat_1=60 +lat_2=46 +lat_0=44 +lon_0=-68.5 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
  // defined... but now you need to register 
  ol.proj.proj4.register(proj4);



  const map = new ol.Map({
    view: new ol.View({
      center: ol.proj.fromLonLat([-73.6, 45.5], 'EPSG:6623'),
      zoom: 1,
      maxZoom: 20, 
      minZoom: 12,
      extent: ol.proj.transformExtent([-73.97878, 45.41224, -73.47309, 45.70650], 'EPSG:4326', 'EPSG:6623'),
      projection: 'EPSG:6623',
      
    }),
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    target: 'openlayers-map'
  })

  // adding POI (geojson), with styling\
  const POI_styles = function(feature){
    let poi_id = feature.get('id');
    let poi_id_str = poi_id.toString();
    const styles = [
      new ol.style.Style({
        image: new ol.style.Circle({
          fill: new ol.style.Fill({
            color: [77, 219, 105, 0.6]
          }),
          stroke: new ol.style.Stroke({
            color: [6, 125, 34, 1],
            width: 2
          }),
          radius: 12
        }),
        text: new ol.style.Text({
          text: poi_id_str,
          scale: 1.5,
          fill: new ol.style.Fill({
            color: [232, 26, 26, 1]
          }),
          stroke: new ol.style.Stroke({
            color: [232, 26, 26, 1],
            width:0.3
          })
        })
      })
    ]
    return styles
  }

  const POI_styles_selected = function(feature){
    let poi_id = feature.get('id');
    let poi_id_str = poi_id.toString();
    const styles = [
      new ol.style.Style({
        image: new ol.style.Circle({
          fill: new ol.style.Fill({
            color: [247, 26, 10, 0.5]
          }),
          stroke: new ol.style.Stroke({
            color: [6, 125, 34, 1],
            width: 2
          }),
          radius: 12
        }),
        text: new ol.style.Text({
          text: poi_id_str,
          scale: 1.5,
          fill: new ol.style.Fill({
            color: [87, 9, 9, 1]
          }),
          stroke: new ol.style.Stroke({
            color: [87, 9, 9, 1],
            width:0.3
          })
        })
      })
    ]
    return styles
  }

  const march21 = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: './data/vector_data/MTL_POI_MAR2021.geojson',
        //url: './data/vector_data/test_PostCrash2.geojson',
        format: new ol.format.GeoJSON(),

    }),
    style: POI_styles
})
  map.addLayer(march21);

  // map features click logic
  // need the name of POI and the image and the column navigation (html), need access to view. 

  const navelements = document.querySelector('.column-navigation');
  const POI_name_element = document.getElementById('POIname');
  const POI_image_element = document.getElementById('POIimage');
  const POI_image_element2 = document.getElementById('POIimage2');
  const POI_image_element3 = document.getElementById('POIimage3');

  const POI_desc_element1 = document.getElementById('POIdesc1')
  const POI_desc_element2 = document.getElementById('POIdesc2')
  const POI_desc_element3 = document.getElementById('POIdesc3')

  const POI_year_element1 = document.getElementById('POIyear1')
  const POI_year_element2 = document.getElementById('POIyear2')
  const POI_year_element3 = document.getElementById('POIyear3')

  const mapView = map.getView();

  map.on('singleclick', function(evt){
    map.forEachFeatureAtPixel(evt.pixel, function(feature, layer){
      let featureID = feature.get('id');
      let navElement = navelements.children.namedItem(featureID);
      //console.log(navElement);
      mainLogic(feature, navElement)
    })
  })

  function mainLogic(feature, clickedAnchorElement){
    // reassign active class to the clicked element
    let currentActiveStyledElement = document.querySelector('.active');
    currentActiveStyledElement.className = currentActiveStyledElement.className.replace('active', '');
    clickedAnchorElement.className = 'active';


    //change view based on the feature
    let featureCoordinates = feature.get('geometry').getCoordinates();
    //console.log(featureCoordinates); // getting coords from the geojson file, not from the click
    mapView.animate({center: featureCoordinates});
    //mapView.animate({center: featureCoordinates}, {zoom: 17});

    // changing the style for selected features. 
    // assign ALL features to the default style we created first
    // then IN THIS FUNCTION ABOVE we have accessed the selected feature
    // so outside the parenthesis we can just style differently
    // ACTIVE is the word here not selected ^
    let POI_features = march21.getSource().getFeatures();
    POI_features.forEach(function(feature){
      feature.setStyle(POI_styles);
    })
    feature.setStyle(POI_styles_selected);

    let featureName = feature.get('name');
    let featureImage = feature.get('image1');
    let featureImage2 = feature.get('image2');
    let featureImage3 = feature.get('image3');

    POI_name_element.innerHTML = featureName;

    POI_image_element.setAttribute('src', './data/static_image/' + featureImage + '.png');
    POI_image_element2.setAttribute('src', './data/static_image/' + featureImage2 + '.png');
    POI_image_element3.setAttribute('src', './data/static_image/' + featureImage3 + '.png');
  
    let featureDesc = feature.get('desc1');
    let featureDesc2 = feature.get('desc2');
    let featureDesc3 = feature.get('desc3');

    POI_desc_element1.innerHTML = featureDesc;
    POI_desc_element2.innerHTML = featureDesc2;
    POI_desc_element3.innerHTML = featureDesc3;

    let featureYear = feature.get('year1');
    let featureYear2 = feature.get('year2');
    let featureYear3 = feature.get('year3');

    POI_year_element1.innerHTML = featureYear;
    POI_year_element2.innerHTML = featureYear2;
    POI_year_element3.innerHTML = featureYear3;


  }




}