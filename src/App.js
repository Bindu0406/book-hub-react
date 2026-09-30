import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Bookshelves from './components/Bookshelves'
import BookDetails from './components/BookDetails'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

import './App.css'

const bookshelvesList = [
  {
    id: '22526c8e-680e-4419-a041-b05cc239ece4',
    value: 'ALL',
    label: 'All',
  },
  {
    id: '37e09397-fab2-46f4-9b9a-66b2324b2e22',
    value: 'READ',
    label: 'Read',
  },
  {
    id: '2ab42512-3d0d-4b17-817f-8a90c1450eb9',
    value: 'CURRENTLY_READING',
    label: 'Currently Reading',
  },
  {
    id: 'd107f65e-546a-4601-906a-35073e72dc29',
    value: 'WANT_TO_READ',
    label: 'Want to Read',
  },
]

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/login" component={LoginForm} />
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute
          exact
          path="/shelf"
          render={props => (
            <Bookshelves {...props} bookshelvesList={bookshelvesList} />
          )}
        />
        <ProtectedRoute exact path="/books/:id" component={BookDetails} />
        <Route path="/not-found" component={NotFound} />
        <Redirect to="/not-found" />
      </Switch>
    )
  }
}

export default App
