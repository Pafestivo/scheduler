import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'WeSchedule',
  description: 'Schedule your workload',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav>
          <Link href={'/'}>
            <p>Home</p>
          </Link>

          <Link href={'/login'}>
            <p>Login</p>
          </Link>

          <Link href={'/register'}>
            <p>Register for free</p>
          </Link>
        </nav>

        {children}
        </body>
    </html>
  )
}
