import { NextResponse } from 'next/server'
// import { getToken } from 'next-auth/jwt'

export async function middleware(request) {
    return NextResponse.next()

    /*
    const path = request.nextUrl.pathname

    // Define paths that require authentication
    const protectedPaths = [
        '/checkout',
        '/minha-conta'
    ]

    // Check if the current path starts with any of the protected paths
    const isProtected = protectedPaths.some(prefix => path.startsWith(prefix))

    if (isProtected) {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET
        })

        if (!token) {
            const url = new URL('/login', request.url)
            url.searchParams.set('redirect', path)
            return NextResponse.redirect(url)
        }
    }

    return NextResponse.next()
    */
}

export const config = {
    matcher: [
        '/checkout/:path*',
        '/minha-conta/:path*'
    ]
}
