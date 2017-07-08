export class Vector {

    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    plus(vector: Vector) {
        return new Vector(this._x + vector.x, this._y + vector.y); 
    }

    getId() {
        return parseInt( this._y.toString() + this._x.toString() );
    }
}