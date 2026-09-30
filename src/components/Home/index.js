/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'

import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const sliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
}

class Home extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    topRatedBooks: [],
  }

  componentDidMount() {
    this.getTopRatedBooks()
  }

  getTopRatedBooks = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/book-hub/top-rated-books'
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
        authorName: eachBook.author_name,
        coverPic: eachBook.cover_pic,
        title: eachBook.title,
      }))
      this.setState({
        topRatedBooks: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickRetry = () => {
    this.getTopRatedBooks()
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="home-failure-view-container">
      <img
        src="https://res.cloudinary.com/dkxxgpfd8/image/upload/v1647087076/Group_7522_failure_image_desktop_fuh21r.png"
        alt="failure view"
        className="home-failure-image"
      />
      <p className="home-failure-heading">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        className="home-retry-btn"
        onClick={this.onClickRetry}
      >
        Try Again
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {topRatedBooks} = this.state

    return (
      <ul className="slider-wrapper">
        <Slider {...sliderSettings}>
          {topRatedBooks.map(eachBook => {
            const {id, coverPic, title, authorName} = eachBook
            return (
              <li className="slick-item" key={id}>
                <Link to={`/books/${id}`} className="slick-link">
                  <img
                    src={coverPic}
                    alt={title}
                    className="slick-book-image"
                  />
                  <h1 className="slick-book-title">{title}</h1>
                  <p className="slick-book-author">{authorName}</p>
                </Link>
              </li>
            )
          })}
        </Slider>
      </ul>
    )
  }

  renderHomeView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-route-container">
        <Header activeTab="Home" />
        <div className="home-body-content">
          <div className="home-text-container">
            <h1 className="home-heading">Find Your Next Favorite Books?</h1>
            <p className="home-description">
              You are in the right place. Tell us what titles or genres you have
              enjoyed in the past, and we will give you surprisingly insightful
              recommendations.
            </p>
            <Link to="/shelf" className="find-books-link">
              <button type="button" className="find-books-btn">
                Find Books
              </button>
            </Link>
          </div>
          <div className="top-rated-books-container">
            <div className="top-rated-header-container">
              <h1 className="top-rated-heading">Top Rated Books</h1>
            </div>
            {this.renderHomeView()}
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Home
