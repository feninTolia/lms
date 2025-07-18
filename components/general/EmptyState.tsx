import { Ban, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

type Props = {
  title?: string;
  description?: string;
  buttonText?: string;
  href?: string;
};

const EmptyState = ({ title, description, buttonText, href = '/' }: Props) => {
  return (
    <div className="flex flex-col flex-1 h-full items-center justify-center rounded-md border-dashed border p-8 text-center animate-in fade-in-50">
      <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
        <Ban className="size-10 text-primary" />
      </div>

      {title && <h2 className="mt-6 text-xl font-semibold"> {title}</h2>}
      {description && (
        <p className="mb-8 mt-2 text-center text-sm leading-tight text-muted-foreground">
          {description}
        </p>
      )}
      {buttonText && (
        <Link href={href} className={buttonVariants()}>
          <PlusCircle className="size-4 mr-2" />
          <span>{buttonText}</span>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
