#!/usr/bin/env python
# coding: utf-8

# In[1]:


import csv
import json

# f = open('code.txt' , 'w' ,  encoding= 'utf-8')

def divide_by_or(string):
    condition = []
    while string.find("@") != -1:
        condition.append(string[: string.find("@")])
        string = string[string.find("@") + 1:]
    condition.append(string)
    return condition

def divide_by_and(string):
    condition = []
    condition_tmp = []
    while string.find("&") != -1:
        condition_tmp.append(string[: string.find("&")])
        string = string[string.find("&") + 1:]
    condition_tmp.append(string)
    condition = condition_tmp
#     for cond in condition_tmp:
#         condition.append(divide_by_equal(cond))

    return condition

def divide_by_equal(string):
    
    eqa_array = [">=", "<=", "==", "!=", ">", "<"]
    
    for symbol in eqa_array:
        if string.find(symbol) != -1:
            condition = [string[:string.find(symbol)], symbol, string[string.find(symbol) + len(symbol) :]]
            break
    return condition






with open('SKILLS.csv', encoding = 'utf-8') as csvfile:
    
    skill_data = []
    rows = csv.reader(csvfile)
    
    flag = False
    
    for row in rows:
                
        if row[0] == 'id':
            flag = True
            continue
            
        if flag:
            
            skill = {
                'ID' : int(row[0]),
                'Name': row[1]
            }
            
            tmp = row[2]
            cond_raw = divide_by_or(tmp)
            cond = []
            
            for i in range(0, len(cond_raw)):
                cond.append(divide_by_and(cond_raw[i]))

            print(cond)
                    
                    
            
            
            
#             distance_type = -1
#             running_style = -1
#             if cond.find("distance_type") != -1:
#                 distance_type = int(cond[cond.find("distance_type==") + 15])
                
#             if cond.find("running_style") != -1:
#                 running_style = int(cond[cond.find("running_style==") + 15])
                
#             if cond.find("running_style") != -1:
#                 running_style = int(cond[cond.find("running_style==") + 15])
            skill['Effect1'] = {
#                 'distance_type': distance_type,
#                 'running_style': running_style,
                'Condition': cond,
                'TimeKeep': int(row[3]),
                'CD': int(row[4]),
                'ParamType1': row[5], 
                'ParamValue1': int(row[6]), 
                'TargetType1': row[7], 
                'TargetValue1': int(row[8]), 
                'ParamType2': row[9], 
                'ParamValue2': int(row[10]), 
                'TargetType2': row[11], 
                'TargetValue2': int(row[12]), 
                'ParamType3': row[13], 
                'ParamValue3': int(row[14]), 
                'TargetType3': row[15], 
                'TargetValue3': int(row[16])
            }

            cond = row[17]
            distance_type = -1
            running_style = -1
            if cond.find("distance_type") != -1:
                distance_type = int(cond[cond.find("distance_type==") + 15])
                
            if cond.find("running_style") != -1:
                running_style = int(cond[cond.find("running_style==") + 15])
            
            skill['Effect2']: {
                'distance_type': distance_type,
                'running_style': running_style,
                'Condition': row[17], 
                'TimeKeep': int(row[18]), 
                'CD': int(row[19]), 
                'ParamType1': row[20], 
                'ParamValue1': int(row[21]), 
                'TargetType1': row[22], 
                'TargetValue1': int(row[23]), 
                'ParamType2': row[24], 
                'ParamValue2': int(row[25]), 
                'TargetType2': row[26], 
                'TargetValue2': int(row[27]), 
                'ParamType3': row[28], 
                'ParamValue3': int(row[29]), 
                'TargetType3': row[30], 
                'TargetValue3': int(row[31])
            }
            skill['Popularity'] = {
                'Param1': row[32], 
                'Bonus1': row[33], 
                'Param2': row[34], 
                'Bonus2': row[35]
            }
            skill_data.append(skill)
#             print(row[6:])
            


# for skill in skill_data:
#     print(skill)
        
