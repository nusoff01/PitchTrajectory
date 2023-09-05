import { Camera, Canvas, useLoader, useThree } from 'react-three-fiber';
import { Ball } from '../Ball/Ball';
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { PerspectiveCamera, Vector3, Mesh, Group, TextureLoader, CircleGeometry } from 'three';
import { Strikezone } from '../Strikezone/Strikezone';
import { OrbitControls } from '@react-three/drei/core';
import { PITCH_PERSPECTIVE, pitchPerspectiveMap } from '../../App';

const pitches: any = [
  {
      "x": [
          7.9406207025044315,
          -16.560759745555636,
          -2.632979898288993
      ],
      "y": [
          -135.66698985542124,
          28.924904092464185,
          50.00350552415374
      ],
      "z": [
          -1.6475339543719638,
          -33.96097419556522,
          5.265709539708126
      ]
  },
  {
      "x": [
          7.549261683793425,
          7.2097256324653785,
          -2.796705481054232
      ],
      "y": [
          -121.67965896113766,
          22.41726540438499,
          50.00188892223368
      ],
      "z": [
          -1.9064669838543162,
          -33.45613653931078,
          5.267959281733023
      ]
  },
  {
      "x": [
          7.733968994335693,
          -6.398405404115368,
          -2.6875958017040724
      ],
      "y": [
          -136.02513027401486,
          27.617372292578885,
          50.00668734940011
      ],
      "z": [
          1.3769412181383185,
          -29.73590087117034,
          5.297011914121482
      ]
  },
  {
      "x": [
          1.2417141302787253,
          6.57921477756838,
          -3.1474209709729473
      ],
      "y": [
          -120.05230131218161,
          23.303846992709293,
          50.00232180854727
      ],
      "z": [
          0.2626643655655827,
          -35.918803878219464,
          5.411245523493945
      ]
  },
  {
      "x": [
          6.161281579508579,
          7.145254786958378,
          -2.8618412791008723
      ],
      "y": [
          -121.03095979353836,
          25.94995253538417,
          50.00327126948119
      ],
      "z": [
          -2.033864020730043,
          -37.176677163169835,
          5.292593211638651
      ]
  },
  {
      "x": [
          8.772025739323858,
          -16.810496330795278,
          -2.7819151609109833
      ],
      "y": [
          -136.56834446095877,
          33.639705109355724,
          50.00077654787408
      ],
      "z": [
          -2.0452904156925964,
          -37.55888745750219,
          5.236011587841909
      ]
  },
  {
      "x": [
          15.560569982577299,
          -14.62667109542788,
          -2.4134841029593916
      ],
      "y": [
          -126.05361513151661,
          28.467508357474134,
          50.00285708556754
      ],
      "z": [
          -8.219197522565846,
          -29.361150592200097,
          5.110298177256934
      ]
  },
  {
      "x": [
          5.850457948743814,
          8.777378132330727,
          -2.9207731466887186
      ],
      "y": [
          -122.52869952737521,
          28.51564588966991,
          50.00094225079038
      ],
      "z": [
          -2.9467084983875385,
          -38.25979696486631,
          5.304106928182247
      ]
  }
]; 

interface CameraPositionInterface {
  pitchPerspective: PITCH_PERSPECTIVE
}
function CameraPosition ({pitchPerspective}: CameraPositionInterface) {
    const canvasRef = useThree();
    useEffect(() => {
        canvasRef.camera.position.set(...pitchPerspectiveMap[pitchPerspective].position);
        canvasRef.camera.lookAt(pitchPerspectiveMap[pitchPerspective].lookAt);
    }, [pitchPerspective]);
    return <></>;
}

interface BallFieldProps {
    pitchPerspective: PITCH_PERSPECTIVE
}

export function BallField({pitchPerspective}: BallFieldProps): JSX.Element {
    const texture = useLoader(TextureLoader, 'ballTexture2.jpg');
    return (
        <Suspense fallback={null}>
            <group>
                <CameraPosition pitchPerspective={pitchPerspective}/>
                {/* <OrbitControls/> */}
                <ambientLight/>
                <spotLight
                    position={[2, 5, 2]}
                    color="#ffffff"
                    intensity={2.5}
                    shadow-mapSize-height={1024}
                    shadow-mapSize-width={1024}
                    shadow-camera-far={50}
                    shadow-camera-left={-10}
                    shadow-camera-right={10}
                    shadow-camera-top={10}
                    shadow-camera-bottom={-10}
                    castShadow
                />
                <pointLight position={[0,5,0]}/>
                    {pitches.map((p: any, pI: number) => {
                        return <Ball
                            texture={texture}
                            perspective={pitchPerspective}
                            key={pI}
                            timeOffset={pI * 2 + 1}
                            xCoefficients={p.x}
                            yCoefficients={p.y}
                            zCoefficients={p.z}
                        />;
                    })}
                <Strikezone/>
                <Ground/>
            </group>
        </Suspense>
    );
}

function Ground () {
    return <mesh rotation={[-Math.PI / 2,0,0]}>
        <Grass/>
        <HitterCircle/>
    </mesh>;
}

function Grass () {
    return <mesh receiveShadow position={[0,-60,0]} rotation={[0,0,Math.PI / 4]}>
        <planeGeometry attach="geometry" args={[90, 90]}/>
        <meshStandardMaterial attach="material" color="#66AA44" />
    </mesh>;
}

function HitterCircle () {
    return <mesh receiveShadow position={[0,0,0.1]}>
        <circleGeometry args={[10,60]} />
        <meshStandardMaterial color='#C2B280'/>
    </mesh>;
}