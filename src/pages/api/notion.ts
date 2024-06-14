import { NextApiRequest, NextApiResponse } from 'next';

import { Client } from '@notionhq/client';

type KeyProperty = 'Name' | 'Contents';
export type DatabaseMap = Record<KeyProperty, string>;

function getContent(arr: any[]): string {
  const [dic] = arr;
  return dic.text.content;
}

function getDic(properties: any): DatabaseMap {
  return Object.entries(properties).reduce((acc, [key, val]: any) => {
    const content = getContent(key === 'Name' ? val.title : val.rich_text);
    acc[key as KeyProperty] = content;
    return acc;
  }, {} as DatabaseMap);
}

function modifyDatabaseData(results: any[]): DatabaseMap[] {
  return results.reduce(
    (acc, cur: any) => [...acc, getDic(cur.properties)],
    [] as DatabaseMap[]
  );
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DatabaseMap[]>
) {
  let result: Record<KeyProperty, string>[];
  const notion = new Client({
    auth: process.env.NEXT_PUBLIC_NOTION_KEY,
  });

  if (!process.env.NEXT_PUBLIC_NOTION_DATABASE_ID) {
    throw new Error(`DATABASE_ID is not exist!`);
  }

  try {
    const data = await notion.databases.query({
      database_id: process.env.NEXT_PUBLIC_NOTION_DATABASE_ID,
      sorts: [
        {
          property: 'Name',
          direction: 'ascending',
        },
      ],
    });

    result = modifyDatabaseData(data.results);
  } catch {
    throw new Error(`api error!`);
  }

  res.status(200).json(result);
}
