import { Request, Response } from 'express';

export const testUser = async (req: Request, res: Response) => {
    res.status(200).json([{ name: 'John Doe' }, { name: 'Jane Doe' }]);
};
