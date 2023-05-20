import express from "express";
import {getUserByEmail, createUser} from "../db/users";
import {authentication, random} from "../helpers";

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const {email, password} = req.body

        if (!email || !password) {
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

        // User not found
        if (!user) {
            return res.sendStatus(400);
        }

        // Check if user password matches with hash
        const expectedHash = authentication(user.authentication.salt, password)
        if (user.authentication.password != expectedHash) {
            return res.sendStatus(403);
        }

        // Update User Session Token In Database
        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString())

        // Save User After Updating Token
        await user.save()

        // Return Cookie
        res.cookie('AUTH-LOGIN', user.authentication.sessionToken, {domain:'localhost'})

        return res.status(200).json(user).end()
    } catch (err) {
        console.log(err)
        return res.sendStatus(404);
    }
}


export const register = async (req: express.Request, res: express.Response) => {
    try {
        // Request body fields
        const {email, password, username} = req.body

        // Required Fields
        if (!email || !password || !username) {
            return res.sendStatus(400)
        }

        // Get user if exists else
        const existingUser = await getUserByEmail(email)
        if (existingUser) {
            return res.sendStatus(400)
        }

        // Create user if not exists
        const salt = random()
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        })

        return res.status(200).json(user).end()
    } catch (err) {
        console.log(err)
        return res.sendStatus(404);
    }
}