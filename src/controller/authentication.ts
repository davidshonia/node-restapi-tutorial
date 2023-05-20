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

        if (!user) {
            return res.sendStatus(400);
        }

        const expectedHash = authentication(user.authentication.salt, password)

        if (user.authentication.password != expectedHash) {
            return res.sendStatus(403);
        }

        const salt = random();

        return res.status(200).json(user).end()
    } catch (err) {
        console.log(err)
        return res.sendStatus(404);
    }
}


export const register = async (req: express.Request, res: express.Response) => {
    try {
        const {email, password, username} = req.body

        if (!email || !password || !username) {
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
                password: authentication(salt, password)
            }
        })

        return res.status(200).json(user).end()
    } catch (err) {
        console.log(err)
        return res.sendStatus(404);
    }
}