with open('skill_data.json', 'w', encoding="utf8") as outfile:
    json.dump(skill_data, outfile, ensure_ascii=False)


# In[74]:


import csv
import json

        
def word_replace(string):
    
    symbol = ["==", "!=", ">=", "<=", ">", "<"]
    
    
    # distance_type
    if string.find('distance_type') != -1:
        word_new = ['', '短距離', '英里', '中距離', '長距離']
        for i in range(1, len(word_new)):
            string = string.replace('distance_type==' + str(i), word_new[i])
        return string
    
    if string.find('is_basis_distance') != -1:
        string = string.replace('is_basis_distance==0', '賽道長為400的倍數')
        string = string.replace('is_basis_distance==1', '賽道長不為400的倍數')
        return string
    
    if string.find('is_finalcorner') != -1:
        string = string.replace('is_finalcorner==1', '已到達最終彎道')
        return string
    
    if string.find('_random') != -1:
        string = string.replace('_random', '') + '(*)'
        
    if string.find('phase') != -1:
        symbol_new = ["", "不為", "(含)以後", "(含)以前", "(不含)以後", "(不含)以前"]
        for i in range(0, len(symbol)):
            if string.find(symbol[i]) != -1:
                if i == 1:
                    string = symbol_new[i] + string.replace(symbol[i], "")
                else:
                    string = string.replace(symbol[i], "") + symbol_new[i]
                    
        string = string.replace('phase0', '序盤')
        string = string.replace('phase1', '中盤')
        string = string.replace('phase2', '終盤')
        return string
                    
    if string.find('corner') != -1:
        string = string.replace('corner==0', '不為彎道')
        string = string.replace('corner==', '彎道')
        string = string.replace('corner!=0', '位於彎道上')
        return string
    
    if string.find('straight') != -1:
        string = string.replace('straight==0', '不為直線')
        string = string.replace('straight!=0', '位在直線上')
        string = string.replace('straight==1', '位在直線上')
        return string

    if string.find('bashin') != -1:
        
        if string.find("bashin_diff_infront") != -1:
            string = string.replace('bashin_diff_infront', '與前馬距離') + '馬身'
        elif string.find("bashin_diff_behind") != -1:
            string = string.replace('bashin_diff_behind', '與後馬距離') + '馬身'

        return string    

    
    
    
    
    if string.find("!=") != -1:
        string = "不為" + string.replace("!=", "")

    if string.find("==") != -1:
        string = string.replace("==", "")
        
    if string.find("_rate") != -1:
        string = string.replace('_rate', '') + '%'

    if string.find('season') != -1:
        word_new = ['', '春天', '夏天', '秋天', '冬天', '春天']
        
        for i in range(1, len(word_new)):
            string = string.replace('season' + str(i), word_new[i])
        return string

    if string.find('weather') != -1:
        word_new = ['', '晴', '陰', '雨', '雪']
        for i in range(1, len(word_new)):
            string = string.replace('weather' + str(i), word_new[i])
        return string

    if string.find('slope') != -1:
        word_new = ['', '上坡', '下坡']
        for i in range(1, len(word_new)):
            string = string.replace('slope' + str(i), word_new[i])
        return string
    
    if string.find('running_style') != -1:
        string = "跑法" + string
        word_new = ['', '逃げ', '先行', '差し', '追込']
        for i in range(1, len(word_new)):
            string = string.replace('running_style' + str(i), word_new[i])
        return string    
    
    if string.find("change_order_onetime") != -1:
        if string.find("change_order_onetime>") != -1:
            tmp = string.replace("change_order_onetime>", "")
            tmp = str(int(tmp) + 1)
            string = "被至少" + tmp + "人超車"
        elif string.find("change_order_onetime<") != -1:
            tmp = string.replace("change_order_onetime<", "")
            tmp = str(int(tmp) + 1)
            string = "超車至少" + tmp + "人"
            
        return string
    
