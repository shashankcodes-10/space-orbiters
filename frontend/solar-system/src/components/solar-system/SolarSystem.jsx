import { Suspense, useState, useRef } from "react";
import { Canvas, extend, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import DialogModal from "./dialog";
import planetData from "./planetData";
import "./SolarSystem.css";
import sunTexture from "/textures/sun.jpeg";
import { SphereGeometry, MeshPhongMaterial } from "three";
import PropTypes from "prop-types";

extend({ SphereGeometry, MeshPhongMaterial });

const SolarSystem = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const handleCloseDialog = () => setOpenDialog(false);

  const [dialogData, setDialogData] = useState(null);

  return (
    <>
      <DialogModal
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        dialogData={dialogData}
      />
      <Canvas camera={{ position: [0, 50, 45], fov: 45 }}>
        <Suspense fallback={null}>
          <Lights />
          <Sun />
          {planetData.map((planet) => (
            <Planet
              planet={planet}
              key={planet.id}
              setDialogData={setDialogData}
              setOpenDialog={setOpenDialog}
            />
          ))}
          <OrbitControls />
        </Suspense>
      </Canvas>
    </>
  );
};

function Lights() {
  return (
    <>
      <ambientLight />
      <pointLight position={[0, 0, 0]} color="white" intensity={1} />
    </>
  );
}

function Sun() {
  const texture = useLoader(THREE.TextureLoader, sunTexture);
  return (
    <mesh>
      <sphereGeometry args={[4.5, 32, 32]} />
      <meshPhongMaterial map={texture} attach="material" />
    </mesh>
  );
}

function Planet({
  planet: {
    color,
    xRadius,
    zRadius,
    size,
    speed,
    offset,
    rotationSpeed,
    textureMap,
    name,
    gravity,
    orbitalPeriod,
    surfaceArea,
  },
  setDialogData,
  setOpenDialog,
}) {
  const planetRef = useRef();
  const texture = useLoader(THREE.TextureLoader, textureMap);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    const x = xRadius * Math.sin(t);
    const z = zRadius * Math.cos(t);
    planetRef.current.position.x = x;
    planetRef.current.position.z = z;
    planetRef.current.rotation.y += rotationSpeed;
  });
  return (
    <>
      <mesh
        ref={planetRef}
        onClick={() => {
          setDialogData({ name, gravity, orbitalPeriod, surfaceArea });
          setOpenDialog(true);
        }}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial map={texture} />
        <Html distanceFactor={15}>
          <div className="annotation">{name}</div>
        </Html>
      </mesh>
      <Ecliptic xRadius={xRadius} zRadius={zRadius} />
    </>
  );
}

Planet.propTypes = {
  planet: PropTypes.shape({
    color: PropTypes.string,
    xRadius: PropTypes.number,
    zRadius: PropTypes.number,
    size: PropTypes.number,
    speed: PropTypes.number,
    offset: PropTypes.number,
    rotationSpeed: PropTypes.number,
    textureMap: PropTypes.string,
    name: PropTypes.string,
    gravity: PropTypes.string,
    orbitalPeriod: PropTypes.number,
    surfaceArea: PropTypes.string,
  }),
  setDialogData: PropTypes.func,
  setOpenDialog: PropTypes.func,
};

function Ecliptic({ xRadius = 1, zRadius = 1 }) {
  const points = [];
  for (let index = 0; index <= 64; index++) {
    const angle = (index / 64) * 2 * Math.PI;
    const x = xRadius * Math.cos(angle);
    const z = zRadius * Math.sin(angle);
    points.push(new THREE.Vector3(x, 0, z));
  }
  // points.push(points[0]);
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial attach="material" color="#BFBBDA" linewidth={15} />
    </line>
  );
}

Ecliptic.propTypes = {
  xRadius: PropTypes.number,
  zRadius: PropTypes.number,
};

export default SolarSystem;
