/**
 * ============================================
 * VISUAL EFFECTS
 * Stars, nebula, asteroids, comet, constellations
 * ============================================
 */

// Global references (set by main.js)
let scene;

/**
 * Create starfield background
 * @param {THREE.Scene} scene - The Three.js scene
 */
function createStars(scene) {
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 20000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        
        // Distribute stars in a sphere around the scene
        const radius = 2000 + Math.random() * 4000;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        // Varied star colors
        const colorChoice = Math.random();
        if (colorChoice < 0.15) {
            // Red/orange stars
            colors[i3] = 1; colors[i3+1] = 0.5; colors[i3+2] = 0.3;
        } else if (colorChoice < 0.3) {
            // Blue-white stars
            colors[i3] = 0.6; colors[i3+1] = 0.7; colors[i3+2] = 1;
        } else if (colorChoice < 0.4) {
            // Yellow stars
            colors[i3] = 1; colors[i3+1] = 0.9; colors[i3+2] = 0.6;
        } else {
            // White stars
            colors[i3] = 1; colors[i3+1] = 1; colors[i3+2] = 1;
        }
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starsMaterial = new THREE.PointsMaterial({
        size: 1,
        vertexColors: true,
        transparent: true,
        opacity: 1,
        sizeAttenuation: true
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    return stars;
}

/**
 * Create nebula cloud effects
 * @param {THREE.Scene} scene - The Three.js scene
 */
function createNebula(scene) {
    const nebulaGeometry = new THREE.BufferGeometry();
    const nebulaCount = 600;
    const positions = new Float32Array(nebulaCount * 3);
    const colors = new Float32Array(nebulaCount * 3);
    
    for (let i = 0; i < nebulaCount; i++) {
        const i3 = i * 3;
        const radius = 1000 + Math.random() * 2000;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        // Purple/blue nebula colors
        colors[i3] = 0.2 + Math.random() * 0.4;
        colors[i3 + 1] = 0.05 + Math.random() * 0.2;
        colors[i3 + 2] = 0.4 + Math.random() * 0.6;
    }

    nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const nebulaMaterial = new THREE.PointsMaterial({
        size: 40,
        vertexColors: true,
        transparent: true,
        opacity: 0.12,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
    });

    const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
    scene.add(nebula);
    return nebula;
}

/**
 * Create asteroid belt between Mars and Jupiter
 * @param {THREE.Scene} scene - The Three.js scene
 */
function createAsteroidBelt(scene) {
    const asteroidGroup = new THREE.Group();
    const asteroidCount = 2000;
    
    for (let i = 0; i < asteroidCount; i++) {
        // Distribute in a ring between Mars (145) and Jupiter (230)
        const angle = Math.random() * Math.PI * 2;
        const radius = 170 + Math.random() * 40;
        const height = (Math.random() - 0.5) * 25;
        
        const size = 0.2 + Math.random() * 0.7;
        const asteroidGeometry = new THREE.DodecahedronGeometry(size, 0);
        const grayValue = 0.25 + Math.random() * 0.35;
        
        const asteroidMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(grayValue, grayValue, grayValue),
            roughness: 0.95,
            metalness: 0.05
        });
        
        const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
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

/**
 * Create Kuiper Belt beyond Neptune
 * @param {THREE.Scene} scene - The Three.js scene
 */
function createKuiperBelt(scene) {
    const kuiperGroup = new THREE.Group();
    const kuiperCount = 1000;
    
    for (let i = 0; i < kuiperCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 580 + Math.random() * 100;
        const height = (Math.random() - 0.5) * 80;
        
        const colorChoice = Math.random();
        const color = colorChoice < 0.5 ? 
            new THREE.Color(0.5, 0.7, 1) : 
            new THREE.Color(0.85, 0.85, 1);
        
        const size = 0.15 + Math.random() * 0.5;
        const kuiperGeometry = new THREE.IcosahedronGeometry(size, 0);
        const kuiperMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.8,
            metalness: 0.15,
            transparent: true,
            opacity: 0.75
        });
        
        const kuiper = new THREE.Mesh(kuiperGeometry, kuiperMaterial);
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

/**
 * Create a comet with tail
 * @param {THREE.Scene} scene - The Three.js scene
 */
function createComet(scene) {
    const cometGroup = new THREE.Group();
    
    // Comet's nucleus (solid core)
    const nucleusGeometry = new THREE.SphereGeometry(1.5, 16, 16);
    const nucleusMaterial = new THREE.MeshStandardMaterial({
        color: 0x444444,
        roughness: 0.9
    });
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    cometGroup.add(nucleus);

    // Comet's coma (glowing gas cloud)
    const comaGeometry = new THREE.SphereGeometry(3, 16, 16);
    const comaMaterial = new THREE.MeshBasicMaterial({
        color: 0xaaddff,
        transparent: true,
        opacity: 0.3
    });
    const coma = new THREE.Mesh(comaGeometry, comaMaterial);
    cometGroup.add(coma);

    // Ion tail (blue, straight)
    const tailGeometry = new THREE.ConeGeometry(4, 40, 8, 1, true);
    const tailMaterial = new THREE.MeshBasicMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide
    });
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.rotation.x = Math.PI / 2;
    tail.position.z = -25;
    cometGroup.add(tail);

    // Dust tail (white/yellow, curved)
    const dustTailGeometry = new THREE.ConeGeometry(3, 30, 8, 1, true);
    const dustTailMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffee,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide
    });
    const dustTail = new THREE.Mesh(dustTailGeometry, dustTailMaterial);
    dustTail.rotation.x = Math.PI / 2 + 0.2;
    dustTail.rotation.z = 0.3;
    dustTail.position.z = -20;
    dustTail.position.x = -5;
    cometGroup.add(dustTail);

    // Store orbit data
    cometGroup.userData = {
        angle: 0,
        orbitSpeed: 0.8,
        orbitRadius: 280,
        tilt: 0.4
    };

    scene.add(cometGroup);
    return cometGroup;
}

