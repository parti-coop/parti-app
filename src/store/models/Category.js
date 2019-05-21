import { PropTypes } from 'React';
import { Model, fk, many, attr } from 'redux-orm';
import propTypesMixin from 'redux-orm-proptypes';

const ValidatingModel = propTypesMixin(Model);

class Category extends ValidatingModel {
  static get fields() {
    return {
      id: attr(),
      name: attr(),
    }
  }

  static get modelName() {
    return 'Category';
  }

  static reducer(action, Category, session) {
  }
}

export default Category;
