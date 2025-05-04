import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Routers from './routes/Routers';


function App() {
  return (
    <Router>
      <div className="App">
          <Routers />  
      </div>
    </Router>
  );
}

export default App;
