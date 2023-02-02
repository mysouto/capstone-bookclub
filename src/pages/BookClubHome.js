import { React, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase-config";
import {
	addDoc,
	collection,
	deleteDoc,
	deleteField,
	doc,
	getDocs,
	onSnapshot,
	query,
	updateDoc,
	where,
} from "firebase/firestore";

import "bootstrap/dist/css/bootstrap.min.css";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import SearchForm from "../components/SearchForm";
import NewPostForm from "../components/NewPostForm";
import PostsList from "../components/PostsList";

function BookClubHome() {
	let { bookclubid } = useParams();
	let navigate = useNavigate();

	const bookclubRef = doc(db, "bookclubs", bookclubid);
	const postsRef = collection(db, "posts");

	const [currentBookClub, setBookClub] = useState([]);
	const [currentBook, setBook] = useState([]);
	const [postsData, setPostsData] = useState([]);
	const [searchState, setSearchState] = useState(false);
	const [showDeleteModal, setDeleteModal] = useState(false);

	// delete modal
	const handleClose = () => setDeleteModal(false);
	const handleShow = () => setDeleteModal(true);

	useEffect(() => {
		const unsubscribe = onSnapshot(bookclubRef, (response) => {
			const data = response.data();
			setBookClub(data);
			if (data.currentbook) {
				const bookData = data.currentbook;
				setBook(bookData);
			}
		});
		return unsubscribe;
	}, []);

	// DELETE
	const deleteBookClub = async (id) => {
		console.log("calling deleteBookClub");
		const bookClubDoc = doc(db, "bookclubs", id);
		await deleteDoc(bookClubDoc);
		navigate("/");
	};

	const deleteCurrentBook = async (id) => {
		console.log("calling deleteBook");
		await updateDoc(bookclubRef, { currentbook: deleteField() });
	};

	// FEATURE: ADD POST TO DB
	const addPost = async (postText) => {
		console.log("calling addPost");

		await addDoc(postsRef, {
			text: postText,
			bookclubID: bookclubid,
			// bookclubID: currentBookClub.id,
			bookID: currentBook.bookApiID,
		});
	};

	// FEATURE: READ POSTS COLLECTION DB
	const postsQuery = query(
		collection(db, "posts"),
		where("bookclubID", "==", bookclubid)
	);

	useEffect(() => {
		const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
			setPostsData(
				querySnapshot.docs.map((doc) => ({
					// doc.data() is never undefined for query doc snapshots
					...doc.data(),
					id: doc.id,
				}))
			);
		});
		return unsubscribe;
	}, []);

	// CALLBACK FOR FIND BOOK BUTTON
	const findBook = () => {
		console.log("caklling findBook");
		setSearchState(!searchState);
	};

	// conditionals: Home vs <SearchPage/>
	if (searchState) {
		return (
			<SearchForm
				bookclubid={bookclubid}
				bookclubName={currentBookClub.name}
				findBook={findBook}
			/>
		);
	} else {
		if (currentBookClub.currentbook) {
			return (
				<div>
					{/* <h1>{currentBookClub.name} BOOK CLUB HOME PAGE</h1> */}
					<h2>Welcome to your {currentBookClub.name} Book Club!</h2>
					<p>Book Club Name: {currentBookClub.name}</p>
					<p>Book Club ID: {bookclubid}</p>

					<h3>Reading Now</h3>
					<Card style={{ width: "16rem" }}>
						<Card.Img
							src={currentBook.cover}
							alt={currentBook.title}
						/>
						<Card.Body>
							<Card.Title>{currentBook.title}</Card.Title>
							<Card.Text>Author: {currentBook.authors}</Card.Text>
							<Card.Text>Description</Card.Text>
						</Card.Body>
					</Card>

					<Button
						onClick={() => deleteCurrentBook()}
						variant="warning"
					>
						Delete book
					</Button>

					<div>
						{/* POSTS FEATURE */}
						<h2>Comments</h2>
						<NewPostForm addPost={addPost} />

						{/* READ POSTS */}
						<h2>Showing {postsData.length} Comments</h2>
						{/* <postsData> */}
						<PostsList postsData={postsData} />
					</div>

					<h3>Danger Zone</h3>
					<Button variant="danger" onClick={handleShow}>
						Delete Book Club modal
					</Button>
					<Modal show={showDeleteModal} onHide={handleClose}>
						<Modal.Header closeButton>
							<Modal.Title>
								Delete {currentBookClub.name} Book Club
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							Are you sure you wanna delete this Book Club?
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={handleClose}>
								Close
							</Button>
							<Button
								variant="danger"
								onClick={() => {
									deleteBookClub(bookclubid);
								}}
							>
								Delete Book Club
							</Button>
						</Modal.Footer>
					</Modal>
					{/* <Button
						onClick={() => {
							deleteBookClub(bookclubid);
						}}
					>
						Delete book club
					</Button> */}
				</div>
			);
		} else {
			return (
				<div>
					<h2>{currentBookClub.name} NEW BOOK CLUB HOME PAGE</h2>
					<p>Book Club Name: {currentBookClub.name}</p>
					<p>Book Club ID: {bookclubid}</p>
					<div>
						<p>No books yet :(</p>
						<p>Get started here!</p>
						<Button onClick={findBook}>Find Book</Button>
					</div>

					<h3>Danger Zone</h3>
					<Button variant="danger" onClick={handleShow}>
						Delete Book Club modal
					</Button>
					<Modal show={showDeleteModal} onHide={handleClose}>
						<Modal.Header closeButton>
							<Modal.Title>
								Delete {currentBookClub.name} Book Club
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							Are you sure you wanna delete this Book Club?
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={handleClose}>
								Close
							</Button>
							<Button
								variant="danger"
								onClick={() => {
									deleteBookClub(bookclubid);
								}}
							>
								Delete Book Club
							</Button>
						</Modal.Footer>
					</Modal>
					{/* <Button
						onClick={() => {
							deleteBookClub(bookclubid);
						}}
						variant="danger"
					>
						Delete book club
					</Button> */}
				</div>
			);
		}
	}
}

export default BookClubHome;
