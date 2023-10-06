import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as lil from 'lil-gui'

/**
 * Debug
 */
const gui = new lil.GUI()

const parameters = {
    color: new THREE.Color("rgb(217, 134, 26)"),
    spin: () => {
        gsap.to(torusKnot.rotation, { duration:1, y: torusKnot.rotation.y + 10 })
    }
}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
*/

const torusKnotGeometry = new THREE.TorusKnotGeometry(10, 3, 64, 8)
const material = new THREE.MeshBasicMaterial({
    color: parameters.color,
})
const wireframeMaterial = new THREE.MeshBasicMaterial( { 
    color: new THREE.Color("rgb(77, 46, 0)"), 
    wireframe: true, 
    transparent: true } );

const torusKnot = new THREE.Group()
torusKnot.add(new THREE.Mesh(torusKnotGeometry, material))
torusKnot.add(new THREE.Mesh(torusKnotGeometry, wireframeMaterial))

scene.add(torusKnot)

// Update Knot Torus Geometry with dat gui

const torusKnotData = {
    radius: 10,
    tube: 3,
    tubularSegments: 64,
    radialSegments: 8
}

const regenerateTorusKnotGeometry = () => {
    const newGeometry = new THREE.TorusKnotGeometry(
        torusKnotData.radius,
        torusKnotData.tube,
        torusKnotData.tubularSegments,
        torusKnotData.radialSegments
    )
    torusKnot.children[0].geometry.dispose()
    torusKnot.children[1].geometry.dispose()
    torusKnot.children[0].geometry = newGeometry
    torusKnot.children[1].geometry = newGeometry
}


// Debug

gui .add(torusKnot, 'visible')

gui .add(material, 'wireframe')

gui .addColor(parameters, 'color')
    .onChange(() => {
        material.color.set(parameters.color)
    })

gui .add(parameters, 'spin')

const torusKnotFolder = gui.addFolder('TorusKnot')
torusKnotFolder
    .add(torusKnotData, 'radius', 10, 18)
    .step(0.1)
    .onChange(regenerateTorusKnotGeometry)
torusKnotFolder
    .add(torusKnotData, 'tube', 1, 10)
    .step(0.1)
    .onChange(regenerateTorusKnotGeometry)
torusKnotFolder
    .add(torusKnotData, 'tubularSegments', 32, 400)
    .step(1)
    .onChange(regenerateTorusKnotGeometry)
torusKnotFolder
    .add(torusKnotData, 'radialSegments', 3, 40)
    .step(0.1)
    .onChange(regenerateTorusKnotGeometry)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
camera.position.x = 25
camera.position.y = 25

scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Rotate geometry
    torusKnot.rotation.x =  Math.sin(elapsedTime) 

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()