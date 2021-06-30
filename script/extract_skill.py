import sqlite3
import json
import os
    
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

current.execute(sql)
# columns = cursor.description
# for column in columns:
#     print(column[0])

skill_array = []
f = current.fetchall()

title = [
    {
        "name": "string"
    },
    {
        "need_skill_point": "string"
    },
    {
        "description": "string"
    },
    {
        "id": "number"
    },
    {
        "rarity": "number"
    },
    {
        "group_id": "number"
    },
    {
        "group_rate": "number"
    },
    {
        "filter_switch": "number"
    },
    {
        "grade_value": "number"
    },
    {
        "skill_category": "number"
    },
    {
        "tag_id": "string"
    },
    {
        "unique_skill_id_1": "number"
    },
    {
        "unique_skill_id_2": "number"
    },
    {
        "exp_type": "number"
    },
    {
        "potential_per_default": "number"
    },
    {
        "activate_lot": "number"
    },
    {
        "condition_1": "string"
    },
    {
        "float_ability_time_1": "number"
    },
    {
        "float_cooldown_time_1": "number"
    },
    {
        "ability_type_1_1": "number"
    },
    {
        "ability_value_usage_1_1": "number"
    },
    {
        "ability_value_level_usage_1_1": "number"
    },
    {
        "float_ability_value_1_1": "number"
    },
    {
        "target_type_1_1": "number"
    },
    {
        "target_value_1_1": "number"
    },
    {
        "ability_type_1_2": "number"
    },
    {
        "ability_value_usage_1_2": "number"
    },
    {
        "ability_value_level_usage_1_2": "number"
    },
    {
        "float_ability_value_1_2": "number"
    },
    {
        "target_type_1_2": "number"
    },
    {
        "target_value_1_2": "number"
    },
    {
        "ability_type_1_3": "number"
    },
    {
        "ability_value_usage_1_3": "number"
    },
    {
        "ability_value_level_usage_1_3": "number"
    },
    {
        "float_ability_value_1_3": "number"
    },
    {
        "target_type_1_3": "number"
    },
    {
        "target_value_1_3": "number"
    },
    {
        "condition_2": "string"
    },
    {
        "float_ability_time_2": "number"
    },
    {
        "float_cooldown_time_2": "number"
    },
    {
        "ability_type_2_1": "number"
    },
    {
        "ability_value_usage_2_1": "number"
    },
    {
        "ability_value_level_usage_2_1": "number"
    },
    {
        "float_ability_value_2_1": "number"
    },
    {
        "target_type_2_1": "number"
    },
    {
        "target_value_2_1": "number"
    },
    {
        "ability_type_2_2": "number"
    },
    {
        "ability_value_usage_2_2": "number"
    },
    {
        "ability_value_level_usage_2_2": "number"
    },
    {
        "float_ability_value_2_2": "number"
    },
    {
        "target_type_2_2": "number"
    },
    {
        "target_value_2_2": "number"
    },
    {
        "ability_type_2_3": "number"
    },
    {
        "ability_value_usage_2_3": "number"
    },
    {
        "ability_value_level_usage_2_3": "number"
    },
    {
        "float_ability_value_2_3": "number"
    },
    {
        "target_type_2_3": "number"
    },
    {
        "target_value_2_3": "number"
    },
    {
        "popularity_add_param_1": "number"
    },
    {
        "popularity_add_value_1": "number"
    },
    {
        "popularity_add_param_2": "number"
    },
    {
        "popularity_add_value_2": "number"
    },
    {
        "disp_order": "number"
    },
    {
        "icon_id": "number"
    }
]

order = []

for i in range(0, len(title)):
    key = list(title[i].keys())[0]
    order.append([key, title[i][key]])

for row in f:
    
    skill = {}
    for i in range(0, len(row)):
#         print(i)
        if order[i][1] == "number":
            skill[order[i][0]] = int(row[i])
        else:
            skill[order[i][0]] = row[i]
    skill_array.append(skill)


print(skill_array)
    
with open('skill.json', 'w', encoding="utf8") as output:
    json.dump(skill_array, output, ensure_ascii=False)


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

