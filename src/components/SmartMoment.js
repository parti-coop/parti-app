import React from 'react';
import { Text } from 'native-base';

import moment from 'moment';
import Moment from 'react-moment';
import 'moment/locale/ko';

const SmartMoment = (props) => {
  let { date } = props;
  date = date || props.children;
  const datetime = moment(date, null, 'ko');
  const threeDaysAgo = moment().subtract(3, 'days');

  return (
    <Moment
      element={Text}
      format="YYYY.MM.DD"
      fromNow={moment(datetime).isAfter(threeDaysAgo)}
      locale="ko"
      {...props}
    >
      {props.children}
    </Moment>
  );
};

export default SmartMoment;
