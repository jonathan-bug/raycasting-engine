export default class Vector {
    public x: number
    public y: number

    constructor(x: number = 0, y: number = 0) {
        this.x = x
        this.y = y
    }
    
    public add(vector: Vector): Vector {
        this.x += vector.x
        this.y += vector.y

        return this
    }

    public sub(vector: Vector): Vector {
        this.x -= vector.x
        this.y -= vector.y

        return this
    }

    public clone(): Vector {
        return new Vector(this.x, this.y)
    }

    public magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    public dot(vector: Vector): number {
        return this.x * vector.x + this.y * vector.y
    }
    
    public scale(magnitude: number) {
        this.x *= magnitude
        this.y *= magnitude

        return this
    }

    public unit() {
        var magnitude = this.magnitude()

        if(magnitude == 0) {
            return new Vector(0, 0)
        }

        return new Vector(this.x / magnitude, this.y / magnitude)
    }
}