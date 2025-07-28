// Lista de países a serem destacados
const countries = [
  'Brazil',
  'Argentina',
  'Mexico',
  'Canada',
  'United States of America',
  'Germany',
  'Italy',
  'Finland',
  'Spain',
];

// Cores
const highlightColor = '#f44336';
const defaultColor = '#070808';
const borderColor = '#222';
const hoverColor = '#FF0D0D';

// Função para detectar dispositivo móvel
function isMobileDevice() {
  return window.innerWidth <= 768;
}

// Coordenadas do Brasil (centro aproximado)
const brazilCenter = [-15.7801, -47.9292]; // Brasília
const brazilZoom = 2; // Zoom para mostrar o Brasil inteiro

// Coordenadas padrão para desktop
const defaultCenter = [20, 0];
const defaultZoom = 1;

// Função para estilizar cada país
function styleFeature(feature) {
  const name = feature.properties.ADMIN || feature.properties.name;
  const isHighlighted = countries.includes(name);
  return {
    fillColor: isHighlighted ? highlightColor : defaultColor,
    color: borderColor,
    weight: 1,
    fillOpacity: 0.85,
    opacity: 1,
    className: isHighlighted ? 'highlighted-country' : 'regular-country'
  };
}

// Função para obter o nome traduzido do país
function getTranslatedCountryName(countryName) {
  const currentLang = localStorage.getItem('site-lang') || 'pt';
  // Se o objeto translations do i18n.js existir, use ele
  if (typeof translations !== 'undefined' && translations[currentLang] && translations[currentLang][countryName]) {
    return translations[currentLang][countryName];
  }
  // Fallback para o nome original
  return countryName;
}

// Função para interatividade
function onEachFeature(feature, layer) {
  const name = feature.properties.ADMIN || feature.properties.name;
  const translatedName = getTranslatedCountryName(name);
  
  layer.on({
    mouseover: function (e) {
      const l = e.target;
      if (countries.includes(name)) {
        l.setStyle({ 
          fillColor: hoverColor,
          weight: 2,
          opacity: 1
        });
        l.bringToFront();
        showTooltip(translatedName, e.originalEvent);
        if (l._path) l._path.classList.add('country-zoom-hover');
      } else {
        l.setStyle({ fillColor: defaultColor });
      }
      l.bringToFront();
    },
    mouseout: function (e) {
      geojson.resetStyle(e.target);
      hideTooltip();
      if (e.target._path) e.target._path.classList.remove('country-zoom-hover');
    },
    mousemove: function (e) {
      if (countries.includes(name)) {
        moveTooltip(e.originalEvent);
      }
    },
  });
  // Só adiciona tooltip para países da lista
  if (countries.includes(name)) {
    layer.bindTooltip(translatedName, {sticky: true, direction: 'top', className: 'leaflet-country-tooltip'});
  }
}

// Tooltip manual para maior controle visual
let tooltipDiv;
function showTooltip(name, event) {
  if (!tooltipDiv) {
    tooltipDiv = document.createElement('div');
    tooltipDiv.style.position = 'fixed';
    tooltipDiv.style.background = 'rgba(30,30,30,0.95)';
    tooltipDiv.style.color = '#fff';
    tooltipDiv.style.padding = '6px 14px';
    tooltipDiv.style.borderRadius = '6px';
    tooltipDiv.style.fontSize = '1rem';
    tooltipDiv.style.pointerEvents = 'none';
    tooltipDiv.style.zIndex = 10000;
    document.body.appendChild(tooltipDiv);
  }
  tooltipDiv.textContent = name;
  tooltipDiv.style.display = 'block';
  moveTooltip(event);
}
function moveTooltip(event) {
  if (tooltipDiv) {
    tooltipDiv.style.left = (event.clientX + 16) + 'px';
    tooltipDiv.style.top = (event.clientY + 8) + 'px';
  }
}
function hideTooltip() {
  if (tooltipDiv) {
    tooltipDiv.style.display = 'none';
  }
}

// Função para atualizar as traduções dos países no mapa
function updateMapTranslations() {
  if (!geojson) return;
  
  geojson.eachLayer(function(layer) {
    const name = layer.feature.properties.ADMIN || layer.feature.properties.name;
    const translatedName = getTranslatedCountryName(name);
    
    if (countries.includes(name)) {
      // Atualiza o tooltip do Leaflet
      layer.unbindTooltip();
      layer.bindTooltip(translatedName, {sticky: true, direction: 'top', className: 'leaflet-country-tooltip'});
    }
  });
}

// Inicialização do mapa
let geojson;
let map; // Declaração global da variável map
document.addEventListener('DOMContentLoaded', function () {
  // Determina as configurações iniciais baseadas no dispositivo
  const isMobile = isMobileDevice();
  const initialCenter = isMobile ? brazilCenter : defaultCenter;
  const initialZoom = isMobile ? brazilZoom : defaultZoom;

  map = L.map('map', {
    zoomControl: true,
    attributionControl: false,
    scrollWheelZoom: false,
    dragging: true,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    tap: false,
  }).setView(initialCenter, initialZoom);

  // Adiciona um fundo escuro
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    minZoom: 2,
    maxZoom: 5,
    attribution: '&copy; OpenStreetMap &copy; CartoDB'
  }).addTo(map);

  // Carrega GeoJSON mundial (pequeno, simplificado)
  fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
    .then(res => res.json())
    .then(data => {
      geojson = L.geoJson(data, {
        style: styleFeature,
        onEachFeature: onEachFeature,
      }).addTo(map);
      
      // Atualiza traduções após carregar o mapa
      updateMapTranslations();
      
      // Em dispositivos móveis, adiciona uma animação suave para focar no Brasil após o carregamento
      if (isMobile) {
        setTimeout(() => {
          map.setView(brazilCenter, brazilZoom, {
            animate: true,
            duration: 1.5
          });
        }, 500);
      }
    });
});

// Listener para mudança de idioma
document.addEventListener('DOMContentLoaded', function() {
  const languageSelect = document.getElementById('language-select');
  if (languageSelect) {
    languageSelect.addEventListener('change', function() {
      setTimeout(updateMapTranslations, 200);
    });
  }
  const languageSelectMobile = document.getElementById('language-select-mobile');
  if (languageSelectMobile) {
    languageSelectMobile.addEventListener('change', function() {
      setTimeout(updateMapTranslations, 200);
    });
  }
});

// Listener para redimensionamento da janela
window.addEventListener('resize', function() {
  // Aguarda um pouco para que o redimensionamento termine
  setTimeout(() => {
    const isMobile = isMobileDevice();
    if (map && geojson) {
      if (isMobile) {
        // Se mudou para mobile, foca no Brasil
        map.setView(brazilCenter, brazilZoom, {
          animate: true,
          duration: 1.0
        });
      } else {
        // Se mudou para desktop, volta para a visualização global
        map.setView(defaultCenter, defaultZoom, {
          animate: true,
          duration: 1.0
        });
      }
    }
  }, 300);
});
