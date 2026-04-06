/**
 * ============================================
 * CONTROLS & EVENT HANDLERS
 * ============================================
 */

var timeSpeed = 1;
var isPaused = false;
var focusedPlanet = 'earth';
var cameraMode = 'top';
var targetCameraPos;

var showOrbits = true;
var showTrails = true;
var showAsteroids = true;
var showConstellations = false;
var showComet = true;

var currentDate = new Date();
var keys = {};

var updatePlanetInfo, showNotification, takeScreenshot;
var camera, renderer, scene, controls;
var planetsModule, effectsModule;

function initControls(appCamera, appRenderer, appScene, appControls) {
    camera = appCamera;
    renderer = appRenderer;
    scene = appScene;
    controls = appControls;
    targetCameraPos = new THREE.Vector3(0, 550, 0);
    
    setupKeyboardControls();
    setupMouseControls();
    setupUIEventListeners();
    updateDateDisplay();
}

function setModules(planetMod, effectMod, updateFn, notifFn, screenshotFn) {
    planetsModule = planetMod;
    effectsModule = effectMod;
    updatePlanetInfo = updateFn;
    showNotification = notifFn;
    takeScreenshot = screenshotFn;
}

function setupKeyboardControls() {
    document.addEventListener('keydown', function(e) {
        keys[e.key.toLowerCase()] = true;
        
        var planetKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        var planetNames = ['mercury', 'venus', 'earth', 'moon', 'mars', 'ceres', 'jupiter', 'saturn', 'uranus', 'neptune'];
        var keyIndex = planetKeys.indexOf(e.key);
        
        if (keyIndex !== -1 && planetNames[keyIndex] && planetData[planetNames[keyIndex]]) {
            focusedPlanet = planetNames[keyIndex];
            updatePlanetInfo(focusedPlanet);
            updatePlanetButtons(focusedPlanet);
        }
        
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
        
        if (e.key.toLowerCase() === 'p') {
            takeScreenshot();
        }
        
        if (e.key.toLowerCase() === 'f') {
            cameraMode = 'free';
            document.querySelectorAll('.cam-btn').forEach(function(b) { b.classList.remove('active'); });
            document.getElementById('camFree').classList.add('active');
        }
        if (e.key.toLowerCase() === 't' && !e.ctrlKey) {
            cameraMode = 'top';
            targetCameraPos.set(0, 450, 0);
            document.querySelectorAll('.cam-btn').forEach(function(b) { b.classList.remove('active'); });
            document.getElementById('camTop').classList.add('active');
        }
        if (e.key.toLowerCase() === 's' && !e.ctrlKey) {
            cameraMode = 'side';
            targetCameraPos.set(350, 80, 0);
            document.querySelectorAll('.cam-btn').forEach(function(b) { b.classList.remove('active'); });
            document.getElementById('camSide').classList.add('active');
        }
        if (e.key.toLowerCase() === 'u') {
            cameraMode = 'sun';
            targetCameraPos.set(80, 25, 0);
            document.querySelectorAll('.cam-btn').forEach(function(b) { b.classList.remove('active'); });
            document.getElementById('camSun').classList.add('active');
        }
        if (e.key.toLowerCase() === 'e') {
            cameraMode = 'earth';
            document.querySelectorAll('.cam-btn').forEach(function(b) { b.classList.remove('active'); });
            document.getElementById('camEarth').classList.add('active');
        }
        
        if (e.key.toLowerCase() === ' ') {
            isPaused = !isPaused;
            document.querySelectorAll('.time-btn').forEach(function(b) { b.classList.remove('active'); });
            document.getElementById(isPaused ? 'btnPause' : 'btnPlay').classList.add('active');
        }
        
        if (e.key.toLowerCase() === 'r') {
            cameraMode = 'top';
            targetCameraPos.set(0, 450, 0);
            camera.lookAt(0, 0, 0);
            document.querySelectorAll('.cam-btn').forEach(function(b) { b.classList.remove('active'); });
            document.getElementById('camTop').classList.add('active');
        }
        
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

    document.addEventListener('keyup', function(e) {
        keys[e.key.toLowerCase()] = false;
    });
}

function setupMouseControls() {
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    renderer.domElement.addEventListener('click', function(e) {
        if (e.target !== renderer.domElement) return;
        
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        
        var planetMeshes = planetsModule.getPlanetMeshes();
        var intersects = raycaster.intersectObjects(planetMeshes);
        
        if (intersects.length > 0) {
            var clickedPlanet = intersects[0].object.userData.name;
            if (clickedPlanet && planetData[clickedPlanet]) {
                focusedPlanet = clickedPlanet;
                updatePlanetInfo(focusedPlanet);
                updatePlanetButtons(focusedPlanet);
            }
        }
    });
}

function setupUIEventListeners() {
    document.getElementById('btnPause').addEventListener('click', function() {
        isPaused = true;
        document.querySelectorAll('.time-btn').forEach(function(b) { b.classList.remove('active'); });
        document.getElementById('btnPause').classList.add('active');
    });

    document.getElementById('btnPlay').addEventListener('click', function() {
        isPaused = false;
        document.querySelectorAll('.time-btn').forEach(function(b) { b.classList.remove('active'); });
        document.getElementById('btnPlay').classList.add('active');
    });

    document.getElementById('btnFast').addEventListener('click', function() {
        isPaused = false;
        document.querySelectorAll('.time-btn').forEach(function(b) { b.classList.remove('active'); });
        document.getElementById('btnFast').classList.add('active');
        timeSpeed = 10;
        document.getElementById('speedSlider').value = 100;
        document.getElementById('speedValue').textContent = '10x';
    });

    document.getElementById('btnReset').addEventListener('click', function() {
        isPaused = false;
        timeSpeed = 1;
        currentDate = new Date();
        updateDateDisplay();
        document.getElementById('speedSlider').value = 20;
        document.getElementById('speedValue').textContent = '1x';
        document.querySelectorAll('.time-btn').forEach(function(b) { b.classList.remove('active'); });
        document.getElementById('btnPlay').classList.add('active');
        
        var planetKeys = Object.keys(planetsModule.planets);
        for (var i = 0; i < planetKeys.length; i++) {
            var planet = planetsModule.planets[planetKeys[i]];
            if (planet && planet.angle !== undefined) {
                planet.angle = Math.random() * Math.PI * 2;
                planet.trailPositions = [];
            }
        }
    });

    var speedSlider = document.getElementById('speedSlider');
    var speedValue = document.getElementById('speedValue');
    speedSlider.addEventListener('input', function(e) {
        timeSpeed = e.target.value / 20;
        speedValue.textContent = timeSpeed.toFixed(1) + 'x';
    });

    document.getElementById('camTop').addEventListener('click', function() {
        cameraMode = 'top';
        targetCameraPos.set(0, 450, 0);
        setActiveCameraBtn('camTop');
    });

    document.getElementById('camSide').addEventListener('click', function() {
        cameraMode = 'side';
        targetCameraPos.set(350, 80, 0);
        setActiveCameraBtn('camSide');
    });

    document.getElementById('camSun').addEventListener('click', function() {
        cameraMode = 'sun';
        targetCameraPos.set(80, 25, 0);
        setActiveCameraBtn('camSun');
    });

    document.getElementById('camEarth').addEventListener('click', function() {
        cameraMode = 'earth';
        setActiveCameraBtn('camEarth');
    });

    document.getElementById('camFree').addEventListener('click', function() {
        cameraMode = 'free';
        setActiveCameraBtn('camFree');
    });

    document.getElementById('showOrbits').addEventListener('change', function(e) {
        showOrbits = e.target.checked;
        planetsModule.toggleOrbits(showOrbits);
    });

    document.getElementById('showTrails').addEventListener('change', function(e) {
        showTrails = e.target.checked;
        planetsModule.toggleTrails(showTrails);
    });

    document.getElementById('showAsteroids').addEventListener('change', function(e) {
        showAsteroids = e.target.checked;
        if (effectsModule) {
            effectsModule.asteroidGroup.visible = showAsteroids;
            effectsModule.kuiperGroup.visible = showAsteroids;
        }
    });

    document.getElementById('showConstellations').addEventListener('change', function(e) {
        showConstellations = e.target.checked;
        if (effectsModule && effectsModule.constellationLines) {
            effectsModule.constellationLines.visible = showConstellations;
        }
    });

    document.getElementById('showComet').addEventListener('change', function(e) {
        showComet = e.target.checked;
        if (effectsModule && effectsModule.comet) {
            effectsModule.comet.visible = showComet;
        }
    });

    var planetBtns = document.querySelectorAll('.planet-btn');
    for (var i = 0; i < planetBtns.length; i++) {
        planetBtns[i].addEventListener('click', function() {
            focusedPlanet = this.dataset.planet;
            updatePlanetInfo(focusedPlanet);
            updatePlanetButtons(focusedPlanet);
            
            var planet = planetsModule.getPlanet(focusedPlanet);
            if (planet && planet.distance > 0) {
                var distance = planet.distance + 50;
                targetCameraPos.set(
                    Math.cos(planet.angle) * distance,
                    30,
                    Math.sin(planet.angle) * distance
                );
            }
        });
    }

    document.getElementById('btnFullscreen').addEventListener('click', function() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });

    document.getElementById('btnSound').addEventListener('click', function(e) {
        var isOn = e.target.textContent === '🔊';
        e.target.textContent = isOn ? '🔇' : '🔊';
        showNotification(isOn ? 'Sound muted' : 'Sound enabled');
    });

    document.getElementById('btnCompare').addEventListener('click', function() {
        document.getElementById('compareModal').classList.add('active');
        populateComparison();
    });

    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('compareModal').classList.remove('active');
    });

    document.getElementById('compareModal').addEventListener('click', function(e) {
        if (e.target.id === 'compareModal') {
            document.getElementById('compareModal').classList.remove('active');
        }
    });
}

