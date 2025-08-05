import { User, IUser } from '../models/v1/User'

export class UserService {
    async findByEmail(email: string): Promise<IUser | null> {
        return User.findOne({ email })
    }

    async create(data: Partial<IUser>): Promise<IUser> {
        const user = new User(data)
        return user.save()
    }

    async findById(id: string): Promise<IUser | null> {
        return User.findById(id)
    }
}
