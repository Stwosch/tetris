import { Vector } from '../vector';

export class Block {

    protected _vectors: Vector[];
    protected _type: string;
    protected _width: number;
    protected _height: number;

    constructor() {}

    getBlockPosition(startPosition: Vector) {
        return this._vectors.map((vector: Vector) => vector.plus(startPosition));
    }

    get type() {
        return this._type;
    }

    get width() {
        return this._width;
    }

    set vectors(vectors: Vector[]) {
        this._vectors = vectors;
    }

    get vectors() {
        return this._vectors;
    }
}

export class EmptyBlock extends Block {

    constructor() {
        super();

        this._type = 'empty';
    }
}

export class OBlock extends Block {

    constructor() {
        super();

        this._type = 'o';
        this._vectors = [
            new Vector(0, 0),
            new Vector(1, 0),
            new Vector(0, 1),
            new Vector(1, 1)
        ]

        this._width = 2;
        this._height = 2;
    }
}