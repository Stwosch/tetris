import { Model } from './model/model';
import { View } from './view/view';
import { Controller } from './controller/controller';

const controller = new Controller(new Model, new View);
controller.init();
