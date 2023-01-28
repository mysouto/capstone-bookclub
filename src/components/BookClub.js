import PropTypes from "prop-types";

function BookClub({ bookClubID, name, currentBook, deleteBookClub }) {
	return (
		<div>
			<p>Book Club: {name} </p>
			{/* <p>ID {bookClubID}</p> */}
			<p>Current Book ID: {currentBook}</p>

			<button
				onClick={() => {
					deleteBookClub(bookClubID);
				}}
			>
				Delete book club
			</button>
		</div>
	);
}

BookClub.propTypes = {
	bookClubID: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	deleteBookClub: PropTypes.func.isRequired,
};

export default BookClub;
