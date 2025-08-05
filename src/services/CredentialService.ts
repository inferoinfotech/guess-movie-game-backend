import bcrypt from 'bcrypt'

export class CredentialService {
    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10)
    }

    async comparePassword(password: string, hashed: string): Promise<boolean> {
        return await bcrypt.compare(password, hashed)
    }
}
