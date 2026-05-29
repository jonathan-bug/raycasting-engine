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
    
    public scale(magnitude: number): Vector {
        this.x *= magnitude
        this.y *= magnitude

        return this
    }

    public unit(): Vector {
        const magnitude = this.magnitude()

        if(magnitude == 0) {
            this.x = 0
            this.y = 0

            return this
        }

        this.x /= magnitude
        this.y /= magnitude

        return this
    }

    public mutate(x: number, y: number) {
        this.x = x
        this.y = y

        return this
    }

    public translate(x: number, y: number) {
        this.x += x
        this.y += y

        return this
    }
}