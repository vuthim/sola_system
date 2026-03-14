/**
 * ============================================
 * PLANET CREATION & MANAGEMENT
 * Create planets, moons, orbits, and trails
 * ============================================
 */

// Global references (set by main.js)
let scene;
let planetData;

// Storage for created objects
const planets = {};
const orbits = {};
const planetTrails = {};
const planetGroup = new THREE.Group();

/**
 * Initialize planet system
 */
function initPlanetSystem() {
    scene.add(planetGroup);
}

/**
 * Create a single planet with all features
 * @param {string} name - Planet identifier
 * @param {Object} parent - Parent group for moons
 */
function createPlanet(name, parent = null) {
    const data = planetData[name];
    if (!data) return null;
    
    const distance = data.orbitDistance;
    const size = data.size;
    const color = data.color;
    const group = parent ? new THREE.Group() : planetGroup;
    
    // Create orbit ring (skip for Sun)
    if (distance > 0) {
        const orbitGeometry = new THREE.RingGeometry(distance - 0.5, distance + 0.5, 128);
        const orbitMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide
        });
        const orbitRing = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbitRing.rotation.x = Math.PI / 2;
        group.add(orbitRing);
        orbits[name] = orbitRing;
    }

    // Planet mesh
    const planetGeometry = new THREE.SphereGeometry(size, 48, 48);
    const planetMaterial = new THREE.MeshStandardMaterial({
        color: color,
        emissive: data.emissive,
        emissiveIntensity: 0.12,
        roughness: 0.8,
        metalness: 0.1
    });
    
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.castShadow = true;
    planet.receiveShadow = true;
    
    if (parent) {
        planet.position.x = distance;
    } else {
        planet.position.x = distance;
    }
    planet.userData = { name: name };

    // === PLANET-SPECIFIC FEATURES ===
    
    // Earth's clouds
    if (name === 'earth') {
        const cloudGeometry = new THREE.SphereGeometry(size * 1.02, 32, 32);
        const cloudMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3,
            roughness: 1
        });
        const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
        planet.add(clouds);
    }

    // Jupiter's Great Red Spot
    if (name === 'jupiter') {
        const spotGeometry = new THREE.SphereGeometry(size * 0.15, 16, 16);
        const spotMaterial = new THREE.MeshStandardMaterial({
            color: 0xcc4422,
            roughness: 0.9
        });
        const spot = new THREE.Mesh(spotGeometry, spotMaterial);
        spot.position.set(size * 0.7, size * 0.2, size * 0.8);
        planet.add(spot);
    }

    // Saturn's rings (multiple layers)
    if (name === 'saturn') {
        const ringConfigs = [
            { inner: 1.4, outer: 2.6, opacity: 0.7 },
            { inner: 1.2, outer: 1.5, opacity: 0.35 },
            { inner: 2.6, outer: 3.2, opacity: 0.25 }
        ];
        
        ringConfigs.forEach(config => {
            const ringGeometry = new THREE.RingGeometry(size * config.inner, size * config.outer, 64);
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0xd4a574,
                transparent: true,
                opacity: config.opacity,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2.5;
            planet.add(ring);
        });
    }

    // Uranus rings
    if (name === 'uranus') {
        const uranusRingGeometry = new THREE.RingGeometry(size * 1.6, size * 2.1, 64);
        const uranusRingMaterial = new THREE.MeshBasicMaterial({
            color: 0x5588aa,
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide
        });
        const uranusRing = new THREE.Mesh(uranusRingGeometry, uranusRingMaterial);
        uranusRing.rotation.x = Math.PI / 2;
        planet.add(uranusRing);
    }

    // Add to scene
    group.add(planet);

    if (!parent) {
        planetGroup.add(group);
    } else {
        scene.add(group);
    }

    // === TRAIL SYSTEM ===
    if (distance > 0) {
        const trailGeometry = new THREE.BufferGeometry();
        const trailPositions = new Float32Array(300 * 3);
        trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
        
        const trailMaterial = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.25
        });
        
        const trail = new THREE.Line(trailGeometry, trailMaterial);
        scene.add(trail);

        planets[name] = {
            group: group,
            planet: planet,
            distance: distance,
            angle: Math.random() * Math.PI * 2,
            speed: data.orbitSpeed,
            trailPositions: [],
            trailMaxLength: 100,
            parent: parent
        };
        
        planetTrails[name] = trail;
    } else {
        // Sun doesn't move
        planets[name] = {
            group: group,
            planet: planet,
            distance: 0,
            angle: 0,
            speed: 0,
            trailPositions: []
        };
    }

    return group;
}

/**
 * Create Earth's Moon orbiting Earth
 */
