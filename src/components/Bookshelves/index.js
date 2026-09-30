/* eslint-disable react/no-unknown-property */
/* eslint-disable react/destructuring-assignment */
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import Footer from '../Footer'
import BookItem from '../BookItem'
import './index.css'

const defaultBookshelvesList = [
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

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Bookshelves extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    booksData: [],
    activeFilter: 'ALL',
    activeFilterLabel: 'All',
    searchInput: '',
    searchText: '',
  }

  componentDidMount() {
    this.getBooks()
  }

  getBooks = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {activeFilter, searchInput} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/book-hub/books?shelf=${activeFilter}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.books.map(eachBook => ({
        id: eachBook.id,
        title: eachBook.title,
        readStatus: eachBook.read_status,
        rating: eachBook.rating,
        authorName: eachBook.author_name,
        coverPic: eachBook.cover_pic,
      }))
      this.setState({
        booksData: updatedData,
        searchText: searchInput,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSearch = () => {
    this.getBooks()
  }

  onKeyDownSearch = event => {
    if (event.key === 'Enter') {
      this.getBooks()
    }
  }

  onClickRetry = () => {
    this.getBooks()
  }

  onClickTab = (value, label) => {
    this.setState(
      {activeFilter: value, activeFilterLabel: label},
      this.getBooks,
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="bookshelves-failure-container">
      <img
        src="https://res.cloudinary.com/dkxxgpfd8/image/upload/v1647087076/Group_7522_failure_image_desktop_fuh21r.png"
        alt="failure view"
        className="failure-image"
      />
      <p className="failure-heading">Something went wrong. Please try again</p>
      <button type="button" className="retry-btn" onClick={this.onClickRetry}>
        Try Again
      </button>
    </div>
  )

  renderNoBooksView = () => {
    const {searchText} = this.state
    return (
      <div className="no-books-container">
        <img
          src="https://res.cloudinary.com/dkxxgpfd8/image/upload/v1647087076/Asset_1_72x_no_books_desktop_qjrvs1.png"
          alt="no books"
          className="no-books-image"
        />
        <p className="no-books-heading">
          Your search for {searchText} did not find any matches.
        </p>
      </div>
    )
  }

  renderBooksListView = () => {
    const {booksData} = this.state
    if (booksData.length === 0) {
      return this.renderNoBooksView()
    }

    return (
      <ul className="books-list">
        {booksData.map(eachBook => (
          <BookItem key={eachBook.id} bookDetails={eachBook} />
        ))}
      </ul>
    )
  }

  renderBooksView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderBooksListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {bookshelvesList} = this.props
    const shelvesList = bookshelvesList || defaultBookshelvesList
    const {activeFilter, activeFilterLabel, searchInput} = this.state

    return (
      <div className="bookshelves-route-container">
        <Header activeTab="Bookshelves" />
        <div className="bookshelves-content-container">
          <div className="bookshelves-sidebar">
            <h1 className="sidebar-heading">Bookshelves</h1>
            <ul className="sidebar-list">
              {shelvesList.map(eachShelf => {
                const isActive = eachShelf.value === activeFilter
                const tabBtnClassName = isActive
                  ? 'sidebar-btn active-tab'
                  : 'sidebar-btn'
                return (
                  <li key={eachShelf.id} className="sidebar-item">
                    <button
                      type="button"
                      className={tabBtnClassName}
                      onClick={() =>
                        this.onClickTab(eachShelf.value, eachShelf.label)
                      }
                    >
                      {eachShelf.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="bookshelves-books-section">
            <div className="bookshelves-header">
              <h1 className="books-shelf-title">{activeFilterLabel} Books</h1>
              <div className="search-input-container">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search"
                  value={searchInput}
                  onChange={this.onChangeSearchInput}
                  onKeyDown={this.onKeyDownSearch}
                />
                <button
                  type="button"
                  className="search-btn"
                  testid="searchButton"
                  onClick={this.onSearch}
                >
                  <BsSearch className="search-icon" />
                </button>
              </div>
            </div>

            {this.renderBooksView()}
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Bookshelves
