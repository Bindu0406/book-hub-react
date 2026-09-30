/* eslint-disable react/no-unknown-property */
import {Link} from 'react-router-dom'
import {BsFillStarFill} from 'react-icons/bs'
import './index.css'

const BookItem = props => {
  const {bookDetails} = props
  const {id, title, readStatus, rating, authorName, coverPic} = bookDetails

  return (
    <li className="book-item" testid="bookItem">
      <Link to={`/books/${id}`} className="book-item-link">
        <img src={coverPic} alt={title} className="book-item-image" />
        <div className="book-item-details">
          <h1 className="book-item-title">{title}</h1>
          <p className="book-item-author">{authorName}</p>
          <div className="book-item-rating-container">
            <p className="book-item-avg-rating-text">Avg Rating</p>
            <BsFillStarFill className="book-item-star-icon" />
            <p className="book-item-rating">{rating}</p>
          </div>
          <div className="status-row">
            <p className="book-item-status-label">Status</p>
            <p className="status-highlight">{readStatus}</p>
          </div>
        </div>
      </Link>
    </li>
  )
}

export default BookItem
