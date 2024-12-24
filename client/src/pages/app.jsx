import ShowTodo from './showTodo'
import Header from '../component/header'
import Search from './search';
import Create from './create';

const App = () => {

  return (
    <div className="bg-background">
      <Header/>
      <Search/>
      <Create/>
      <ShowTodo/>
    </div>
  )
}

export default App
