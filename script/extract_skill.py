import sqlite3
import json
import os
import re
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

sql = """
    SELECT Text1.'text' AS name, Point.need_skill_point, Text2.'text' AS description, Skill.*
    FROM skill_data AS Skill
    LEFT JOIN text_data AS Text1
    ON Text1.category = 47
    AND Text1.'index' = Skill.id
    LEFT JOIN text_data AS Text2
    ON Text2.category = 48
    AND Text2.'index' = Skill.id
    LEFT JOIN single_mode_skill_need_point AS Point
    ON Point.id = Skill.id
    ORDER BY Skill.id;
    """

def do_nothing(var):
    return var

def to_string(var):
    try:
        return str(var)
    except:
        return None

def to_integer(var):
    try:
        return int(var)
    except:
        return None

def to_float(var):
    try:
        return float(var)
    except:
        return None

def divide_by_10k(var):
    try:
        return float(var) / 10000.0
    except:
        return None

parameter_converter = {
    "name": do_nothing,
    "need_skill_point": to_integer,
    "description":do_nothing,
    "id": do_nothing,
    "rarity": to_integer,
    "group_id": do_nothing,
    "group_rate": to_integer,
    "filter_switch": to_integer,
    "grade_value": to_integer,
    "skill_category": to_integer,
    "tag_id": do_nothing,
    "unique_skill_id_1": do_nothing,
    "unique_skill_id_2": do_nothing,
    "exp_type": to_integer,
    "potential_per_default": to_integer,
    "activate_lot": to_integer,
    "condition_1": do_nothing,
    "float_ability_time_1": divide_by_10k,
    "float_cooldown_time_1": divide_by_10k,
    "ability_type_1_1": do_nothing,
    "ability_value_usage_1_1": to_integer,
    "ability_value_level_usage_1_1": to_integer,
    "float_ability_value_1_1": divide_by_10k,
    "target_type_1_1": do_nothing,
    "target_value_1_1": to_integer,
    "ability_type_1_2": do_nothing,
    "ability_value_usage_1_2": to_integer,
    "ability_value_level_usage_1_2": to_integer,
    "float_ability_value_1_2": divide_by_10k,
    "target_type_1_2": do_nothing,
    "target_value_1_2": to_integer,
    "ability_type_1_3": do_nothing,
    "ability_value_usage_1_3": to_integer,
    "ability_value_level_usage_1_3": to_integer,
    "float_ability_value_1_3": divide_by_10k,
    "target_type_1_3": do_nothing,
    "target_value_1_3": to_integer,
    "condition_2": do_nothing,
    "float_ability_time_2": divide_by_10k,
    "float_cooldown_time_2": divide_by_10k,
    "ability_type_2_1": do_nothing,
    "ability_value_usage_2_1": to_integer,
    "ability_value_level_usage_2_1": to_integer,
    "float_ability_value_2_1": divide_by_10k,
    "target_type_2_1": do_nothing,
    "target_value_2_1": to_integer,
    "ability_type_2_2": do_nothing,
    "ability_value_usage_2_2": to_integer,
    "ability_value_level_usage_2_2": to_integer,
    "float_ability_value_2_2": divide_by_10k,
    "target_type_2_2": do_nothing,
    "target_value_2_2": to_integer,
    "ability_type_2_3": do_nothing,
    "ability_value_usage_2_3": to_integer,
    "ability_value_level_usage_2_3": to_integer,
    "float_ability_value_2_3": divide_by_10k,
    "target_type_2_3": do_nothing,
    "target_value_2_3": to_integer,
    "popularity_add_param_1": to_integer,
    "popularity_add_value_1": to_integer,
    "popularity_add_param_2": to_integer,
    "popularity_add_value_2": to_integer,
    "disp_order": to_integer,
    "icon_id": do_nothing,
}

condition_object_map = {
    "condition_1": "condition_1_object",
    "condition_2": "condition_2_object",
}

condition_pattern = re.compile("^([a-zA-Z0-9_]+)(>\=|>|\=\=|<|<\=|!\=)([a-zA-Z0-9_]+)$")

def parse_condition(condition: str):
    if not condition:
        return {}

    split_by_or = condition.split("@")
    if len(split_by_or) > 1:
        return {
            "operator": "or",
            "items": [parse_condition(or_condition) for or_condition in split_by_or]
        }
    
    split_by_and = condition.split("&")
    if len(split_by_and) > 1:
        return {
            "operator": "and",
            "items": [parse_condition(and_condition) for and_condition in split_by_and]
        }

    match = condition_pattern.match(condition)
    key, operator, value = match.groups()
    return { "operator": operator, "key": key, "value": value }

def convert_skill(skill):
    return {
        "id": skill["id"],
        "name": skill["name"],
        "rarity": skill["rarity"],
        "description": skill["description"],
        "icon_id": skill["icon_id"],
        "need_skill_point": skill["need_skill_point"],
        "abilities": convert_skill_abilities(skill)
    }

def convert_skill_abilities(skill):
    abilities = []
    for i in range(1, 3):
        if skill["condition_" + str(i)] != "":
            abilities.append({
                "condition": skill["condition_" + str(i) + "_object"],
                "condition_raw": skill["condition_" + str(i)],
                "ability_time": skill["float_ability_time_" + str(i)],
                "cooldown_time": skill["float_cooldown_time_" + str(i)],
                "effects": convert_skill_effects(skill, str(i)),
            })
    return abilities

def convert_skill_effects(skill, ability):
    effects = []
    for i in range(1, 4):
        if skill["ability_type_" + ability + "_" + str(i)] != "0":
            effects.append({
                "ability_type": skill["ability_type_" + ability + "_" + str(i)],
                "ability_value": skill["float_ability_value_" + ability + "_" + str(i)],
                "target_type": skill["target_type_" + ability + "_" + str(i)],
                "target_value": skill["target_value_" + ability + "_" + str(i)],
            })
    return effects

current.execute(sql)
skills = {}
for row in current.fetchall():
    for key in row.keys():
        if key in parameter_converter:
            row[key] = parameter_converter[key](row[key])
    for source, target in condition_object_map.items():
        row[target] = parse_condition(row[source])
    skills[row["id"]] = convert_skill(row)

with open(os.path.join(base_dir, '../src/db/skill.json'), 'w', encoding="utf8") as output:
    json.dump(skills, output, ensure_ascii=False, indent=2)
