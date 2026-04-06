/**
 * ============================================
 * PLANET CREATION & MANAGEMENT
 * ============================================
 */

var scene;
var planetData;

var planets = {};
var orbits = {};
var planetTrails = {};
var planetGroup = new THREE.Group();

function initPlanetSystem(appScene, data) {
    scene = appScene;
    planetData = data;
    scene.add(planetGroup);
}

function createPlanet(name, parent) {
    parent = parent || null;
    var data = planetData[name];
    if (!data) return null;
    
    var distance = data.orbitDistance;
    var size = data.size;
    var color = data.color;
    var group = parent ? new THREE.Group() : planetGroup;
    
    if (distance > 0) {
        var orbitGeometry = new THREE.RingGeometry(distance - 0.5, distance + 0.5, 128);
        var orbitMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide
        });
        var orbitRing = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbitRing.rotation.x = Math.PI / 2;
        group.add(orbitRing);
        orbits[name] = orbitRing;
    }

    var planetGeometry = new THREE.SphereGeometry(size, 48, 48);
    var planetMaterial = new THREE.MeshStandardMaterial({
        color: color,
        emissive: data.emissive,
        emissiveIntensity: 0.12,
        roughness: 0.8,
        metalness: 0.1
    });
    
    var planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.castShadow = true;
    planet.receiveShadow = true;
    planet.position.x = distance;
    planet.userData = { name: name };

    if (name === 'earth') {
        var cloudGeometry = new THREE.SphereGeometry(size * 1.02, 32, 32);
        var cloudMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3,
            roughness: 1
        });
        var clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
        planet.add(clouds);
    }

    if (name === 'jupiter') {
        var spotGeometry = new THREE.SphereGeometry(size * 0.15, 16, 16);
        var spotMaterial = new THREE.MeshStandardMaterial({
            color: 0xcc4422,
            roughness: 0.9
        });
        var spot = new THREE.Mesh(spotGeometry, spotMaterial);
        spot.position.set(size * 0.7, size * 0.2, size * 0.8);
        planet.add(spot);
    }

    if (name === 'saturn') {
        var ringConfigs = [
            { inner: 1.4, outer: 2.6, opacity: 0.7 },
            { inner: 1.2, outer: 1.5, opacity: 0.35 },
            { inner: 2.6, outer: 3.2, opacity: 0.25 }
        ];
        
        for (var r = 0; r < ringConfigs.length; r++) {
            var config = ringConfigs[r];
            var ringGeometry = new THREE.RingGeometry(size * config.inner, size * config.outer, 64);
            var ringMaterial = new THREE.MeshBasicMaterial({
                color: 0xd4a574,
                transparent: true,
                opacity: config.opacity,
                side: THREE.DoubleSide
            });
            var ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2.5;
            planet.add(ring);
        }
    }

    if (name === 'uranus') {
        var uranusRingGeometry = new THREE.RingGeometry(size * 1.6, size * 2.1, 64);
        var uranusRingMaterial = new THREE.MeshBasicMaterial({
            color: 0x5588aa,
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide
        });
        var uranusRing = new THREE.Mesh(uranusRingGeometry, uranusRingMaterial);
        uranusRing.rotation.x = Math.PI / 2;
        planet.add(uranusRing);
    }

    group.add(planet);

    if (!parent) {
        planetGroup.add(group);
    } else {
        scene.add(group);
    }

    if (distance > 0) {
        var trailGeometry = new THREE.BufferGeometry();
        var trailPositions = new Float32Array(300 * 3);
        trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
        
        var trailMaterial = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.25
        });
        
        var trail = new THREE.Line(trailGeometry, trailMaterial);
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

function createMoon() {
    var moonData = planetData.moon;
    var moonOrbitGroup = new THREE.Group();
    
    var moonGeometry = new THREE.SphereGeometry(moonData.size, 24, 24);
    var moonMaterial = new THREE.MeshStandardMaterial({
        color: moonData.color,
        roughness: 0.9,
        metalness: 0.05
    });
    var moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    moonMesh.position.x = moonData.orbitDistance;
    moonMesh.userData = { name: 'moon' };
    
    var moonOrbitGeometry = new THREE.RingGeometry(
        moonData.orbitDistance - 0.3,
        moonData.orbitDistance + 0.3,
        32
    );
    var moonOrbitMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide
    });
    var moonOrbitRing = new THREE.Mesh(moonOrbitGeometry, moonOrbitMaterial);
    moonOrbitRing.rotation.x = Math.PI / 2;
    
    moonOrbitGroup.add(moonOrbitRing);
    moonOrbitGroup.add(moonMesh);
    
    planets.earth.group.add(moonOrbitGroup);
    
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

function createAllPlanets() {
    var keys = Object.keys(planetData);
    for (var i = 0; i < keys.length; i++) {
        var name = keys[i];
        if (name !== 'moon') {
            createPlanet(name);
        }
    }
    createMoon();
}

function updatePlanets(timeSpeed, showTrails) {
    var keys = Object.keys(planets);
    for (var i = 0; i < keys.length; i++) {
        var name = keys[i];
        var planet = planets[name];
        
        if (!planet.speed || planet.distance === 0) {
            if (planet.planet) {
                planet.planet.rotation.y += 0.004 * timeSpeed;
            }
            continue;
        }
        
        planet.angle += planet.speed * 0.006 * timeSpeed;
        planet.planet.position.x = Math.cos(planet.angle) * planet.distance;
        planet.planet.position.z = Math.sin(planet.angle) * planet.distance;
        
        planet.planet.rotation.y += 0.004 * timeSpeed;
        
        if (showTrails && planet.trailPositions) {
            planet.trailPositions.push(planet.planet.position.clone());
            
            if (planet.trailPositions.length > planet.trailMaxLength) {
                planet.trailPositions.shift();
            }
            
            var trail = planetTrails[name];
            if (trail) {
                var positions = trail.geometry.attributes.position.array;
                for (var j = 0; j < planet.trailPositions.length; j++) {
                    positions[j * 3] = planet.trailPositions[j].x;
                    positions[j * 3 + 1] = planet.trailPositions[j].y;
                    positions[j * 3 + 2] = planet.trailPositions[j].z;
                }
                trail.geometry.attributes.position.needsUpdate = true;
                trail.geometry.setDrawRange(0, planet.trailPositions.length);
            }
        }
    }
}

function updateMoon(timeSpeed) {
    if (!planets.moon) return;
    
    planets.moon.angle += planets.moon.speed * 0.01 * timeSpeed;
    
    if (planets.moon.mesh) {
        planets.moon.mesh.position.x = Math.cos(planets.moon.angle) * planets.moon.distance;
        planets.moon.mesh.position.z = Math.sin(planets.moon.angle) * planets.moon.distance;
    }
}

function toggleOrbits(visible) {
    var keys = Object.keys(orbits);
    for (var i = 0; i < keys.length; i++) {
        orbits[keys[i]].visible = visible;
    }
}

function toggleTrails(visible) {
    var keys = Object.keys(planetTrails);
    for (var i = 0; i < keys.length; i++) {
        planetTrails[keys[i]].visible = visible;
    }
}

function getPlanet(name) {
    return planets[name];
}

function getPlanetMeshes() {
    var meshes = [];
    var keys = Object.keys(planets);
    for (var i = 0; i < keys.length; i++) {
        var p = planets[keys[i]];
        if (p && p.planet) {
            meshes.push(p.planet);
        }
    }
    return meshes;
}
