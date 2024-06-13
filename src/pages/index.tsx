import { useEffect, useState } from 'react';

export default function Home() {
  const [list, setList] = useState<{ [key: string]: string }[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/notion', {
        cache: 'force-cache',
      });
      const data = await res.json();

      const getContent = (arr: any[]): string => {
        const [dic] = arr;
        return dic.text.content;
      };

      data.forEach((data: any) => {
        let obj: { [key: string]: string } = {};
        Object.entries(data.properties).forEach(
          ([key, value]: [string, any]) => {
            const content = getContent(
              key === 'Name' ? value.title : value.rich_text
            );

            console.log({ key, content });
          }
        );
      });
    })();
  }, []);

  return <>{/* {data?.results.map(() => )} */}</>;
}
