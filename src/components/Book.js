import PropTypes from "prop-types";

import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

const Book = ({ bookApiID, title, cover, authors, addBook }) => {
	return (
		<Card style={{ width: "18rem" }}>
			<Card.Img src={cover} alt={title} />
			<Card.Body>
				<Card.Title>{title}</Card.Title>
				<Card.Text>Authors: {authors}</Card.Text>
				<Card.Text>Description</Card.Text>
				<Button variant="primary" onClick={() => addBook(bookApiID)}>
					Add Book
				</Button>
			</Card.Body>
		</Card>
	);
};

Book.propTypes = {
	bookApiID: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	cover: PropTypes.string.isRequired,
	authors: PropTypes.array.isRequired,
	addBook: PropTypes.func,
};

export default Book;