function setActiveCameraBtn(activeId) {
    var btns = document.querySelectorAll('.cam-btn');
    for (var i = 0; i < btns.length; i++) {
        btns[i].classList.remove('active');
    }
    document.getElementById(activeId).classList.add('active');
}

function updatePlanetButtons(activePlanet) {
    var btns = document.querySelectorAll('.planet-btn');
    for (var i = 0; i < btns.length; i++) {
        btns[i].classList.remove('active');
        if (btns[i].dataset.planet === activePlanet) {
            btns[i].classList.add('active');
        }
    }
}

function updateDateDisplay() {
    var options = { year: 'numeric', month: 'short', day: 'numeric' };
    document.getElementById('currentDate').textContent = currentDate.toLocaleDateString('en-US', options);
}

function populateComparison() {
    var grid = document.getElementById('comparisonGrid');
    grid.innerHTML = '';
    
    var keys = Object.keys(planetData).slice(1);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var data = planetData[key];
        var div = document.createElement('div');
        div.className = 'comparison-planet';
        div.innerHTML = '<div class="planet-visual" style="background: radial-gradient(circle, #' + data.color.toString(16).padStart(6, '0') + ', #' + data.emissive.toString(16).padStart(6, '0') + ')"></div>' +
            '<h3>' + data.name + '</h3>' +
            '<div class="comparison-stats">' +
            '<div>Diameter: <span>' + data.diameter + '</span></div>' +
            '<div>Moons: <span>' + data.moons + '</span></div>' +
            '<div>Gravity: <span>' + data.gravity + '</span></div>' +
            '</div>';
        div.addEventListener('click', function() {
            var planets = document.querySelectorAll('.comparison-planet');
            for (var j = 0; j < planets.length; j++) {
                planets[j].classList.remove('selected');
            }
            this.classList.add('selected');
            focusedPlanet = key;
            updatePlanetInfo(key);
            updatePlanetButtons(key);
        });
        grid.appendChild(div);
    }
}

function getState() {
    return {
        timeSpeed: timeSpeed,
        isPaused: isPaused,
        focusedPlanet: focusedPlanet,
        cameraMode: cameraMode,
        currentDate: currentDate,
        keys: keys,
        showTrails: showTrails
    };
}

function updateCamera() {
    if (cameraMode !== 'free') {
        var planet = planetsModule.getPlanet(focusedPlanet);
        
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
        var moveSpeed = 4;
        var direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        
        if (keys['w']) camera.position.addScaledVector(direction, moveSpeed);
        if (keys['s']) camera.position.addScaledVector(direction, -moveSpeed);
        
        var right = new THREE.Vector3();
        right.crossVectors(direction, camera.up).normalize();
        if (keys['a']) camera.position.addScaledVector(right, -moveSpeed);
        if (keys['d']) camera.position.addScaledVector(right, moveSpeed);
        
        if (keys['q']) camera.rotation.y += 0.015;
        if (keys['e']) camera.rotation.y -= 0.015;
    }
}

function updateDate() {
    currentDate = new Date(currentDate.getTime() + timeSpeed * 864000);
    updateDateDisplay();
}
