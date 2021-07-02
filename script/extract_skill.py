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
    "float_ability_time_1": to_integer,
    "float_cooldown_time_1": to_integer,
    "ability_type_1_1": to_integer,
    "ability_value_usage_1_1": to_integer,
    "ability_value_level_usage_1_1": to_integer,
    "float_ability_value_1_1": to_integer,
    "target_type_1_1": to_integer,
    "target_value_1_1": to_integer,
    "ability_type_1_2": to_integer,
    "ability_value_usage_1_2": to_integer,
    "ability_value_level_usage_1_2": to_integer,
    "float_ability_value_1_2": to_integer,
    "target_type_1_2": to_integer,
    "target_value_1_2": to_integer,
    "ability_type_1_3": to_integer,
    "ability_value_usage_1_3": to_integer,
    "ability_value_level_usage_1_3": to_integer,
    "float_ability_value_1_3": to_integer,
    "target_type_1_3": to_integer,
    "target_value_1_3": to_integer,
    "condition_2": do_nothing,
    "float_ability_time_2": to_integer,
    "float_cooldown_time_2": to_integer,
    "ability_type_2_1": to_integer,
    "ability_value_usage_2_1": to_integer,
    "ability_value_level_usage_2_1": to_integer,
    "float_ability_value_2_1": to_integer,
    "target_type_2_1": to_integer,
    "target_value_2_1": to_integer,
    "ability_type_2_2": to_integer,
    "ability_value_usage_2_2": to_integer,
    "ability_value_level_usage_2_2": to_integer,
    "float_ability_value_2_2": to_integer,
    "target_type_2_2": to_integer,
    "target_value_2_2": to_integer,
    "ability_type_2_3": to_integer,
    "ability_value_usage_2_3": to_integer,
    "ability_value_level_usage_2_3": to_integer,
    "float_ability_value_2_3": to_integer,
    "target_type_2_3": to_integer,
    "target_value_2_3": to_integer,
    "popularity_add_param_1": to_integer,
    "popularity_add_value_1": to_integer,
    "popularity_add_param_2": to_integer,
    "popularity_add_value_2": to_integer,
    "disp_order": to_integer,
    "icon_id": to_integer,
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

current.execute(sql)
# columns = cursor.description
# for column in columns:
#     print(column[0])

skills = {}
for row in current.fetchall():
    for key in row.keys():
        if key in parameter_converter:
            row[key] = parameter_converter[key](row[key])
    for source, target in condition_object_map.items():
        row[target] = parse_condition(row[source])
    skills[row["id"]] = row

# print(skill_array)
    
with open(os.path.join(base_dir, '../src/db/skill.json'), 'w', encoding="utf8") as output:
    json.dump(skills, output, ensure_ascii=False, indent=2)

# rarity: 1:白 2:金 3:非三星固有  4:非三星馬升三星後的固有 5:三星固有
    
# group_id: 同種技能同group
# group_rate: -1:X 1:白 2:金or固有

# filter_switch: 不明 一律為0

# skill_category: 0:綠技 1:序盤 2:中盤 3:終盤 4:其他 5:固有

# tag_id: 
# 101~104:逃先差追
# 201~204:短英中長
# 301~303:序中終
# 401:與速度or速度提升有關
# 402:與耐力or回體有關
# 403:與力量or加速度or走位有關
# 404:與根性有關
# 405:與賢or視野有關
# 406:與紅有關(不確定?)
# 407:與出閘有關

# unique_skill_id_1:繼承固有的原先id (非繼承沒有)
# unique_skill_id_2:升級大招的原先id (一開始就三星的馬沒有)
# exp_type: 1為固有技能 繼承&其餘為0
# potential_per_default: 不明 但0為固有技能(含繼承) 其餘為10
# activate_lot: 不明

# disp_order: 猜 單純只是位置排序

