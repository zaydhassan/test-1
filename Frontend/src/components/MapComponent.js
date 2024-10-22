import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ isSidebarOpen, attackSpeed }) => {
  const mapRef = useRef(null); // Store the Leaflet map instance

  useEffect(() => {
    // Initialize the map and store it in mapRef
    const map = L.map('map', {
      zoomControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      dragging: false,
      attributionControl: false,
      maxBounds: [[-90, -180], [90, 180]],
      maxBoundsViscosity: 1.0,
    }).setView([40, 0], 1.5);

    mapRef.current = map; // Store map instance

    map.createPane('backgroundPane');
    map.getPane('backgroundPane').style.zIndex = 100;

    // Add background rectangle to map
    L.rectangle([[-90, -180], [90, 180]], {
      color: '#000000',
      fillColor: '#000000',
      fillOpacity: 1,
      pane: 'backgroundPane',
    }).addTo(map);

    // Load GeoJSON for countries
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then((response) => response.json())
      .then((data) => {
        L.geoJSON(data, {
          style: {
            color: '#4A90E2',
            weight: 0.5,
            fillColor: '#000000',
            fillOpacity: 0.5,
          },
          onEachFeature: function (feature, layer) {
            layer.on({
              mouseover: function () {
                layer.setStyle({
                  color: '#4A90E2',
                  weight: 1.5,
                  dashArray: '5, 5',
                  fillColor: '#4A90E2',
                  fillOpacity: 0.5,
                });
              },
              mouseout: function () {
                layer.setStyle({
                  color: '#4A90E2',
                  weight: 0.5,
                  dashArray: '',
                  fillColor: '#000000',
                  fillOpacity: 0.5,
                });
              },
            });
          },
        }).addTo(map);
      });

    const svgLayer = d3.select(map.getPanes().overlayPane).append('svg'),
    g = svgLayer.append('g').attr('class', 'leaflet-zoom-hide');

    let currentIndex = 0;

    function projectPoint(latlng) {
      const point = map.latLngToLayerPoint(new L.LatLng(latlng[0], latlng[1]));
      return [point.x, point.y];
    }

    function createGradient(id, color) {
      const svgDefs = svgLayer.append('defs');

      const radialGradient = svgDefs.append('radialGradient')
        .attr('id', id)
        .attr('cx', '50%')
        .attr('cy', '50%')
        .attr('r', '50%');

      radialGradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', color)
        .attr('stop-opacity', 1);

      radialGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', color)
        .attr('stop-opacity', 0);
    }

    function showNextAttack(attackData) {
      if (currentIndex >= attackData.length) {
        currentIndex = 0;
      }

      const attack = attackData[currentIndex++];
      const source = projectPoint(attack.source);
      const destination = projectPoint(attack.destination);

      const midPoint = [
        (source[0] + destination[0]) / 2 + 100,
        (source[1] + destination[1]) / 2,
      ];

      let lineColor;
      switch (attack.threatType) {
        case 'malware':
          lineColor = 'red';
          break;
        case 'phishing':
          lineColor = 'purple';
          break;
        case 'exploit':
          lineColor = 'yellow';
          break;
        default:
          lineColor = 'white';
      }

      const lineGenerator = d3.line()
        .curve(d3.curveBundle.beta(1))
        .x((d) => d[0])
        .y((d) => d[1]);

      g.append('path')
        .datum([source, midPoint, destination])
        .attr('class', 'attack-line')
        .attr('d', lineGenerator)
        .attr('stroke', lineColor)
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', function () {
          return this.getTotalLength();
        })
        .attr('stroke-dashoffset', function () {
          return this.getTotalLength();
        })
        .transition()
        .duration(attackSpeed)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0)
        .on('start', function () {
          const gradientId = `fadeGradient-${currentIndex}`;
          createGradient(gradientId, lineColor);
          g.append('circle')
            .attr('cx', source[0])
            .attr('cy', source[1])
            .attr('r', 5)
            .attr('fill', `url(#${gradientId})`)
            .attr('opacity', 0)
            .transition()
            .duration(1000)
            .ease(d3.easeBounceOut)
            .attr('r', 15)
            .attr('opacity', 1)
            .transition()
            .duration(500)
            .attr('r', 0)
            .attr('opacity', 0)
            .remove();
        })
        .on('end', function () {
          const gradientId = `fadeGradient-${currentIndex}-end`;
          createGradient(gradientId, lineColor);
          g.append('circle')
            .attr('cx', destination[0])
            .attr('cy', destination[1])
            .attr('r', 5)
            .attr('fill', `url(#${gradientId})`)
            .attr('opacity', 0)
            .transition()
            .duration(1000)
            .ease(d3.easeBounceOut)
            .attr('r', 15)
            .attr('opacity', 1)
            .transition()
            .duration(500)
            .attr('r', 0)
            .attr('opacity, 0')
            .remove();
          d3.select(this)
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr('stroke-dashoffset', -this.getTotalLength())
            .remove();

          showNextAttack(attackData);
        });

      const attackInfo = `${attack.sourceName} ➔ ${attack.destinationName} (${attack.threatType})`;

      d3.select('#activeAttacksList').append('li').text(attackInfo).transition().duration(attackSpeed).remove();
    }

    function reset(attackData) {
      const bounds = map.getBounds(),
        topLeft = map.latLngToLayerPoint(bounds.getNorthWest()),
        bottomRight = map.latLngToLayerPoint(bounds.getSouthEast());

      svgLayer
        .attr('width', bottomRight.x - topLeft.x)
        .attr('height', bottomRight.y - topLeft.y)
        .style('left', `${topLeft.x}px`)
        .style('top', `${topLeft.y}px`);

      g.attr('transform', `translate(${-topLeft.x}, ${-topLeft.y})`);

      showNextAttack(attackData);
    }

    fetch('/attackData.json')
      .then((response) => response.json())
      .then((attackData) => {
        map.on('moveend', () => reset(attackData));
        reset(attackData);
      });

    return () => {
      map.off('moveend');
      map.remove();
    };
  }, [attackSpeed]);

  // Adjust map size on sidebar toggle
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 400);
    }
  }, [isSidebarOpen]);

  return <div id="map" className={isSidebarOpen ? 'map-shrink' : 'map-expand'}></div>;
};

export default MapComponent;