#     word.append('order')
#     word_new.append('排名')
    
    if string.find('popularity') != -1:
        return string.replace('popularity', '人氣')
        
    if string.find('remain_distance') != -1:
        return string.replace('remain_distance', '剩餘距離')    
    
    if string.find('rotation') != -1:
        string = string.replace('rotation1', '右回')    
        string = string.replace('rotation2', '左回')
        return string

    if string.find('order') != -1:
        string = '排名' + string.replace('order', '')
    return string


with open('skill_data.json', encoding="utf8") as file:
    data = json.load(file)

# print(data)

for i in data:
#     print(i['Effect1'])
    for condtion_array in i['Effect1']['Condition']:
        for cond in condtion_array:
            print(word_replace(cond))
        print()


# In[152]:


import sqlite3
    
def db_dict_factory(cursor, row):
    result = {}
    for index, column in enumerate(cursor.description):
        result[column[0]] = str(row[index])
    return result

conn = sqlite3.connect("master.mdb")
conn.row_factory = db_dict_factory

cursor = conn.cursor()

# sql = "SELECT Skill.*, Text.'text' AS 'group' \
#     FROM ( \
#         SELECT Skill.*, Text.'text' AS name \
#         FROM skill_data AS Skill \
#         INNER JOIN text_data AS Text \
#         ON Skill.'id' = Text.'index') AS Skill \
#     INNER JOIN text_data AS Text \
#     ON Skill.'group_id' = Text.'index' ;"

#     (SELECT T1.'index' AS index, T1.text AS name, T2.text AS desc
text_table = """ 
    (SELECT T1.*, T1.text AS name, T2.text AS desc
    FROM text_data AS T1, text_data AS T2
    WHERE T1.'id' <> T2.'id'
    AND T1.'category' = 47
    AND T2.'category' = 48 
    AND T1.'index' = T2.'index') AS Text """

sql = """
    SELECT Skill.*, Text.'name', Text.'desc'
    FROM skill_data AS Skill
    INNER JOIN """ + text_table + """
    ON Skill.'id' = Text.'index';
    """
# print(sql)




cursor.execute(sql)
# columns = cursor.description
# for column in columns:
#     print(column[0])

skill_array = []
f = cursor.fetchall()
for row in f:
#     print(row)
#     if row['activate_lot'] == '0':
#         continue
    skill = {
        'ID': row['id'],
        'rarity': row['rarity'],
        'group_id' : row['group_id'],
        'group_rate': row['group_rate'],
        'filter_switch': row['filter_switch'] , 
        'grade_value': row['grade_value'], 
        'skill_category': row['skill_category'], 
        'tag_id': row['tag_id'], 
        'unique_skill_id_1':row['unique_skill_id_1'], 
        'unique_skill_id_2': row['unique_skill_id_2'], 
        'exp_type': row['exp_type'], 
        'potential_per_default': row['potential_per_default'], 
        'activate_lot': row['activate_lot'],
        
        'disp_order': row['disp_order'], 
        'icon_id': row['icon_id'], 
        'name': row['name'], 
        'desc': row['desc']
    }
    print(skill['name'], skill['grade_value'], skill['icon_id'])

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


# In[38]:


import json
import os

path = os.walk("json")

file_array = []
table_dict = {}

for _root, _dir, _file in path:
    for f in _file:
        tables_array.append(f)
        file_array.append(f)
        
# print(file_array)

for file in file_array:
    with open('json/' + file, encoding="utf8") as f:
        data = json.load(f)
        if data is not None:
            table_dict[file] = list(data[0].keys())

print(table_dict)

with open('tables.json', 'w', encoding="utf8") as output:
    json.dump(table_dict, output)


# In[27]:


import json
import os

with open('tables.json', encoding="utf8") as f:
    data = json.load(f)

word = 'gallery'
find_array = []
    
for table in data.keys():
    
    for col_name in data[table]:
        if col_name.find(word) != -1:
            find_array.append(table)
            break
            
print(find_array)

# for table in data.keys():
#     print(table)


# ['available_skill_set.json', 'card_data.json', 'card_rarity_data.json', 'support_card_data.json'] 尚未確認


# In[1]:


import json
import os

path = os.walk("json")

file_array = []
table_dict = {}

