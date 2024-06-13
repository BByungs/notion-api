import { NextApiRequest, NextApiResponse } from 'next';

import { Client } from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<PageObjectResponse>>
) {
  let result: Array<PageObjectResponse>;
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

    result = data.results as Array<PageObjectResponse>;
  } catch {
    throw new Error(`api error!`);
  }

  res.status(200).json(result);
}
