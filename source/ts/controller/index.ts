import { Model } from '../model';
import { View } from '../view';
import { Board } from '../board';
import { Block } from '../block';
import { Vector } from '../vector';

export class Controller {

    private _model: Model;
    private _view: View;
    private _createdBlock: boolean;

    constructor(model: Model, view: View) {
        this._model = model;
        this._view = view;
        this._createdBlock = false;
    }

    private _tryDropBlock(block: Block) {
        
        if(this._model.canDropBlock(block.vectors)) {
            
            const oldVectors = block.vectors;
            block.vectors = block.getBlockPosition(new Vector(0, 1));

            this._model.removeBlock(oldVectors);
            this._model.addBlock(block);

            this._view.removeBlock(oldVectors);
            this._view.renderBlock(block);

        } else {
            this._createdBlock = false;
        }
        
    }

    private _createBlock() {

        const block: Block = this._model.createBlock();
        if(block.vectors.length > 0) {
            this._view.renderBlock(block);
            this._createdBlock = true;
            return block;
        }

        //konczymy gre, nie mozemy utworzyc nowego bloku, gdy length jest rowna 0
    }

    private _startGame() {
        
        let block: Block;

        return setInterval(() => {
            
            if(this._createdBlock) {
                this._tryDropBlock(block);
            } else {
               block = this._createBlock();
            } 
        }, 2000);

        
    }

    init() {

        const board = new Board(10, 20);
        this._model.saveBoard(board);
        this._view.renderEmptyTemplate(board.area);


        const run = this._startGame();      
    }
}