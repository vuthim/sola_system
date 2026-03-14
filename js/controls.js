/**
 * ============================================
 * CONTROLS & EVENT HANDLERS
 * Keyboard, mouse, UI event listeners
 * ============================================
 */

// State variables (shared with main.js)
let timeSpeed = 1;
let isPaused = false;
let focusedPlanet = 'earth';
let cameraMode = 'top';
let targetCameraPos = new THREE.Vector3(0, 550, 0);

// Visibility toggles
let showOrbits = true;
let showTrails = true;
let showAsteroids = true;
let showConstellations = false;
let showComet = true;

// Current date
let currentDate = new Date();

// Keyboard state
const keys = {};

// Reference to main module functions
let updatePlanetInfo, showNotification, takeScreenshot;
let camera, renderer, scene, controls;
let planetsModule, effectsModule;

/**
 * Initialize controls with references
 */
function initControls(appCamera, appRenderer, appScene, appControls) {
    camera = appCamera;
    renderer = appRenderer;
    scene = appScene;
    controls = appControls;
    
    // Set up event listeners
    setupKeyboardControls();
    setupMouseControls();
    setupUIEventListeners();
    
    // Update date display
    updateDateDisplay();
}

/**
 * Set module references
 */
function setModules(planetMod, effectMod, updateFn, notifFn, screenshotFn) {
    planetsModule = planetMod;
    effectsModule = effectMod;
    updatePlanetInfo = updateFn;
    showNotification = notifFn;
    takeScreenshot = screenshotFn;
}

/**
 * Keyboard event handlers
 */
function setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
        
        // Planet selection with number keys
        const planetKeys = ['1','2','3','4','5','6','7','8','9','0'];
        const planetNames = ['mercury','venus','earth','moon','mars','ceres','jupiter','saturn','uranus','neptune'];
        const keyIndex = planetKeys.indexOf(e.key);
        
        if (keyIndex !== -1 && planetNames[keyIndex] && planetData[planetNames[keyIndex]]) {
            focusedPlanet = planetNames[keyIndex];
            updatePlanetInfo(focusedPlanet);
            updatePlanetButtons(focusedPlanet);
        }
        
        // Time speed controls
        if (e.key === '+' || e.key === '=') {
            timeSpeed = Math.min(timeSpeed + 0.5, 20);
            document.getElementById('speedSlider').value = timeSpeed * 20;
            document.getElementById('speedValue').textContent = timeSpeed.toFixed(1) + 'x';
        }
        if (e.key === '-') {
            timeSpeed = Math.max(timeSpeed - 0.5, 0);
            document.getElementById('speedSlider').value = timeSpeed * 20;
            document.getElementById('speedValue').textContent = timeSpeed.toFixed(1) + 'x';
        }
        
        // Screenshot
        if (e.key.toLowerCase() === 'p') {
            takeScreenshot();
        }
        
        // Camera views
        if (e.key.toLowerCase() === 'f') {
            cameraMode = 'free';
            document.querySelectorAll('.cam-btn').forEach(b => b.classList.remove('active'));
            document.getElementById('camFree').classList.add('active');
        }
        if (e.key.toLowerCase() === 't' && !e.ctrlKey) {
            cameraMode = 'top';
            targetCameraPos.set(0, 450, 0);
            document.querySelectorAll('.cam-btn').forEach(b => b.classList.remove('active'));
            document.getElementById('camTop').classList.add('active');
        }
        if (e.key.toLowerCase() === 's' && !e.ctrlKey) {
            cameraMode = 'side';
            targetCameraPos.set(350, 80, 0);
            document.querySelectorAll('.cam-btn').forEach(b => b.classList.remove('active'));
            document.getElementById('camSide').classList.add('active');
        }
        if (e.key.toLowerCase() === 'u') {
            cameraMode = 'sun';
            targetCameraPos.set(80, 25, 0);
            document.querySelectorAll('.cam-btn').forEach(b => b.classList.remove('active'));
            document.getElementById('camSun').classList.add('active');
        }
        if (e.key.toLowerCase() === 'e') {
            cameraMode = 'earth';
            document.querySelectorAll('.cam-btn').forEach(b => b.classList.remove('active'));
            document.getElementById('camEarth').classList.add('active');
        }
        
        // Pause/Play
        if (e.key.toLowerCase() === ' ') {
            isPaused = !isPaused;
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
            document.getElementById(isPaused ? 'btnPause' : 'btnPlay').classList.add('active');
        }
        
        // Reset view
        if (e.key.toLowerCase() === 'r') {
            cameraMode = 'top';
            targetCameraPos.set(0, 450, 0);
            camera.lookAt(0, 0, 0);
            document.querySelectorAll('.cam-btn').forEach(b => b.classList.remove('active'));
            document.getElementById('camTop').classList.add('active');
        }
        
        // Toggles
        if (e.key.toLowerCase() === 'o') {
            showOrbits = !showOrbits;
            planetsModule.toggleOrbits(showOrbits);
            document.getElementById('showOrbits').checked = showOrbits;
        }
        if (e.key.toLowerCase() === 'n') {
            showTrails = !showTrails;
            planetsModule.toggleTrails(showTrails);
            document.getElementById('showTrails').checked = showTrails;
        }
        if (e.key.toLowerCase() === 'c') {
            showConstellations = !showConstellations;
            if (effectsModule && effectsModule.constellationLines) {
                effectsModule.constellationLines.visible = showConstellations;
            }
            document.getElementById('showConstellations').checked = showConstellations;
        }
    });

    document.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });
}

