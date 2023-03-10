
/*
**User Service
*/

import prisma from "../prisma"
import { CreateUserData, UpdateUserData } from "../types"


/**
 *  Get user by email
 *
 * @param email
 * @returns
 */
export const getUserByEmail = async (email: string) => {
	return await prisma.user.findUnique({ // vill INTE använda findUniqueOrThrow eftersom vi inte vill få ett fel, utan den ska vara unique.
		where: {
			email: email, //kan skrivas bara 'email' när key och value är samma
		}
	})
}

/**
 * Create a user
 *
 * @param data User Details
 */
export const createUser = async (data: CreateUserData) => {

	return await prisma.user.create({
		data: data,
	})
}

/**
 * Update a user
 *
 * @param id user id
 * @param data
 */
export const updateUser = async (userId: number, userData: UpdateUserData) => {
	return await prisma.user.update({
		where: {
			id: userId,
		},
		data: userData,
	})
}
