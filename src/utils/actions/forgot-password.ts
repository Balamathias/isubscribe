'use server'

export const handleForgotPassword = async (formData: FormData) => {
    const email = formData.get('email')
    const response = await fetch(process.env.NEXT_PUBLIC_SITE_URL + '/api/auth/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email})
    })

    if (response.ok) {
        
        return {message: 'Success!', code: 200}
    }

    return {message: 'An error occurred, please try again', code: 400}
}