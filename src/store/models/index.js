import Group from './Group';
import Channel from './Channel';
import Category from './Category';

import { ORM } from 'redux-orm';

const orm = new ORM();
orm.register(Group, Channel, Category);

export default orm;
