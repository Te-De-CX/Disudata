
import { ReactNode } from "react";

const RootLayout = ({ children }: { children: ReactNode }) => {

    return (
        <html lang="en">
            <head>
                <title>DisuData</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body>
                <div className="flex flex-col min-h-screen">
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    )
}

export default RootLayout;  