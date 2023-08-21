import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Login } from './Components/Login';
import { Dashboard } from './Components/dashboard/Dashboard';
import axios from "axios"
import { useState } from 'react';
function App() {

const [userInfo, setUserInfo] = useState()
const [error, setError] = useState()
const [loading, setLoading] = useState()

  return (
       <Router>
      <Switch>

      <Route
        exact
        path="/"
        render={(props) => (
          <Login
            {...props}
            error={error}
            setError={setError}
            loading={loading}
            setLoading={setLoading}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
          />
        )}
      />
    <Route
        exact
        path="/dashboard"
        render={(props) => (
          <Dashboard
            {...props}
            error={error}
            setError={setError}
            loading={loading}
            setLoading={setLoading}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
          />
        )}
      />
      </Switch>
    </Router>
  );
}

export default App;
