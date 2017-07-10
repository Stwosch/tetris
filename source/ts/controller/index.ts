import { Model } from '../model';
import { View } from '../view';
import { Board } from '../board';
import { Block, EmptyBlock } from '../block';
import { Vector } from '../vector';

export class Controller {

    private _model: Model;
    private _view: View;
    private _isCreatedBlock: boolean;

    constructor(model: Model, view: View) {
        this._model = model;
        this._view = view;
        this._isCreatedBlock = false;
    }

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

    private _createBlock() {

        const block: Block = this._model.createBlock();
        if(block.vectors.length > 0) {
            this._view.renderBlock(block);
            this._isCreatedBlock = true;
            return block;
        }

        //konczymy gre, nie mozemy utworzyc nowego bloku, gdy length jest rowna 0
    }

    private _startGame() {
        
        let block: Block;
        window.addEventListener('keydown', e => {
            
            if(block) {
                switch(e.keyCode) {

                    case 37: 
                        this._tryMoveBlock(block, new Vector(-1, 0));
                    break;
    
                    case 39: 
                        this._tryMoveBlock(block, new Vector(1, 0));
                    break;
                }
            }
            
        });

        return setInterval(() => {
            
            if(!this._isCreatedBlock) {
                const result: boolean = this._model.clearLine();
                if(result) {
                    const area = this._model.board.area;
                    this._view.renderAllTemplate(area);
                    console.log(area);
                }
            }

            if(this._isCreatedBlock) {
                this._tryMoveBlock(block, new Vector(0, 1));
            } else {
               block = this._createBlock();
            }

                       
        }, 100);

        
    }

    init(): void {
        const board: Board = new Board(10, 20);
        this._model.saveBoard(board);
        this._view.renderAllTemplate(board.area);
        const run = this._startGame();      
    }
}