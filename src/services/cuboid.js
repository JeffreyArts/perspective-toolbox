import _ from "lodash"
import * as THREE from "three"
import Line from "./line.js"
import {PolylineAlgorithm} from "visual-pattern-generator"

/* cuboidProps = object {
    width: 5,
    depth: 5,
    height: 5,
    maxLines: 1024,
    helperCube: true,
    name: 'cuboid',
}
*/

const symbols = [
    {
        polylines: [
            [{x:0, y:0},{ x:1, y:0}]
        ],
        connectCords: [
            {x:0, y:0},
            {x:1, y:0}
        ],
        width:2,
        height:1
    },
    {
        polylines: [
            [{x:0, y:0},{ x:0, y:1}]
        ],
        connectCords: [
            {x:0, y:0},
            {x:0, y:1}
        ],
        width:1,
        height:2
    }
]

const algorithmConfig = {
    width: 5,
    height: 5,
    symbols: symbols,
    algorithm: {
        type: "polylines",
        startPoint: {x:0, y:0},
        mirrorX: 1,
        mirrorY: 1,
        drawConnectLines: true
    }
}

const Cuboid  = {
    create: (cubeDimensions, cuboidProps) => {
        if (!cuboidProps.maxLines) {
            cuboidProps.maxLines = 1024
            console.warn("Missing maxLines property on Cuboid.create method, defaulting to 1024")
        }
        if (!cuboidProps.name) {
            cuboidProps.name = "cuboid"
            console.warn("Missing name property on Cuboid.create method, defaulting to 'cuboid'")
        }
        const cuboid = new THREE.Group()
        cuboid.name = cuboidProps.name
        const lineData = Line.getLineDataObject()

        let line = null

        for (let index = 0; index < cuboidProps.maxLines; index++) {
            line = Line.create(lineData, {
                width: cubeDimensions.width, 
                height: cubeDimensions.height, 
                depth: cubeDimensions.depth
            })
            cuboid.add(line)
            line.rotation.setFromVector3( line.data.rotation )
            line.position.copy( line.data.position )
            line.scale.copy( line.data.scale )
        }
            
        // three.controls.target.set((width-1)/2, (height-1)/2, (depth-1)/2)
        // three.camera.lookAt(three.controls.target)
        
        if (cuboidProps.helperCube) {
            Cuboid.createHelperCube()
        }
        return cuboid
    },
    createHelperCube: (name, cubeDimensions) => {
        const helperCube = new THREE.Group()
        helperCube.name = name
        // var helperCube = _.find(three.scene.children, {name: "helper-cubeDimensions"})
        // if (!helperCube) {
        //     three.scene.add(helperCube)
        // }

        // for (let i = helperCube.children.length - 1; i >= 0; i--) {
        //     if(helperCube.children[i].type === "Mesh") {
        //         helperCube.children[i].geometry.dispose()
        //         helperCube.children[i].material.dispose()
        //     }
        //     helperCube.remove(helperCube.children[i])
        // }
        

        let sphere = new THREE.Mesh(new THREE.SphereGeometry( 0.01, 32, 16 ), new THREE.MeshBasicMaterial({color: 0xcccccc, wireframe: true}))
        
        for (var x=0; x<cubeDimensions.width; x++) {
            for (var y=0; y<cubeDimensions.height; y++) {

                // Back
                sphere.position.x = x
                sphere.position.y = y
                sphere.position.z = 0
                helperCube.add(sphere.clone())

                // Front
                sphere.position.x = x
                sphere.position.y = y
                sphere.position.z = cubeDimensions.depth-1
                helperCube.add(sphere.clone())
            }
        }
        
        for (var x=0; x<cubeDimensions.depth; x++) {
            for (var y=0; y<cubeDimensions.height; y++) {
                // Left
                sphere.position.x = 0
                sphere.position.y = y
                sphere.position.z = x
                helperCube.add(sphere.clone())

                // Right
                sphere.position.x = cubeDimensions.width-1
                sphere.position.y = y
                sphere.position.z = x
                helperCube.add(sphere.clone())
            }
        }
        
        for (var x=0; x<cubeDimensions.width; x++) {
            for (var y=0; y<cubeDimensions.depth; y++) {
                // Bottom
                sphere.position.x = x
                sphere.position.y = 0
                sphere.position.z = y
                helperCube.add(sphere.clone())

                // Top
                sphere.position.x = x
                sphere.position.y = cubeDimensions.height-1
                sphere.position.z = y
                helperCube.add(sphere.clone())
            }
        }
        return helperCube
    },   
    generateCuboidLines: (cubeDimensions = {width:0, height:0, depth:0}, type, seed) => {
        const cuboidLines = []         
        const lineData = {
            color:"#ffffff",
            thickness: 0.25,
            length: 0,
            polyline: [],
            scale: {},
            rotation: {},
            position: {}
        }
        let query, queryPlaceholder



        if (type == "abstract") {
            cubeDimensions.width = 5
            cubeDimensions.height = 5
            cubeDimensions.depth = 5
            
            query = _.merge({}, algorithmConfig, {
                seed: seed, 
                width: cubeDimensions.width, 
                height: cubeDimensions.height,
            })
            var masks = [[
                [1,0,0,0,1],
                [0,0,0,0,0],
                [0,1,1,1,0],
                [0,0,0,0,0],
                [1,0,0,0,1],
            ], [
                [1,0,0,0,1],
                [0,0,0,0,0],
                [0,0,1,0,0],
                [0,0,0,0,0],
                [1,0,0,0,1],
            ]]
            _.merge(query.algorithm, {
                mirrorX: 1,
                mirrorY: 1,
                mask: masks[Math.round(Math.random())]
            })

            queryPlaceholder.left   = _.merge({},query)
            queryPlaceholder.right  = _.merge({},query)

            queryPlaceholder.top    = _.merge({},query, { width: cubeDimensions.width,  height: cubeDimensions.depth})
            queryPlaceholder.bottom = _.merge({},query, { width: cubeDimensions.width,  height: cubeDimensions.depth})

            queryPlaceholder.front  = _.merge({},query, { width: cubeDimensions.width,  height: cubeDimensions.height})
            queryPlaceholder.back   = _.merge({},query, { width: cubeDimensions.width,  height: cubeDimensions.height})

        } else if (type == "non-identity") {
            cubeDimensions.width = 5
            cubeDimensions.height = 5
            cubeDimensions.depth = 5
            
            query = _.merge({},algorithmConfig, {
                seed: seed, 
                width: cubeDimensions.width, 
                height: cubeDimensions.height,
            })
            _.merge(query.algorithm, {
                mirrorX: 1,
                mirrorY: 1,
                mask: null
            })

            queryPlaceholder.left   = _.merge({},query)
            queryPlaceholder.right  = _.merge({},query)

            queryPlaceholder.front  = _.merge({},query, { width: cubeDimensions.width,  height: cubeDimensions.height})
            queryPlaceholder.back   = _.merge({},query, { width: cubeDimensions.width,  height: cubeDimensions.height})

            queryPlaceholder.top    = _.merge({},query, { width: cubeDimensions.width,  height: cubeDimensions.depth})
            queryPlaceholder.bottom = _.merge({},query, { width: cubeDimensions.width,  height: cubeDimensions.depth})
        } else if (type == "identity") {
            cubeDimensions.width = 5
            cubeDimensions.height = 5
            cubeDimensions.depth = 5
            
            query = _.merge({},algorithmConfig, {
                seed: seed, 
                width: cubeDimensions.width, 
                height: cubeDimensions.height,
            })

            _.merge(query.algorithm, {
                mirrorX: Math.round(Math.random()) + 1,
                mirrorY: 0,
                mask: null
            })

            queryPlaceholder.left   = _.merge({},query)
            queryPlaceholder.right  = _.merge({},query)

            queryPlaceholder.front  = _.merge({},query, { width: cubeDimensions.width,  height: cubeDimensions.height})
            queryPlaceholder.back   = _.merge({},query, { width: cubeDimensions.width,  height: cubeDimensions.height})


            _.merge(query.algorithm, {
                mirrorX: 1,
                mirrorY: 1,
                mask: null
            })

            queryPlaceholder.top    = _.merge({},query, { width: cubeDimensions.width,  height: cubeDimensions.depth})
            queryPlaceholder.bottom = _.merge({},query, { width: cubeDimensions.width,  height: cubeDimensions.depth})
        } else if (type == "open") {
            cubeDimensions.width = 7
            cubeDimensions.height = 7
            cubeDimensions.depth = 7
            
            query = _.merge({},algorithmConfig, {
                seed: seed, 
                width: cubeDimensions.width, 
                height: cubeDimensions.height,
            })

            var masks = [[
                [1,0,0,0,0,0,1],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [1,0,0,0,0,0,1],
            ], [
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
            ], [
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,1,0,0,0],
                [0,0,1,1,1,0,0],
                [0,0,0,1,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
            ], [
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,1,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
            ], [
                [0,0,0,1,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [1,0,0,0,0,0,1],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,1,0,0,0],
            ]]
            var index = Math.round(Math.random()*(masks.length - 1))
            
            _.merge(query.algorithm, {
                mirrorX: 1,
                mirrorY: 1,
                mask: masks[index]
            })

            queryPlaceholder.left   = _.merge({},query)
            queryPlaceholder.right  = _.merge({},query)

            queryPlaceholder.front  = _.merge({},query, { width: cubeDimensions.width,  height: cubeDimensions.height})
            queryPlaceholder.back   = _.merge({},query, { width: cubeDimensions.width,  height: cubeDimensions.height})

            queryPlaceholder.top    = _.merge({},query, { width: cubeDimensions.width,  height: cubeDimensions.depth})
            queryPlaceholder.bottom = _.merge({},query, { width: cubeDimensions.width,  height: cubeDimensions.depth})
        } else {
            query = _.merge({},algorithmConfig, {
                seed: seed, 
                width: cubeDimensions.depth, 
                height: cubeDimensions.height,
            })
            _.merge(query.algorithm, {
                mirrorX: 1,
                mirrorY: 1,
                mask: null
            })

            queryPlaceholder.left   = _.merge({},query)
            queryPlaceholder.right  = _.merge({},query)

            queryPlaceholder.top    = _.merge({},query, { width: cubeDimensions.width,  height: cubeDimensions.depth})
            queryPlaceholder.bottom = _.merge({},query, { width: cubeDimensions.width,  height: cubeDimensions.depth})

            queryPlaceholder.front  = _.merge({},query, { width: cubeDimensions.width,  height: cubeDimensions.height})
            queryPlaceholder.back   = _.merge({},query, { width: cubeDimensions.width,  height: cubeDimensions.height})
        }

        _.each(queryPlaceholder, (query, side) => {
            const polylines = PolylineAlgorithm(query).polylines

            // Add Side
            _.each(polylines, polyline => {
                cuboidLines.push(Line.update(lineData, {polyline: polyline, side: side, thickness: lineData.lineThickness}, cubeDimensions))
            })
        })
        
        // Remove duplicates
        return _.uniqBy(cuboidLines, (cl) => {
            return `${cl.position.x}, ${cl.position.y}, ${cl.position.z}, ${cl.data.length}`
        })
    },
    updateCuboid: (cuboid, props = {delay: 0, cuboidLines: [], transition: null, duration: null}) => {
        if (_.isNull(prop.transition)) {
            console.error("Missing required `transition` property for updateCuboid, should be a tween transition function")
            return
        }
        if (_.isNull(prop.duration)) {
            console.error("Missing required `duration` property for updateCuboid, should be number in miliseconds")
            return
        }

        
        _.each(cuboid.children, (line, lineIndex) => {

            if (!prop.cuboidLines[lineIndex]) {
                line.visible = false
                return
            }


            if (line.visible == false) {
                line.visible = true
            }

            setTimeout(() => {
                new TWEEN.Tween( cuboid.children[lineIndex].scale  )   
                    .to( prop.cuboidLines[lineIndex].scale, duration )
                    .easing( transition )
                    .start()

                new TWEEN.Tween( cuboid.children[lineIndex].position  )   
                    .to( prop.cuboidLines[lineIndex].position, duration )
                    .easing( transition )
                    .start()                    

                new TWEEN.Tween(cuboid.children[lineIndex].rotation)   
                    .to({
                        x: prop.cuboidLines[lineIndex].rotation.x,
                        z: prop.cuboidLines[lineIndex].rotation.z,
                        y: prop.cuboidLines[lineIndex].rotation.y
                    }, duration )
                    .easing( transition )
                    .start()
            }, lineIndex * props.delay)
            
        })
    },
    removeCuboid: (cuboid) => {
        for (let i = cuboid.children.length - 1; i >= 0; i--) {
            if(cuboid.children[i].type === "Mesh") {
                cuboid.children[i].geometry.dispose()
                cuboid.children[i].material.dispose()
            }
            cuboid.remove(cuboid.children[i])
        }
        cuboid.parent.remove(cuboid)
    },
}

export default Line