import { Model } from './model';
import { View } from './view';
import { Controller } from './controller';

const controller = new Controller(new Model, new View);
controller.init();