for _root, _dir, _file in path:
    for f in _file:
#         tables_array.append(f)
        file_array.append(f)
        
# print(file_array)
# 200511 全身全靈
# 200431 金出閘

# name item_id 
# change_item_id category 

# 石頭: 
# 43 90

# $$: 
# 59 91

# 鬧鐘: 10220 
# 34 95
# 冰: 10221 
# 150 116
# 鞋子: 10226 ~ 10230 
# 1~13 11
# sp: 10232 
# 30 110
#820021001
# 809001009
# 809001010
# 830021001
# 55 147
#400001017
#400001406
#400001023

# 30021 綠惡SSR
# 
# conclusion_id

# 1:一般輔助卡片事件
# 3:訓練失敗事件
# 4:降心情事件?(含訓練失敗事件)
# 5:友人事件(記者之類的)
find_word = '13'

for file in file_array:
    with open('json/' + file, encoding="utf8") as f:
        data = json.load(f)
        if data is not None:
            for obj in data:
                result = filter(lambda x:str(x).find(find_word) != -1 and find_word == str(x), list(obj.values()))
                l = len(list(result))
                if l != 0:
                    print(l, file)
                    break
# print(table_dict)

# with open('tables.json', 'w', encoding="utf8") as output:
#     json.dump(table_dict, output)


# In[41]:


import json
import os



with open('category.json', encoding="utf8") as f:
    data = json.load(f)
    json_new = data
    
    for key in data.keys():
        tmp = {}
        if type(data[key]) is not dict:
                arr = data[key]
                for obj in data[key]:
                    if "id" not in obj:
                        tmp.update(obj)
                    else:
                        tmp[obj['content']] = {
                            'index':obj['id'],
                            'related_table':{}
                        }
                json_new[key] = tmp
                
print(json_new)
                

with open('category_2.json', 'w', encoding="utf8") as output:
    json.dump(json_new, output, ensure_ascii=False)


# In[63]:


import json
import os

def deal_dict(data):
    if "index" in data:
        return data
    elif "id" in data:
        return {
            data["content"]: {
                'index': data['id'],
                'related_table':{}
            }
        }
    else:
        if len(data.keys()) == 0:
            return data
        else:
            print()
            print(data)
            tmp_dict = {}
            for key in data.keys():
                tmp = {}
                if isinstance(data[key], list) :
                    tmp.update(deal_array(data[key]))
                elif isinstance(data[key], dict):
                    tmp.update(deal_dict(data[key]))
                else:
                    tmp[key] = data[key]
                    
                tmp_dict[key] = tmp
                
            print(tmp_dict)
            return tmp_dict

def deal_array(data):
    if len(data) == 0:
        return {}
    else:
        tmp = {}
        for obj in data:
            if isinstance(obj, dict):
                tmp.update(deal_dict(obj))
            else:
                tmp.update(deal_array(obj))
        return tmp

with open('category_2.json', encoding="utf8") as f:
    data = json.load(f)
    json_new = {}
    
    if isinstance(data, dict):
        json_new.update(deal_dict(data))
    elif isinstance(data, list):
        json_new.update(deal_array(data))
    else:
        json_new = data

print()       
print(json_new)
                

with open('category_3.json', 'w', encoding="utf8") as output:
    json.dump(json_new, output, ensure_ascii=False)


# In[67]:


import json
import os

def traversal_dict(data):
    tmp = {}
    if "index" in data:
        tmp = data
        tmp["remark"] = ""
    for key in data:
        if isinstance(data[key], dict):
            tmp[key.replace(' ', '_')] = traversal_dict(data[key])
        else:
            tmp[key.replace(' ', '_')] = data[key]
    return tmp

with open('category_3.json', encoding="utf8") as f:
    data = json.load(f)
    json_new = traversal_dict(data)
    

print(json_new)

with open('category_3.json', 'w', encoding="utf8") as output:
    json.dump(json_new, output, ensure_ascii=False)


# In[10]:


import sqlite3
import json
    
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

for row in f:
    skill_array.append(row)

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

