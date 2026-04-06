/**
 * ============================================
 * VISUAL EFFECTS
 * Stars, nebula, asteroids, comet, constellations
 * ============================================
 */

function createStars(scene) {
    var starsGeometry = new THREE.BufferGeometry();
    var starCount = 20000;
    var positions = new Float32Array(starCount * 3);
    var colors = new Float32Array(starCount * 3);
    
    for (var i = 0; i < starCount; i++) {
        var i3 = i * 3;
        var radius = 2000 + Math.random() * 4000;
        var theta = Math.random() * Math.PI * 2;
        var phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        var colorChoice = Math.random();
        if (colorChoice < 0.15) {
            colors[i3] = 1; colors[i3 + 1] = 0.5; colors[i3 + 2] = 0.3;
        } else if (colorChoice < 0.3) {
            colors[i3] = 0.6; colors[i3 + 1] = 0.7; colors[i3 + 2] = 1;
        } else if (colorChoice < 0.4) {
            colors[i3] = 1; colors[i3 + 1] = 0.9; colors[i3 + 2] = 0.6;
        } else {
            colors[i3] = 1; colors[i3 + 1] = 1; colors[i3 + 2] = 1;
        }
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    var starsMaterial = new THREE.PointsMaterial({
        size: 1,
        vertexColors: true,
        transparent: true,
        opacity: 1,
        sizeAttenuation: true
    });

    var stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    return stars;
}

function createNebula(scene) {
    var nebulaGeometry = new THREE.BufferGeometry();
    var nebulaCount = 600;
    var positions = new Float32Array(nebulaCount * 3);
    var colors = new Float32Array(nebulaCount * 3);
    
    for (var i = 0; i < nebulaCount; i++) {
        var i3 = i * 3;
        var radius = 1000 + Math.random() * 2000;
        var theta = Math.random() * Math.PI * 2;
        var phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        colors[i3] = 0.2 + Math.random() * 0.4;
        colors[i3 + 1] = 0.05 + Math.random() * 0.2;
        colors[i3 + 2] = 0.4 + Math.random() * 0.6;
    }

    nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    var nebulaMaterial = new THREE.PointsMaterial({
        size: 40,
        vertexColors: true,
        transparent: true,
        opacity: 0.12,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
    });

    var nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
    scene.add(nebula);
    return nebula;
}

function createAsteroidBelt(scene) {
    var asteroidGroup = new THREE.Group();
    var asteroidCount = 2000;
    
    for (var i = 0; i < asteroidCount; i++) {
        var angle = Math.random() * Math.PI * 2;
        var radius = 170 + Math.random() * 40;
        var height = (Math.random() - 0.5) * 25;
        
        var size = 0.2 + Math.random() * 0.7;
        var asteroidGeometry = new THREE.DodecahedronGeometry(size, 0);
        var grayValue = 0.25 + Math.random() * 0.35;
        
        var asteroidMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(grayValue, grayValue, grayValue),
            roughness: 0.95,
            metalness: 0.05
        });
        
        var asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
        asteroid.position.set(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
        );
        asteroid.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        asteroidGroup.add(asteroid);
    }
    
    scene.add(asteroidGroup);
    return asteroidGroup;
}

function createKuiperBelt(scene) {
    var kuiperGroup = new THREE.Group();
    var kuiperCount = 1000;
    
    for (var i = 0; i < kuiperCount; i++) {
        var angle = Math.random() * Math.PI * 2;
        var radius = 580 + Math.random() * 100;
        var height = (Math.random() - 0.5) * 80;
        
        var colorChoice = Math.random();
        var color = colorChoice < 0.5 ? 
            new THREE.Color(0.5, 0.7, 1) : 
            new THREE.Color(0.85, 0.85, 1);
        
        var size = 0.15 + Math.random() * 0.5;
        var kuiperGeometry = new THREE.IcosahedronGeometry(size, 0);
        var kuiperMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.8,
            metalness: 0.15,
            transparent: true,
            opacity: 0.75
        });
        
        var kuiper = new THREE.Mesh(kuiperGeometry, kuiperMaterial);
        kuiper.position.set(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
        );
        
        kuiperGroup.add(kuiper);
    }
    
    scene.add(kuiperGroup);
    return kuiperGroup;
}

