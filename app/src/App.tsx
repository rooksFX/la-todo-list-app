import RoutesWrapper from './views/routes_wrapper/RoutesWrapper';
import './App.scss';
import './common.scss';
import { AppProvider } from './context/State';

const App = () => {
  // This component will hold the Context
  return (
    <div id="app">
      <AppProvider>
        <RoutesWrapper />
      </AppProvider>
    </div>
  )
}

export default App