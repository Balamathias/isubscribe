import bcrypt from 'bcryptjs'

export const hashPin = async (pin: string, saltRounds=10): Promise<string> => {
    const hash = bcrypt.hashSync(pin, saltRounds);
    return hash
}

export const unhashPin = async (pin: string, hash: string): Promise<boolean> => {
    return bcrypt.compareSync(pin, hash);
}