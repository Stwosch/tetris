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

    canDropBlock(blockPosition: Vector[], dropDown: Vector) {

        const borderBottomVectors: Vector[] = [];
        const sieveBorderBottomVectors:  (container: Vector[], vector: Vector) => void = (container, vector) => {

            const containerVectorIndex: number = container.findIndex((containerVector: Vector) => containerVector.x === vector.x);
            const doesNotVectorExistInContainer: (index: number) => boolean = index => index === -1;
            const isVectorHigherThanInContainer: (vector: Vector, vectorInContainer: Vector) => boolean = (vector, vectorInContainer) => vector.y > vectorInContainer.y;
    
            if(doesNotVectorExistInContainer(containerVectorIndex)) {
    
                container.push(new Vector(vector.x, vector.y));
    
            } else if(isVectorHigherThanInContainer(vector, container[containerVectorIndex])) {
    
                container[containerVectorIndex].y = vector.y;
            }
        }

        blockPosition.forEach((vector: Vector) => sieveBorderBottomVectors(borderBottomVectors, vector));
        
        const droppedVectors: Vector[] = borderBottomVectors.map((vector: Vector) => vector.plus(dropDown));

        return this._isPositionFree(droppedVectors);
    }

    removeBlockOnArea(vectors: Vector[]) {
        vectors.forEach((vector: Vector) => this._board.setBlockOnArea(vector, new EmptyBlock) );
    }

    addBlockOnArea(block: Block, blockPosition: Vector[]): void {
        blockPosition.forEach((vector: Vector) => this._board.setBlockOnArea(vector, block));
    }
    
    tryMoveBlock(blockPosition: Vector[], move: Vector) {
        const extremeVectors: Vector[] = [];
        const sieveExtremeVectors:  (container: Vector[], vector: Vector) => void = (container, vector) => {

            const containerVectorIndex: number = container.findIndex((containerVector: Vector) => containerVector.y === vector.y);
            const doesNotVectorExistInContainer: (index: number) => boolean = index => index === -1;
            const isVectorFavorableThanInContainer: (vector: Vector, vectorInContainer: Vector) => boolean = (vector, vectorInContainer) => move.x < 0 && vector.x < vectorInContainer.x || move.x > 0 && vector.x > vectorInContainer.x;
    
            if(doesNotVectorExistInContainer(containerVectorIndex)) {
    
                container.push(new Vector(vector.x, vector.y));
    
            } else if(isVectorFavorableThanInContainer(vector, container[containerVectorIndex])) {
    
                container[containerVectorIndex].x = vector.x;
            }
        }

        blockPosition.forEach((vector: Vector) => sieveExtremeVectors(extremeVectors, vector));
        const movedVectors: Vector[] = extremeVectors.map((vector: Vector) => vector.plus(move));

        return this._isPositionFree(movedVectors);
    }
}