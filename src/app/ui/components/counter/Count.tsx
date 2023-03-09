interface Props {
  value: number;
}

export default function Count({ value }: Props) {
  return <span className="counter_count">{value}</span>;
}
