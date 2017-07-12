import { times } from '../useful-functions/useful-functions';
import { EmptyBlock, Block } from '../block/block';
import { Vector } from '../vector/vector';

export class Board {
    
    private _width: number;
    private _height: number;
    private _area: Block[][];

    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
        this._initArea();
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get area() {
        return this._area;
    }

    _initArea(): void {
        this._area = [];
        times(this._height, () => this._area.push([]) );
    }

    setBlockOnArea(vector: Vector, block: Block) {
        this._area[vector.y][vector.x] = block; 
    }

    forEachArea(value: Block): void {
        
        times(this._height, (y: number) => 
            times(this._width, (x: number) => this._area[y][x] = value)
        );
    }
    
}