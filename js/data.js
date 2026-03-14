/**
 * ============================================
 * PLANETARY DATA
 * All astronomical data for celestial bodies
 * ============================================
 */

const planetData = {
    // THE SUN - Our star
    sun: { 
        name: 'Sun', 
        type: 'Star',
        distance: '0 km', 
        period: 'N/A', 
        diameter: '1,392,700 km',
        moons: '0',
        day: '25-35 days',
        gravity: '274 m/s²',
        orbitSpeed: 0,
        orbitDistance: 0,
        size: 35,
        color: 0xffff00,
        emissive: 0xff8800,
        description: 'The Sun is the star at the center of our Solar System. It is a nearly perfect sphere of hot plasma.'
    },

    // TERRESTRIAL PLANETS
    mercury: { 
        name: 'Mercury', 
        type: 'Terrestrial Planet',
        distance: '57.9M km', 
        period: '88 days', 
        diameter: '4,879 km',
        moons: '0',
        day: '59 Earth days',
        gravity: '3.7 m/s²',
        orbitSpeed: 4.15,
        orbitDistance: 50,
        size: 1.8,
        color: 0xb5b5b5,
        emissive: 0x666666,
        description: 'The smallest planet in our solar system and closest to the Sun.'
    },
    
    venus: { 
        name: 'Venus', 
        type: 'Terrestrial Planet',
        distance: '108.2M km', 
        period: '225 days', 
        diameter: '12,104 km',
        moons: '0',
        day: '243 Earth days',
        gravity: '8.9 m/s²',
        orbitSpeed: 1.62,
        orbitDistance: 75,
        size: 2.8,
        color: 0xe6c87a,
        emissive: 0x997700,
        description: 'Earth\'s sister planet with a toxic atmosphere of sulfuric acid clouds.'
    },
    
    earth: { 
        name: 'Earth', 
        type: 'Terrestrial Planet',
        distance: '149.6M km', 
        period: '365 days', 
        diameter: '12,742 km',
        moons: '1',
        day: '24 hours',
        gravity: '9.8 m/s²',
        orbitSpeed: 1,
        orbitDistance: 105,
        size: 2.9,
        color: 0x4da6ff,
        emissive: 0x0066cc,
        description: 'The only astronomical object known to harbor life.'
    },
    
    // Earth's Moon
    moon: {
        name: 'Moon',
        type: 'Natural Satellite',
        distance: '384,400 km',
        period: '27 days',
        diameter: '3,474 km',
        moons: '0',
        day: '27 Earth days',
        gravity: '1.6 m/s²',
        orbitSpeed: 13,
        orbitDistance: 8,
        size: 0.8,
        color: 0xcccccc,
        emissive: 0x888888,
        description: 'Earth\'s only natural satellite, the fifth largest in the solar system.'
    },
    
    mars: { 
        name: 'Mars', 
        type: 'Terrestrial Planet',
        distance: '227.9M km', 
        period: '687 days', 
        diameter: '6,779 km',
        moons: '2',
        day: '24h 37m',
        gravity: '3.7 m/s²',
        orbitSpeed: 0.53,
        orbitDistance: 145,
        size: 2.2,
        color: 0xff6b4a,
        emissive: 0x992200,
        description: 'The Red Planet has the largest volcano in the solar system.'
    },

    // DWARF PLANETS & ASTEROIDS
    ceres: {
        name: 'Ceres',
        type: 'Dwarf Planet',
        distance: '414M km',
        period: '1,680 days',
        diameter: '946 km',
        moons: '0',
        day: '9 hours',
        gravity: '0.28 m/s²',
        orbitSpeed: 0.3,
        orbitDistance: 180,
        size: 0.5,
        color: 0x888888,
        emissive: 0x555555,
        description: 'The largest object in the asteroid belt between Mars and Jupiter.'
    },

    // GAS GIANTS
    jupiter: { 
        name: 'Jupiter', 
        type: 'Gas Giant',
        distance: '778.5M km', 
        period: '12 years', 
        diameter: '139,820 km',
        moons: '95',
        day: '10 hours',
        gravity: '24.8 m/s²',
        orbitSpeed: 0.084,
        orbitDistance: 230,
        size: 12,
        color: 0xd4a574,
        emissive: 0x886622,
        description: 'The largest planet with a storm larger than Earth - the Great Red Spot.'
    },
    
    saturn: { 
        name: 'Saturn', 
        type: 'Gas Giant',
        distance: '1.43B km', 
        period: '29 years', 
        diameter: '116,460 km',
        moons: '146',
        day: '10.7 hours',
        gravity: '10.4 m/s²',
        orbitSpeed: 0.034,
        orbitDistance: 330,
        size: 10,
        color: 0xf4d58d,
        emissive: 0xaa8800,
        description: 'Famous for its spectacular ring system made of ice and rock.'
    },

    // ICE GIANTS
    uranus: { 
        name: 'Uranus', 
        type: 'Ice Giant',
        distance: '2.87B km', 
        period: '84 years', 
        diameter: '50,724 km',
        moons: '28',
        day: '17 hours',
        gravity: '8.7 m/s²',
        orbitSpeed: 0.012,
        orbitDistance: 430,
        size: 5.5,
        color: 0x7fdbff,
        emissive: 0x0088aa,
        description: 'An ice giant that rotates on its side with 13 known rings.'
    },
    
    neptune: { 
        name: 'Neptune', 
        type: 'Ice Giant',
        distance: '4.50B km', 
        period: '165 years', 
        diameter: '49,244 km',
        moons: '16',
        day: '16 hours',
        gravity: '11 m/s²',
        orbitSpeed: 0.006,
        orbitDistance: 530,
        size: 5.2,
        color: 0x4a6dff,
        emissive: 0x0033aa,
        description: 'The windiest planet with speeds over 2,000 km/h.'
    },

    // TRANS-NEPTUNIAN OBJECTS
    pluto: {
        name: 'Pluto',
        type: 'Dwarf Planet',
        distance: '5.91B km',
        period: '248 years',
        diameter: '2,377 km',
        moons: '5',
        day: '6.4 days',
        gravity: '0.62 m/s²',
        orbitSpeed: 0.003,
        orbitDistance: 600,
        size: 1.2,
        color: 0xd4a588,
        emissive: 0x8b6b4a,
        description: 'A dwarf planet in the Kuiper belt, once considered the ninth planet.'
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { planetData };
}