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
    private _currentBlockPosition: Vector[];

    constructor(model: Model, view: View) {
        this._model = model;
        this._view = view;
        this._isCreatedBlock = false;
    }

    private _listeners(): { moving: () => void } {

        return {
            moving: () => {

                const isSetCurrentBlock: (block: Block) => boolean = block => !!block;
                const moveBlock: (move: Vector) => void = move => {
                    const result = this._model.tryMoveBlock(this._currentBlockPosition, move);
                    
                    if(result) {
                        const oldPosition = this._currentBlockPosition;
                        this._currentBlockPosition = this._currentBlockPosition.map((vector: Vector) => vector.plus(move));
            
                        this._model.removeBlockOnArea(oldPosition);
                        this._model.addBlockOnArea(this._currentBlock, this._currentBlockPosition);
                            
                        this._view.renderBlock(new EmptyBlock().type, oldPosition);
                        this._view.renderBlock(this._currentBlock.type, this._currentBlockPosition);
                    }
                };


                window.addEventListener('keydown', e => {
                        
                    if(!isSetCurrentBlock(this._currentBlock)) {
                        return;
                    }

                    switch(e.keyCode) {
                        case 37: moveBlock(new Vector(-1, 0)); break;
                        case 39: moveBlock(new Vector(1, 0)); break;
                    }  
                    
                });
                
            }  
        }   
    }

    private _startGame(): number {

        const canCreateBlock: (freeSpaces: Vector[][]) => boolean = freeSpaces => freeSpaces.length > 0;

        const handleGame: () => void = () => {
            if(this._isCreatedBlock) {

                const dropDown: Vector = new Vector(0, 1);

                if(this._model.canDropBlock(this._currentBlockPosition, dropDown)) {
                    const oldPosition = this._currentBlockPosition;
                    this._currentBlockPosition = this._currentBlockPosition.map((vector: Vector) => vector.plus(dropDown));
        
                    this._model.removeBlockOnArea(oldPosition);
                    this._model.addBlockOnArea(this._currentBlock, this._currentBlockPosition);
                        
                    this._view.renderBlock(new EmptyBlock().type, oldPosition);
                    this._view.renderBlock(this._currentBlock.type, this._currentBlockPosition);
                } else {
                    this._isCreatedBlock = false;
                }
            } else {

                const randomBlock: Block = this._model.getRandomBlock();
                const freeSpaces: Vector[][] = this._model.getFreeSpaces(randomBlock);
                
                if(canCreateBlock(freeSpaces)) {
                    
                    const freeSpace: Vector[] = this._model.getRandomFreeSpace(freeSpaces);
                    this._view.renderBlock(randomBlock.type, freeSpace);
                    this._currentBlock = randomBlock;
                    this._isCreatedBlock = true;
                    this._currentBlockPosition = freeSpace;

                } else {
                    console.log('end game');
                }
            } 
        }
        
        this._listeners().moving();
        
        return setInterval(handleGame, 500);
    }

    init(): void {
        this._model.board = board;
        this._model.blocks = blocks;
        board.forEachArea(new EmptyBlock);
        this._view.renderArea(board.area);
        const startGameHandler: number = this._startGame();      
    }
}