function createMoon() {
    // Moon data
    const moonData = planetData.moon;
    
    // Moon orbit group (attached to Earth)
    const moonOrbitGroup = new THREE.Group();
    
    // Moon mesh
    const moonGeometry = new THREE.SphereGeometry(moonData.size, 24, 24);
    const moonMaterial = new THREE.MeshStandardMaterial({
        color: moonData.color,
        roughness: 0.9,
        metalness: 0.05
    });
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    moonMesh.position.x = moonData.orbitDistance;
    moonMesh.userData = { name: 'moon' };
    
    // Moon orbit line
    const moonOrbitGeometry = new THREE.RingGeometry(
        moonData.orbitDistance - 0.3,
        moonData.orbitDistance + 0.3,
        32
    );
    const moonOrbitMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide
    });
    const moonOrbitRing = new THREE.Mesh(moonOrbitGeometry, moonOrbitMaterial);
    moonOrbitRing.rotation.x = Math.PI / 2;
    
    moonOrbitGroup.add(moonOrbitRing);
    moonOrbitGroup.add(moonMesh);
    
    // Add to Earth's group
    planets.earth.group.add(moonOrbitGroup);
    
    // Store moon data
    planets.moon = {
        mesh: moonMesh,
        orbit: moonOrbitRing,
        group: moonOrbitGroup,
        distance: moonData.orbitDistance,
        angle: 0,
        speed: moonData.orbitSpeed
    };
    
    return moonOrbitGroup;
}

/**
 * Create all planets
 */
function createAllPlanets() {
    // Create all planets except Moon (handled separately)
    Object.keys(planetData).forEach(name => {
        if (name !== 'moon') {
            createPlanet(name);
        }
    });
    
    // Create Earth's moon
    createMoon();
}

/**
 * Update planet positions
 * @param {number} timeSpeed - Current time multiplier
 * @param {boolean} showTrails - Whether trails are visible
 */
function updatePlanets(timeSpeed, showTrails) {
    Object.keys(planets).forEach(name => {
        const planet = planets[name];
        
        // Skip stationary objects (Sun)
        if (!planet.speed || planet.distance === 0) {
            if (planet.planet) {
                planet.planet.rotation.y += 0.004 * timeSpeed;
            }
            return;
        }
        
        // Update orbital position
        planet.angle += planet.speed * 0.006 * timeSpeed;
        planet.planet.position.x = Math.cos(planet.angle) * planet.distance;
        planet.planet.position.z = Math.sin(planet.angle) * planet.distance;
        
        // Rotate planet
        planet.planet.rotation.y += 0.004 * timeSpeed;
        
        // Update trail
        if (showTrails && planet.trailPositions) {
            planet.trailPositions.push(planet.planet.position.clone());
            
            if (planet.trailPositions.length > planet.trailMaxLength) {
                planet.trailPositions.shift();
            }
            
            const trail = planetTrails[name];
            if (trail) {
                const positions = trail.geometry.attributes.position.array;
                for (let i = 0; i < planet.trailPositions.length; i++) {
                    positions[i * 3] = planet.trailPositions[i].x;
                    positions[i * 3 + 1] = planet.trailPositions[i].y;
                    positions[i * 3 + 2] = planet.trailPositions[i].z;
                }
                trail.geometry.attributes.position.needsUpdate = true;
                trail.geometry.setDrawRange(0, planet.trailPositions.length);
            }
        }
    });
}

/**
 * Update Earth's moon position
 * @param {number} timeSpeed - Current time multiplier
 */
function updateMoon(timeSpeed) {
    if (!planets.moon) return;
    
    planets.moon.angle += planets.moon.speed * 0.01 * timeSpeed;
    
    if (planets.moon.mesh) {
        planets.moon.mesh.position.x = Math.cos(planets.moon.angle) * planets.moon.distance;
        planets.moon.mesh.position.z = Math.sin(planets.moon.angle) * planets.moon.distance;
    }
}

/**
 * Toggle orbit visibility
 * @param {boolean} visible - Show or hide orbits
 */
function toggleOrbits(visible) {
    Object.values(orbits).forEach(orbit => {
        orbit.visible = visible;
    });
}

/**
 * Toggle trail visibility
 * @param {boolean} visible - Show or hide trails
 */
function toggleTrails(visible) {
    Object.values(planetTrails).forEach(trail => {
        trail.visible = visible;
    });
}

/**
 * Get a planet by name
 * @param {string} name - Planet identifier
 */
function getPlanet(name) {
    return planets[name];
}

/**
 * Get all planet meshes for raycasting
 */
function getPlanetMeshes() {
    return Object.values(planets).map(p => p.planet).filter(p => p);
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
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
}