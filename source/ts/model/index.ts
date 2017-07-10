import { Board } from '../board';
import { Block, OBlock, EmptyBlock } from '../block';
import { Vector } from '../vector';
import { times } from '../useful-functions';

export class Model {

    private _board: Board;
    private _blocks: Block[];
    
    constructor() {}

    private _checkVectorFitArray(array: any[][], vector: Vector) {
        return vector.y < array.length && vector.y >= 0 && vector.x >= 0 && vector.x < array[0].length;
    }

    private _checkIsPositionFree(positions: Vector[]) {
        const typeOfEmptyBlock = new EmptyBlock().type;
        const index: number = positions.findIndex((vector: Vector) => {

            if(this._checkVectorFitArray(this._board.area, vector)) {
                return this._board.area[vector.y][vector.x].value.type !== typeOfEmptyBlock;
            } else {
                return true;
            }
        });

        return index === -1;
    }

    private _checkFreeSpaces(block: Block) {

        const spaces: Vector[][] = [];
        const amountSpacesToCheck: number = this._board.area[0].length - Math.floor(block.width / 2);

        times(amountSpacesToCheck, (x:number) => {
            
            const areaVectors: Vector[] = block.getBlockPosition(new Vector(x, 0));
            if(this._checkIsPositionFree(areaVectors)) {
                spaces.push(areaVectors);
            }

        });

        return spaces;
    }

    private _randomValueFromArray(array: any[]) { 
        return array[Math.floor( Math.random() * array.length )];
    }

    private _saveBlock(block: Block) {

        const spaces: Vector[][] = this._checkFreeSpaces(block);
        
        if(spaces.length <= 0) {
            block.vectors = [];
            return;
        }
        
        block.vectors = this._randomValueFromArray(spaces);
        this.addBlock(block);
    }

    private _filterProperVectorToMoveDown(properVectors: Vector[], vector: Vector) {

        const pVectorIndex: number = properVectors.findIndex((pVector: Vector) => pVector.x === vector.x);

        if(pVectorIndex === -1) {

            properVectors.push(new Vector(vector.x, vector.y));

        } else if(properVectors[pVectorIndex].y < vector.y) {

            properVectors[pVectorIndex].y = vector.y;
        }
    }

    private _filterProperVectorToMoveRight(properVectors: Vector[], vector: Vector) {

        const pVectorIndex: number = properVectors.findIndex((pVector: Vector) => pVector.y === vector.y);

        if(pVectorIndex === -1) {

            properVectors.push(new Vector(vector.x, vector.y));

        } else if(properVectors[pVectorIndex].x < vector.x) {

            properVectors[pVectorIndex].x = vector.x;
        }
    }

    private _filterProperVectorToMoveLeft(properVectors: Vector[], vector: Vector) {

        const pVectorIndex: number = properVectors.findIndex((pVector: Vector) => pVector.y === vector.y);

        if(pVectorIndex === -1) {

            properVectors.push(new Vector(vector.x, vector.y));

        } else if(properVectors[pVectorIndex].x > vector.x) {

            properVectors[pVectorIndex].x = vector.x;
        }
    }

    private _filterProperVectorToMove(properVectors: Vector[], vector: Vector, move: Vector) {

        if(move.y === 1) {
            this._filterProperVectorToMoveDown(properVectors, vector);
        } else if(move.x === 1) {
            this._filterProperVectorToMoveRight(properVectors, vector);
        } else if(move.x === -1) {
            this._filterProperVectorToMoveLeft(properVectors, vector);
        }
    }



    saveBoard(board: Board) {

        this._board = board;
        this._board.initArea();
        this._blocks = [
            new OBlock
        ];
    }

    createBlock() {
        const blockSource: Block = this._randomValueFromArray(this._blocks);
        const block: Block = Object.assign(new Block, blockSource);
        this._saveBlock(block);
        return block;
    }

    canDropBlock(positions: Vector[], move: Vector) {

        const properVectors: Vector[] = [];

        positions.forEach((vector: Vector) => this._filterProperVectorToMove(properVectors, vector, move) );
        
        const droppedVectors = properVectors.map((vector: Vector) => vector.plus(move));

        return this._checkIsPositionFree(droppedVectors);
    }

    removeBlock(vectors: Vector[]) {
        vectors.forEach((vector: Vector) => this._board.setAreaBlock(vector, new EmptyBlock) );
    }

    addBlock(block: Block) {
        block.vectors.forEach((vector: Vector) => this._board.setAreaBlock(vector, block) );
    }

}