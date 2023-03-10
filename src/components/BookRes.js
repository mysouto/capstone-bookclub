import PropTypes from "prop-types";
import { useState, useContext } from "react";
import { UserContext } from "../UserContext";

import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";

const BookRes = ({
	bookApiID,
	title,
	cover,
	authors,
	description,
	publishedDate,
	addBook,
	currentBookClubUid,
}) => {
	const { user } = useContext(UserContext);
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<div className="col mt-5">
			<Card style={{ width: "18rem", height: "40rem" }}>
				<Card.Img
					src={cover}
					alt={title}
					variant="top"
					style={{ height: "20rem" }}
				/>
				<Card.Body>
					<Card.Title>{title}</Card.Title>
					<Card.Text style={{ fontSize: "1rem" }}>
						Author(s): {authors}
					</Card.Text>
					<Card.Text>
						Description: {description.slice(0, 100)}...{" "}
						<Card.Link href="#" onClick={handleShow}>
							see more
						</Card.Link>
					</Card.Text>
					{user && currentBookClubUid === user.uid && (
						<Button
							variant="primary"
							onClick={() => addBook(bookApiID)}
						>
							Add Book
						</Button>
					)}

					<Modal show={show} onHide={handleClose}>
						<Modal.Header closeButton>
							<Modal.Title>{title}</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Card.Img
								src={cover}
								alt={title}
								style={{ height: "220px", width: "180px" }}
							/>
							<p>
								<strong>Author(s):</strong> {authors}
							</p>
							<p>
								<strong>Description</strong> <br></br>
								{description}
							</p>
							<p>
								<strong>Published: </strong>
								{publishedDate}
							</p>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={handleClose}>
								Close
							</Button>
							<Button
								variant="primary"
								onClick={() => addBook(bookApiID)}
							>
								Add Book to Club
							</Button>
						</Modal.Footer>
					</Modal>
				</Card.Body>
			</Card>
		</div>
	);
};

BookRes.propTypes = {
	bookApiID: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	cover: PropTypes.string.isRequired,
	authors: PropTypes.string.isRequired,
	addBook: PropTypes.func.isRequired,
};

export default BookRes;
