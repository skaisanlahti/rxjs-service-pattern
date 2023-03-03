import { Observable } from 'rxjs';
import useStream from '../../../../utilities/use-stream';

interface Props {
  count$: Observable<number>;
}

export default function Count({ count$ }: Props) {
  const count = useStream(count$, 0);

  return <span className="counter_count">{count}</span>;
}
