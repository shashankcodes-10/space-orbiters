import mercury from "/textures/2k_mercury.jpeg";
import venus from "/textures/2k_venus_surface.jpeg";
import earth from "/textures/2k_earth_daymap.jpeg";
import mars from "/textures/2k_mars.jpeg";
import jupiter from "/textures/2k_jupiter.jpeg";
import saturn from "/textures/2k_saturn.jpeg";
import uranus from "/textures/uranus.jpeg";
import neptune from "/textures/2k_neptune.jpeg";

const random = (a, b) => a + Math.random() * b;
const randomInt = (a, b) => Math.floor(random(a, b));
const randomColor = () =>
  `rgb(${randomInt(80, 50)}, ${randomInt(80, 50)}, ${randomInt(80, 50)})`;

const planetData = [];
const totalPlanets = 8;
const textures = [
  mercury,
  venus,
  earth,
  mars,
  jupiter,
  saturn,
  uranus,
  neptune,
];
const radiusSize = [1.2, 1.6, 1.63, 1.34, 2.9, 2.8, 2.6, 1.8];
const names = [
  "mercury",
  "venus",
  "earth",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
];

for (let i = 0; i < totalPlanets; i++) {
  var planet = {
    id: i,
    color: randomColor(),
    xRadius: (i + 1.5) * 6,
    zRadius: (i + 1.5) * 4,
    size: radiusSize[i],
    speed: random(0.05, 0.1),
    offset: random(0, Math.PI * 2),
    rotationSpeed: random(0.01, 0.03),
    textureMap: textures[i],
    name: names[i].toUpperCase(),
    gravity: random(2, 5).toFixed(2),
    orbitalPeriod: randomInt(50, 500),
    surfaceArea: random(100, 1000).toFixed(2),
  };
  planetData.push(planet);
}

export default planetData;
