import { v4 as uuidv4 } from 'uuid';

const { ObjectId } = require('mongodb');
const fs = require('fs');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');
const { getFromDB, addToDB } = require('../utils/helpers/helpers');

const { env } = process;

class FilesController {
  async postUpload(request, response) {
    const requestHeader = request.get('X-Token');
    const { name, type, data } = request.body;
    let { parentId = 0 } = request.body;
    const { isPublic = false } = request.body;

    if (!name) {
      response.status(400);
      response.json({ error: 'Missing name' });
      return;
    }

    if (!type) {
      response.status(400);
      response.json({ error: 'Missing type' });
      return;
    }

    if (!data && type !== 'folder') {
      response.status(400);
      response.json({ error: 'Missing data' });
      return;
    }
    const key = `auth_${requestHeader}`;

    const userId = await redisClient.get(key);
    if (parentId) {
      try {
        const doc = await getFromDB(dbClient.db, 'files', { _id: ObjectId(parentId) });
        if (doc.type !== 'folder') {
          response.status(400);
          response.json({ error: 'Parent is not a folder' });
        }
      } catch (err) {
        response.status(400);
        response.json({ error: 'Parent not found' });
      }
    }

    if (type === 'folder') {
      try {
        const folderId = await addToDB(dbClient.db, 'files', {
          userId: ObjectId(userId), name, type, parentId,
        });
        response.status(201);
        response.json({
          id: folderId, userId, name, type, isPublic, parentId,
        });
        return;
      } catch (err) {
        console.log(`ERROR IN ADDING FOLDER: ${err}`);
      }
    } else {
      const localDir = env.FOLDER_PATH || '/tmp/files_manager';
      const fileName = uuidv4();
      const fileContent = Buffer.from(data, 'base64').toString();

      if (!fs.existsSync(localDir)) {
        fs.mkdirSync(localDir);
      }

      fs.writeFileSync(`${localDir}/${fileName}`, fileContent);
      if (!parentId === 0) {
        parentId = ObjectId(parentId);
      }
      try {
        const fileId = await addToDB(dbClient.db, 'files',
          {
            userId: ObjectId(userId), name, type, parentId, isPublic, localPath: `${localDir}/${fileName}`,
          });
        response.status(201);
        response.json({
          id: fileId, userId, name, type, isPublic, parentId,
        });
        return;
      } catch (err) {
        console.log(`ERROR IN ADDING FILE: ${err}`);
      }
    }
  }
}

export default new FilesController();