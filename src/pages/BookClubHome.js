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

import SearchPage from "./SearchPage";
import NewPostForm from "../components/NewPostForm";
import PostsList from "../components/PostsList";
import DeleteModal from "./css-components/DeleteBookCubModal";
import NoBookAlert from "./css-components/NoBookAlert";
import BookCard from "./css-components/BookCard";

import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";

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
			// if no bookclub doc data found in db, navigate home and return to stop onSnapshot listener
			if (!data) {
				navigate("/");
				return;
			}
			setBookClub(data);
			// console.log(typeof currentBookClub);

			if (data.currentbook) {
				const bookData = data.currentbook;
				setBook(bookData);
			}
		});
		// Stop listening to changes
		return unsubscribe;
	}, []);

	// DELETE
	const deleteBookClub = async (id) => {
		console.log("calling deleteBookClub");
		const bookClubDoc = doc(db, "bookclubs", id);
		await deleteDoc(bookClubDoc);
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
		console.log("calling findBook");
		setSearchState(!searchState);
	};

	// conditionals: Home vs <SearchPage/>
	if (searchState) {
		return (
			<SearchPage
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
					<>
						<BookCard currentBook={currentBook} />
					</>

					<Button
						onClick={() => deleteCurrentBook()}
						variant="warning"
					>
						Delete book
					</Button>

					<>
						{/* POSTS FEATURE */}
						<h2>Comments</h2>
						<NewPostForm addPost={addPost} />

						{/* READ POSTS */}
						<h2>Showing {postsData.length} Comments</h2>
						<PostsList postsData={postsData} />
					</>

					<>
						<DeleteModal
							bookclubid={bookclubid}
							currentBookClub={currentBookClub}
							deleteBookClub={deleteBookClub}
							showDeleteModal={showDeleteModal}
							handleClose={handleClose}
							handleShow={handleShow}
						/>
					</>
				</div>
			);
		} else {
			return (
				<div>
					<h2>{currentBookClub.name} NEW BOOK CLUB HOME PAGE</h2>
					<p>Book Club Name: {currentBookClub.name}</p>
					<p>Book Club ID: {bookclubid}</p>

					<>
						<NoBookAlert findBook={findBook} />
					</>

					<>
						<DeleteModal
							bookclubid={bookclubid}
							currentBookClub={currentBookClub}
							deleteBookClub={deleteBookClub}
							showDeleteModal={showDeleteModal}
							handleClose={handleClose}
							handleShow={handleShow}
						/>
					</>
				</div>
			);
		}
	}
}

export default BookClubHome;
