# GLB as the 3D model format for the web

The owner's 3D logo exists as FBX and OBJ+MTL files. Neither format is ideal for web delivery: FBX requires a heavy loader not natively supported by Three.js, and OBJ+MTL is a multi-file format with no animation support. We convert the model to GLB (binary glTF) once via Blender, then serve the single `.glb` file. GLB is the web standard for 3D — compact, single-file, natively supported by `@react-three/drei`'s `useGLTF`, and cached by the browser like any static asset.

## Considered options

- **FBX** — rejected: requires `FBXLoader`, large file size, poor web performance
- **OBJ + MTL** — rejected: multi-file, no animations, older format with less tooling support
- **GLB** — chosen: single binary file, industry standard for WebGL, first-class support in R3F/drei
