import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    // Protect Admin API routes
    if (pathname.startsWith('/api/admin')) {
        const adminSession = req.cookies.get('admin_session');
        if (!adminSession?.value) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.next();
    }

    // Protect Admin UI routes
    const isAdminRoute = /^\/([a-z]{2}\/)?admin(\/.*)?$/.test(pathname);
    const isLoginRoute = /^\/([a-z]{2}\/)?admin\/login(\/.*)?$/.test(pathname);

    if (isAdminRoute && !isLoginRoute) {
        const adminSession = req.cookies.get('admin_session');
        if (!adminSession?.value) {
            const localeMatch = pathname.match(/^\/([a-z]{2})\/admin/);
            const locale = localeMatch ? `/${localeMatch[1]}` : '';
            const loginUrl = new URL(`${locale}/admin/login`, req.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return intlMiddleware(req);
}

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api` (excluding `/api/admin` which we want to match manually, wait, if we exclude `/api` then middleware won't run for `/api/admin`! Let's modify matcher)
    // Actually, we must run middleware for `/api/admin`
    matcher: ['/((?!api(?!\\/admin)|_next|_vercel|.*\\..*).*)']
};
