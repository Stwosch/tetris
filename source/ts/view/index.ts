import { DOM } from '../dom-elements';
import { times } from '../useful-functions';
import { Block, EmptyBlock } from '../block';
import { Vector } from '../vector';

export class View {

    constructor() {
    }

    private _getBlockById(id: number) {
        return document.getElementById('bid-' + id);
    }

    private _addTypeToBlock(el: HTMLElement, type: string) {
        el.className = "block block__" + type;
    }

    renderEmptyTemplate(area: { value: Block, id: number }[][]) {

        const flattened = area.reduce(
            ( sum: { value: Block, id: number }[], 
              value: { value: Block, id: number }[] ) => 
                
                sum.concat(value), [] 
        );

        const output = flattened.reduce(
            ( html: string, 
              block: { value: Block, id: number } ) => 
              
                html += DOM.blockTmpl({
                    type: block.value.type,
                    id: block.id
                }), ""
        );

        DOM.board.innerHTML = output;
    }

    renderBlock(block: Block) {
        
        block.vectors.forEach((vector: Vector) => {
            
            const id = vector.getId();
            const el = this._getBlockById(id);
            this._addTypeToBlock(el, block.type);
        });
    }

    removeBlock(vectors: Vector[]) {

        const typeOfEmptyBlock = new EmptyBlock().type;

        vectors.forEach((vector: Vector) => {
            
            const id = vector.getId();
            const el = this._getBlockById(id);
            this._addTypeToBlock(el, typeOfEmptyBlock);

        });
    }
}