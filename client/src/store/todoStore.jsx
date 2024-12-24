import createStore from 'teaful';

export const { useStore: useTodo } = createStore({
    todos: [],
    keyword: "",
    completed: 2,
});