/**
 * Mouse/Click event handlers
 */
function setupMouseControls() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.domElement.addEventListener('click', (e) => {
        // Don't process if clicking on UI
        if (e.target !== renderer.domElement) return;
        
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        
        const planetMeshes = planetsModule.getPlanetMeshes();
        const intersects = raycaster.intersectObjects(planetMeshes);
        
        if (intersects.length > 0) {
            const clickedPlanet = intersects[0].object.userData.name;
            if (clickedPlanet && planetData[clickedPlanet]) {
                focusedPlanet = clickedPlanet;
                updatePlanetInfo(focusedPlanet);
                updatePlanetButtons(focusedPlanet);
            }
        }
    });
}

/**
 * All UI button and control event listeners
 */
function setupUIEventListeners() {
    // === TIME CONTROLS ===
    document.getElementById('btnPause').addEventListener('click', () => {
        isPaused = true;
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        document.getElementById('btnPause').classList.add('active');
    });

    document.getElementById('btnPlay').addEventListener('click', () => {
        isPaused = false;
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        document.getElementById('btnPlay').classList.add('active');
    });

    document.getElementById('btnFast').addEventListener('click', () => {
        isPaused = false;
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        document.getElementById('btnFast').classList.add('active');
        timeSpeed = 10;
        document.getElementById('speedSlider').value = 100;
        document.getElementById('speedValue').textContent = '10x';
    });

    document.getElementById('btnReset').addEventListener('click', () => {
        isPaused = false;
        timeSpeed = 1;
        currentDate = new Date();
        updateDateDisplay();
        document.getElementById('speedSlider').value = 20;
        document.getElementById('speedValue').textContent = '1x';
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        document.getElementById('btnPlay').classList.add('active');
        
        // Reset planet positions
        Object.keys(planetsModule.planets).forEach(name => {
            const planet = planetsModule.planets[name];
            if (planet && planet.angle !== undefined) {
                planet.angle = Math.random() * Math.PI * 2;
                planet.trailPositions = [];
            }
        });
    });

    // Speed slider
    const speedSlider = document.getElementById('speedSlider');
    const speedValue = document.getElementById('speedValue');
    speedSlider.addEventListener('input', (e) => {
        timeSpeed = e.target.value / 20;
        speedValue.textContent = timeSpeed.toFixed(1) + 'x';
    });

    // === CAMERA VIEWS ===
    document.getElementById('camTop').addEventListener('click', () => {
        cameraMode = 'top';
        targetCameraPos.set(0, 450, 0);
        setActiveCameraBtn('camTop');
    });

    document.getElementById('camSide').addEventListener('click', () => {
        cameraMode = 'side';
        targetCameraPos.set(350, 80, 0);
        setActiveCameraBtn('camSide');
    });

    document.getElementById('camSun').addEventListener('click', () => {
        cameraMode = 'sun';
        targetCameraPos.set(80, 25, 0);
        setActiveCameraBtn('camSun');
    });

    document.getElementById('camEarth').addEventListener('click', () => {
        cameraMode = 'earth';
        setActiveCameraBtn('camEarth');
    });

    document.getElementById('camFree').addEventListener('click', () => {
        cameraMode = 'free';
        setActiveCameraBtn('camFree');
    });

    // === DISPLAY CHECKBOXES ===
    document.getElementById('showOrbits').addEventListener('change', (e) => {
        showOrbits = e.target.checked;
        planetsModule.toggleOrbits(showOrbits);
    });

    document.getElementById('showTrails').addEventListener('change', (e) => {
        showTrails = e.target.checked;
        planetsModule.toggleTrails(showTrails);
    });

    document.getElementById('showAsteroids').addEventListener('change', (e) => {
        showAsteroids = e.target.checked;
        if (effectsModule) {
            effectsModule.asteroidGroup.visible = showAsteroids;
            effectsModule.kuiperGroup.visible = showAsteroids;
        }
    });

    document.getElementById('showConstellations').addEventListener('change', (e) => {
        showConstellations = e.target.checked;
        if (effectsModule && effectsModule.constellationLines) {
            effectsModule.constellationLines.visible = showConstellations;
        }
    });

    document.getElementById('showComet').addEventListener('change', (e) => {
        showComet = e.target.checked;
        if (effectsModule && effectsModule.comet) {
            effectsModule.comet.visible = showComet;
        }
    });

    // === PLANET BUTTONS ===
    document.querySelectorAll('.planet-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            focusedPlanet = btn.dataset.planet;
            updatePlanetInfo(focusedPlanet);
            updatePlanetButtons(focusedPlanet);
            
            // Move camera toward planet
            const planet = planetsModule.getPlanet(focusedPlanet);
            if (planet && planet.distance > 0) {
                const distance = planet.distance + 50;
                targetCameraPos.set(
                    Math.cos(planet.angle) * distance,
                    30,
                    Math.sin(planet.angle) * distance
                );
            }
        });
    });

    // === ACTION BUTTONS ===
    document.getElementById('btnFullscreen').addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });

    document.getElementById('btnSound').addEventListener('click', (e) => {
        const isOn = e.target.textContent === '🔊';
        e.target.textContent = isOn ? '🔇' : '🔊';
        showNotification(isOn ? 'Sound muted' : 'Sound enabled');
    });

    document.getElementById('btnCompare').addEventListener('click', () => {
        document.getElementById('compareModal').classList.add('active');
        populateComparison();
    });

    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('compareModal').classList.remove('active');
    });

    // Close modal on background click
    document.getElementById('compareModal').addEventListener('click', (e) => {
        if (e.target.id === 'compareModal') {
            document.getElementById('compareModal').classList.remove('active');
        }
    });
}

