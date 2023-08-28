import { Line } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "react-three-fiber";
import { BufferGeometry, Mesh, Vector3 } from "three";

const szPoints = [
    new Vector3(-.833, 1.5, 0),
    new Vector3(.833, 1.5, 0),
    new Vector3(.833, 3.5, 0),
    new Vector3(-.833, 3.5, 0),
    new Vector3(-.833, 1.5, 0)
];
const lineGeometry = new BufferGeometry().setFromPoints(szPoints)


export function Strikezone (): JSX.Element {
    const meshRef = useRef<Mesh>(null!);

    return (
        <group>
            <Line 
                points={szPoints}
                color='black'
                lineWidth={1}
            />
        </group>
    );
}