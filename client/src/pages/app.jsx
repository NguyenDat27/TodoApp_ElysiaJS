import ShowTodo from './showTodo'
import Header from '../component/header'
import SearchByTitle from './search';
import Create from './create';
import TodoStatusFilter from './checkbox';
import ProgressCircle from './percent';

const App = () => {

  return (
    <div className="bg-background">
      <Header/>
      <ProgressCircle/>
      <SearchByTitle/>
      <TodoStatusFilter/>
      <Create/>
      <ShowTodo/>
    </div>
  )
}

export default App
