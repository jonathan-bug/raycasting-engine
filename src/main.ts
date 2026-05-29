import './style.css'
import Vector from './utils/Vector'

const canvas = document.getElementById('canvas') as HTMLCanvasElement
const context = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

if (!context) {
    throw new Error('Error no context')
}

// Variables
var time0 = 0
var positionMouse: Vector = new Vector()

var position: Vector = new Vector(2, 2)
var orientation: Vector = new Vector(0.5, 0)
var plane: Vector = new Vector(0, -0.66)
var speed: number = 0.003
var orientationSpeed: number = 0.003

var W: boolean = false
var A: boolean = false
var S: boolean = false
var D: boolean = false

var grid: number[][] = [
    [2, 2, 2, 2, 2, 2, 2, 2],
    [2, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 1, 1, 1, 0, 2],
    [2, 0, 0, 1, 0, 1, 0, 2],
    [2, 0, 0, 3, 0, 3, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2]
]

// Loop
function animate(time1: number) {
    var time: number = time1 - time0



    if (context) {
        // Clear
        context.clearRect(0, 0, canvas.width, canvas.height)

        context.fillStyle = 'rgb(50, 50, 50)'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.fillStyle = 'rgb(0, 0, 0)'
        context.fillRect(0, 0, canvas.width, canvas.height / 2)

        // Strokes
        for (var x: number = 0; x < canvas.width; x++) {
            var pov: number = 2 * x / canvas.width - 1
            var rayOrientation: Vector = new Vector(orientation.x + plane.x * pov, orientation.y + plane.y * pov)

            var gridPosition: Vector = new Vector(Math.floor(position.x), Math.floor(position.y))

            var sideDist: Vector = new Vector()
            var delDist: Vector = new Vector(
                (rayOrientation.x == 0) ? 1e30 : Math.abs(1 / rayOrientation.x),
                (rayOrientation.y == 0) ? 1e30 : Math.abs(1 / rayOrientation.y)
            )
            var perp: number = 0

            var step: Vector = new Vector()

            var hit: boolean = false
            var side: number = 0

            if (rayOrientation.x < 0) {
                step.x = -1
                sideDist.x = (position.x - gridPosition.x) * delDist.x
            } else {
                step.x = 1
                sideDist.x = (gridPosition.x + 1 - position.x) * delDist.x
            }

            if (rayOrientation.y < 0) {
                step.y = -1
                sideDist.y = (position.y - gridPosition.y) * delDist.y
            } else {
                step.y = 1
                sideDist.y = (gridPosition.y + 1 - position.y) * delDist.y
            }

            // DDA
            while (!hit) {
                if (sideDist.x < sideDist.y) {
                    sideDist.x += delDist.x
                    gridPosition.x += step.x
                    side = 0
                } else {
                    sideDist.y += delDist.y
                    gridPosition.y += step.y
                    side = 1
                }

                if (grid[gridPosition.y][gridPosition.x] > 0) {
                    hit = true
                }
            }

            if (side == 0) {
                perp = (sideDist.x - delDist.x)
            } else {
                perp = (sideDist.y - delDist.y)
            }

            if (perp <= 0) {
                perp = 0.01
            }

            var height: number = Math.floor(canvas.height / perp)

            var renderStart = -height / 2 + canvas.height / 2

            if (renderStart < 0) {
                renderStart = 0
            }

            var renderEnd = height / 2 + canvas.height / 2

            if (renderEnd >= canvas.height) {
                renderEnd = canvas.height - 1
            }

            var style = {
                r: 0,
                g: 0,
                b: 0
            }

            switch (grid[gridPosition.y][gridPosition.x]) {
                case 1:
                    style.r = 255
                    break
                case 2:
                    style.g = 255
                    break
                case 3:
                    style.b = 255
                    break
                case 4:
                    style.r = 255
                    style.g = 255
                    style.b = 255
                    break
                default:
                    style.r = 255
                    style.g = 255
                    break
            }

            if (side == 1) {
                style.r /= 2
                style.g /= 2
                style.b /= 2
            }

            context.fillStyle = `rgb(${style.r}, ${style.g}, ${style.b})`
            context.fillRect(x, renderStart, 1, renderEnd - renderStart)
        }

        var playerSpeed = time * speed
        var playerOrientationSpeed = time * orientationSpeed

        if (W) {
            if (grid[Math.floor(position.y)][Math.floor(position.x + orientation.x * 0.3)] == 0) {
                position.x += orientation.x * playerSpeed
            }

            if (grid[Math.floor(position.y + orientation.y * 0.3)][Math.floor(position.x)] == 0) {
                position.y += orientation.y * playerSpeed
            }
        }

        if (S) {
            if (grid[Math.floor(position.y)][Math.floor(position.x - orientation.x * 0.3)] == 0) {
                position.x -= orientation.x * playerSpeed
            }

            if (grid[Math.floor(position.y - orientation.y * 0.3)][Math.floor(position.x)] == 0) {
                position.y -= orientation.y * playerSpeed
            }
        }

        if (A) {
            var orientation0: Vector = orientation.clone()

            orientation.x = orientation.x * Math.cos(playerOrientationSpeed) - orientation.y * Math.sin(playerOrientationSpeed)
            orientation.y = orientation0.x * Math.sin(playerOrientationSpeed) + orientation.y * Math.cos(playerOrientationSpeed)

            var plane0: Vector = plane.clone()

            plane.x = plane.x * Math.cos(playerOrientationSpeed) - plane.y * Math.sin(playerOrientationSpeed)
            plane.y = plane0.x * Math.sin(playerOrientationSpeed) + plane.y * Math.cos(playerOrientationSpeed)
        }

        if (D) {
            var orientation0: Vector = orientation.clone()

            orientation.x = orientation.x * Math.cos(-playerOrientationSpeed) - orientation.y * Math.sin(-playerOrientationSpeed)
            orientation.y = orientation0.x * Math.sin(-playerOrientationSpeed) + orientation.y * Math.cos(-playerOrientationSpeed)

            var plane0: Vector = plane.clone()

            plane.x = plane.x * Math.cos(-playerOrientationSpeed) - plane.y * Math.sin(-playerOrientationSpeed)
            plane.y = plane0.x * Math.sin(-playerOrientationSpeed) + plane.y * Math.cos(-playerOrientationSpeed)
        }
    }

    time0 = time1
    requestAnimationFrame(animate)
}

requestAnimationFrame(animate)

// Events
document.addEventListener('mousemove', event => {
    positionMouse.x = event.clientX
    positionMouse.y = event.clientY
})

document.addEventListener('keydown', event => {
    if (event.key == 'w') {
        W = true
    }

    if (event.key == 'a') {
        A = true
    }

    if (event.key == 's') {
        S = true
    }

    if (event.key == 'd') {
        D = true
    }
})

document.addEventListener('keyup', event => {
    if (event.key == 'w') {
        W = false
    }

    if (event.key == 'a') {
        A = false
    }

    if (event.key == 's') {
        S = false
    }

    if (event.key == 'd') {
        D = false
    }
})