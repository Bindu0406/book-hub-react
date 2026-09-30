/* eslint-disable react/no-unknown-property */
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsFillStarFill} from 'react-icons/bs'

import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class BookDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    bookDetailsData: {},
  }

  componentDidMount() {
    this.getBookDetails()
  }

  getBookDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/book-hub/books/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const bookData = data.book_details
      const formattedData = {
        id: bookData.id,
        authorName: bookData.author_name,
        coverPic: bookData.cover_pic,
        aboutBook: bookData.about_book,
        rating: bookData.rating,
        readStatus: bookData.read_status,
        title: bookData.title,
        aboutAuthor: bookData.about_author,
      }
      this.setState({
        bookDetailsData: formattedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickRetry = () => {
    this.getBookDetails()
  }

  renderLoadingView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#0284C7" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="details-failure-view-container">
      <img
        src="https://res.cloudinary.com/dkxxgpfd8/image/upload/v1647087076/Group_7522_failure_image_desktop_fuh21r.png"
        alt="failure view"
        className="details-failure-image"
      />
      <p className="details-failure-heading">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        className="details-retry-btn"
        onClick={this.onClickRetry}
      >
        Try Again
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {bookDetailsData} = this.state
    const {
      title,
      coverPic,
      authorName,
      rating,
      readStatus,
      aboutAuthor,
      aboutBook,
    } = bookDetailsData

    return (
      <div className="book-details-card">
        <div className="book-primary-info">
          <img src={coverPic} alt={title} className="book-detail-cover-pic" />
          <div className="book-titles-box">
            <h1 className="book-title">{title}</h1>
            <p className="book-author">{authorName}</p>
            <div className="book-rating-box">
              <p className="avg-rating-text">Avg Rating</p>
              <BsFillStarFill className="star-icon" />
              <p className="book-rating-val">{rating}</p>
            </div>
            <p className="book-status-text">
              Status: <span className="status-span">{readStatus}</span>
            </p>
          </div>
        </div>
        <hr className="details-divider" />
        <div className="book-about-section">
          <h1 className="about-heading">About Author</h1>
          <p className="about-description">{aboutAuthor}</p>
          <h1 className="about-heading">About Book</h1>
          <p className="about-description">{aboutBook}</p>
        </div>
      </div>
    )
  }

  renderBookDetailsContent = () => {
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
      <div className="book-details-route-container">
        <Header activeTab="" />
        <div className="book-details-content-wrapper">
          {this.renderBookDetailsContent()}
        </div>
        <Footer />
      </div>
    )
  }
}

export default BookDetails
