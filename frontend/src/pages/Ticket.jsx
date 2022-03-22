import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	getTicket,
	closeTicket,
	editTicket,
	deleteTicket,
} from '../features/tickets/ticketSlice';
import {
	getNotes,
	createNote,
	reset as notesReset,
} from '../features/notes/noteSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { FaPlus, FaEdit, FaSave, FaRegTimesCircle } from 'react-icons/fa';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import NoteItem from '../components/NoteItem';

const customStyles = {
	content: {
		width: '600px',
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		position: 'relative',
	},
};

Modal.setAppElement('#root');

function Ticket() {
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [noteText, setNoteText] = useState('');
	const [edit, setEdit] = useState(false);
	const [product, setProduct] = useState('');
	const [description, setDescription] = useState('');

	const { ticket, isLoading, isError, message } = useSelector(
		(state) => state.tickets
	);
	const { notes, isLoading: notesIsLoading } = useSelector(
		(state) => state.notes
	);

	// const params = useParams();
	const dispatch = useDispatch();
	const { ticketId } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (isError) {
			toast.error(message);
		}

		dispatch(getTicket(ticketId));
		dispatch(getNotes(ticketId));
		// eslint-disable-next-line
	}, [isError, message, ticketId]);

	// Close ticket
	const onTicketClose = () => {
		dispatch(closeTicket(ticketId));
		toast.success('Ticket Closed');
		navigate('/tickets');
	};

	// Open modal
	const openModal = () => {
		setModalIsOpen(true);
	};

	// Close modal
	const closeModal = () => {
		setModalIsOpen(false);
	};

	// Create note submit
	const onNoteSubmit = (e) => {
		e.preventDefault();
		dispatch(createNote({ noteText, ticketId }));
		closeModal();
	};

	// Editing ticket details
	const editDetails = () => {
		setEdit(true);
		setProduct(ticket.product);
		setDescription(ticket.description);
	};

	// Save new ticket details
	const saveTicket = () => {
		dispatch(editTicket({ ticketId, product, description }));
		setEdit(false);
		toast.success('Ticket has been updated');
		window.location.reload();
	};

	// Delete current ticket
	const deleteThisTicket = () => {
		if (
			window.confirm(
				'You are about to delete this ticket. You will not be able to get it back.'
			)
		) {
			dispatch(deleteTicket(ticketId)).then(
				toast.success('Ticket deleted.'),
				navigate('/')
			);
		}
	};

	if (isLoading || notesIsLoading) {
		return <Spinner />;
	}

	if (isError) {
		return <h3>Something Went Wrong</h3>;
	}

	return (
		<div className="ticket-page">
			<header className="ticket-header">
				<BackButton url="/tickets" />
				<h2>
					Ticket ID: {ticket._id}
					<span className={`status status-${ticket.status}`}>
						{ticket.status}
					</span>
				</h2>
				<h3>
					Date Submitted:{' '}
					{new Date(ticket.createdAt).toLocaleString('en-us')}
				</h3>
				<div className="ticket-edit">
					{edit ? (
						<>
							<h3>
								Product:{' '}
								<select
									className="edit-select"
									name="product"
									id="product"
									value={product}
									onChange={(e) => setProduct(e.target.value)}
								>
									<option value="iPhone">iPhone</option>
									<option value="Macbook Pro">
										Macbook Pro
									</option>
									<option value="iMac">iMac</option>
									<option value="iPad">iPad</option>
								</select>
							</h3>

							<div className="flex">
								{ticket.status !== 'closed' && (
									<button
										className="btn-edit"
										onClick={() => saveTicket()}
									>
										<FaSave />
									</button>
								)}
								<button
									className="btn-delete"
									onClick={() => deleteThisTicket()}
								>
									<FaRegTimesCircle />
								</button>
							</div>
						</>
					) : (
						<>
							<h3>Product: {ticket.product}</h3>

							<div className="flex">
								{ticket.status !== 'closed' && (
									<button
										className="btn-edit"
										onClick={() => editDetails()}
									>
										<FaEdit />
									</button>
								)}
								<button
									className="btn-delete"
									onClick={() => deleteThisTicket()}
								>
									<FaRegTimesCircle />
								</button>
							</div>
						</>
					)}
				</div>
				<hr />
				<div className="ticket-desc">
					<h3>Description of Issue</h3>
					{edit ? (
						<textarea
							name="description"
							id="description"
							className="edit-description"
							placeholder={description}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						></textarea>
					) : (
						<p>{ticket.description}</p>
					)}
				</div>
				<h2>Notes</h2>
			</header>

			{ticket.status !== 'closed' && (
				<button onClick={openModal} className="btn">
					<FaPlus />
					Add Note
				</button>
			)}

			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				style={customStyles}
				contentLabel="Add Note"
			>
				<h2>Add Note</h2>
				<button className="btn-close" onClick={closeModal}>
					X
				</button>
				<form onSubmit={onNoteSubmit}>
					<div className="form-group">
						<textarea
							name="noteText"
							id="noteText"
							value={noteText}
							className="form-control"
							placeholder="Note Text"
							onChange={(e) => setNoteText(e.target.value)}
						></textarea>
					</div>
					<div className="form-group">
						<button className="btn" type="Submit">
							Submit
						</button>
					</div>
				</form>
			</Modal>

			{notes.map((note) => (
				<NoteItem key={note._id} note={note} />
			))}

			{ticket.status !== 'closed' && (
				<button
					onClick={onTicketClose}
					className="btn btn-block btn-danger"
				>
					Close Ticket
				</button>
			)}
		</div>
	);
}

export default Ticket;
