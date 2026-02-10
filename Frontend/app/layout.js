import './globals.css';
import 'react-quill-new/dist/quill.snow.css';

export const metadata = {
  title: 'Blog Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}