import json
import os
import sqlite3

def db_dict_factory(cursor, row):
    result = {}
    for index, column in enumerate(cursor.description):
        result[column[0]] = str(row[index])
    return result

asset_folder = os.path.join(os.getenv("UserProfile"), "AppData\\LocalLow\\Cygames\\umamusume")
connection = sqlite3.connect(os.path.join(asset_folder, "master\\master.mdb"))
connection.row_factory = db_dict_factory
current = connection.cursor()

current.execute("SELECT * FROM succession_relation")
relation_json = { item["relation_type"]: item["relation_point"] for item in current.fetchall() }
with open("../src/db/relation.json", "w") as fp:
    json.dump(relation_json, fp, indent=2, sort_keys=True)

current.execute("SELECT * FROM succession_relation_member")
relation_member_json = {}
for item in current.fetchall():
  if item["chara_id"] not in relation_member_json:
    relation_member_json[item["chara_id"]] = []
  relation_member_json[item["chara_id"]].append(item["relation_type"])
with open("../src/db/relation_member.json", "w") as fp:
    json.dump(relation_member_json, fp, indent=2, sort_keys=True)

current.execute("SELECT * FROM card_data LEFT JOIN text_data ON card_data.chara_id = text_data.[index] AND text_data.category = 6")
character_data = current.fetchall()
CHARACTER_KEYS = ["text"]

character_json = { item["chara_id"]: { key: item[key] for key in CHARACTER_KEYS } for item in character_data}
with open("../src/db/character.json", "w", encoding="utf-8") as fp:
    json.dump(character_json, fp, ensure_ascii=False, indent=2, sort_keys=True)

character_name_localization = { item["text"]: item["text"] for item in character_data }
with open("../src/localization/ja_jp/character/name.json", "w", encoding="utf-8") as fp:
    json.dump(character_name_localization, fp, ensure_ascii=False, indent=2, sort_keys=True)