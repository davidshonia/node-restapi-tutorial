import express from "express";
import {getUserByEmail, createUser} from "../db/users";
import {authentications, random} from "../helpers";

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const {email, password, username} = req.body

        if (!email || !password || !password) {
            return res.sendStatus(400)
        }

        const existingUser = await getUserByEmail(email)

        if (existingUser) {
            return res.sendStatus(400)
        }

        const salt = random()

        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentications(salt, password)
            }
        })

        return res.status(200).json(user).end()
    } catch (err) {
        console.log(err)
        return res.sendStatus(404);
    }
}