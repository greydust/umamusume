import json
import math
import os
import UnityPy
import sqlite3
import sys

if sys.version_info.major < 3 or (sys.version_info.major == 3 and sys.version_info.minor < 9):
    print("Please use Python 3.9 or later")
    exit()

base_dir = os.path.dirname(__file__)

def db_dict_factory(cursor, row):
    result = {}
    for index, column in enumerate(cursor.description):
        result[column[0]] = str(row[index])
    return result

asset_folder = os.path.join(os.getenv("UserProfile"), "AppData\\LocalLow\\Cygames\\umamusume")
connection = sqlite3.connect(os.path.join(asset_folder, "meta"))
connection.row_factory = db_dict_factory
current = connection.cursor()

def extract_character_portrait():
  current.execute('SELECT n as name, h as hash from a WHERE n LIKE "chara/chr%/chr\_icon\_____" ESCAPE "\\"')
  for item in current.fetchall():
    image_name = (item["name"].split("/")[-1]).split("_")[2]
    assets = UnityPy.load(os.path.join(asset_folder, "dat", item["hash"][:2], item["hash"]))
    for obj in assets.objects:
      if obj.type in [UnityPy.enums.ClassIDType.Texture2D, UnityPy.enums.ClassIDType.Sprite]:
        image = obj.read().image
        image.save(os.path.join(base_dir, "..\\public\\static\\image\\character\\portrait", image_name + ".png"))

def extract_course_param():
  current.execute('SELECT n as name, h as hash from a WHERE n LIKE "race/courseeventparam/%/pfb\_prm\_race%" ESCAPE "\\"')
  for item in current.fetchall():
    basename = os.path.basename(item["name"])
    assets = UnityPy.load(os.path.join(asset_folder, "dat", item["hash"][:2], item["hash"]))
    for obj in assets.objects:
        if obj.type in [UnityPy.enums.ClassIDType.MonoBehaviour]:
            if obj.serialized_type.nodes:
                tree = obj.read_typetree()
                with open(os.path.join(base_dir, "../temp" , basename), "w", newline='\n') as fp:
                  json.dump(tree, fp, indent=2, sort_keys=True)

def extract_course_slope():
  current.execute('SELECT n as name, h as hash from a WHERE n LIKE "race/course/%/pos/an\_pos\_race%\_00\_%\_%\_%\_%" ESCAPE "\\"')
  for item in current.fetchall():
    basename = os.path.basename(item["name"])
    image_name = (item["name"].split("/")[-1]).split("_")[2]

    assets = UnityPy.load(os.path.join(asset_folder, "dat", item["hash"][:2], item["hash"]))
    for obj in assets.objects:
        if obj.type in [UnityPy.enums.ClassIDType.MonoBehaviour]:
            if obj.serialized_type.nodes:
                tree = obj.read_typetree()
                rotations = tree["key"]["rotation"]
                slope_pers = [math.asin(min(max(2*(r["w"]*r["x"]-r["y"]*r["z"]), -1), 1)) for r in rotations]
                with open(os.path.join(base_dir, "../temp" , basename), "w", newline='\n') as fp:
                  json.dump(slope_pers, fp, indent=2, sort_keys=True)

extract_character_portrait()
# extract_course_param()
# extract_course_slope()
