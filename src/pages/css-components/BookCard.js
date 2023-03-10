import PropTypes from "prop-types";
import { useState, useContext } from "react";
import { UserContext } from "../../UserContext";

import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Card, Modal } from "react-bootstrap";

const BookCard = ({ currentBook, deleteCurrentBook, currentBookClubUid }) => {
	const { user } = useContext(UserContext);
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	return (
		<div style={{ marginTop: "20px" }}>
			<Card style={{ width: "18rem", height: "40rem" }}>
				<Card.Img
					src={currentBook.cover}
					alt={currentBook.title}
					style={{ height: "20rem" }}
				/>
				<Card.Body>
					<Card.Title>{currentBook.title}</Card.Title>
					<Card.Text>
						<strong>Author: </strong>
						<p className="text-muted">{currentBook.authors}</p>
					</Card.Text>
					<Card.Text>
						{" "}
						<strong>Description </strong>
						<p className="text-muted">
							{currentBook.description.slice(0, 100)} ...{" "}
							<Card.Link href="#" onClick={handleShow}>
								see more
							</Card.Link>
						</p>
					</Card.Text>

					{user && currentBookClubUid === user.uid && (
						<Button
							onClick={() => deleteCurrentBook()}
							variant="warning"
						>
							Delete book
						</Button>
					)}
				</Card.Body>
			</Card>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>{currentBook.title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Card.Img
						src={currentBook.cover}
						alt={
							currentBook.title ||
							"Title and book cover information unavaible"
						}
						style={{ height: "220px", width: "180px" }}
					/>
					<p>
						<strong>Author(s):</strong> {currentBook.authors}
					</p>
					<p>
						<strong>Description</strong> <br></br>
						{currentBook.description}
					</p>
					<p>
						<strong>Published: </strong>
						{currentBook.publishedDate}
					</p>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

BookCard.propTypes = {
	currentBook: PropTypes.object.isRequired,
};

export default BookCard;
