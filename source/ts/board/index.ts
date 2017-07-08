import { times } from '../useful-functions';
import { EmptyBlock, Block } from '../block';
import { Vector } from '../vector';

export class Board {
    
    private _width: number;
    private _height: number;
    private _area: {value: Block, id: number}[][];

    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
    }

    get width() {
        return this._width;
    }

    set width(width: number) {
       this._width = width;
    }

    get height() {
        return this._height;
    }

    set height(height: number) {
        this._height = height
    }

    get area() {
        return this._area;
    }

    setAreaBlock(vector: Vector, block: Block) {
        this._area[vector.y][vector.x].value = block; 
    }

    initArea() {
        
        this._area = [];
        
        times(this._height, (y: number) => {

            this._area.push([]);
            times(this._width, (x: number) => {

                const id: number = new Vector(x, y).getId();
                this._area[y].push({
                   value: new EmptyBlock,
                   id: id 
                });
                    
            });

        });
    }
    
}