import { ReactNode } from 'react';
import Navbar from './_components/Navbar';

type Props = { children: ReactNode };

const PublicLayout = ({ children }: Props) => {
  return (
    <div>
      <Navbar />
      <main className="px-4 md:px-6 lg:px-8 m-auto container">{children}</main>
    </div>
  );
};

export default PublicLayout;
