import { Board } from '../board';
import { Block, OBlock, EmptyBlock } from '../block';
import { Vector } from '../vector';
import { times } from '../useful-functions';

export class Model {

    private _board: Board;
    private _blocks: Block[];
    
    constructor() {}

    private _checkIsPositionFree(positions: Vector[]) {
        const index: number = positions.findIndex((vector: Vector) => !this._board.area[vector.y][vector.x].value.type );
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
        console.log(blockSource);
        console.log(block);
        this._saveBlock(block);
        return block;
    }

    canDropBlock(positions: Vector[]) {
        const droppedPositions: Vector[] = positions.map((vector: Vector) => vector.plus(new Vector(0, 1)));
        return this._checkIsPositionFree(droppedPositions);
    }

    removeBlock(vectors: Vector[]) {
        vectors.forEach((vector: Vector) => this._board.setAreaBlock(vector, new EmptyBlock) );
    }

    addBlock(block: Block) {
        block.vectors.forEach((vector: Vector) => this._board.setAreaBlock(vector, block) );
    }

}