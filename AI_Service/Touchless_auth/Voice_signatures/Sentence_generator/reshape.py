import json

def fix_json_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        while True:
            line = f.readline()
            if line.strip().startswith('{'):
                content = line + f.read()
                break

    data = json.loads(content)

    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    fix_json_file('./src/markov_model.json')