import { Model } from '../model/model';
import { View } from '../view/view';
import { Board } from '../board/board';
import { Block, EmptyBlock } from '../block/block';
import { Vector } from '../vector/vector';
import { board, blocks } from '../game-components/game-components';

export class Controller {

    private _model: Model;
    private _view: View;
    private _isCreatedBlock: boolean;
    private _currentBlock: Block;

    constructor(model: Model, view: View) {
        this._model = model;
        this._view = view;
        this._isCreatedBlock = false;
    }
/*
    private _tryMoveBlock(block: Block, move: Vector) {
        
        if(this._model.canDropBlock(block.vectors, move)) {
            const oldVectors = block.vectors;
            block.vectors = block.getBlockPosition(move);

            this._model.removeBlock(oldVectors);
            this._model.addBlock(block);

            this._view.removeBlock(oldVectors);
            this._view.renderBlock(block);

        } else if (move.y > 0) {
            this._isCreatedBlock = false;
        }
        
    }
    */

    private _listeners(): { moving: () => void } {

        return {
            moving: () => {

                function isSetCurrentBlock(block: Block): boolean {
                    return !!block;
                }

                window.addEventListener('keydown', e => {
                        /*
                    if(!isSetCurrentBlock(this._currentBlock)) {
                        return;
                    }

                    switch(e.keyCode) {
                        case 37: this._tryMoveBlock(this._currentBlock, new Vector(-1, 0)); break;
                        case 39: this._tryMoveBlock(this._currentBlock, new Vector(1, 0)); break;
                    }  
                    */
                });
                
            }  
        }   
    }

    private _startGame(): number {

        const canCreateBlock: (freeSpaces: Vector[][]) => boolean = freeSpaces => freeSpaces.length > 0;

        const handleGame: () => void = () => {
            if(this._isCreatedBlock) {
               // this._tryMoveBlock(this._currentBlock, new Vector(0, 1));
            } else {

                const randomBlock: Block = this._model.getRandomBlock();
                const freeSpaces: Vector[][] = this._model.getFreeSpaces(randomBlock);
                
                if(canCreateBlock(freeSpaces)) {
                    
                    const freeSpace: Vector[] = this._model.getRandomFreeSpace(freeSpaces);
                    randomBlock.position = freeSpace;
                    this._view.renderBlock(randomBlock);
                    this._currentBlock = randomBlock;
                    this._isCreatedBlock = true;

                } else {
                    console.log('end game');
                }
            } 
        }
        
        this._listeners().moving();
        
        //return setInterval(handleGame, 500);

        handleGame()
        return 1;
    }

    init(): void {
        this._model.board = board;
        this._model.blocks = blocks;
        board.forEachArea(new EmptyBlock);
        this._view.renderArea(board.area);
        const startGameHandler: number = this._startGame();      
    }
}