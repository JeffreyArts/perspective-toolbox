import _ from "lodash"
import * as THREE from "three"
import degreesToRadians from "./degrees-to-radians.js"

/* lineObject = object {
    start: {
        x: 0,
        y: 0,
    },
    end: {
        x: 1,
        y: 0,
    },
    color:'#60f',
    side: "right",
    thickness: .5,
    length: 0
    rotation: {},
    position: {}
}
*/

const Line  = {
    create: (line, cube) => {
        if (!line.color) {
            line.color = "#ffffff"
        }
        if (!line.thickness) {
            line.thickness = .25
        }

        const geometry = new THREE.BoxGeometry(1,1,1)
        const lineObject = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: line.color, wireframe: false}))
        lineObject.data = line
        lineObject.data.length = Line.getLength(lineObject)
        lineObject.data.position = Line.getPosition(lineObject, cube)
        lineObject.data.scale = Line.getScale(lineObject)
        lineObject.data.rotation = Line.getRotation(lineObject)
        // lineObject.visible = false;
        return lineObject
    },
    update: (lineData, props, cube) => {
        var line = Line.create(_.merge({}, lineData, props), cube)
        line.rotation.setFromVector3( line.data.rotation )
        line.position.copy( line.data.position )
        line.scale.copy( line.data.scale )
        return line
    },
    updateFromPolyline: (line) => {
        line.data.start = {
            x: line.data.polyline[0].x,
            y: line.data.polyline[0].y
        }

        line.data.end = {
            x: line.data.polyline[1].x,
            y: line.data.polyline[1].y
        }
        delete line.data.polyline
    },
    getLength: (line) => {
        if (line.data.polyline) {
            Line.updateFromPolyline(line)
        }
        var length = Math.abs(line.data.start.x - line.data.end.x)
            
        if (length === 0) {
            length = Math.abs(line.data.start.y - line.data.end.y)
        }
        return length
    },
    getScale: (line) => {
        var result = new THREE.Vector3(line.data.thickness,line.data.thickness,line.data.thickness)
        result.x = (line.data.length + line.data.thickness) * (1/line.data.thickness) * line.data.thickness
        return result
    },
    getRotation: (line) => {
        if (line.data.polyline) {
            Line.updateFromPolyline(line)
        }

        var result = new THREE.Vector3()
        // var rotation = 90;
        var rotation = Math.random() < 0.5 ? 90 : -90
        if (line.data.side == "front" || line.data.side == "back") {
            if (Math.abs(line.data.start.x - line.data.end.x)) {
                result.x = degreesToRadians(rotation)
                result.y = 0
                result.z = 0
            } else {
                result.x = 0
                result.y = 0
                result.z = degreesToRadians(rotation)
            }
        } else if (line.data.side == "left" || line.data.side == "right") {
            if (Math.abs(line.data.start.x - line.data.end.x)) {
                result.x = 0
                result.y = degreesToRadians(rotation)
                result.z = 0
            } else {
                result.x = 0
                result.y = 0
                result.z = degreesToRadians(rotation)
            }
        } else if (line.data.side == "bottom" || line.data.side == "top") {
            if (Math.abs(line.data.start.x - line.data.end.x)) {
                result.x = degreesToRadians(rotation)
                result.y = 0
                result.z = 0
            } else {
                result.x = 0
                result.y = degreesToRadians(rotation)
                result.z = 0
            }
        } else {
            result.x = 0
            result.y = 0
            result.z = 0
        }
        return result
    },
    getOrientation: (line) => {
        var orientation = {
            x: null,
            y: null,
            z: null
        }
        // orientation = true 
        // when the direction of the line is in line with the axis
        if (line.data.side == "front" || line.data.side == "back") {
            orientation.x = line.data.start.x == line.data.end.x
            orientation.y = line.data.start.y == line.data.end.y
            orientation.z = false
        } else if (line.data.side == "left" || line.data.side == "right") {
            orientation.x = false
            orientation.y = line.data.start.y == line.data.end.y
            orientation.z = line.data.start.x == line.data.end.x
        } else if (line.data.side == "bottom" || line.data.side == "top") {
            orientation.x = line.data.start.x == line.data.end.x
            orientation.y = false
            orientation.z = line.data.start.y == line.data.end.y
        }
        return orientation
    },
    getPosition: (line, cube) => {
        if (line.data.polyline) {
            Line.updateFromPolyline(line)
        }
        var result = new THREE.Vector3()
        if (line.data.side == "front") {
            result.z = cube.depth - 1
            if (line.data.start.y > line.data.end.y) {
                result.x = line.data.start.x
                result.y = line.data.end.y + line.data.length/2
            } else if (line.data.start.y < line.data.end.y) {
                result.x = line.data.start.x
                result.y = line.data.start.y + line.data.length/2
            } else if (line.data.start.x > line.data.end.x) {
                result.x = line.data.end.x + line.data.length/2 
                result.y = line.data.start.y
            } else if (line.data.start.x < line.data.end.x) {
                result.x = line.data.start.x + line.data.length/2
                result.y = line.data.start.y
            }
        }  else if (line.data.side == "back") {
            var startX = cube.width -1
            result.z = 0
            if (line.data.start.y > line.data.end.y) {
                result.x = startX - line.data.start.x
                result.y = line.data.end.y + line.data.length/2
            } else if (line.data.start.y < line.data.end.y) {
                result.x = startX - line.data.start.x
                result.y = line.data.start.y + line.data.length/2
            } else if (line.data.start.x > line.data.end.x) {
                result.x = startX - line.data.end.x - line.data.length/2 // for non-mirrored version: line.data.end.x + line.data.length/2; 
                result.y = line.data.start.y
            } else if (line.data.start.x < line.data.end.x) {
                result.x = startX - line.data.start.x - line.data.length/2 // for non-mirrored version: line.data.start.x + line.data.length/2;
                result.y = line.data.start.y
            }
        } else if (line.data.side == "left") {
            result.x = 0
            if (line.data.start.y > line.data.end.y) {
                result.z = line.data.start.x
                result.y = line.data.end.y + line.data.length/2
            } else if (line.data.start.y < line.data.end.y) {
                result.z = line.data.start.x
                result.y = line.data.start.y + line.data.length/2
            } else if (line.data.start.x > line.data.end.x) {
                result.z = line.data.end.x + line.data.length/2 // for non-mirrored version: line.data.end.x + line.data.length/2; 
                result.y = line.data.start.y
            } else if (line.data.start.x < line.data.end.x) {
                result.z = line.data.start.x + line.data.length/2 // for non-mirrored version: line.data.start.x + line.data.length/2;
                result.y = line.data.start.y
            }
        } else if (line.data.side == "right") {
            var startX = cube.depth -1
            result.x = cube.width - 1 
            if (line.data.start.y > line.data.end.y) {
                result.z = startX - line.data.start.x
                result.y = line.data.end.y + line.data.length/2
            } else if (line.data.start.y < line.data.end.y) {
                result.z = startX - line.data.start.x
                result.y = line.data.start.y + line.data.length/2
            } else if (line.data.start.x > line.data.end.x) {
                result.z = startX - line.data.end.x - line.data.length/2 // for non-mirrored version: line.data.end.x + line.data.length/2; 
                result.y = line.data.start.y
            } else if (line.data.start.x < line.data.end.x) {
                result.z = startX - line.data.start.x - line.data.length/2 // for non-mirrored version: line.data.start.x + line.data.length/2;
                result.y = line.data.start.y
            }
        } else if (line.data.side == "top") {
            result.y = cube.height -1
            var startY = cube.depth -1

            if (line.data.start.y > line.data.end.y) {
                result.x = line.data.start.x
                result.z = startY - line.data.end.y - line.data.length/2
            } else if (line.data.start.y < line.data.end.y) {
                result.x = line.data.start.x
                result.z = startY - line.data.start.y - line.data.length/2
            } else if (line.data.start.x > line.data.end.x) {
                result.x = line.data.end.x + line.data.length/2 // for non-mirrored version: line.data.end.x + line.data.length/2; 
                result.z = startY - line.data.start.y
            } else if (line.data.start.x < line.data.end.x) {
                result.x = line.data.start.x + line.data.length/2 // for non-mirrored version: line.data.start.x + line.data.length/2;
                result.z = startY - line.data.start.y
            }
        } else if (line.data.side == "bottom") {
            result.y = 0

            if (line.data.start.y > line.data.end.y) {
                result.x = line.data.start.x
                result.z = line.data.end.y + line.data.length/2
            } else if (line.data.start.y < line.data.end.y) {
                result.x = line.data.start.x
                result.z = line.data.start.y + line.data.length/2
            } else if (line.data.start.x > line.data.end.x) {
                result.x = line.data.end.x + line.data.length/2 // for non-mirrored version: line.data.end.x + line.data.length/2; 
                result.z = line.data.start.y
            } else if (line.data.start.x < line.data.end.x) {
                result.x = line.data.start.x + line.data.length/2 // for non-mirrored version: line.data.start.x + line.data.length/2;
                result.z = line.data.start.y
            }
        } else if (_.isObject(cube)) {
            result.x = (cube.width-1)/2
            result.y = (cube.height-1)/2
            result.z = (cube.depth-1)/2
        }

        return result
    },
}

export default Line