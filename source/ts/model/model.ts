import { Board } from '../board/board';
import { Block, OBlock, EmptyBlock } from '../block/block';
import { Vector } from '../vector/vector';
import { times, randomValueFromArray } from '../useful-functions/useful-functions';

export class Model {

    private _board: Board;
    private _blocks: Block[];
    
    constructor() {}

    set board(board: Board) {
        this._board = board;
    }

    set blocks(blocks: Block[]) {
        this._blocks = blocks;
    } 
    
    get board() {
        return this._board;
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

    canDropBlock(positions: Vector[], move: Vector) {

        const properVectors: Vector[] = [];

        positions.forEach((vector: Vector) => this._filterProperVectorToMove(properVectors, vector, move) );
        
        const droppedVectors = properVectors.map((vector: Vector) => vector.plus(move));

        return this._isPositionFree(droppedVectors);
    }

    removeBlock(vectors: Vector[]) {
        vectors.forEach((vector: Vector) => this._board.setBlockOnArea(vector, new EmptyBlock) );
    }

    private _isPositionFree(vectors: Vector[]): boolean {

        const doesVectorFitArray: (array: any[][], vector: Vector) => boolean = (array, vector) => vector.y < array.length && vector.y >= 0 && vector.x >= 0 && vector.x < array[0].length;
        const isEmptyBlock: (blockType: string, typeOfEmptyBlock: string) => boolean = (blockType, typeOfEmptyBlock) => blockType === typeOfEmptyBlock;
        const typeOfEmptyBlock: string = new EmptyBlock().type;

        const foundBusyPosition: Vector = vectors.find((vector: Vector) => {

            if(doesVectorFitArray(this._board.area, vector)) {
                return !isEmptyBlock(this._board.area[vector.y][vector.x].type, typeOfEmptyBlock);
            }

            return true;
        });

        return !foundBusyPosition;
    }

    getRandomBlock(): Block {
        const randomBlock: Block = randomValueFromArray(this._blocks);
        return Object.assign(new Block, randomBlock);
    }

    getFreeSpaces(block: Block): Vector[][] {

        const freeSpaces: Vector[][] = [];
        const amountSpacesToCheck: number = this._board.area[0].length - Math.floor(block.width / 2);

        times(amountSpacesToCheck, (x:number) => {
            
            const areaVectors: Vector[] = block.getBlockStartPosition(new Vector(x, 0));
            if(this._isPositionFree(areaVectors)) {
                freeSpaces.push(areaVectors);
            }

        });

        return freeSpaces;
    }

    getRandomFreeSpace(freeSpaces: Vector[][]): Vector[] {
        return randomValueFromArray(freeSpaces);
    }

    createBlockOnBoard(block: Block): void {
        block.position.forEach((vector: Vector) => this._board.setBlockOnArea(vector, block));
    }
}