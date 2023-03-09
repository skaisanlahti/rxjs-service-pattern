import { ReactNode } from 'react';

interface Props {
  loading: boolean;
  children?: ReactNode;
}

export default function Loader({ loading, children }: Props) {
  if (!loading) return <>{children}</>;
  return (
    <div className="loader">
      <div className="loader_overlay">
        <div className="loader_ripple">
          <div></div>
          <div></div>
        </div>
      </div>
      {children}
    </div>
  );
}
