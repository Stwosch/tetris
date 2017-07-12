(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector_1 = require("../vector/vector");
class Block {
    constructor() { }
    getBlockStartPosition(startPosition) {
        return this._vectors.map((vector) => vector.plus(startPosition));
    }
    get type() {
        return this._type;
    }
    get width() {
        return this._width;
    }
    get vectors() {
        return this._vectors;
    }
    get position() {
        return this._position;
    }
    set position(vectors) {
        this._position = vectors;
    }
}
exports.Block = Block;
class EmptyBlock extends Block {
    constructor() {
        super();
        this._type = 'empty';
    }
}
exports.EmptyBlock = EmptyBlock;
class OBlock extends Block {
    constructor() {
        super();
        this._type = 'o';
        this._vectors = [
            new vector_1.Vector(0, 0),
            new vector_1.Vector(1, 0),
            new vector_1.Vector(0, 1),
            new vector_1.Vector(1, 1)
        ];
        this._width = 2;
        this._height = 2;
    }
}
exports.OBlock = OBlock;
},{"../vector/vector":9}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const useful_functions_1 = require("../useful-functions/useful-functions");
class Board {
    constructor(width, height) {
        this._width = width;
        this._height = height;
        this._initArea();
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    get area() {
        return this._area;
    }
    _initArea() {
        this._area = [];
        useful_functions_1.times(this._height, () => this._area.push([]));
    }
    setBlockOnArea(vector, block) {
        this._area[vector.y][vector.x] = block;
    }
    forEachArea(value) {
        useful_functions_1.times(this._height, (y) => useful_functions_1.times(this._width, (x) => this._area[y][x] = value));
    }
}
exports.Board = Board;
},{"../useful-functions/useful-functions":8}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_1 = require("../block/block");
const game_components_1 = require("../game-components/game-components");
class Controller {
    constructor(model, view) {
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
    _listeners() {
        return {
            moving: () => {
                function isSetCurrentBlock(block) {
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
        };
    }
    _startGame() {
        const canCreateBlock = freeSpaces => freeSpaces.length > 0;
        const handleGame = () => {
            if (this._isCreatedBlock) {
                // this._tryMoveBlock(this._currentBlock, new Vector(0, 1));
            }
            else {
                const randomBlock = this._model.getRandomBlock();
                const freeSpaces = this._model.getFreeSpaces(randomBlock);
                if (canCreateBlock(freeSpaces)) {
                    const freeSpace = this._model.getRandomFreeSpace(freeSpaces);
                    randomBlock.position = freeSpace;
                    this._view.renderBlock(randomBlock);
                    this._currentBlock = randomBlock;
                    this._isCreatedBlock = true;
                }
                else {
                    console.log('end game');
                }
            }
        };
        this._listeners().moving();
        //return setInterval(handleGame, 500);
        handleGame();
        return 1;
    }
    init() {
        this._model.board = game_components_1.board;
        this._model.blocks = game_components_1.blocks;
        game_components_1.board.forEachArea(new block_1.EmptyBlock);
        this._view.renderArea(game_components_1.board.area);
        const startGameHandler = this._startGame();
    }
}
exports.Controller = Controller;
},{"../block/block":1,"../game-components/game-components":5}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOM = {
    blockTmpl: Handlebars.compile(document.getElementById('block-template').innerHTML),
    board: document.querySelector('.board')
};
},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = require("../board/board");
const block_1 = require("../block/block");
exports.board = new board_1.Board(10, 20);
exports.blocks = [
    new block_1.OBlock
];
},{"../block/block":1,"../board/board":2}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("./model/model");
const view_1 = require("./view/view");
const controller_1 = require("./controller/controller");
const controller = new controller_1.Controller(new model_1.Model, new view_1.View);
controller.init();
},{"./controller/controller":3,"./model/model":7,"./view/view":10}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_1 = require("../block/block");
const vector_1 = require("../vector/vector");
const useful_functions_1 = require("../useful-functions/useful-functions");
class Model {
    constructor() { }
    set board(board) {
        this._board = board;
    }
    set blocks(blocks) {
        this._blocks = blocks;
    }
    get board() {
        return this._board;
    }
    _filterProperVectorToMoveDown(properVectors, vector) {
        const pVectorIndex = properVectors.findIndex((pVector) => pVector.x === vector.x);
        if (pVectorIndex === -1) {
            properVectors.push(new vector_1.Vector(vector.x, vector.y));
        }
        else if (properVectors[pVectorIndex].y < vector.y) {
            properVectors[pVectorIndex].y = vector.y;
        }
    }
    _filterProperVectorToMoveRight(properVectors, vector) {
        const pVectorIndex = properVectors.findIndex((pVector) => pVector.y === vector.y);
        if (pVectorIndex === -1) {
            properVectors.push(new vector_1.Vector(vector.x, vector.y));
        }
        else if (properVectors[pVectorIndex].x < vector.x) {
            properVectors[pVectorIndex].x = vector.x;
        }
    }
    _filterProperVectorToMoveLeft(properVectors, vector) {
        const pVectorIndex = properVectors.findIndex((pVector) => pVector.y === vector.y);
        if (pVectorIndex === -1) {
            properVectors.push(new vector_1.Vector(vector.x, vector.y));
        }
        else if (properVectors[pVectorIndex].x > vector.x) {
            properVectors[pVectorIndex].x = vector.x;
        }
    }
    _filterProperVectorToMove(properVectors, vector, move) {
        if (move.y === 1) {
            this._filterProperVectorToMoveDown(properVectors, vector);
        }
        else if (move.x === 1) {
            this._filterProperVectorToMoveRight(properVectors, vector);
        }
        else if (move.x === -1) {
            this._filterProperVectorToMoveLeft(properVectors, vector);
        }
    }
    canDropBlock(positions, move) {
        const properVectors = [];
        positions.forEach((vector) => this._filterProperVectorToMove(properVectors, vector, move));
        const droppedVectors = properVectors.map((vector) => vector.plus(move));
        return this._isPositionFree(droppedVectors);
    }
    removeBlock(vectors) {
        vectors.forEach((vector) => this._board.setBlockOnArea(vector, new block_1.EmptyBlock));
    }
    _isPositionFree(vectors) {
        const doesVectorFitArray = (array, vector) => vector.y < array.length && vector.y >= 0 && vector.x >= 0 && vector.x < array[0].length;
        const isEmptyBlock = (blockType, typeOfEmptyBlock) => blockType === typeOfEmptyBlock;
        const typeOfEmptyBlock = new block_1.EmptyBlock().type;
        const foundBusyPosition = vectors.find((vector) => {
            if (doesVectorFitArray(this._board.area, vector)) {
                return !isEmptyBlock(this._board.area[vector.y][vector.x].type, typeOfEmptyBlock);
            }
            return true;
        });
        return !foundBusyPosition;
    }
    getRandomBlock() {
        const randomBlock = useful_functions_1.randomValueFromArray(this._blocks);
        return Object.assign(new block_1.Block, randomBlock);
    }
    getFreeSpaces(block) {
        const freeSpaces = [];
        const amountSpacesToCheck = this._board.area[0].length - Math.floor(block.width / 2);
        useful_functions_1.times(amountSpacesToCheck, (x) => {
            const areaVectors = block.getBlockStartPosition(new vector_1.Vector(x, 0));
            if (this._isPositionFree(areaVectors)) {
                freeSpaces.push(areaVectors);
            }
        });
        return freeSpaces;
    }
    getRandomFreeSpace(freeSpaces) {
        return useful_functions_1.randomValueFromArray(freeSpaces);
    }
    createBlockOnBoard(block) {
        block.position.forEach((vector) => this._board.setBlockOnArea(vector, block));
    }
}
exports.Model = Model;
},{"../block/block":1,"../useful-functions/useful-functions":8,"../vector/vector":9}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function times(times, fn) {
    let output = "";
    for (let i = 0; i < times; i++) {
        output += fn(i);
    }
    return output;
}
exports.times = times;
function randomValueFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
}
exports.randomValueFromArray = randomValueFromArray;
},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vector {
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    set x(x) {
        this._x = x;
    }
    set y(y) {
        this._y = y;
    }
    plus(vector) {
        return new Vector(this._x + vector.x, this._y + vector.y);
    }
    getId() {
        return parseInt(this._y.toString() + this._x.toString());
    }
}
exports.Vector = Vector;
},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dom_elements_1 = require("../dom-elements/dom-elements");
const block_1 = require("../block/block");
class View {
    constructor() {
    }
    _getBlockById(id) {
        return document.getElementById('bid-' + id);
    }
    _addTypeToBlock(el, type) {
        el.className = "block block__" + type;
    }
    renderArea(area) {
        let id = 0;
        const flattened = area.reduce((sum, value) => sum.concat(value), []);
        const output = flattened.reduce((html, block) => html += dom_elements_1.DOM.blockTmpl({ type: block.type, id: id++ }), "");
        dom_elements_1.DOM.board.innerHTML = output;
    }
    renderBlock(block) {
        block.position.forEach((vector) => {
            const id = vector.getId();
            const el = this._getBlockById(id);
            this._addTypeToBlock(el, block.type);
        });
    }
    removeBlock(vectors) {
        const typeOfEmptyBlock = new block_1.EmptyBlock().type;
        vectors.forEach((vector) => {
            const id = vector.getId();
            const el = this._getBlockById(id);
            this._addTypeToBlock(el, typeOfEmptyBlock);
        });
    }
}
exports.View = View;
},{"../block/block":1,"../dom-elements/dom-elements":4}]},{},[3,7,10,6,2,4,8,1,9,5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzb3VyY2UvdHMvYmxvY2svYmxvY2sudHMiLCJzb3VyY2UvdHMvYm9hcmQvYm9hcmQudHMiLCJzb3VyY2UvdHMvY29udHJvbGxlci9jb250cm9sbGVyLnRzIiwic291cmNlL3RzL2RvbS1lbGVtZW50cy9kb20tZWxlbWVudHMudHMiLCJzb3VyY2UvdHMvZ2FtZS1jb21wb25lbnRzL2dhbWUtY29tcG9uZW50cy50cyIsInNvdXJjZS90cy9tYWluLnRzIiwic291cmNlL3RzL21vZGVsL21vZGVsLnRzIiwic291cmNlL3RzL3VzZWZ1bC1mdW5jdGlvbnMvdXNlZnVsLWZ1bmN0aW9ucy50cyIsInNvdXJjZS90cy92ZWN0b3IvdmVjdG9yLnRzIiwic291cmNlL3RzL3ZpZXcvdmlldy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsNkNBQTBDO0FBRTFDO0lBUUksZ0JBQWUsQ0FBQztJQUVoQixxQkFBcUIsQ0FBQyxhQUFxQjtRQUN2QyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFjLEtBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFFRCxJQUFJLElBQUk7UUFDSixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ0wsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksT0FBTztRQUNQLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDUixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUMxQixDQUFDO0lBRUQsSUFBSSxRQUFRLENBQUMsT0FBaUI7UUFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7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U0FBUyxDQUFDLE1BQU0sQ0FBRSxDQUFDLElBQVksRUFBRSxLQUFZLEtBQUssSUFBSSxJQUFJLGtCQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUUsQ0FBQztRQUU3SCxrQkFBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO0lBQ2pDLENBQUM7SUFFRCxXQUFXLENBQUMsS0FBWTtRQUVwQixLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQWM7WUFFbEMsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzFCLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFpQjtRQUV6QixNQUFNLGdCQUFnQixHQUFHLElBQUksa0JBQVUsRUFBRSxDQUFDLElBQUksQ0FBQztRQUUvQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBYztZQUUzQixNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDMUIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBRS9DLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBNUNELG9CQTRDQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgeyBWZWN0b3IgfSBmcm9tICcuLi92ZWN0b3IvdmVjdG9yJztcclxuXHJcbmV4cG9ydCBjbGFzcyBCbG9jayB7XHJcblxyXG4gICAgcHJvdGVjdGVkIF92ZWN0b3JzOiBWZWN0b3JbXTtcclxuICAgIHByb3RlY3RlZCBfdHlwZTogc3RyaW5nO1xyXG4gICAgcHJvdGVjdGVkIF93aWR0aDogbnVtYmVyO1xyXG4gICAgcHJvdGVjdGVkIF9oZWlnaHQ6IG51bWJlcjtcclxuICAgIHByb3RlY3RlZCBfcG9zaXRpb246IFZlY3RvcltdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgICBnZXRCbG9ja1N0YXJ0UG9zaXRpb24oc3RhcnRQb3NpdGlvbjogVmVjdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZlY3RvcnMubWFwKCh2ZWN0b3I6IFZlY3RvcikgPT4gdmVjdG9yLnBsdXMoc3RhcnRQb3NpdGlvbikpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB0eXBlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB3aWR0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHZlY3RvcnMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZlY3RvcnM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHBvc2l0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgcG9zaXRpb24odmVjdG9yczogVmVjdG9yW10pIHtcclxuICAgICAgICB0aGlzLl9wb3NpdGlvbiA9IHZlY3RvcnM7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBFbXB0eUJsb2NrIGV4dGVuZHMgQmxvY2sge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX3R5cGUgPSAnZW1wdHknO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgT0Jsb2NrIGV4dGVuZHMgQmxvY2sge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX3R5cGUgPSAnbyc7XHJcbiAgICAgICAgdGhpcy5fdmVjdG9ycyA9IFtcclxuICAgICAgICAgICAgbmV3IFZlY3RvcigwLCAwKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcigxLCAwKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcigwLCAxKSxcclxuICAgICAgICAgICAgbmV3IFZlY3RvcigxLCAxKVxyXG4gICAgICAgIF1cclxuXHJcbiAgICAgICAgdGhpcy5fd2lkdGggPSAyO1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCA9IDI7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyB0aW1lcyB9IGZyb20gJy4uL3VzZWZ1bC1mdW5jdGlvbnMvdXNlZnVsLWZ1bmN0aW9ucyc7XHJcbmltcG9ydCB7IEVtcHR5QmxvY2ssIEJsb2NrIH0gZnJvbSAnLi4vYmxvY2svYmxvY2snO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tICcuLi92ZWN0b3IvdmVjdG9yJztcclxuXHJcbmV4cG9ydCBjbGFzcyBCb2FyZCB7XHJcbiAgICBcclxuICAgIHByaXZhdGUgX3dpZHRoOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9oZWlnaHQ6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX2FyZWE6IEJsb2NrW11bXTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuX2luaXRBcmVhKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHdpZHRoKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaGVpZ2h0KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGFyZWEoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FyZWE7XHJcbiAgICB9XHJcblxyXG4gICAgX2luaXRBcmVhKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2FyZWEgPSBbXTtcclxuICAgICAgICB0aW1lcyh0aGlzLl9oZWlnaHQsICgpID0+IHRoaXMuX2FyZWEucHVzaChbXSkgKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRCbG9ja09uQXJlYSh2ZWN0b3I6IFZlY3RvciwgYmxvY2s6IEJsb2NrKSB7XHJcbiAgICAgICAgdGhpcy5fYXJlYVt2ZWN0b3IueV1bdmVjdG9yLnhdID0gYmxvY2s7IFxyXG4gICAgfVxyXG5cclxuICAgIGZvckVhY2hBcmVhKHZhbHVlOiBCbG9jayk6IHZvaWQge1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRpbWVzKHRoaXMuX2hlaWdodCwgKHk6IG51bWJlcikgPT4gXHJcbiAgICAgICAgICAgIHRpbWVzKHRoaXMuX3dpZHRoLCAoeDogbnVtYmVyKSA9PiB0aGlzLl9hcmVhW3ldW3hdID0gdmFsdWUpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuICAgIFxyXG59IiwiaW1wb3J0IHsgTW9kZWwgfSBmcm9tICcuLi9tb2RlbC9tb2RlbCc7XHJcbmltcG9ydCB7IFZpZXcgfSBmcm9tICcuLi92aWV3L3ZpZXcnO1xyXG5pbXBvcnQgeyBCb2FyZCB9IGZyb20gJy4uL2JvYXJkL2JvYXJkJztcclxuaW1wb3J0IHsgQmxvY2ssIEVtcHR5QmxvY2sgfSBmcm9tICcuLi9ibG9jay9ibG9jayc7XHJcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gJy4uL3ZlY3Rvci92ZWN0b3InO1xyXG5pbXBvcnQgeyBib2FyZCwgYmxvY2tzIH0gZnJvbSAnLi4vZ2FtZS1jb21wb25lbnRzL2dhbWUtY29tcG9uZW50cyc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29udHJvbGxlciB7XHJcblxyXG4gICAgcHJpdmF0ZSBfbW9kZWw6IE1vZGVsO1xyXG4gICAgcHJpdmF0ZSBfdmlldzogVmlldztcclxuICAgIHByaXZhdGUgX2lzQ3JlYXRlZEJsb2NrOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfY3VycmVudEJsb2NrOiBCbG9jaztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RlbDogTW9kZWwsIHZpZXc6IFZpZXcpIHtcclxuICAgICAgICB0aGlzLl9tb2RlbCA9IG1vZGVsO1xyXG4gICAgICAgIHRoaXMuX3ZpZXcgPSB2aWV3O1xyXG4gICAgICAgIHRoaXMuX2lzQ3JlYXRlZEJsb2NrID0gZmFsc2U7XHJcbiAgICB9XHJcbi8qXHJcbiAgICBwcml2YXRlIF90cnlNb3ZlQmxvY2soYmxvY2s6IEJsb2NrLCBtb3ZlOiBWZWN0b3IpIHtcclxuICAgICAgICBcclxuICAgICAgICBpZih0aGlzLl9tb2RlbC5jYW5Ecm9wQmxvY2soYmxvY2sudmVjdG9ycywgbW92ZSkpIHtcclxuICAgICAgICAgICAgY29uc3Qgb2xkVmVjdG9ycyA9IGJsb2NrLnZlY3RvcnM7XHJcbiAgICAgICAgICAgIGJsb2NrLnZlY3RvcnMgPSBibG9jay5nZXRCbG9ja1Bvc2l0aW9uKG1vdmUpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fbW9kZWwucmVtb3ZlQmxvY2sob2xkVmVjdG9ycyk7XHJcbiAgICAgICAgICAgIHRoaXMuX21vZGVsLmFkZEJsb2NrKGJsb2NrKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3ZpZXcucmVtb3ZlQmxvY2sob2xkVmVjdG9ycyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZpZXcucmVuZGVyQmxvY2soYmxvY2spO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKG1vdmUueSA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5faXNDcmVhdGVkQmxvY2sgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICAqL1xyXG5cclxuICAgIHByaXZhdGUgX2xpc3RlbmVycygpOiB7IG1vdmluZzogKCkgPT4gdm9pZCB9IHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbW92aW5nOiAoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaXNTZXRDdXJyZW50QmxvY2soYmxvY2s6IEJsb2NrKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICEhYmxvY2s7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgICAgICBpZighaXNTZXRDdXJyZW50QmxvY2sodGhpcy5fY3VycmVudEJsb2NrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2goZS5rZXlDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzc6IHRoaXMuX3RyeU1vdmVCbG9jayh0aGlzLl9jdXJyZW50QmxvY2ssIG5ldyBWZWN0b3IoLTEsIDApKTsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzk6IHRoaXMuX3RyeU1vdmVCbG9jayh0aGlzLl9jdXJyZW50QmxvY2ssIG5ldyBWZWN0b3IoMSwgMCkpOyBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9ICBcclxuICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSAgXHJcbiAgICAgICAgfSAgIFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3N0YXJ0R2FtZSgpOiBudW1iZXIge1xyXG5cclxuICAgICAgICBjb25zdCBjYW5DcmVhdGVCbG9jazogKGZyZWVTcGFjZXM6IFZlY3RvcltdW10pID0+IGJvb2xlYW4gPSBmcmVlU3BhY2VzID0+IGZyZWVTcGFjZXMubGVuZ3RoID4gMDtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlR2FtZTogKCkgPT4gdm9pZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYodGhpcy5faXNDcmVhdGVkQmxvY2spIHtcclxuICAgICAgICAgICAgICAgLy8gdGhpcy5fdHJ5TW92ZUJsb2NrKHRoaXMuX2N1cnJlbnRCbG9jaywgbmV3IFZlY3RvcigwLCAxKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmFuZG9tQmxvY2s6IEJsb2NrID0gdGhpcy5fbW9kZWwuZ2V0UmFuZG9tQmxvY2soKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZyZWVTcGFjZXM6IFZlY3RvcltdW10gPSB0aGlzLl9tb2RlbC5nZXRGcmVlU3BhY2VzKHJhbmRvbUJsb2NrKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYoY2FuQ3JlYXRlQmxvY2soZnJlZVNwYWNlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmcmVlU3BhY2U6IFZlY3RvcltdID0gdGhpcy5fbW9kZWwuZ2V0UmFuZG9tRnJlZVNwYWNlKGZyZWVTcGFjZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJhbmRvbUJsb2NrLnBvc2l0aW9uID0gZnJlZVNwYWNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXcucmVuZGVyQmxvY2socmFuZG9tQmxvY2spO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRCbG9jayA9IHJhbmRvbUJsb2NrO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2lzQ3JlYXRlZEJsb2NrID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlbmQgZ2FtZScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICB0aGlzLl9saXN0ZW5lcnMoKS5tb3ZpbmcoKTtcclxuICAgICAgICBcclxuICAgICAgICAvL3JldHVybiBzZXRJbnRlcnZhbChoYW5kbGVHYW1lLCA1MDApO1xyXG5cclxuICAgICAgICBoYW5kbGVHYW1lKClcclxuICAgICAgICByZXR1cm4gMTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX21vZGVsLmJvYXJkID0gYm9hcmQ7XHJcbiAgICAgICAgdGhpcy5fbW9kZWwuYmxvY2tzID0gYmxvY2tzO1xyXG4gICAgICAgIGJvYXJkLmZvckVhY2hBcmVhKG5ldyBFbXB0eUJsb2NrKTtcclxuICAgICAgICB0aGlzLl92aWV3LnJlbmRlckFyZWEoYm9hcmQuYXJlYSk7XHJcbiAgICAgICAgY29uc3Qgc3RhcnRHYW1lSGFuZGxlcjogbnVtYmVyID0gdGhpcy5fc3RhcnRHYW1lKCk7ICAgICAgXHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY29uc3QgRE9NID0ge1xyXG4gICAgYmxvY2tUbXBsOiBIYW5kbGViYXJzLmNvbXBpbGUoIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdibG9jay10ZW1wbGF0ZScpLmlubmVySFRNTCApLFxyXG4gICAgYm9hcmQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib2FyZCcpXHJcbn0iLCJpbXBvcnQgeyBCb2FyZCB9IGZyb20gJy4uL2JvYXJkL2JvYXJkJztcclxuaW1wb3J0IHsgQmxvY2ssIE9CbG9ja30gZnJvbSAnLi4vYmxvY2svYmxvY2snO1xyXG5cclxuZXhwb3J0IGNvbnN0IGJvYXJkOiBCb2FyZCA9IG5ldyBCb2FyZCgxMCwgMjApO1xyXG5cclxuZXhwb3J0IGNvbnN0IGJsb2NrczogQmxvY2tbXSA9IFtcclxuICAgIG5ldyBPQmxvY2tcclxuXTsiLCJpbXBvcnQgeyBNb2RlbCB9IGZyb20gJy4vbW9kZWwvbW9kZWwnO1xyXG5pbXBvcnQgeyBWaWV3IH0gZnJvbSAnLi92aWV3L3ZpZXcnO1xyXG5pbXBvcnQgeyBDb250cm9sbGVyIH0gZnJvbSAnLi9jb250cm9sbGVyL2NvbnRyb2xsZXInO1xyXG5cclxuY29uc3QgY29udHJvbGxlciA9IG5ldyBDb250cm9sbGVyKG5ldyBNb2RlbCwgbmV3IFZpZXcpO1xyXG5jb250cm9sbGVyLmluaXQoKTtcclxuIiwiaW1wb3J0IHsgQm9hcmQgfSBmcm9tICcuLi9ib2FyZC9ib2FyZCc7XHJcbmltcG9ydCB7IEJsb2NrLCBPQmxvY2ssIEVtcHR5QmxvY2sgfSBmcm9tICcuLi9ibG9jay9ibG9jayc7XHJcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gJy4uL3ZlY3Rvci92ZWN0b3InO1xyXG5pbXBvcnQgeyB0aW1lcywgcmFuZG9tVmFsdWVGcm9tQXJyYXkgfSBmcm9tICcuLi91c2VmdWwtZnVuY3Rpb25zL3VzZWZ1bC1mdW5jdGlvbnMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1vZGVsIHtcclxuXHJcbiAgICBwcml2YXRlIF9ib2FyZDogQm9hcmQ7XHJcbiAgICBwcml2YXRlIF9ibG9ja3M6IEJsb2NrW107XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgICBzZXQgYm9hcmQoYm9hcmQ6IEJvYXJkKSB7XHJcbiAgICAgICAgdGhpcy5fYm9hcmQgPSBib2FyZDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgYmxvY2tzKGJsb2NrczogQmxvY2tbXSkge1xyXG4gICAgICAgIHRoaXMuX2Jsb2NrcyA9IGJsb2NrcztcclxuICAgIH0gXHJcbiAgICBcclxuICAgIGdldCBib2FyZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYm9hcmQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZmlsdGVyUHJvcGVyVmVjdG9yVG9Nb3ZlRG93bihwcm9wZXJWZWN0b3JzOiBWZWN0b3JbXSwgdmVjdG9yOiBWZWN0b3IpIHtcclxuXHJcbiAgICAgICAgY29uc3QgcFZlY3RvckluZGV4OiBudW1iZXIgPSBwcm9wZXJWZWN0b3JzLmZpbmRJbmRleCgocFZlY3RvcjogVmVjdG9yKSA9PiBwVmVjdG9yLnggPT09IHZlY3Rvci54KTtcclxuXHJcbiAgICAgICAgaWYocFZlY3RvckluZGV4ID09PSAtMSkge1xyXG5cclxuICAgICAgICAgICAgcHJvcGVyVmVjdG9ycy5wdXNoKG5ldyBWZWN0b3IodmVjdG9yLngsIHZlY3Rvci55KSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZihwcm9wZXJWZWN0b3JzW3BWZWN0b3JJbmRleF0ueSA8IHZlY3Rvci55KSB7XHJcblxyXG4gICAgICAgICAgICBwcm9wZXJWZWN0b3JzW3BWZWN0b3JJbmRleF0ueSA9IHZlY3Rvci55O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9maWx0ZXJQcm9wZXJWZWN0b3JUb01vdmVSaWdodChwcm9wZXJWZWN0b3JzOiBWZWN0b3JbXSwgdmVjdG9yOiBWZWN0b3IpIHtcclxuXHJcbiAgICAgICAgY29uc3QgcFZlY3RvckluZGV4OiBudW1iZXIgPSBwcm9wZXJWZWN0b3JzLmZpbmRJbmRleCgocFZlY3RvcjogVmVjdG9yKSA9PiBwVmVjdG9yLnkgPT09IHZlY3Rvci55KTtcclxuXHJcbiAgICAgICAgaWYocFZlY3RvckluZGV4ID09PSAtMSkge1xyXG5cclxuICAgICAgICAgICAgcHJvcGVyVmVjdG9ycy5wdXNoKG5ldyBWZWN0b3IodmVjdG9yLngsIHZlY3Rvci55KSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZihwcm9wZXJWZWN0b3JzW3BWZWN0b3JJbmRleF0ueCA8IHZlY3Rvci54KSB7XHJcblxyXG4gICAgICAgICAgICBwcm9wZXJWZWN0b3JzW3BWZWN0b3JJbmRleF0ueCA9IHZlY3Rvci54O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9maWx0ZXJQcm9wZXJWZWN0b3JUb01vdmVMZWZ0KHByb3BlclZlY3RvcnM6IFZlY3RvcltdLCB2ZWN0b3I6IFZlY3Rvcikge1xyXG5cclxuICAgICAgICBjb25zdCBwVmVjdG9ySW5kZXg6IG51bWJlciA9IHByb3BlclZlY3RvcnMuZmluZEluZGV4KChwVmVjdG9yOiBWZWN0b3IpID0+IHBWZWN0b3IueSA9PT0gdmVjdG9yLnkpO1xyXG5cclxuICAgICAgICBpZihwVmVjdG9ySW5kZXggPT09IC0xKSB7XHJcblxyXG4gICAgICAgICAgICBwcm9wZXJWZWN0b3JzLnB1c2gobmV3IFZlY3Rvcih2ZWN0b3IueCwgdmVjdG9yLnkpKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmKHByb3BlclZlY3RvcnNbcFZlY3RvckluZGV4XS54ID4gdmVjdG9yLngpIHtcclxuXHJcbiAgICAgICAgICAgIHByb3BlclZlY3RvcnNbcFZlY3RvckluZGV4XS54ID0gdmVjdG9yLng7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2ZpbHRlclByb3BlclZlY3RvclRvTW92ZShwcm9wZXJWZWN0b3JzOiBWZWN0b3JbXSwgdmVjdG9yOiBWZWN0b3IsIG1vdmU6IFZlY3Rvcikge1xyXG5cclxuICAgICAgICBpZihtb3ZlLnkgPT09IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5fZmlsdGVyUHJvcGVyVmVjdG9yVG9Nb3ZlRG93bihwcm9wZXJWZWN0b3JzLCB2ZWN0b3IpO1xyXG4gICAgICAgIH0gZWxzZSBpZihtb3ZlLnggPT09IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5fZmlsdGVyUHJvcGVyVmVjdG9yVG9Nb3ZlUmlnaHQocHJvcGVyVmVjdG9ycywgdmVjdG9yKTtcclxuICAgICAgICB9IGVsc2UgaWYobW92ZS54ID09PSAtMSkge1xyXG4gICAgICAgICAgICB0aGlzLl9maWx0ZXJQcm9wZXJWZWN0b3JUb01vdmVMZWZ0KHByb3BlclZlY3RvcnMsIHZlY3Rvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNhbkRyb3BCbG9jayhwb3NpdGlvbnM6IFZlY3RvcltdLCBtb3ZlOiBWZWN0b3IpIHtcclxuXHJcbiAgICAgICAgY29uc3QgcHJvcGVyVmVjdG9yczogVmVjdG9yW10gPSBbXTtcclxuXHJcbiAgICAgICAgcG9zaXRpb25zLmZvckVhY2goKHZlY3RvcjogVmVjdG9yKSA9PiB0aGlzLl9maWx0ZXJQcm9wZXJWZWN0b3JUb01vdmUocHJvcGVyVmVjdG9ycywgdmVjdG9yLCBtb3ZlKSApO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGRyb3BwZWRWZWN0b3JzID0gcHJvcGVyVmVjdG9ycy5tYXAoKHZlY3RvcjogVmVjdG9yKSA9PiB2ZWN0b3IucGx1cyhtb3ZlKSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc1Bvc2l0aW9uRnJlZShkcm9wcGVkVmVjdG9ycyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQmxvY2sodmVjdG9yczogVmVjdG9yW10pIHtcclxuICAgICAgICB2ZWN0b3JzLmZvckVhY2goKHZlY3RvcjogVmVjdG9yKSA9PiB0aGlzLl9ib2FyZC5zZXRCbG9ja09uQXJlYSh2ZWN0b3IsIG5ldyBFbXB0eUJsb2NrKSApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2lzUG9zaXRpb25GcmVlKHZlY3RvcnM6IFZlY3RvcltdKTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGRvZXNWZWN0b3JGaXRBcnJheTogKGFycmF5OiBhbnlbXVtdLCB2ZWN0b3I6IFZlY3RvcikgPT4gYm9vbGVhbiA9IChhcnJheSwgdmVjdG9yKSA9PiB2ZWN0b3IueSA8IGFycmF5Lmxlbmd0aCAmJiB2ZWN0b3IueSA+PSAwICYmIHZlY3Rvci54ID49IDAgJiYgdmVjdG9yLnggPCBhcnJheVswXS5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgaXNFbXB0eUJsb2NrOiAoYmxvY2tUeXBlOiBzdHJpbmcsIHR5cGVPZkVtcHR5QmxvY2s6IHN0cmluZykgPT4gYm9vbGVhbiA9IChibG9ja1R5cGUsIHR5cGVPZkVtcHR5QmxvY2spID0+IGJsb2NrVHlwZSA9PT0gdHlwZU9mRW1wdHlCbG9jaztcclxuICAgICAgICBjb25zdCB0eXBlT2ZFbXB0eUJsb2NrOiBzdHJpbmcgPSBuZXcgRW1wdHlCbG9jaygpLnR5cGU7XHJcblxyXG4gICAgICAgIGNvbnN0IGZvdW5kQnVzeVBvc2l0aW9uOiBWZWN0b3IgPSB2ZWN0b3JzLmZpbmQoKHZlY3RvcjogVmVjdG9yKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZihkb2VzVmVjdG9yRml0QXJyYXkodGhpcy5fYm9hcmQuYXJlYSwgdmVjdG9yKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICFpc0VtcHR5QmxvY2sodGhpcy5fYm9hcmQuYXJlYVt2ZWN0b3IueV1bdmVjdG9yLnhdLnR5cGUsIHR5cGVPZkVtcHR5QmxvY2spO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuICFmb3VuZEJ1c3lQb3NpdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBnZXRSYW5kb21CbG9jaygpOiBCbG9jayB7XHJcbiAgICAgICAgY29uc3QgcmFuZG9tQmxvY2s6IEJsb2NrID0gcmFuZG9tVmFsdWVGcm9tQXJyYXkodGhpcy5fYmxvY2tzKTtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihuZXcgQmxvY2ssIHJhbmRvbUJsb2NrKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRGcmVlU3BhY2VzKGJsb2NrOiBCbG9jayk6IFZlY3RvcltdW10ge1xyXG5cclxuICAgICAgICBjb25zdCBmcmVlU3BhY2VzOiBWZWN0b3JbXVtdID0gW107XHJcbiAgICAgICAgY29uc3QgYW1vdW50U3BhY2VzVG9DaGVjazogbnVtYmVyID0gdGhpcy5fYm9hcmQuYXJlYVswXS5sZW5ndGggLSBNYXRoLmZsb29yKGJsb2NrLndpZHRoIC8gMik7XHJcblxyXG4gICAgICAgIHRpbWVzKGFtb3VudFNwYWNlc1RvQ2hlY2ssICh4Om51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgYXJlYVZlY3RvcnM6IFZlY3RvcltdID0gYmxvY2suZ2V0QmxvY2tTdGFydFBvc2l0aW9uKG5ldyBWZWN0b3IoeCwgMCkpO1xyXG4gICAgICAgICAgICBpZih0aGlzLl9pc1Bvc2l0aW9uRnJlZShhcmVhVmVjdG9ycykpIHtcclxuICAgICAgICAgICAgICAgIGZyZWVTcGFjZXMucHVzaChhcmVhVmVjdG9ycyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBmcmVlU3BhY2VzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFJhbmRvbUZyZWVTcGFjZShmcmVlU3BhY2VzOiBWZWN0b3JbXVtdKTogVmVjdG9yW10ge1xyXG4gICAgICAgIHJldHVybiByYW5kb21WYWx1ZUZyb21BcnJheShmcmVlU3BhY2VzKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVCbG9ja09uQm9hcmQoYmxvY2s6IEJsb2NrKTogdm9pZCB7XHJcbiAgICAgICAgYmxvY2sucG9zaXRpb24uZm9yRWFjaCgodmVjdG9yOiBWZWN0b3IpID0+IHRoaXMuX2JvYXJkLnNldEJsb2NrT25BcmVhKHZlY3RvciwgYmxvY2spKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBmdW5jdGlvbiB0aW1lcyh0aW1lczogbnVtYmVyLCBmbjogYW55KSB7XHJcbiAgICBcclxuICAgIGxldCBvdXRwdXQgPSBcIlwiO1xyXG5cclxuICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aW1lczsgaSsrKSB7XHJcbiAgICAgICAgIG91dHB1dCArPSBmbihpKTsgICBcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gb3V0cHV0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tVmFsdWVGcm9tQXJyYXkoYXJyYXk6IGFueVtdKSB7IFxyXG4gICAgcmV0dXJuIGFycmF5W01hdGguZmxvb3IoIE1hdGgucmFuZG9tKCkgKiBhcnJheS5sZW5ndGggKV07XHJcbn0iLCJleHBvcnQgY2xhc3MgVmVjdG9yIHtcclxuXHJcbiAgICBwcml2YXRlIF94OiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF95OiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl94ID0geDtcclxuICAgICAgICB0aGlzLl95ID0geTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgeCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5feDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgeSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5feTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgeCh4OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl94ID0geDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgeSh5OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl95ID0geTtcclxuICAgIH1cclxuXHJcbiAgICBwbHVzKHZlY3RvcjogVmVjdG9yKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy5feCArIHZlY3Rvci54LCB0aGlzLl95ICsgdmVjdG9yLnkpOyBcclxuICAgIH1cclxuXHJcbiAgICBnZXRJZCgpIHtcclxuICAgICAgICByZXR1cm4gcGFyc2VJbnQoIHRoaXMuX3kudG9TdHJpbmcoKSArIHRoaXMuX3gudG9TdHJpbmcoKSApO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRE9NIH0gZnJvbSAnLi4vZG9tLWVsZW1lbnRzL2RvbS1lbGVtZW50cyc7XHJcbmltcG9ydCB7IHRpbWVzIH0gZnJvbSAnLi4vdXNlZnVsLWZ1bmN0aW9ucy91c2VmdWwtZnVuY3Rpb25zJztcclxuaW1wb3J0IHsgQmxvY2ssIEVtcHR5QmxvY2sgfSBmcm9tICcuLi9ibG9jay9ibG9jayc7XHJcbmltcG9ydCB7IFZlY3RvciB9IGZyb20gJy4uL3ZlY3Rvci92ZWN0b3InO1xyXG5cclxuZXhwb3J0IGNsYXNzIFZpZXcge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2dldEJsb2NrQnlJZChpZDogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiaWQtJyArIGlkKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9hZGRUeXBlVG9CbG9jayhlbDogSFRNTEVsZW1lbnQsIHR5cGU6IHN0cmluZykge1xyXG4gICAgICAgIGVsLmNsYXNzTmFtZSA9IFwiYmxvY2sgYmxvY2tfX1wiICsgdHlwZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXJBcmVhKGFyZWE6IEJsb2NrW11bXSk6IHZvaWQge1xyXG5cclxuICAgICAgICBsZXQgaWQ6IG51bWJlciA9IDA7XHJcbiAgICAgICAgY29uc3QgZmxhdHRlbmVkID0gYXJlYS5yZWR1Y2UoIChzdW06IEJsb2NrW10sIHZhbHVlOiBCbG9ja1tdKSA9PiBzdW0uY29uY2F0KHZhbHVlKSwgW10gKTtcclxuICAgICAgICBjb25zdCBvdXRwdXQgPSBmbGF0dGVuZWQucmVkdWNlKCAoaHRtbDogc3RyaW5nLCBibG9jazogQmxvY2spID0+IGh0bWwgKz0gRE9NLmJsb2NrVG1wbCh7IHR5cGU6IGJsb2NrLnR5cGUsIGlkOiBpZCsrIH0pLCBcIlwiICk7XHJcblxyXG4gICAgICAgIERPTS5ib2FyZC5pbm5lckhUTUwgPSBvdXRwdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyQmxvY2soYmxvY2s6IEJsb2NrKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgYmxvY2sucG9zaXRpb24uZm9yRWFjaCgodmVjdG9yOiBWZWN0b3IpID0+IHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGlkID0gdmVjdG9yLmdldElkKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsID0gdGhpcy5fZ2V0QmxvY2tCeUlkKGlkKTtcclxuICAgICAgICAgICAgdGhpcy5fYWRkVHlwZVRvQmxvY2soZWwsIGJsb2NrLnR5cGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUJsb2NrKHZlY3RvcnM6IFZlY3RvcltdKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IHR5cGVPZkVtcHR5QmxvY2sgPSBuZXcgRW1wdHlCbG9jaygpLnR5cGU7XHJcblxyXG4gICAgICAgIHZlY3RvcnMuZm9yRWFjaCgodmVjdG9yOiBWZWN0b3IpID0+IHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGlkID0gdmVjdG9yLmdldElkKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsID0gdGhpcy5fZ2V0QmxvY2tCeUlkKGlkKTtcclxuICAgICAgICAgICAgdGhpcy5fYWRkVHlwZVRvQmxvY2soZWwsIHR5cGVPZkVtcHR5QmxvY2spO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSJdfQ==
