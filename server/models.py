#models for maps and so forth.

class Map(object):
    def __init__(self):
        self.img = None
        self.size = None
        self.clusters = None
        self.tiles = []

class Cluster(object):
    def __init__(self):
        self.boundingBox = None
        self.tags = []
        self.img = None
