import { DOM } from '../dom-elements/dom-elements';
import { times } from '../useful-functions/useful-functions';
import { Block, EmptyBlock } from '../block/block';
import { Vector } from '../vector/vector';

export class View {

    constructor() {
    }

    private _getBlockById(id: number) {
        return document.getElementById('bid-' + id);
    }

    private _addTypeToBlock(el: HTMLElement, type: string) {
        el.className = "block block__" + type;
    }

    renderArea(area: Block[][]): void {

        let id: number = 0;
        const flattened = area.reduce( (sum: Block[], value: Block[]) => sum.concat(value), [] );
        const output = flattened.reduce( (html: string, block: Block) => html += DOM.blockTmpl({ type: block.type, id: id++ }), "" );

        DOM.board.innerHTML = output;
    }

    renderBlock(block: Block) {
        
        block.position.forEach((vector: Vector) => {
            
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