export const editorModel = {
  state: {
    categories: [{src:null,name:'empty image'}],
    matrix: [[-1]],
    copyCategory: -1
  },
  reducers: {
    setSize(state, payload) {
      let { x, y } = payload;
      let matrix = [];
      for (let i = 0; i < x; i++) {
        let col = [];
        for (let j = 0; j < y; j++) {
          col.push(-1);
        }
        matrix.push(col);
      }
      return { ...state, matrix };
    },
    setCategory(state, payload) {
      let { x, y, category } = payload;
      let { matrix } = state;
      matrix[x][y] = category;
      return { ...state, matrix };
    },
    clearCategory(state, payload) {
      let { x, y } = payload;
      let { matrix } = state;
      matrix[x][y] = -1;
      return { ...state, matrix };
    },
    copyCategory(state, payload) {
      let { x, y } = payload;
      let { matrix } = state;
      let copyCategory = matrix[x][y];
      return { ...state, copyCategory };
    },
    pasteCategory(state, payload) {
      let { x, y } = payload;
      let { matrix, copyCategory } = state;
      matrix[x][y] = copyCategory;
      return { ...state, matrix };
    },
    addCategory(state, payload) {
      let { categories } = state;
      categories.push(payload);
      return { ...state, categories };
    },
    deleteCategory(state, payload) {
      if(payload===0){
        return {...state};
      }
      let { categories } = state;
      categories = categories.filter((v, i) => i !== payload);
      return { ...state, categories };
    }
  },
  effects: dispatch => ({
    // handle state changes with impure functions.
    // use async/await for async actions
    async incrementAsync(payload, rootState) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      dispatch.count.increment(payload);
    }
  })
};
