import gridfs
from bson import ObjectId


def create_gridfs(image_file, name, db):
    '''return image id'''
    fs = gridfs.GridFS(db)
    _id = fs.put(image_file, filename=name)
    return _id

def get_file(db, id):
    fs = gridfs.GridFS(db)
    if isinstance(id, basestring):
        id = ObjectId(id)
    return fs.get(id)
