/**
 * ============================================
 * MAIN ENTRY POINT
 * Solar System 3D - Initialization & Animation
 * ============================================
 */

// Three.js core objects
let scene, camera, renderer, controls;

// Visual effects
let stars, nebula, sunGroup, asteroidGroup, kuiperGroup, comet, constellationLines;

// Planet system
let planetModule, effectsModule, controlsModule;

// ============================================
// INITIALIZATION
// ============================================

function init() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        15000
    );
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true  // For screenshots
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    // Setup OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 20;
    controls.maxDistance = 3000;
    
    // Setup lighting
    setupLighting();
    
    // Setup effects
    setupEffects();
    
    // Setup planets
    setupPlanets();
    
    // Setup controls
    setupControls();
    
    // Initial camera position
    camera.position.set(0, 600, 0);
    camera.lookAt(0, 0, 0);
    controls.update();
    
    // Setup resize handler
    window.addEventListener('resize', onWindowResize);
    
    // Start loading animation
    startLoading();
}

/**
 * Setup scene lighting
 */
function setupLighting() {
    // Ambient light (soft overall illumination)
    const ambientLight = new THREE.AmbientLight(0x222233, 0.5);
    scene.add(ambientLight);
    
    // Sun light (point light from Sun)
    const sunLight = new THREE.PointLight(0xffffee, 3, 4000);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);
}

/**
 * Setup visual effects
 */
function setupEffects() {
    effectsModule = {
        createStars,
        createNebula,
        createAsteroidBelt,
        createKuiperBelt,
        createComet,
        createConstellations,
        createSun,
        asteroidGroup: null,
        kuiperGroup: null,
        comet: null,
        constellationLines: null,
        sunGroup: null
    };
    
    // Create stars
    stars = createStars();
    
    // Create nebula
    nebula = createNebula();
    
    // Create Sun
    sunGroup = createSun();
    effectsModule.sunGroup = sunGroup;
    
    // Create asteroid belt
    asteroidGroup = createAsteroidBelt();
    effectsModule.asteroidGroup = asteroidGroup;
    
    // Create Kuiper Belt
    kuiperGroup = createKuiperBelt();
    effectsModule.kuiperGroup = kuiperGroup;
    
    // Create comet
    comet = createComet();
    effectsModule.comet = comet;
    
    // Create constellations
    constellationLines = createConstellations();
    effectsModule.constellationLines = constellationLines;
}

/**
 * Setup planets
 */
function setupPlanets() {
    planetModule = {
        initPlanetSystem,
        createPlanet,
        createMoon,
        createAllPlanets,
        updatePlanets,
        updateMoon,
        toggleOrbits,
        toggleTrails,
        getPlanet,
        getPlanetMeshes,
        planets,
        orbits,
        planetTrails
    };
    
    // Initialize planet group
    initPlanetSystem();
    
    // Create all planets
    createAllPlanets();
}

/**
 * Setup controls
 */
function setupControls() {
    controlsModule = {
        initControls,
        setModules,
        setupKeyboardControls,
        setupMouseControls,
        setupUIEventListeners,
        getState,
        updateCamera,
        updateDate,
        keys
    };
    
    // Initialize controls with Three.js references
    initControls(camera, renderer, scene, controls);
    
    // Set up module references for controls
    controlsModule.setModules(
        planetModule,
        effectsModule,
        updatePlanetInfo,
        showNotification,
        takeScreenshot
    );
}

// ============================================
// UI FUNCTIONS
// ============================================

/**
 * Update planet info panel
 */
function updatePlanetInfo(planetName) {
    const data = planetData[planetName];
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
    
    // Update icon color
    const icon = document.getElementById('planetIcon');
    icon.style.background = `radial-gradient(circle, #${data.color.toString(16).padStart(6, '0')}, #${data.emissive.toString(16).padStart(6, '0')})`;
    
    document.getElementById('planetInfo').classList.add('active');
}

/**
 * Show notification toast
 */
function showNotification(message) {
    const notif = document.getElementById('notification');
    notif.textContent = message;
    notif.classList.add('show');
    setTimeout(() => notif.classList.remove('show'), 2000);
}

/**
 * Take screenshot
 */
function takeScreenshot() {
    renderer.render(scene, camera);
    const link = document.createElement('a');
    link.download = `solar-system-${Date.now()}.png`;
    link.href = renderer.domElement.toDataURL('image/png');
    link.click();
    showNotification('Screenshot saved!');
}

// ============================================
// LOADING
// ============================================

/**
 * Start loading screen animation
 */
function startLoading() {
    const loadingStatus = document.getElementById('loadingStatus');
    const loadSteps = [
        'Generating stellar fields...',
        'Creating planetary bodies...',
        'Calculating orbits...',
        'Loading solar corona...',
        'Preparing asteroid belts...',
        'Calibrating sensors...'
    ];
    
    let loadStep = 0;
    const loadInterval = setInterval(() => {
        if (loadStep < loadSteps.length) {
            loadingStatus.textContent = loadSteps[loadStep];
            loadStep++;
        }
    }, 400);
    
    // Hide loading and start animation
    setTimeout(() => {
        clearInterval(loadInterval);
        loadingStatus.textContent = 'Launch complete!';
        document.getElementById('loading').classList.add('hidden');
        updatePlanetInfo('earth');
        animate();
    }, 3000);
}

// ============================================
// ANIMATION LOOP
// ============================================

/**
 * Main animation loop
 */
function animate() {
    requestAnimationFrame(animate);
    
    const state = controlsModule.getState();
    const { timeSpeed, isPaused } = state;
    
    if (!isPaused) {
        // Update date
        controlsModule.updateDate();
        
        // Update planets
        updatePlanets(timeSpeed, state.showTrails);
        
        // Update moon
        updateMoon(timeSpeed);
        
        // Update comet
        if (comet.visible) {
            comet.userData.angle += comet.userData.orbitSpeed * 0.008 * timeSpeed;
            comet.position.x = Math.cos(comet.userData.angle) * comet.userData.orbitRadius;
            comet.position.z = Math.sin(comet.userData.angle) * comet.userData.orbitRadius;
            comet.position.y = Math.sin(comet.userData.angle * 2) * comet.userData.orbitRadius * comet.userData.tilt;
            
            // Tail points away from Sun
            const tailAngle = Math.atan2(comet.position.z, comet.position.x);
            comet.rotation.y = tailAngle + Math.PI;
        }
        
        // Rotate asteroid belt
        asteroidGroup.rotation.y += 0.00015 * timeSpeed;
        kuiperGroup.rotation.y += 0.00008 * timeSpeed;
        
        // Rotate Sun
        sunGroup.rotation.y += 0.0008;
        
        // Stars rotation
        stars.rotation.y += 0.00002;
    }
    
    // Update camera
    controlsModule.updateCamera();
    
    // Update controls
    controls.update();
    
    // Render
    renderer.render(scene, camera);
}

/**
 * Window resize handler
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ============================================
// START
// ============================================

// Initialize when DOM is ready
window.addEventListener('DOMContentLoaded', init);