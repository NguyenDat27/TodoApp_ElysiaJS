import createStore from 'teaful';

export const { useStore: useTodo } = createStore({
    todos: [],
    keyword: "",
    percent: 0,
});