function createComet(scene) {
    var cometGroup = new THREE.Group();
    
    var nucleusGeometry = new THREE.SphereGeometry(1.5, 16, 16);
    var nucleusMaterial = new THREE.MeshStandardMaterial({
        color: 0x444444,
        roughness: 0.9
    });
    var nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    cometGroup.add(nucleus);

    var comaGeometry = new THREE.SphereGeometry(3, 16, 16);
    var comaMaterial = new THREE.MeshBasicMaterial({
        color: 0xaaddff,
        transparent: true,
        opacity: 0.3
    });
    var coma = new THREE.Mesh(comaGeometry, comaMaterial);
    cometGroup.add(coma);

    var tailGeometry = new THREE.ConeGeometry(4, 40, 8, 1, true);
    var tailMaterial = new THREE.MeshBasicMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide
    });
    var tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.rotation.x = Math.PI / 2;
    tail.position.z = -25;
    cometGroup.add(tail);

    var dustTailGeometry = new THREE.ConeGeometry(3, 30, 8, 1, true);
    var dustTailMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffee,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide
    });
    var dustTail = new THREE.Mesh(dustTailGeometry, dustTailMaterial);
    dustTail.rotation.x = Math.PI / 2 + 0.2;
    dustTail.rotation.z = 0.3;
    dustTail.position.z = -20;
    dustTail.position.x = -5;
    cometGroup.add(dustTail);

    cometGroup.userData = {
        angle: 0,
        orbitSpeed: 0.8,
        orbitRadius: 280,
        tilt: 0.4
    };

    scene.add(cometGroup);
    return cometGroup;
}

function createConstellations(scene) {
    var constellationsGroup = new THREE.Group();
    var linesGroup = new THREE.Group();
    
    var constellations = [
        {
            name: 'Orion',
            stars: [[100, 80, 150], [120, 100, 180], [80, 60, 160], [140, 90, 200], [90, 45, 140], [110, 30, 170]]
        },
        {
            name: 'Big Dipper',
            stars: [[-200, 150, 300], [-180, 140, 280], [-160, 135, 260], [-140, 130, 240], [-120, 125, 220], [-100, 120, 200], [-80, 115, 180]]
        },
        {
            name: 'Cassiopeia',
            stars: [[250, -100, 350], [270, -80, 380], [290, -90, 400], [310, -70, 420], [330, -85, 440]]
        }
    ];

    for (var c = 0; c < constellations.length; c++) {
        var constellation = constellations[c];
        
        var lineGeometry = new THREE.BufferGeometry();
        var points = constellation.stars.map(function(s) {
            return new THREE.Vector3(s[0], s[1], s[2]);
        });
        lineGeometry.setFromPoints(points);
        
        var lineMaterial = new THREE.LineBasicMaterial({
            color: 0x6666ff,
            transparent: true,
            opacity: 0.3
        });
        
        var line = new THREE.Line(lineGeometry, lineMaterial);
        linesGroup.add(line);

        for (var s = 0; s < constellation.stars.length; s++) {
            var star = constellation.stars[s];
            var starGeometry = new THREE.SphereGeometry(0.8, 8, 8);
            var starMaterial = new THREE.MeshBasicMaterial({
                color: 0xaaaaff,
                transparent: true,
                opacity: 0.6
            });
            var starMesh = new THREE.Mesh(starGeometry, starMaterial);
            starMesh.position.set(star[0], star[1], star[2]);
            constellationsGroup.add(starMesh);
        }
    }

    constellationsGroup.add(linesGroup);
    
    scene.add(constellationsGroup);
    constellationsGroup.visible = false;
    return constellationsGroup;
}

function createSun(scene) {
    var sunGroup = new THREE.Group();

    var sunGeometry = new THREE.SphereGeometry(30, 64, 64);
    var sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xffdd00,
    });
    var sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sunGroup.add(sun);

    var glowSizes = [35, 45, 60];
    for (var i = 0; i < glowSizes.length; i++) {
        var glowGeometry = new THREE.SphereGeometry(glowSizes[i], 32, 32);
        var glowMaterial = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0xffaa00 : 0xff6600,
            transparent: true,
            opacity: 0.4 - i * 0.12,
            side: THREE.BackSide
        });
        var glow = new THREE.Mesh(glowGeometry, glowMaterial);
        sunGroup.add(glow);
    }

    var coronaGeometry = new THREE.SphereGeometry(75, 32, 32);
    var coronaMaterial = new THREE.MeshBasicMaterial({
        color: 0xff4400,
        transparent: true,
        opacity: 0.05,
        side: THREE.BackSide
    });
    var corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
    sunGroup.add(corona);

    for (var i = 0; i < 50; i++) {
        var flareGeometry = new THREE.SphereGeometry(0.5 + Math.random(), 4, 4);
        var flareMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.3
        });
        var flare = new THREE.Mesh(flareGeometry, flareMaterial);
        var angle = Math.random() * Math.PI * 2;
        var radius = 30 + Math.random() * 10;
        flare.position.set(
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 10,
            Math.sin(angle) * radius
        );
        sun.add(flare);
    }

    scene.add(sunGroup);
    return sunGroup;
}
