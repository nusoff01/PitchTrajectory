import { Camera, Canvas, useThree } from 'react-three-fiber';
import './App.css';
import { Ball } from './components/Ball/Ball';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { PerspectiveCamera, Vector3, Mesh } from 'three';
import { Strikezone } from './components/Strikezone/Strikezone';
import { OrbitControls } from '@react-three/drei/core';
import { BallField } from './components/BallField/BallField';

export type PITCH_PERSPECTIVE = 'catcher' | 'pitcher' | 'rhh' | 'lhh';
export interface PitchPerspectiveDef {
  position: [number, number, number],
  lookAt: Vector3
}
export const pitchPerspectiveMap: Record<PITCH_PERSPECTIVE, PitchPerspectiveDef> = {
  'catcher': {
    position: [0, 3, -5],
    lookAt: new Vector3(0, 6, 50)
  },
  'pitcher': {
    position: [0, 6, 60],
    lookAt: new Vector3(0, 3, 0)
  },
  'rhh': {
    position: [2,5,-1.5],
    lookAt: new Vector3(0, 6, 50)
  },
  'lhh': {
    position: [-2,5,-1.5],
    lookAt: new Vector3(0, 6, 50)
  },
};

function App(): JSX.Element {
  const [pitchPerspective, setPitchPerspective] = useState<PITCH_PERSPECTIVE>('catcher');

  return (
    <div className='appContainer'>
    <div className='canvasContainer'>
      <Canvas className='canvas' camera={{position: [0, 3.5, -5], 
        fov: 60}}>
        <BallField pitchPerspective={pitchPerspective}/>
      </Canvas>
    </div>
    <div>
      <label>Perspective: </label>
      <select
        value={pitchPerspective}
        onChange={(e) => {
          setPitchPerspective(e.target.value as PITCH_PERSPECTIVE);
        }}
      >
        {(Object.keys(pitchPerspectiveMap).map((oText, oI) => (
          <option>{oText}</option>
        )))}
      </select>
    </div>
    </div>
  );
}

export default App;
