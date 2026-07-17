def find_app_closure(file_path):
    balance = 0
    started = False
    with open(file_path, 'r') as f:
        for i, line in enumerate(f):
            for char in line:
                if char == '{':
                    if i >= 32:
                        if not started:
                            balance += 1
                            started = True
                        else:
                            balance += 1
                elif char == '}':
                    if started:
                        balance -= 1
                        if balance == 0:
                            print(f"App closed at line {i+1}")
                            return

find_app_closure('src/App.tsx')
