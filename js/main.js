/**
 * ============================================
 * MAIN ENTRY POINT
 * Solar System 3D - Initialization & Animation
 * ============================================
 */

var scene, camera, renderer, controls;
var stars, nebula, sunGroup, asteroidGroup, kuiperGroup, comet, constellationLines;
var planetModule, effectsModule, controlsModule;
var planetData;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510);
    
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        15000
    );
    
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 20;
    controls.maxDistance = 3000;
    
    setupLighting();
    setupEffects();
    setupPlanets();
    setupControls();
    
    camera.position.set(0, 600, 0);
    camera.lookAt(0, 0, 0);
    controls.update();
    
    window.addEventListener('resize', onWindowResize);
    
    startLoading();
}

function setupLighting() {
    var ambientLight = new THREE.AmbientLight(0x222233, 0.5);
    scene.add(ambientLight);
    
    var sunLight = new THREE.PointLight(0xffffee, 3, 4000);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);
}

function setupEffects() {
    effectsModule = {
        createStars: createStars,
        createNebula: createNebula,
        createAsteroidBelt: createAsteroidBelt,
        createKuiperBelt: createKuiperBelt,
        createComet: createComet,
        createConstellations: createConstellations,
        createSun: createSun,
        asteroidGroup: null,
        kuiperGroup: null,
        comet: null,
        constellationLines: null,
        sunGroup: null
    };
    
    stars = createStars(scene);
    nebula = createNebula(scene);
    sunGroup = createSun(scene);
    effectsModule.sunGroup = sunGroup;
    
    asteroidGroup = createAsteroidBelt(scene);
    effectsModule.asteroidGroup = asteroidGroup;
    
    kuiperGroup = createKuiperBelt(scene);
    effectsModule.kuiperGroup = kuiperGroup;
    
    comet = createComet(scene);
    effectsModule.comet = comet;
    
    constellationLines = createConstellations(scene);
    effectsModule.constellationLines = constellationLines;
}

function setupPlanets() {
    planetModule = {
        initPlanetSystem: initPlanetSystem,
        createPlanet: createPlanet,
        createMoon: createMoon,
        createAllPlanets: createAllPlanets,
        updatePlanets: updatePlanets,
        updateMoon: updateMoon,
        toggleOrbits: toggleOrbits,
        toggleTrails: toggleTrails,
        getPlanet: getPlanet,
        getPlanetMeshes: getPlanetMeshes,
        planets: planets,
        orbits: orbits,
        planetTrails: planetTrails
    };
    
    initPlanetSystem(scene, planetData);
    createAllPlanets();
}

function setupControls() {
    controlsModule = {
        initControls: initControls,
        setModules: setModules,
        setupKeyboardControls: setupKeyboardControls,
        setupMouseControls: setupMouseControls,
        setupUIEventListeners: setupUIEventListeners,
        getState: getState,
        updateCamera: updateCamera,
        updateDate: updateDate,
        keys: keys
    };
    
    initControls(camera, renderer, scene, controls);
    
    controlsModule.setModules(
        planetModule,
        effectsModule,
        updatePlanetInfo,
        showNotification,
        takeScreenshot
    );
}

function updatePlanetInfo(planetName) {
    var data = planetData[planetName];
    if (!data) return;
    
    document.getElementById('planetName').textContent = data.name;
    document.getElementById('planetType').textContent = data.type;
    document.getElementById('planetDistance').textContent = data.distance;
    document.getElementById('planetPeriod').textContent = data.period;
    document.getElementById('planetDiameter').textContent = data.diameter;
    document.getElementById('planetMoons').textContent = data.moons;
    document.getElementById('planetDay').textContent = data.day;
    document.getElementById('planetGravity').textContent = data.gravity;
    document.getElementById('planetDescription').textContent = data.description;
    
    var icon = document.getElementById('planetIcon');
    icon.style.background = 'radial-gradient(circle, #' + data.color.toString(16).padStart(6, '0') + ', #' + data.emissive.toString(16).padStart(6, '0') + ')';
    
    document.getElementById('planetInfo').classList.add('active');
}

function showNotification(message) {
    var notif = document.getElementById('notification');
    notif.textContent = message;
    notif.classList.add('show');
    setTimeout(function() { notif.classList.remove('show'); }, 2000);
}

function takeScreenshot() {
    renderer.render(scene, camera);
    var link = document.createElement('a');
    link.download = 'solar-system-' + Date.now() + '.png';
    link.href = renderer.domElement.toDataURL('image/png');
    link.click();
    showNotification('Screenshot saved!');
}

function startLoading() {
    var loadingStatus = document.getElementById('loadingStatus');
    var loadSteps = [
        'Generating stellar fields...',
        'Creating planetary bodies...',
        'Calculating orbits...',
        'Loading solar corona...',
        'Preparing asteroid belts...',
        'Calibrating sensors...'
    ];
    
    var loadStep = 0;
    var loadInterval = setInterval(function() {
        if (loadStep < loadSteps.length) {
            loadingStatus.textContent = loadSteps[loadStep];
            loadStep++;
        }
    }, 400);
    
    setTimeout(function() {
        clearInterval(loadInterval);
        loadingStatus.textContent = 'Launch complete!';
        document.getElementById('loading').classList.add('hidden');
        updatePlanetInfo('earth');
        animate();
    }, 3000);
}

function animate() {
    requestAnimationFrame(animate);
    
    var state = controlsModule.getState();
    var timeSpeed = state.timeSpeed;
    var isPaused = state.isPaused;
    
    if (!isPaused) {
        controlsModule.updateDate();
        
        updatePlanets(timeSpeed, state.showTrails);
        updateMoon(timeSpeed);
        
        if (comet.visible) {
            comet.userData.angle += comet.userData.orbitSpeed * 0.008 * timeSpeed;
            comet.position.x = Math.cos(comet.userData.angle) * comet.userData.orbitRadius;
            comet.position.z = Math.sin(comet.userData.angle) * comet.userData.orbitRadius;
            comet.position.y = Math.sin(comet.userData.angle * 2) * comet.userData.orbitRadius * comet.userData.tilt;
            
            var tailAngle = Math.atan2(comet.position.z, comet.position.x);
            comet.rotation.y = tailAngle + Math.PI;
        }
        
        asteroidGroup.rotation.y += 0.00015 * timeSpeed;
        kuiperGroup.rotation.y += 0.00008 * timeSpeed;
        
        sunGroup.rotation.y += 0.0008;
        
        stars.rotation.y += 0.00002;
    }
    
    controlsModule.updateCamera();
    controls.update();
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('DOMContentLoaded', init);
