import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";

import { app, db } from "../firebase-config";
import { doc, setDoc } from "firebase/firestore";

// Components
import BookResList from "../components/BookResList";
// import { Footer } from "./css-components/Footer";

// SEARCH BOOK feature
function SearchPage({
	bookclubid,
	bookclubName,
	uid,
	findBook,
	currentBookClubUid,
}) {
	let navigate = useNavigate();

	const bookclubRef = doc(db, "bookclubs", bookclubid);

	const [bookQuery, setBookQuery] = useState("");
	const [searchResults, setResults] = useState([]);

	const URL =
		"https://www.googleapis.com/books/v1/volumes?q=" +
		bookQuery +
		"&fields=items(id, volumeInfo/title, volumeInfo/authors, volumeInfo/description, volumeInfo/publishedDate, volumeInfo/imageLinks/thumbnail)&maxResults=40";

	const handleChange = (event) => {
		const query = event.target.value;
		setBookQuery(query);
	};

	const searchBook = (event) => {
		event.preventDefault();
		axios
			.get(URL)
			.then((response) => {
				const booksAPIResCopy = response.data.items.map((book) => {
					return {
						bookApiID:
							book.id === undefined
								? "No bookApiID from response"
								: book.id,
						cover:
							book.volumeInfo.imageLinks === undefined
								? ""
								: book.volumeInfo.imageLinks.thumbnail,
						title: book.volumeInfo.title,
						authors:
							book.volumeInfo.authors === undefined
								? "No authors data availabl"
								: book.volumeInfo.authors.join(", "),
						description:
							book.volumeInfo.description === undefined
								? "No book description available."
								: book.volumeInfo.description,
						publishedDate:
							book.volumeInfo.publishedDate === undefined
								? "No published data available"
								: book.volumeInfo.publishedDate,
					};
				});

				setResults(booksAPIResCopy);
			})
			.catch((error) => {
				console.log(error);
				alert(error.message);
			});
	};

	const getSelectedBook = (bookApiID) => {
		let book = {};
		for (let result of searchResults) {
			if (result.bookApiID === bookApiID) {
				book = result;
			}
		}
		return book;
	};

	const addBook = async (bookApiID) => {
		const bookToAdd = getSelectedBook(bookApiID);
		await setDoc(bookclubRef, {
			name: bookclubName,
			uid: uid,
			currentbook: bookToAdd,
		});
		findBook();
		navigate(`/bookclubhome/${bookclubid}`);
	};

	return (
		<div>
			<h4 className="display-4 text-center m-3">Search Book</h4>
			<form
				onSubmit={searchBook}
				className="row justify-content-center m-4 p-3"
			>
				<input
					onChange={handleChange}
					type="text"
					placeholder="Find Book..."
					className="col-10 rounded-pill border border-2 m-4 p-2"
				/>
				<Button type="submit" className="col-2">
					Search
				</Button>
			</form>

			<h6 className="display-6 text-center">Results</h6>
			<div className="container">
				<BookResList
					searchResults={searchResults}
					addBook={addBook}
					currentBookClubUid={currentBookClubUid}
				></BookResList>
			</div>
			{/* <Footer></Footer> */}
		</div>
	);
}

SearchPage.propTypes = {
	bookclubid: PropTypes.string.isRequired,
	bookclubName: PropTypes.string.isRequired,
	findBook: PropTypes.func.isRequired,
};

export default SearchPage;
