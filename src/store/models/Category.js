import { Model, attr } from 'redux-orm';
import propTypesMixin from 'redux-orm-proptypes';

const ValidatingModel = propTypesMixin(Model);

const NULL_ID = 0;

class Category extends ValidatingModel {
  static nullObject(hasSibling) {
    return {
      id: NULL_ID,
      name: (hasSibling ? '이외 채널' : '전체 채널'),
      hasSibling,
    };
  }

  static get fields() {
    return {
      id: attr(),
      name: attr(),
    };
  }

  static get modelName() {
    return 'Category';
  }

  static isNullObject(category) {
    return category.id === NULL_ID;
  }
}

export default Category;
