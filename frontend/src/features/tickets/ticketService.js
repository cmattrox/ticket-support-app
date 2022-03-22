import axios from 'axios';

const API_URL = '/api/tickets/';

// Create new ticket
const createTicket = async (ticketData, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.post(API_URL, ticketData, config);

	return response.data;
};

// Get user tickets
const getTickets = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(API_URL, config);

	return response.data;
};

// Get user ticket
const getTicket = async (ticketId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.get(API_URL + ticketId, config);

	return response.data;
};

// Close ticket
const closeTicket = async (ticketId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.put(
		API_URL + ticketId,
		{ status: 'closed' },
		config
	);

	return response.data;
};

// Delete ticket
const deleteTicket = async (ticketId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.delete(API_URL + ticketId, config);

	return response.data;
};

// Edit ticket
const editTicket = async (ticketData, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	const response = await axios.put(
		API_URL + ticketData.ticketId,
		ticketData,
		config
	);

	return response.data;
};

const ticketService = {
	createTicket,
	getTickets,
	getTicket,
	closeTicket,
	editTicket,
	deleteTicket,
};

export default ticketService;
