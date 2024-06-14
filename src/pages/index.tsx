import { useEffect, useState } from 'react';
import { DatabaseMap } from './api/notion';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState<DatabaseMap[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/notion', {
          // cache: 'force-cache',
        });

        const data: DatabaseMap[] = await res.json();
        setList(data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) return <p>...loading</p>;

  return (
    <div>
      {list.map(({ Name, Contents }) => (
        <p key={Contents}>{`Name: ${Name} , Contents: ${Contents}`}</p>
      ))}
    </div>
  );
}
