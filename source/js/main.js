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
const vector_1 = require("../vector/vector");
const game_components_1 = require("../game-components/game-components");
class Controller {
    constructor(model, view) {
        this._model = model;
        this._view = view;
        this._isCreatedBlock = false;
    }
    _listeners() {
        return {
            moving: () => {
                const isSetCurrentBlock = block => !!block;
                const moveBlock = move => {
                    const result = this._model.tryMoveBlock(this._currentBlockPosition, move);
                    if (result) {
                        const oldPosition = this._currentBlockPosition;
                        this._currentBlockPosition = this._currentBlockPosition.map((vector) => vector.plus(move));
                        this._model.removeBlockOnArea(oldPosition);
                        this._model.addBlockOnArea(this._currentBlock, this._currentBlockPosition);
                        this._view.renderBlock(new block_1.EmptyBlock().type, oldPosition);
                        this._view.renderBlock(this._currentBlock.type, this._currentBlockPosition);
                    }
                };
                window.addEventListener('keydown', e => {
                    if (!isSetCurrentBlock(this._currentBlock)) {
                        return;
                    }
                    switch (e.keyCode) {
                        case 37:
                            moveBlock(new vector_1.Vector(-1, 0));
                            break;
                        case 39:
                            moveBlock(new vector_1.Vector(1, 0));
                            break;
                    }
                });
            }
        };
    }
    _startGame() {
        const canCreateBlock = freeSpaces => freeSpaces.length > 0;
        const handleGame = () => {
            if (this._isCreatedBlock) {
                const dropDown = new vector_1.Vector(0, 1);
                if (this._model.canDropBlock(this._currentBlockPosition, dropDown)) {
                    const oldPosition = this._currentBlockPosition;
                    this._currentBlockPosition = this._currentBlockPosition.map((vector) => vector.plus(dropDown));
                    this._model.removeBlockOnArea(oldPosition);
                    this._model.addBlockOnArea(this._currentBlock, this._currentBlockPosition);
                    this._view.renderBlock(new block_1.EmptyBlock().type, oldPosition);
                    this._view.renderBlock(this._currentBlock.type, this._currentBlockPosition);
                }
                else {
                    this._isCreatedBlock = false;
                }
            }
            else {
                const randomBlock = this._model.getRandomBlock();
                const freeSpaces = this._model.getFreeSpaces(randomBlock);
                if (canCreateBlock(freeSpaces)) {
                    const freeSpace = this._model.getRandomFreeSpace(freeSpaces);
                    this._view.renderBlock(randomBlock.type, freeSpace);
                    this._currentBlock = randomBlock;
                    this._isCreatedBlock = true;
                    this._currentBlockPosition = freeSpace;
                }
                else {
                    console.log('end game');
                }
            }
        };
        this._listeners().moving();
        return setInterval(handleGame, 500);
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
},{"../block/block":1,"../game-components/game-components":5,"../vector/vector":9}],4:[function(require,module,exports){
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
    canDropBlock(blockPosition, dropDown) {
        const borderBottomVectors = [];
        const sieveBorderBottomVectors = (container, vector) => {
            const containerVectorIndex = container.findIndex((containerVector) => containerVector.x === vector.x);
            const doesNotVectorExistInContainer = index => index === -1;
            const isVectorHigherThanInContainer = (vector, vectorInContainer) => vector.y > vectorInContainer.y;
            if (doesNotVectorExistInContainer(containerVectorIndex)) {
                container.push(new vector_1.Vector(vector.x, vector.y));
            }
            else if (isVectorHigherThanInContainer(vector, container[containerVectorIndex])) {
                container[containerVectorIndex].y = vector.y;
            }
        };
        blockPosition.forEach((vector) => sieveBorderBottomVectors(borderBottomVectors, vector));
        const droppedVectors = borderBottomVectors.map((vector) => vector.plus(dropDown));
        return this._isPositionFree(droppedVectors);
    }
    removeBlockOnArea(vectors) {
        vectors.forEach((vector) => this._board.setBlockOnArea(vector, new block_1.EmptyBlock));
    }
    addBlockOnArea(block, blockPosition) {
        blockPosition.forEach((vector) => this._board.setBlockOnArea(vector, block));
    }
    tryMoveBlock(blockPosition, move) {
        const extremeVectors = [];
        const sieveExtremeVectors = (container, vector) => {
            const containerVectorIndex = container.findIndex((containerVector) => containerVector.y === vector.y);
            const doesNotVectorExistInContainer = index => index === -1;
            const isVectorFavorableThanInContainer = (vector, vectorInContainer) => move.x < 0 && vector.x < vectorInContainer.x || move.x > 0 && vector.x > vectorInContainer.x;
            if (doesNotVectorExistInContainer(containerVectorIndex)) {
                container.push(new vector_1.Vector(vector.x, vector.y));
            }
            else if (isVectorFavorableThanInContainer(vector, container[containerVectorIndex])) {
                container[containerVectorIndex].x = vector.x;
            }
        };
        blockPosition.forEach((vector) => sieveExtremeVectors(extremeVectors, vector));
        const movedVectors = extremeVectors.map((vector) => vector.plus(move));
        return this._isPositionFree(movedVectors);
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
    renderBlock(blockType, blockPosition) {
        blockPosition.forEach((vector) => {
            const id = vector.getId();
            const el = this._getBlockById(id);
            this._addTypeToBlock(el, blockType);
        });
    }
}
exports.View = View;
},{"../dom-elements/dom-elements":4}]},{},[3,7,10,6,2,4,8,1,9,5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzb3VyY2UvdHMvYmxvY2svYmxvY2sudHMiLCJzb3VyY2UvdHMvYm9hcmQvYm9hcmQudHMiLCJzb3VyY2UvdHMvY29udHJvbGxlci9jb250cm9sbGVyLnRzIiwic291cmNlL3RzL2RvbS1lbGVtZW50cy9kb20tZWxlbWVudHMudHMiLCJzb3VyY2UvdHMvZ2FtZS1jb21wb25lbnRzL2dhbWUtY29tcG9uZW50cy50cyIsInNvdXJjZS90cy9tYWluLnRzIiwic291cmNlL3RzL21vZGVsL21vZGVsLnRzIiwic291cmNlL3RzL3VzZWZ1bC1mdW5jdGlvbnMvdXNlZnVsLWZ1bmN0aW9ucy50cyIsInNvdXJjZS90cy92ZWN0b3IvdmVjdG9yLnRzIiwic291cmNlL3RzL3ZpZXcvdmlldy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsNkNBQTBDO0FBRTFDO0lBT0ksZ0JBQWUsQ0FBQztJQUVoQixxQkFBcUIsQ0FBQyxhQUFxQjtRQUN2QyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFjLEtBQUssTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUFFRCxJQUFJLElBQUk7UUFDSixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ0wsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVELElBQUksT0FBTztRQUNQLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3pCLENBQUM7Q0FDSjtBQXhCRCxzQkF3QkM7QUFFRCxnQkFBd0IsU0FBUSxLQUFLO0lBRWpDO1FBQ0ksS0FBSyxFQUFFLENBQUM7UUFFUixJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztJQUN6QixDQUFDO0NBQ0o7QUFQRCxn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QyxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBL0JELG9CQStCQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgeyBWZWN0b3IgfSBmcm9tICcuLi92ZWN0b3IvdmVjdG9yJztcclxuXHJcbmV4cG9ydCBjbGFzcyBCbG9jayB7XHJcblxyXG4gICAgcHJvdGVjdGVkIF92ZWN0b3JzOiBWZWN0b3JbXTtcclxuICAgIHByb3RlY3RlZCBfdHlwZTogc3RyaW5nO1xyXG4gICAgcHJvdGVjdGVkIF93aWR0aDogbnVtYmVyO1xyXG4gICAgcHJvdGVjdGVkIF9oZWlnaHQ6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gICAgZ2V0QmxvY2tTdGFydFBvc2l0aW9uKHN0YXJ0UG9zaXRpb246IFZlY3Rvcikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl92ZWN0b3JzLm1hcCgodmVjdG9yOiBWZWN0b3IpID0+IHZlY3Rvci5wbHVzKHN0YXJ0UG9zaXRpb24pKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdHlwZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgd2lkdGgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB2ZWN0b3JzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl92ZWN0b3JzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRW1wdHlCbG9jayBleHRlbmRzIEJsb2NrIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLl90eXBlID0gJ2VtcHR5JztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIE9CbG9jayBleHRlbmRzIEJsb2NrIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLl90eXBlID0gJ28nO1xyXG4gICAgICAgIHRoaXMuX3ZlY3RvcnMgPSBbXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IoMCwgMCksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IoMSwgMCksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IoMCwgMSksXHJcbiAgICAgICAgICAgIG5ldyBWZWN0b3IoMSwgMSlcclxuICAgICAgICBdXHJcblxyXG4gICAgICAgIHRoaXMuX3dpZHRoID0gMjtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSAyO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgdGltZXMgfSBmcm9tICcuLi91c2VmdWwtZnVuY3Rpb25zL3VzZWZ1bC1mdW5jdGlvbnMnO1xyXG5pbXBvcnQgeyBFbXB0eUJsb2NrLCBCbG9jayB9IGZyb20gJy4uL2Jsb2NrL2Jsb2NrJztcclxuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSAnLi4vdmVjdG9yL3ZlY3Rvcic7XHJcblxyXG5leHBvcnQgY2xhc3MgQm9hcmQge1xyXG4gICAgXHJcbiAgICBwcml2YXRlIF93aWR0aDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfaGVpZ2h0OiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9hcmVhOiBCbG9ja1tdW107XHJcblxyXG4gICAgY29uc3RydWN0b3Iod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl93aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuX2hlaWdodCA9IGhlaWdodDtcclxuICAgICAgICB0aGlzLl9pbml0QXJlYSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB3aWR0aCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGhlaWdodCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBhcmVhKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hcmVhO1xyXG4gICAgfVxyXG5cclxuICAgIF9pbml0QXJlYSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9hcmVhID0gW107XHJcbiAgICAgICAgdGltZXModGhpcy5faGVpZ2h0LCAoKSA9PiB0aGlzLl9hcmVhLnB1c2goW10pICk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QmxvY2tPbkFyZWEodmVjdG9yOiBWZWN0b3IsIGJsb2NrOiBCbG9jaykge1xyXG4gICAgICAgIHRoaXMuX2FyZWFbdmVjdG9yLnldW3ZlY3Rvci54XSA9IGJsb2NrOyBcclxuICAgIH1cclxuXHJcbiAgICBmb3JFYWNoQXJlYSh2YWx1ZTogQmxvY2spOiB2b2lkIHtcclxuICAgICAgICBcclxuICAgICAgICB0aW1lcyh0aGlzLl9oZWlnaHQsICh5OiBudW1iZXIpID0+IFxyXG4gICAgICAgICAgICB0aW1lcyh0aGlzLl93aWR0aCwgKHg6IG51bWJlcikgPT4gdGhpcy5fYXJlYVt5XVt4XSA9IHZhbHVlKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBcclxufSIsImltcG9ydCB7IE1vZGVsIH0gZnJvbSAnLi4vbW9kZWwvbW9kZWwnO1xyXG5pbXBvcnQgeyBWaWV3IH0gZnJvbSAnLi4vdmlldy92aWV3JztcclxuaW1wb3J0IHsgQm9hcmQgfSBmcm9tICcuLi9ib2FyZC9ib2FyZCc7XHJcbmltcG9ydCB7IEJsb2NrLCBFbXB0eUJsb2NrIH0gZnJvbSAnLi4vYmxvY2svYmxvY2snO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tICcuLi92ZWN0b3IvdmVjdG9yJztcclxuaW1wb3J0IHsgYm9hcmQsIGJsb2NrcyB9IGZyb20gJy4uL2dhbWUtY29tcG9uZW50cy9nYW1lLWNvbXBvbmVudHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbnRyb2xsZXIge1xyXG5cclxuICAgIHByaXZhdGUgX21vZGVsOiBNb2RlbDtcclxuICAgIHByaXZhdGUgX3ZpZXc6IFZpZXc7XHJcbiAgICBwcml2YXRlIF9pc0NyZWF0ZWRCbG9jazogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgX2N1cnJlbnRCbG9jazogQmxvY2s7XHJcbiAgICBwcml2YXRlIF9jdXJyZW50QmxvY2tQb3NpdGlvbjogVmVjdG9yW107XHJcblxyXG4gICAgY29uc3RydWN0b3IobW9kZWw6IE1vZGVsLCB2aWV3OiBWaWV3KSB7XHJcbiAgICAgICAgdGhpcy5fbW9kZWwgPSBtb2RlbDtcclxuICAgICAgICB0aGlzLl92aWV3ID0gdmlldztcclxuICAgICAgICB0aGlzLl9pc0NyZWF0ZWRCbG9jayA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2xpc3RlbmVycygpOiB7IG1vdmluZzogKCkgPT4gdm9pZCB9IHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbW92aW5nOiAoKSA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgaXNTZXRDdXJyZW50QmxvY2s6IChibG9jazogQmxvY2spID0+IGJvb2xlYW4gPSBibG9jayA9PiAhIWJsb2NrO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbW92ZUJsb2NrOiAobW92ZTogVmVjdG9yKSA9PiB2b2lkID0gbW92ZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fbW9kZWwudHJ5TW92ZUJsb2NrKHRoaXMuX2N1cnJlbnRCbG9ja1Bvc2l0aW9uLCBtb3ZlKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBpZihyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgb2xkUG9zaXRpb24gPSB0aGlzLl9jdXJyZW50QmxvY2tQb3NpdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudEJsb2NrUG9zaXRpb24gPSB0aGlzLl9jdXJyZW50QmxvY2tQb3NpdGlvbi5tYXAoKHZlY3RvcjogVmVjdG9yKSA9PiB2ZWN0b3IucGx1cyhtb3ZlKSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9tb2RlbC5yZW1vdmVCbG9ja09uQXJlYShvbGRQb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX21vZGVsLmFkZEJsb2NrT25BcmVhKHRoaXMuX2N1cnJlbnRCbG9jaywgdGhpcy5fY3VycmVudEJsb2NrUG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXcucmVuZGVyQmxvY2sobmV3IEVtcHR5QmxvY2soKS50eXBlLCBvbGRQb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXcucmVuZGVyQmxvY2sodGhpcy5fY3VycmVudEJsb2NrLnR5cGUsIHRoaXMuX2N1cnJlbnRCbG9ja1Bvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBpZighaXNTZXRDdXJyZW50QmxvY2sodGhpcy5fY3VycmVudEJsb2NrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2goZS5rZXlDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzc6IG1vdmVCbG9jayhuZXcgVmVjdG9yKC0xLCAwKSk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDM5OiBtb3ZlQmxvY2sobmV3IFZlY3RvcigxLCAwKSk7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gIFxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSAgXHJcbiAgICAgICAgfSAgIFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3N0YXJ0R2FtZSgpOiBudW1iZXIge1xyXG5cclxuICAgICAgICBjb25zdCBjYW5DcmVhdGVCbG9jazogKGZyZWVTcGFjZXM6IFZlY3RvcltdW10pID0+IGJvb2xlYW4gPSBmcmVlU3BhY2VzID0+IGZyZWVTcGFjZXMubGVuZ3RoID4gMDtcclxuXHJcbiAgICAgICAgY29uc3QgaGFuZGxlR2FtZTogKCkgPT4gdm9pZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYodGhpcy5faXNDcmVhdGVkQmxvY2spIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBkcm9wRG93bjogVmVjdG9yID0gbmV3IFZlY3RvcigwLCAxKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9tb2RlbC5jYW5Ecm9wQmxvY2sodGhpcy5fY3VycmVudEJsb2NrUG9zaXRpb24sIGRyb3BEb3duKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9sZFBvc2l0aW9uID0gdGhpcy5fY3VycmVudEJsb2NrUG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudEJsb2NrUG9zaXRpb24gPSB0aGlzLl9jdXJyZW50QmxvY2tQb3NpdGlvbi5tYXAoKHZlY3RvcjogVmVjdG9yKSA9PiB2ZWN0b3IucGx1cyhkcm9wRG93bikpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21vZGVsLnJlbW92ZUJsb2NrT25BcmVhKG9sZFBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tb2RlbC5hZGRCbG9ja09uQXJlYSh0aGlzLl9jdXJyZW50QmxvY2ssIHRoaXMuX2N1cnJlbnRCbG9ja1Bvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdmlldy5yZW5kZXJCbG9jayhuZXcgRW1wdHlCbG9jaygpLnR5cGUsIG9sZFBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl92aWV3LnJlbmRlckJsb2NrKHRoaXMuX2N1cnJlbnRCbG9jay50eXBlLCB0aGlzLl9jdXJyZW50QmxvY2tQb3NpdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2lzQ3JlYXRlZEJsb2NrID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcmFuZG9tQmxvY2s6IEJsb2NrID0gdGhpcy5fbW9kZWwuZ2V0UmFuZG9tQmxvY2soKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZyZWVTcGFjZXM6IFZlY3RvcltdW10gPSB0aGlzLl9tb2RlbC5nZXRGcmVlU3BhY2VzKHJhbmRvbUJsb2NrKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaWYoY2FuQ3JlYXRlQmxvY2soZnJlZVNwYWNlcykpIHtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmcmVlU3BhY2U6IFZlY3RvcltdID0gdGhpcy5fbW9kZWwuZ2V0UmFuZG9tRnJlZVNwYWNlKGZyZWVTcGFjZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXcucmVuZGVyQmxvY2socmFuZG9tQmxvY2sudHlwZSwgZnJlZVNwYWNlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJyZW50QmxvY2sgPSByYW5kb21CbG9jaztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pc0NyZWF0ZWRCbG9jayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3VycmVudEJsb2NrUG9zaXRpb24gPSBmcmVlU3BhY2U7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZW5kIGdhbWUnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5fbGlzdGVuZXJzKCkubW92aW5nKCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHNldEludGVydmFsKGhhbmRsZUdhbWUsIDUwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9tb2RlbC5ib2FyZCA9IGJvYXJkO1xyXG4gICAgICAgIHRoaXMuX21vZGVsLmJsb2NrcyA9IGJsb2NrcztcclxuICAgICAgICBib2FyZC5mb3JFYWNoQXJlYShuZXcgRW1wdHlCbG9jayk7XHJcbiAgICAgICAgdGhpcy5fdmlldy5yZW5kZXJBcmVhKGJvYXJkLmFyZWEpO1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0R2FtZUhhbmRsZXI6IG51bWJlciA9IHRoaXMuX3N0YXJ0R2FtZSgpOyAgICAgIFxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNvbnN0IERPTSA9IHtcclxuICAgIGJsb2NrVG1wbDogSGFuZGxlYmFycy5jb21waWxlKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmxvY2stdGVtcGxhdGUnKS5pbm5lckhUTUwgKSxcclxuICAgIGJvYXJkOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYm9hcmQnKVxyXG59IiwiaW1wb3J0IHsgQm9hcmQgfSBmcm9tICcuLi9ib2FyZC9ib2FyZCc7XHJcbmltcG9ydCB7IEJsb2NrLCBPQmxvY2t9IGZyb20gJy4uL2Jsb2NrL2Jsb2NrJztcclxuXHJcbmV4cG9ydCBjb25zdCBib2FyZDogQm9hcmQgPSBuZXcgQm9hcmQoMTAsIDIwKTtcclxuXHJcbmV4cG9ydCBjb25zdCBibG9ja3M6IEJsb2NrW10gPSBbXHJcbiAgICBuZXcgT0Jsb2NrXHJcbl07IiwiaW1wb3J0IHsgTW9kZWwgfSBmcm9tICcuL21vZGVsL21vZGVsJztcclxuaW1wb3J0IHsgVmlldyB9IGZyb20gJy4vdmlldy92aWV3JztcclxuaW1wb3J0IHsgQ29udHJvbGxlciB9IGZyb20gJy4vY29udHJvbGxlci9jb250cm9sbGVyJztcclxuXHJcbmNvbnN0IGNvbnRyb2xsZXIgPSBuZXcgQ29udHJvbGxlcihuZXcgTW9kZWwsIG5ldyBWaWV3KTtcclxuY29udHJvbGxlci5pbml0KCk7XHJcbiIsImltcG9ydCB7IEJvYXJkIH0gZnJvbSAnLi4vYm9hcmQvYm9hcmQnO1xyXG5pbXBvcnQgeyBCbG9jaywgT0Jsb2NrLCBFbXB0eUJsb2NrIH0gZnJvbSAnLi4vYmxvY2svYmxvY2snO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tICcuLi92ZWN0b3IvdmVjdG9yJztcclxuaW1wb3J0IHsgdGltZXMsIHJhbmRvbVZhbHVlRnJvbUFycmF5IH0gZnJvbSAnLi4vdXNlZnVsLWZ1bmN0aW9ucy91c2VmdWwtZnVuY3Rpb25zJztcclxuXHJcbmV4cG9ydCBjbGFzcyBNb2RlbCB7XHJcblxyXG4gICAgcHJpdmF0ZSBfYm9hcmQ6IEJvYXJkO1xyXG4gICAgcHJpdmF0ZSBfYmxvY2tzOiBCbG9ja1tdO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gICAgc2V0IGJvYXJkKGJvYXJkOiBCb2FyZCkge1xyXG4gICAgICAgIHRoaXMuX2JvYXJkID0gYm9hcmQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGJsb2NrcyhibG9ja3M6IEJsb2NrW10pIHtcclxuICAgICAgICB0aGlzLl9ibG9ja3MgPSBibG9ja3M7XHJcbiAgICB9IFxyXG4gICAgXHJcbiAgICBnZXQgYm9hcmQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JvYXJkO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2lzUG9zaXRpb25GcmVlKHZlY3RvcnM6IFZlY3RvcltdKTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGRvZXNWZWN0b3JGaXRBcnJheTogKGFycmF5OiBhbnlbXVtdLCB2ZWN0b3I6IFZlY3RvcikgPT4gYm9vbGVhbiA9IChhcnJheSwgdmVjdG9yKSA9PiB2ZWN0b3IueSA8IGFycmF5Lmxlbmd0aCAmJiB2ZWN0b3IueSA+PSAwICYmIHZlY3Rvci54ID49IDAgJiYgdmVjdG9yLnggPCBhcnJheVswXS5sZW5ndGg7XHJcbiAgICAgICAgY29uc3QgaXNFbXB0eUJsb2NrOiAoYmxvY2tUeXBlOiBzdHJpbmcsIHR5cGVPZkVtcHR5QmxvY2s6IHN0cmluZykgPT4gYm9vbGVhbiA9IChibG9ja1R5cGUsIHR5cGVPZkVtcHR5QmxvY2spID0+IGJsb2NrVHlwZSA9PT0gdHlwZU9mRW1wdHlCbG9jaztcclxuICAgICAgICBjb25zdCB0eXBlT2ZFbXB0eUJsb2NrOiBzdHJpbmcgPSBuZXcgRW1wdHlCbG9jaygpLnR5cGU7XHJcblxyXG4gICAgICAgIGNvbnN0IGZvdW5kQnVzeVBvc2l0aW9uOiBWZWN0b3IgPSB2ZWN0b3JzLmZpbmQoKHZlY3RvcjogVmVjdG9yKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZihkb2VzVmVjdG9yRml0QXJyYXkodGhpcy5fYm9hcmQuYXJlYSwgdmVjdG9yKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICFpc0VtcHR5QmxvY2sodGhpcy5fYm9hcmQuYXJlYVt2ZWN0b3IueV1bdmVjdG9yLnhdLnR5cGUsIHR5cGVPZkVtcHR5QmxvY2spO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuICFmb3VuZEJ1c3lQb3NpdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBnZXRSYW5kb21CbG9jaygpOiBCbG9jayB7XHJcbiAgICAgICAgY29uc3QgcmFuZG9tQmxvY2s6IEJsb2NrID0gcmFuZG9tVmFsdWVGcm9tQXJyYXkodGhpcy5fYmxvY2tzKTtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihuZXcgQmxvY2ssIHJhbmRvbUJsb2NrKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRGcmVlU3BhY2VzKGJsb2NrOiBCbG9jayk6IFZlY3RvcltdW10ge1xyXG5cclxuICAgICAgICBjb25zdCBmcmVlU3BhY2VzOiBWZWN0b3JbXVtdID0gW107XHJcbiAgICAgICAgY29uc3QgYW1vdW50U3BhY2VzVG9DaGVjazogbnVtYmVyID0gdGhpcy5fYm9hcmQuYXJlYVswXS5sZW5ndGggLSBNYXRoLmZsb29yKGJsb2NrLndpZHRoIC8gMik7XHJcblxyXG4gICAgICAgIHRpbWVzKGFtb3VudFNwYWNlc1RvQ2hlY2ssICh4Om51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgYXJlYVZlY3RvcnM6IFZlY3RvcltdID0gYmxvY2suZ2V0QmxvY2tTdGFydFBvc2l0aW9uKG5ldyBWZWN0b3IoeCwgMCkpO1xyXG4gICAgICAgICAgICBpZih0aGlzLl9pc1Bvc2l0aW9uRnJlZShhcmVhVmVjdG9ycykpIHtcclxuICAgICAgICAgICAgICAgIGZyZWVTcGFjZXMucHVzaChhcmVhVmVjdG9ycyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBmcmVlU3BhY2VzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFJhbmRvbUZyZWVTcGFjZShmcmVlU3BhY2VzOiBWZWN0b3JbXVtdKTogVmVjdG9yW10ge1xyXG4gICAgICAgIHJldHVybiByYW5kb21WYWx1ZUZyb21BcnJheShmcmVlU3BhY2VzKTtcclxuICAgIH1cclxuXHJcbiAgICBjYW5Ecm9wQmxvY2soYmxvY2tQb3NpdGlvbjogVmVjdG9yW10sIGRyb3BEb3duOiBWZWN0b3IpIHtcclxuXHJcbiAgICAgICAgY29uc3QgYm9yZGVyQm90dG9tVmVjdG9yczogVmVjdG9yW10gPSBbXTtcclxuICAgICAgICBjb25zdCBzaWV2ZUJvcmRlckJvdHRvbVZlY3RvcnM6ICAoY29udGFpbmVyOiBWZWN0b3JbXSwgdmVjdG9yOiBWZWN0b3IpID0+IHZvaWQgPSAoY29udGFpbmVyLCB2ZWN0b3IpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lclZlY3RvckluZGV4OiBudW1iZXIgPSBjb250YWluZXIuZmluZEluZGV4KChjb250YWluZXJWZWN0b3I6IFZlY3RvcikgPT4gY29udGFpbmVyVmVjdG9yLnggPT09IHZlY3Rvci54KTtcclxuICAgICAgICAgICAgY29uc3QgZG9lc05vdFZlY3RvckV4aXN0SW5Db250YWluZXI6IChpbmRleDogbnVtYmVyKSA9PiBib29sZWFuID0gaW5kZXggPT4gaW5kZXggPT09IC0xO1xyXG4gICAgICAgICAgICBjb25zdCBpc1ZlY3RvckhpZ2hlclRoYW5JbkNvbnRhaW5lcjogKHZlY3RvcjogVmVjdG9yLCB2ZWN0b3JJbkNvbnRhaW5lcjogVmVjdG9yKSA9PiBib29sZWFuID0gKHZlY3RvciwgdmVjdG9ySW5Db250YWluZXIpID0+IHZlY3Rvci55ID4gdmVjdG9ySW5Db250YWluZXIueTtcclxuICAgIFxyXG4gICAgICAgICAgICBpZihkb2VzTm90VmVjdG9yRXhpc3RJbkNvbnRhaW5lcihjb250YWluZXJWZWN0b3JJbmRleCkpIHtcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnB1c2gobmV3IFZlY3Rvcih2ZWN0b3IueCwgdmVjdG9yLnkpKTtcclxuICAgIFxyXG4gICAgICAgICAgICB9IGVsc2UgaWYoaXNWZWN0b3JIaWdoZXJUaGFuSW5Db250YWluZXIodmVjdG9yLCBjb250YWluZXJbY29udGFpbmVyVmVjdG9ySW5kZXhdKSkge1xyXG4gICAgXHJcbiAgICAgICAgICAgICAgICBjb250YWluZXJbY29udGFpbmVyVmVjdG9ySW5kZXhdLnkgPSB2ZWN0b3IueTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYmxvY2tQb3NpdGlvbi5mb3JFYWNoKCh2ZWN0b3I6IFZlY3RvcikgPT4gc2lldmVCb3JkZXJCb3R0b21WZWN0b3JzKGJvcmRlckJvdHRvbVZlY3RvcnMsIHZlY3RvcikpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IGRyb3BwZWRWZWN0b3JzOiBWZWN0b3JbXSA9IGJvcmRlckJvdHRvbVZlY3RvcnMubWFwKCh2ZWN0b3I6IFZlY3RvcikgPT4gdmVjdG9yLnBsdXMoZHJvcERvd24pKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzUG9zaXRpb25GcmVlKGRyb3BwZWRWZWN0b3JzKTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVCbG9ja09uQXJlYSh2ZWN0b3JzOiBWZWN0b3JbXSkge1xyXG4gICAgICAgIHZlY3RvcnMuZm9yRWFjaCgodmVjdG9yOiBWZWN0b3IpID0+IHRoaXMuX2JvYXJkLnNldEJsb2NrT25BcmVhKHZlY3RvciwgbmV3IEVtcHR5QmxvY2spICk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQmxvY2tPbkFyZWEoYmxvY2s6IEJsb2NrLCBibG9ja1Bvc2l0aW9uOiBWZWN0b3JbXSk6IHZvaWQge1xyXG4gICAgICAgIGJsb2NrUG9zaXRpb24uZm9yRWFjaCgodmVjdG9yOiBWZWN0b3IpID0+IHRoaXMuX2JvYXJkLnNldEJsb2NrT25BcmVhKHZlY3RvciwgYmxvY2spKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgdHJ5TW92ZUJsb2NrKGJsb2NrUG9zaXRpb246IFZlY3RvcltdLCBtb3ZlOiBWZWN0b3IpIHtcclxuICAgICAgICBjb25zdCBleHRyZW1lVmVjdG9yczogVmVjdG9yW10gPSBbXTtcclxuICAgICAgICBjb25zdCBzaWV2ZUV4dHJlbWVWZWN0b3JzOiAgKGNvbnRhaW5lcjogVmVjdG9yW10sIHZlY3RvcjogVmVjdG9yKSA9PiB2b2lkID0gKGNvbnRhaW5lciwgdmVjdG9yKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb250YWluZXJWZWN0b3JJbmRleDogbnVtYmVyID0gY29udGFpbmVyLmZpbmRJbmRleCgoY29udGFpbmVyVmVjdG9yOiBWZWN0b3IpID0+IGNvbnRhaW5lclZlY3Rvci55ID09PSB2ZWN0b3IueSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGRvZXNOb3RWZWN0b3JFeGlzdEluQ29udGFpbmVyOiAoaW5kZXg6IG51bWJlcikgPT4gYm9vbGVhbiA9IGluZGV4ID0+IGluZGV4ID09PSAtMTtcclxuICAgICAgICAgICAgY29uc3QgaXNWZWN0b3JGYXZvcmFibGVUaGFuSW5Db250YWluZXI6ICh2ZWN0b3I6IFZlY3RvciwgdmVjdG9ySW5Db250YWluZXI6IFZlY3RvcikgPT4gYm9vbGVhbiA9ICh2ZWN0b3IsIHZlY3RvckluQ29udGFpbmVyKSA9PiBtb3ZlLnggPCAwICYmIHZlY3Rvci54IDwgdmVjdG9ySW5Db250YWluZXIueCB8fCBtb3ZlLnggPiAwICYmIHZlY3Rvci54ID4gdmVjdG9ySW5Db250YWluZXIueDtcclxuICAgIFxyXG4gICAgICAgICAgICBpZihkb2VzTm90VmVjdG9yRXhpc3RJbkNvbnRhaW5lcihjb250YWluZXJWZWN0b3JJbmRleCkpIHtcclxuICAgIFxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnB1c2gobmV3IFZlY3Rvcih2ZWN0b3IueCwgdmVjdG9yLnkpKTtcclxuICAgIFxyXG4gICAgICAgICAgICB9IGVsc2UgaWYoaXNWZWN0b3JGYXZvcmFibGVUaGFuSW5Db250YWluZXIodmVjdG9yLCBjb250YWluZXJbY29udGFpbmVyVmVjdG9ySW5kZXhdKSkge1xyXG4gICAgXHJcbiAgICAgICAgICAgICAgICBjb250YWluZXJbY29udGFpbmVyVmVjdG9ySW5kZXhdLnggPSB2ZWN0b3IueDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgYmxvY2tQb3NpdGlvbi5mb3JFYWNoKCh2ZWN0b3I6IFZlY3RvcikgPT4gc2lldmVFeHRyZW1lVmVjdG9ycyhleHRyZW1lVmVjdG9ycywgdmVjdG9yKSk7XHJcbiAgICAgICAgY29uc3QgbW92ZWRWZWN0b3JzOiBWZWN0b3JbXSA9IGV4dHJlbWVWZWN0b3JzLm1hcCgodmVjdG9yOiBWZWN0b3IpID0+IHZlY3Rvci5wbHVzKG1vdmUpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzUG9zaXRpb25GcmVlKG1vdmVkVmVjdG9ycyk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZnVuY3Rpb24gdGltZXModGltZXM6IG51bWJlciwgZm46IGFueSkge1xyXG4gICAgXHJcbiAgICBsZXQgb3V0cHV0ID0gXCJcIjtcclxuXHJcbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGltZXM7IGkrKykge1xyXG4gICAgICAgICBvdXRwdXQgKz0gZm4oaSk7ICAgXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG91dHB1dDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbVZhbHVlRnJvbUFycmF5KGFycmF5OiBhbnlbXSkgeyBcclxuICAgIHJldHVybiBhcnJheVtNYXRoLmZsb29yKCBNYXRoLnJhbmRvbSgpICogYXJyYXkubGVuZ3RoICldO1xyXG59IiwiZXhwb3J0IGNsYXNzIFZlY3RvciB7XHJcblxyXG4gICAgcHJpdmF0ZSBfeDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfeTogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5feCA9IHg7XHJcbiAgICAgICAgdGhpcy5feSA9IHk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHgoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3g7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHkoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3k7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHgoeDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5feCA9IHg7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHkoeTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5feSA9IHk7XHJcbiAgICB9XHJcblxyXG4gICAgcGx1cyh2ZWN0b3I6IFZlY3Rvcikge1xyXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMuX3ggKyB2ZWN0b3IueCwgdGhpcy5feSArIHZlY3Rvci55KTsgXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KCB0aGlzLl95LnRvU3RyaW5nKCkgKyB0aGlzLl94LnRvU3RyaW5nKCkgKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IERPTSB9IGZyb20gJy4uL2RvbS1lbGVtZW50cy9kb20tZWxlbWVudHMnO1xyXG5pbXBvcnQgeyB0aW1lcyB9IGZyb20gJy4uL3VzZWZ1bC1mdW5jdGlvbnMvdXNlZnVsLWZ1bmN0aW9ucyc7XHJcbmltcG9ydCB7IEJsb2NrLCBFbXB0eUJsb2NrIH0gZnJvbSAnLi4vYmxvY2svYmxvY2snO1xyXG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tICcuLi92ZWN0b3IvdmVjdG9yJztcclxuXHJcbmV4cG9ydCBjbGFzcyBWaWV3IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9nZXRCbG9ja0J5SWQoaWQ6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYmlkLScgKyBpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfYWRkVHlwZVRvQmxvY2soZWw6IEhUTUxFbGVtZW50LCB0eXBlOiBzdHJpbmcpIHtcclxuICAgICAgICBlbC5jbGFzc05hbWUgPSBcImJsb2NrIGJsb2NrX19cIiArIHR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyQXJlYShhcmVhOiBCbG9ja1tdW10pOiB2b2lkIHtcclxuXHJcbiAgICAgICAgbGV0IGlkOiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGNvbnN0IGZsYXR0ZW5lZCA9IGFyZWEucmVkdWNlKCAoc3VtOiBCbG9ja1tdLCB2YWx1ZTogQmxvY2tbXSkgPT4gc3VtLmNvbmNhdCh2YWx1ZSksIFtdICk7XHJcbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gZmxhdHRlbmVkLnJlZHVjZSggKGh0bWw6IHN0cmluZywgYmxvY2s6IEJsb2NrKSA9PiBodG1sICs9IERPTS5ibG9ja1RtcGwoeyB0eXBlOiBibG9jay50eXBlLCBpZDogaWQrKyB9KSwgXCJcIiApO1xyXG5cclxuICAgICAgICBET00uYm9hcmQuaW5uZXJIVE1MID0gb3V0cHV0O1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlckJsb2NrKGJsb2NrVHlwZTogc3RyaW5nLCBibG9ja1Bvc2l0aW9uOiBWZWN0b3JbXSkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGJsb2NrUG9zaXRpb24uZm9yRWFjaCgodmVjdG9yOiBWZWN0b3IpID0+IHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGlkID0gdmVjdG9yLmdldElkKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsID0gdGhpcy5fZ2V0QmxvY2tCeUlkKGlkKTtcclxuICAgICAgICAgICAgdGhpcy5fYWRkVHlwZVRvQmxvY2soZWwsIGJsb2NrVHlwZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iXX0=
