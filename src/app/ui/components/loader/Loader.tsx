import { ReactNode } from 'react';

interface Props {
  loading: boolean;
  children?: ReactNode;
}

export default function Loader(props: Props) {
  if (!props.loading) return <>{props.children}</>;
  return (
    <div className="loader_target">
      <div className="loader">
        <div className="loader_ripple">
          <div></div>
          <div></div>
        </div>
      </div>
      {props.children}
    </div>
  );
}
