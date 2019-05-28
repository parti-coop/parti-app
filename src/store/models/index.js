import Group from './Group';
import Channel from './Channel';
import Category from './Category';
import Post from './Post';
import User from './User';

import { ORM } from 'redux-orm';

const orm = new ORM();
orm.register(Group, Channel, Category, Post, User);

export default orm;