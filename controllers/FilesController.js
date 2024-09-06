import { v4 as uuidv4 } from 'uuid';

import { ObjectId } from 'mongodb';
import fs from 'fs';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const { env } = process;

class FilesController {
  static async postUpload(req, res) {
    const token = req.get('X-Token');
    const { name, type, data } = req.body;
    let { parentId = 0 } = req.body;
    const { isPublic = false } = req.body;

    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    if (!name) return res.status(400).json({ error: 'Missing name' });
    if (!type) return res.status(400).json({ error: 'Missing type' });
    if (!data && type !== 'folder') return res.status(400).json({ error: 'Missing data' });

    if (parentId) {
      const filePId = await dbClient.db.collection('files').findOne({ _id: ObjectId(parentId) });
      if (!filePId) return res.status(400).json({ error: 'Parent not found' });
      if (filePId.type !== 'folder') return res.status(400).res.json({ error: 'Parent is not a folder' });
    }

    if (type === 'folder') {
      const folder = {
        userId: ObjectId(userId), name, type, parentId,
      };

      const result = await dbClient.db.collection('files').insertOne(folder);
      if (!result) return res.status(422).json({ error: 'Could not create folder' });
      return res.status(201)
        .json({
          id: result.insertedId, userId, name, type, isPublic, parentId,
        });
    }
    const localDir = env.FOLDER_PATH || '/tmp/files_manager';
    const fileName = uuidv4();
    const fileContent = Buffer.from(data, 'base64').toString();

    try {
      if (!fs.existsSync(localDir)) {
        fs.mkdirSync(localDir);
      }

      fs.writeFileSync(`${localDir}/${fileName}`, fileContent);
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!parentId === 0) {
      parentId = ObjectId(parentId);
    }

    const file = {
      userId: ObjectId(userId), name, type, parentId, isPublic, localPath: `${localDir}/${fileName}`,
    };
    const result = await dbClient.db.collection('files').insertOne(file);
    if (!result) return res.status(422).json({ error: 'Could not create file' });
    return res.status(201)
      .json({
        id: result.insertedId, userId, name, type, isPublic, parentId,
      });
  }

  static async getShow(req, res) {
    const fileId = req.params.id;
    const token = req.get('X-Token');
    const key = `auth_${token}`;

    const userId = await redisClient.get(key);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const file = await dbClient.db.collection('files').findOne({ _id: ObjectId(fileId), userId: ObjectId(userId) });
    if (!file) return res.status(404).json({ error: 'Not found' });

    return res.status(200)
      .json({
        id: file._id,
        userId,
        name: file.name,
        type: file.type,
        isPublic: file.isPublic,
        parentId: file.parentId,
      });
  }

  static async getIndex(req, res) {
    let { parentId } = req.query;
    const { page } = req.query;
    const token = req.get('X-Token');
    const key = `auth_${token}`;

    const userId = await redisClient.get(key);

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    let match;
    const limit = 20;
    const skip = parseInt(page, 10) * limit;

    if (!parentId) {
      match = {};
    } else {
      parentId = parentId !== '0' ? ObjectId(parentId) : 0;
      match = { parentId };
    }

    const files = await dbClient.db.collection('files').aggregate([
      { $match: match },
      { $skip: skip },
      { $limit: limit },
    ]).toArray();

    if (!files || files.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(200).send(files);
  }
}

export default FilesController;