/**
 * Set active camera button
 */
function setActiveCameraBtn(activeId) {
    document.querySelectorAll('.cam-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(activeId).classList.add('active');
}

/**
 * Update planet buttons highlighting
 */
function updatePlanetButtons(activePlanet) {
    document.querySelectorAll('.planet-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.planet === activePlanet) {
            btn.classList.add('active');
        }
    });
}

/**
 * Update date display
 */
function updateDateDisplay() {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    document.getElementById('currentDate').textContent = currentDate.toLocaleDateString('en-US', options);
}

/**
 * Populate comparison modal
 */
function populateComparison() {
    const grid = document.getElementById('comparisonGrid');
    grid.innerHTML = '';
    
    Object.keys(planetData).slice(1).forEach(key => {
        const data = planetData[key];
        const div = document.createElement('div');
        div.className = 'comparison-planet';
        div.innerHTML = `
            <div class="planet-visual" style="background: radial-gradient(circle, #${data.color.toString(16).padStart(6, '0')}, #${data.emissive.toString(16).padStart(6, '0')})"></div>
            <h3>${data.name}</h3>
            <div class="comparison-stats">
                <div>Diameter: <span>${data.diameter}</span></div>
                <div>Moons: <span>${data.moons}</span></div>
                <div>Gravity: <span>${data.gravity}</span></div>
            </div>
        `;
        div.addEventListener('click', () => {
            document.querySelectorAll('.comparison-planet').forEach(p => p.classList.remove('selected'));
            div.classList.add('selected');
            focusedPlanet = key;
            updatePlanetInfo(key);
            updatePlanetButtons(key);
        });
        grid.appendChild(div);
    });
}

/**
 * Get current state
 */
function getState() {
    return {
        timeSpeed,
        isPaused,
        focusedPlanet,
        cameraMode,
        currentDate,
        keys
    };
}

/**
 * Update camera based on mode and focused planet
 */
function updateCamera() {
    if (cameraMode !== 'free') {
        const planet = planetsModule.getPlanet(focusedPlanet);
        
        switch(cameraMode) {
            case 'top':
                targetCameraPos.set(0, 400, 0);
                camera.lookAt(0, 0, 0);
                break;
            case 'side':
                if (planet && planet.planet) {
                    targetCameraPos.set(
                        planet.planet.position.x + 120,
                        30,
                        planet.planet.position.z + 120
                    );
                    camera.lookAt(planet.planet.position.x, 0, planet.planet.position.z);
                }
                break;
            case 'sun':
                targetCameraPos.set(55, 20, 15);
                camera.lookAt(0, 0, 0);
                break;
            case 'earth':
                if (planet && planet.planet) {
                    targetCameraPos.set(
                        planet.planet.position.x + 20,
                        8,
                        planet.planet.position.z + 20
                    );
                    camera.lookAt(planet.planet.position.x, 0, planet.planet.position.z);
                }
                break;
        }
        
        camera.position.lerp(targetCameraPos, 0.025);
    } else {
        // Free camera WASD controls
        const moveSpeed = 4;
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        
        if (keys['w']) camera.position.addScaledVector(direction, moveSpeed);
        if (keys['s']) camera.position.addScaledVector(direction, -moveSpeed);
        
        const right = new THREE.Vector3();
        right.crossVectors(direction, camera.up).normalize();
        if (keys['a']) camera.position.addScaledVector(right, -moveSpeed);
        if (keys['d']) camera.position.addScaledVector(right, moveSpeed);
        
        if (keys['q']) camera.rotation.y += 0.015;
        if (keys['e']) camera.rotation.y -= 0.015;
    }
}

/**
 * Advance the date based on time speed
 */
function updateDate() {
    currentDate = new Date(currentDate.getTime() + timeSpeed * 864000);
    updateDateDisplay();
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
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
}