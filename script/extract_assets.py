import os
import UnityPy
import sqlite3

def db_dict_factory(cursor, row):
    result = {}
    for index, column in enumerate(cursor.description):
        result[column[0]] = str(row[index])
    return result

asset_folder = os.path.join(os.getenv("UserProfile"), "AppData\\LocalLow\\Cygames\\umamusume")
connection = sqlite3.connect(os.path.join(asset_folder, "meta"))
connection.row_factory = db_dict_factory
current = connection.cursor()

current.execute('SELECT n as name, h as hash from a WHERE n LIKE "chara/chr%/chr\_icon\_____" ESCAPE "\\"')
for item in current.fetchall():
  image_name = (item["name"].split("/")[-1]).split("_")[2]
  assets = UnityPy.load(os.path.join(asset_folder, "dat", item["hash"][:2], item["hash"]))
  for obj in assets.objects:
    if obj.type in [UnityPy.enums.ClassIDType.Texture2D, UnityPy.enums.ClassIDType.Sprite]:
      image = obj.read().image
      image.save(os.path.join("..\\public\\static\\image\\character\\portrait", image_name + ".png"))



