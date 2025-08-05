import { Roles } from '@/constants'
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

    async updateById(userId: string, data: any) {
        const updated = await User.findByIdAndUpdate(userId, data, {
            new: true,
        }).select('-password')
        if (!updated) throw new Error('User not found')
        return updated
    }

    async updateRole(userId: string, newRole: Roles) {
        const user = await User.findById(userId)
        if (!user) throw new Error('User not found')
        user.role = newRole
        return await user.save()
    }

    async findAll() {
        return User.find().select('-password') // hide password
    }

    // async toggleBan(userId: string) {
    //     const user = await User.findById(userId)
    //     if (!user) throw new Error('User not found')
    //     user.isBanned = !user.isBanned
    //     return await user.save()
    // }
}
