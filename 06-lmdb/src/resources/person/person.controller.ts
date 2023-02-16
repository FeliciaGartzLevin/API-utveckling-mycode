import { Request, Response } from 'express'
import Debug from 'debug'
import { Movie } from '../movie/movie.model'
import { Person } from './person.model'
import mongoose from 'mongoose'

const debug = Debug('lmdb:person.controller')

/**
 * Get all people
 */
export const index = async (req: Request, res: Response) => {
	try {
		// Find all people
		const people = await Person.find()

		res.send({
			status: "success",
			data: people,
		})

	} catch (err) {
		debug("Error thrown when finding people", err)
		res.status(500).send({ status: "error", message: "Error thrown when finding people" })
	}
}

/**
 * Get a person
 *
 * GET /people/:personId
 */
export const show = async (req: Request, res: Response) => {
	const personId = req.params.personId

	try {
		// Find a single person
		const person = await Person.findById(personId)

		// If no person was found, report 404
		if (!person) {
			return res.sendStatus(404)
		}

		// Get movies where person is director
		const directing = await Movie.find({ director: personId } , ['title', 'releaseYear'])

		// Respond with person
		res.send({
			status: "success",
			data: {
				person,
				directing,
			},
		})

	} catch (err) {
		debug("Error thrown when finding person '%s': %o", personId, err)
		res.status(500).send({ status: "error", message: "Error thrown when finding person" })
	}
}

/**
 * Create a person
 *
 * POST /people
 */
export const store = async (req: Request, res: Response) => {
	try {
		// Create and save a new Person
		const person = await new Person(req.body).save()

		// Respond with the newly created Person
		res.status(201).send({
			status: "success",
			data: person,
		})

		const err = new Error()

	} catch (err) {
		debug("Error thrown when creating person", err)

		if (err instanceof mongoose.Error.ValidationError) {
			return res.status(400).send({ status: "error", message: err.message })
		}

		res.status(500).send({ status: "error", message: "Error thrown when creating a new person" })
	}
}

/**
 * Create a movie
 *
 * POST /movies
 */
export const store = async (req: Request, res: Response) => {
	try {
		// Create and save a new Movie
		const movie = await new Movie(req.body).save()

		// Respond with the newly created Movie
		res.status(201).send({
			status: "success",
			data: movie,
		})

		const err = new Error()

	} catch (err) {
		debug("Error thrown when creating movie", err)

		if (err instanceof mongoose.Error.ValidationError) {
			return res.status(400).send({ status: "error", message: err.message })
		}

		res.status(500).send({ status: "error", message: "Error thrown when creating a new movie" })
	}
}

/**
 * Update a movie
 *
 * PATCH /movies/:movieId
 */
export const update = async (req: Request, res: Response) => {
	const movieId = req.params.movieId

	try {
		// Update Movie
		const movie = await Movie.findByIdAndUpdate(movieId, req.body)

		// Respond with the newly created Movie
		res.status(200).send({
			status: "success",
			data: movie,
		})

	} catch (err) {
		debug("Error thrown when updaing movie", err)

		if (err instanceof mongoose.Error.ValidationError) {
			return res.status(400).send({ status: "error", message: err.message })
		}

		res.status(500).send({ status: "error", message: "Error thrown when updating movie" })
	}
}
