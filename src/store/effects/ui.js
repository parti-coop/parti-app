export const uiShowError = (err) => {
  return (dispatch, getState) => {
    try {
      //alert('오류', err?.message || '앗! 뭔가 잘못되었습니다. 잠시 후에 다시 시도해 주세요!');
    } catch(ignore) { /* ignore */ }
  };
};