/**
 * Create constellation lines
 * @param {THREE.Scene} scene - The Three.js scene
 */
function createConstellations(scene) {
    const constellationsGroup = new THREE.Group();
    const linesGroup = new THREE.Group();
    
    // Sample constellation connections
    const constellations = [
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

    constellations.forEach(constellation => {
        // Create line connecting stars
        const lineGeometry = new THREE.BufferGeometry();
        const points = constellation.stars.map(s => new THREE.Vector3(s[0], s[1], s[2]));
        lineGeometry.setFromPoints(points);
        
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x6666ff,
            transparent: true,
            opacity: 0.3
        });
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        linesGroup.add(line);

        // Add star markers at constellation points
        constellation.stars.forEach(star => {
            const starGeometry = new THREE.SphereGeometry(0.8, 8, 8);
            const starMaterial = new THREE.MeshBasicMaterial({
                color: 0xaaaaff,
                transparent: true,
                opacity: 0.6
            });
            const starMesh = new THREE.Mesh(starGeometry, starMaterial);
            starMesh.position.set(star[0], star[1], star[2]);
            constellationsGroup.add(starMesh);
        });
    });

    constellationsGroup.add(linesGroup);
    
    scene.add(constellationsGroup);
    constellationsGroup.visible = false;
    return constellationsGroup;
}

/**
 * Create the Sun with glow effects
 * @param {THREE.Scene} scene - The Three.js scene
 */
function createSun(scene) {
    const sunGroup = new THREE.Group();

    // Sun Core
    const sunGeometry = new THREE.SphereGeometry(30, 64, 64);
    const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xffdd00,
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sunGroup.add(sun);

    // Glowing layers (atmosphere)
    [35, 45, 60].forEach((size, i) => {
        const glowGeometry = new THREE.SphereGeometry(size, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0xffaa00 : 0xff6600,
            transparent: true,
            opacity: 0.4 - i * 0.12,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        sunGroup.add(glow);
    });

    // Corona (outer glow)
    const coronaGeometry = new THREE.SphereGeometry(75, 32, 32);
    const coronaMaterial = new THREE.MeshBasicMaterial({
        color: 0xff4400,
        transparent: true,
        opacity: 0.05,
        side: THREE.BackSide
    });
    const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
    sunGroup.add(corona);

    // Solar flares (animated particles)
    for (let i = 0; i < 50; i++) {
        const flareGeometry = new THREE.SphereGeometry(0.5 + Math.random(), 4, 4);
        const flareMaterial = new THREE.MeshBasicMaterial({
            color: 0xffaa00,
            transparent: true,
            opacity: 0.3
        });
        const flare = new THREE.Mesh(flareGeometry, flareMaterial);
        const angle = Math.random() * Math.PI * 2;
        const radius = 30 + Math.random() * 10;
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

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createStars,
        createNebula,
        createAsteroidBelt,
        createKuiperBelt,
        createComet,
        createConstellations,
        createSun
    };
}