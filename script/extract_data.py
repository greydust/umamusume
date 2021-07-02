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
connection = sqlite3.connect(os.path.join(asset_folder, "master\\master.mdb"))
connection.row_factory = db_dict_factory
current = connection.cursor()

meta_connection = sqlite3.connect(os.path.join(asset_folder, "meta"))
meta_connection.row_factory = db_dict_factory
meta_current = meta_connection.cursor()

def extract_relation():
    current.execute("SELECT * FROM succession_relation")
    relation_json = { item["relation_type"]: item["relation_point"] for item in current.fetchall() }
    with open(os.path.join(base_dir, "../src/db/relation.json"), "w", newline='\n') as fp:
        json.dump(relation_json, fp, indent=2, sort_keys=True)

def extract_relation_member():
    current.execute("SELECT * FROM succession_relation_member")
    relation_member_json = {}
    for item in current.fetchall():
        if item["chara_id"] not in relation_member_json:
            relation_member_json[item["chara_id"]] = []
        relation_member_json[item["chara_id"]].append(item["relation_type"])
    with open(os.path.join(base_dir, "../src/db/relation_member.json"), "w", newline='\n') as fp:
        json.dump(relation_member_json, fp, indent=2, sort_keys=True)

def extract_character():
    current.execute("SELECT * FROM card_data")
    character_data = current.fetchall()
    CHARACTER_KEYS = []

    character_json = { item["chara_id"]: { key: item[key] for key in CHARACTER_KEYS } for item in character_data}
    with open(os.path.join(base_dir, "../src/db/character.json"), "w", newline='\n', encoding="utf-8") as fp:
        json.dump(character_json, fp, ensure_ascii=False, indent=2, sort_keys=True)

def extract_proper_rate():
    current.execute("SELECT * FROM race_proper_distance_rate")
    proper_distance_json = { item["id"]: { "speed": float(item["proper_rate_speed"]) / 10000, "power": float(item["proper_rate_power"]) / 10000 } for item in current.fetchall() }
    with open(os.path.join(base_dir, "../src/db/proper_rate/distance.json"), "w", newline='\n') as fp:
        json.dump(proper_distance_json, fp, indent=2, sort_keys=True)

    current.execute("SELECT * FROM race_proper_ground_rate")
    proper_ground_json = { item["id"]: float(item["proper_rate"]) / 10000 for item in current.fetchall() }
    with open(os.path.join(base_dir, "../src/db/proper_rate/ground.json"), "w", newline='\n') as fp:
        json.dump(proper_ground_json, fp, indent=2, sort_keys=True)

    current.execute("SELECT * FROM race_proper_runningstyle_rate")
    proper_running_style_json = { item["id"]: float(item["proper_rate"]) / 10000 for item in current.fetchall() }
    with open(os.path.join(base_dir, "../src/db/proper_rate/running_style.json"), "w", newline='\n') as fp:
        json.dump(proper_running_style_json, fp, indent=2, sort_keys=True)

def get_course_slope_per(course):
    target_file_name = 'race/course/{race_track_id}/pos/an_pos_race{race_track_id}_00_{distance}_{ground}_{inout}_{turn}'.format(
        race_track_id = course["race_track_id"],
        distance = course["distance"],
        ground = str(int(course["ground"]) - 1).zfill(2),
        inout = int(course["inout"]) - 1,
        turn = int(course["turn"]) - 1,
    )
    meta_current.execute('SELECT n as name, h as hash from a WHERE n = "{target_file_name}"'.format(
        target_file_name = target_file_name,
    ))
    item = meta_current.fetchone()
    if item:
        assets = UnityPy.load(os.path.join(asset_folder, "dat", item["hash"][:2], item["hash"]))
        for obj in assets.objects:
            if obj.type in [UnityPy.enums.ClassIDType.MonoBehaviour]:
                if obj.serialized_type.nodes:
                    tree = obj.read_typetree()
                    rotations = tree["key"]["rotation"]
                    slope_pers = [-math.tan(math.asin(min(max(2*(r["w"]*r["x"]-r["y"]*r["z"]), -1), 1)))*100 for r in rotations]
                    part_distance = float(course["distance"]) / (len(slope_pers) - 1)
                    current_distance = 0
                    course_slope_per = []
                    for slope_per in slope_pers:
                        real_slope_per = 0 if -1 < slope_per < 1 else slope_per
                        if not course_slope_per or course_slope_per[-1]["slope_per"] != real_slope_per:
                            course_slope_per.append({ "distance": current_distance, "slope_per": real_slope_per })
                        current_distance += part_distance
                    return course_slope_per
    return []

def get_course_param(course):
    target_file_name = 'race/courseeventparam/{id}/pfb_prm_race{id}'.format(id = course["id"])
    meta_current.execute('SELECT n as name, h as hash from a WHERE n = "{target_file_name}"'.format(
        target_file_name = target_file_name,
    ))
    item = meta_current.fetchone()
    course_definition = {
        "straight": [],
        "corner": [{}, {}, {}, {}],
    }
    if item:
        assets = UnityPy.load(os.path.join(asset_folder, "dat", item["hash"][:2], item["hash"]))
        for obj in assets.objects:
            if obj.type in [UnityPy.enums.ClassIDType.MonoBehaviour]:
                if obj.serialized_type.nodes:
                    tree = obj.read_typetree()
                    params = tree["courseParams"]
                    for param in params:
                        if param["_paramType"] == 0 and 1 <= param["_values"][0] <= 4:
                            course_definition["corner"][param["_values"][0] - 1] = {
                                "start": param["_distance"],
                                "end": param["_distance"] + param["_values"][1],
                            }
                        elif param["_paramType"] == 2:
                            if param["_values"][0] == 1:
                                last_straight_start = param["_distance"]
                            elif param["_values"][0] == 2:
                                course_definition["straight"].append({
                                    "start": last_straight_start,
                                    "end": param["_distance"],
                                })
                    break

    return course_definition

def extract_course():
    current.execute("SELECT * FROM race_course_set")
    course_json = {}
    for item in current.fetchall():
        item["slope_per"] = get_course_slope_per(item)
        item["param"] = get_course_param(item)
        item["distance"] = int(item["distance"])
        course_json[item["id"]] = item
    with open(os.path.join(base_dir, "../src/db/course.json"), "w", newline='\n') as fp:
        json.dump(course_json, fp, indent=2, sort_keys=True)

def extract_localization():
    current.execute("SELECT * FROM text_data WHERE category = 6")
    character_name_localization = { item["index"]: item["text"] for item in current.fetchall() }
    with open(os.path.join(base_dir, "../src/localization/ja_jp/character/name.json"), "w", encoding="utf-8") as fp:
        json.dump(character_name_localization, fp, ensure_ascii=False, indent=2, sort_keys=True)

    current.execute("SELECT * FROM text_data WHERE category = 35")
    course_name_localization = { item["index"]: item["text"] for item in current.fetchall() }
    with open(os.path.join(base_dir, "../src/localization/ja_jp/course/racecourse.json"), "w", encoding="utf-8") as fp:
        json.dump(course_name_localization, fp, ensure_ascii=False, indent=2, sort_keys=True)

extract_relation()
extract_relation_member()
extract_proper_rate()
extract_course()
extract_localization()
extract_character()
