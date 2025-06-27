import "./globals.css";
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { Toaster } from "@/components/ui/sonner"

export const metadata = {
  title: "BreathLine",
  description: "One scan, one breath, one life — saved.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
